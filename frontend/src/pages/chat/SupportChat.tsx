import { useState, useEffect, useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";
import "../../style/support-chat.css";

// SockJS загружается через CDN в index.html:
// <script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
declare const SockJS: new (url: string) => WebSocket;

// ─── Types ─────────────────────────────────────────────────────────────────

type Role = "USER" | "SUPPORT" | "ADMIN";
type SupportStatus = "OPEN" | "CLOSED";
type StatusPill = "ok" | "err" | "";

interface UserInfo {
    id: number;
    name: string;
    role: Role;
}

interface SupportTicketResponse {
    id: number;
    user: { id: number; name: string };
    support: { id: number; name: string } | null;
    title: string;
    status: SupportStatus;
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}

interface SupportMessageResponse {
    id: number;
    supportTicket: { id: number };
    sender: { id: number; name: string };
    senderType: Role;
    message: string;
    createdAt: string;
}


// ─── Helpers ───────────────────────────────────────────────────────────────

function ts(): string {
    return new Date().toTimeString().slice(0, 8);
}

function fmtTime(iso: string): string {
    return new Date(iso).toLocaleTimeString("ru", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

function initials(name: string): string {
    return name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .toUpperCase()
        .slice(0, 2) || "?";
}

// ─── Component ─────────────────────────────────────────────────────────────

export default function SupportChat() {
    // Auth state
    const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState<string | null>(null);

    // Ticket list (support/admin see all assigned, user sees own)
    const [tickets, setTickets] = useState<SupportTicketResponse[]>([]);
    const [selectedTicket, setSelectedTicket] =
        useState<SupportTicketResponse | null>(null);

    // WebSocket / chat state
    const [connected, setConnected] = useState(false);
    const [statusPill, setStatusPill] = useState<StatusPill>("");
    const [statusTxt, setStatusTxt] = useState("disconnected");
    const [ticketClosed, setTicketClosed] = useState(false);
    const [messages, setMessages] = useState<SupportMessageResponse[]>([]);
    const [chatInput, setChatInput] = useState("");

    const stompRef = useRef<Client | null>(null);  const messagesEndRef = useRef<HTMLDivElement>(null);
    // ─── Init: fetch current user ─────────────────────────────────────────

    useEffect(() => {
        (async () => {
            try {
                // Try to get JWT from cookie endpoint
                const tokenRes = await fetch("/api/auth/token", {
                    credentials: "include",
                });
                if (!tokenRes.ok) {
                    setAuthError("Вы не авторизованы. Пожалуйста, войдите в систему.");
                    setAuthLoading(false);
                    return;
                }
                // Get current user info — adjust endpoint to your actual /api/users/me
                const meRes = await fetch("/api/users/me", { credentials: "include" });
                if (meRes.ok) {
                    const me: UserInfo = await meRes.json();
                    setCurrentUser(me);
                } else {
                    // Fallback: parse role from token if /me is unavailable
                    // We'll still let the app work; role defaults to USER
                    setCurrentUser({ id: 0, name: "You", role: "USER" });
                }
            } catch (e) {
                // Если упал именно /api/auth/token — показываем экран ошибки
                // Если упал /api/users/me — это не критично, fallback уже установлен выше
                if (!currentUser) {
                    setAuthError("Не удалось связаться с сервером.");
                }
            } finally {
                setAuthLoading(false);
            }
        })();
    }, []);

    // ─── Fetch ticket list when user is known ─────────────────────────────

    useEffect(() => {
        if (!currentUser) return;
        fetchTickets();
    }, [currentUser]);

    async function fetchTickets() {
        try {
            const res = await fetch("/api/support-ticket", { credentials: "include" });
            if (!res.ok) return;
            const list: SupportTicketResponse[] = await res.json();
            setTickets(list);
        } catch {
        }
    }

    // ─── Auto-scroll ──────────────────────────────────────────────────────

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ─── Log helper ───────────────────────────────────────────────────────

    // ─── Connect/disconnect ───────────────────────────────────────────────

    const activeTicketId = selectedTicket?.id ?? 0;

    async function connect() {
        if (!activeTicketId) {
            return;
        }
        setStatusTxt("loading token...");
        setStatusPill("");

        let token: string;
        try {
            const res = await fetch("/api/auth/token", { credentials: "include" });
            if (!res.ok) {
                setStatusPill("err");
                setStatusTxt("auth error");
                return;
            }
            const data = await res.json();
            token = data.token;
            if (!token) throw new Error("empty token");
        } catch (e: unknown) {
            setStatusPill("err");
            setStatusTxt("auth error");
            return;
        }

        setTicketClosed(
            selectedTicket ? selectedTicket.status === "CLOSED" : false
        );
        setStatusTxt("connecting...");
        setStatusPill("");

        const client = new Client({
            webSocketFactory: () => new SockJS("/ws/support"),
            connectHeaders: { token },
            reconnectDelay: 0,
            debug: (s) => {
                if (/CONNECT|CONNECTED|ERROR|SUBSCRIBE|DISCONNECT/i.test(s)) {
                }
            },

            onConnect: () => {
                setStatusPill("ok");
                setStatusTxt("connected");
                setConnected(true);

                // ← новые сообщения
                client.subscribe(`/topic/support/${activeTicketId}`, (frame) => {
                    try {
                        const d: SupportMessageResponse = JSON.parse(frame.body);
                        setMessages((prev) => [...prev, d]);
                    } catch {
                    }
                });

                // ← изменение статуса тикета
                client.subscribe(
                    `/topic/support/${activeTicketId}/status`,
                    (frame) => {
                        try {
                            const d: SupportTicketResponse = JSON.parse(frame.body);
                            if (d.status === "CLOSED") {
                                setTicketClosed(true);
                                setSelectedTicket((prev) =>
                                    prev ? { ...prev, status: "CLOSED" } : prev
                                );
                                setTickets((prev) =>
                                    prev.map((t) =>
                                        t.id === d.id ? { ...t, status: "CLOSED" } : t
                                    )
                                );
                                setMessages((prev) => [
                                    ...prev,
                                    {
                                        id: -Date.now(),
                                        supportTicket: { id: activeTicketId },
                                        sender: { id: 0, name: "system" },
                                        senderType: "SUPPORT",
                                        message: "🔒 тикет закрыт",
                                        createdAt: new Date().toISOString(),
                                    } as SupportMessageResponse,
                                ]);
                            }
                        } catch {
                        }
                    }
                );

                loadHistory(activeTicketId);
            },

            onStompError: (frame) => {
                const msg = frame.headers?.message ?? "STOMP error";
                setStatusPill("err");
                setStatusTxt("stomp error");
                setConnected(false);
            },

            onDisconnect: () => {
                setStatusTxt("disconnected");
                setStatusPill("");
                setConnected(false);
            },

            onWebSocketError: (e: Event) => {
                const msg =
                    e instanceof ErrorEvent ? e.message : "connection refused";
                setStatusPill("err");
                setStatusTxt("ws error");
                setConnected(false);
            },
        });

        stompRef.current = client;
        client.activate();
    }

    function disconnect() {
        stompRef.current?.deactivate();
        stompRef.current = null;
        setConnected(false);
        setStatusPill("");
        setStatusTxt("disconnected");
    }

    // ─── Load history ─────────────────────────────────────────────────────

    async function loadHistory(ticketId: number) {
        try {
            const res = await fetch(`/api/support-message/${ticketId}`, {
                credentials: "include",
            });
            if (!res.ok) {
                return;
            }
            const list: SupportMessageResponse[] = await res.json();
            setMessages(list);
            if (!list.length) {
            } else {
            }
        } catch (e: unknown) {
        }
    }

    // ─── Select a ticket (support/admin) ─────────────────────────────────

    async function selectTicket(ticket: SupportTicketResponse) {
        if (connected) disconnect();
        setMessages([]);
        setSelectedTicket(ticket);
        setTicketClosed(ticket.status === "CLOSED");
    }

    // Автоподключение: для USER — к первому тикету, для staff — при клике
    useEffect(() => {
        if (!currentUser || tickets.length === 0) return;
        if (!selectedTicket) {
            // Автовыбор первого тикета
            const first = tickets[0];
            setSelectedTicket(first);
            setTicketClosed(first.status === "CLOSED");
        }
    }, [tickets, currentUser]);

    useEffect(() => {
        if (selectedTicket && !connected) {
            connect();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedTicket]);

    // ─── Send message ─────────────────────────────────────────────────────

    function sendMsg() {
        const text = chatInput.trim();
        if (!text || !connected || ticketClosed || !stompRef.current) return;

        try {
            stompRef.current.publish({
                destination: `/app/support/${activeTicketId}/send`,
                body: JSON.stringify({ message: text }),
            });
            // Не добавляем оптимистично — сервер сам сделает broadcast нам же через /topic
            setChatInput("");
        } catch (e: unknown) {
        }
    }

    function handleTextareaKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMsg();
        }
    }

    // ─── Close ticket ─────────────────────────────────────────────────────

    function closeTicket() {
        if (!connected || ticketClosed || !stompRef.current) return;
        stompRef.current.publish({
            destination: `/app/support/${activeTicketId}/close`,
            body: "{}",
        });
    }

    // ─── Message bubble style ─────────────────────────────────────────────

    /**
     * Determines whether a message was sent by the current user.
     * Matches on sender.id (preferred) or senderType when id = 0 (fallback/optimistic).
     */
    function isMine(msg: SupportMessageResponse): boolean {
        if (!currentUser) return false;
        return msg.sender.id === currentUser.id;
    }

    function bubbleClass(msg: SupportMessageResponse): string {
        if (isMine(msg)) return "mine";
        if (msg.senderType === "USER") return "user";
        if (msg.senderType === "SUPPORT" || msg.senderType === "ADMIN")
            return "support";
        return "other";
    }

    // ─── Render helpers ───────────────────────────────────────────────────

    const isStaff =
        currentUser?.role === "SUPPORT" || currentUser?.role === "ADMIN";

    const roleLabel =
        currentUser?.role === "ADMIN"
            ? "admin"
            : currentUser?.role === "SUPPORT"
                ? "support"
                : "user";

    const roleClass =
        currentUser?.role === "ADMIN"
            ? "role-admin"
            : currentUser?.role === "SUPPORT"
                ? "role-support"
                : "role-user";

    const chatTitle = selectedTicket
        ? selectedTicket.title
        : connected
            ? "чат с поддержкой"
            : "не подключено";

    const displayedTicketId = selectedTicket?.id ?? (connected ? activeTicketId : null);
    const displayedStatus: SupportStatus | null = selectedTicket?.status ?? null;

    // ─── Loading / error screens ──────────────────────────────────────────

    if (authLoading) {
        return (
            <div className="screen-center">
                <div className="icon">◌</div>
                <div className="title">Загрузка...</div>
            </div>
        );
    }

    if (authError) {
        return (
            <div className="screen-center">
                <div className="icon">⚠</div>
                <div className="title">Ошибка авторизации</div>
                <span>{authError}</span>
            </div>
        );
    }

    // ─── Main render ──────────────────────────────────────────────────────

    return (
        <div className="app">
            {/* ── Topbar ─────────────────────────────────── */}
            <div className="topbar">
                <div className="topbar-left">
                    <span className="topbar-logo">▸ Support Chat</span>
                    {currentUser && (
                        <span className={`topbar-role ${roleClass}`}>
              {currentUser.name} · {roleLabel}
            </span>
                    )}
                </div>
                <div className={`pill ${statusPill}`}>
                    <div className="dot" />
                    <span>{statusTxt}</span>
                </div>
            </div>

            <div className="layout">
                {/* ── Sidebar ──────────────────────────────── */}
                <div className="sidebar">
                    {isStaff ? (
                        /* SUPPORT / ADMIN: список тикетов */
                        <>
                            <div className="ticket-list-header">
                                мои тикеты ({tickets.length})
                            </div>
                            <div className="ticket-list">
                                {tickets.length === 0 && (
                                    <div
                                        className="empty"
                                        style={{ padding: "30px 16px", opacity: 0.4 }}
                                    >
                                        <div className="empty-icon">◌</div>
                                        <span>нет тикетов</span>
                                    </div>
                                )}
                                {tickets.map((t) => (
                                    <div
                                        key={t.id}
                                        className={`ticket-item ${selectedTicket?.id === t.id ? "active" : ""}`}
                                        onClick={() => selectTicket(t)}
                                    >
                                        <div className="ticket-item-top">
                                            <span className="ticket-item-id">#{t.id}</span>
                                            <span
                                                className={`badge ${t.status === "OPEN" ? "open" : "closed"}`}
                                            >
                        {t.status}
                      </span>
                                        </div>
                                        <div className="ticket-item-title">{t.title}</div>
                                        <div className="ticket-item-meta">
                                            👤 {t.user?.name ?? "—"}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        /* USER: список своих тикетов */
                        <>
                            <div className="ticket-list-header">
                                мои обращения ({tickets.length})
                            </div>
                            <div className="ticket-list">
                                {tickets.length === 0 && (
                                    <div className="empty" style={{ padding: "30px 16px", opacity: 0.4 }}>
                                        <div className="empty-icon">◌</div>
                                        <span>нет обращений</span>
                                    </div>
                                )}
                                {tickets.map((t) => (
                                    <div
                                        key={t.id}
                                        className={`ticket-item ${selectedTicket?.id === t.id ? "active" : ""}`}
                                        onClick={() => selectTicket(t)}
                                    >
                                        <div className="ticket-item-top">
                                            <span className="ticket-item-id">#{t.id}</span>
                                            <span className={`badge ${t.status === "OPEN" ? "open" : "closed"}`}>
                        {t.status}
                      </span>
                                        </div>
                                        <div className="ticket-item-title">{t.title}</div>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>

                {/* ── Chat panel ────────────────────────────── */}
                <div className="chat">
                    <div className="chat-hdr">
                        <div className="chat-hdr-info">
                            <div className="chat-hdr-id">
                                ticket #{displayedTicketId ?? "—"}
                            </div>
                            <div className="chat-hdr-title">{chatTitle}</div>
                        </div>
                        {displayedStatus && (
                            <span
                                className={`badge ${displayedStatus === "OPEN" ? "open" : "closed"}`}
                            >
                {displayedStatus}
              </span>
                        )}
                    </div>

                    <div className="messages">
                        {messages.length === 0 && (
                            <div className="empty" id="empty-state">
                                <div className="empty-icon">◌</div>
                                <span>
                  {isStaff
                      ? "выберите тикет из списка слева"
                      : "нет сообщений"}
                </span>
                            </div>
                        )}

                        {messages.map((msg) => {
                            const mine = isMine(msg);
                            const bClass = bubbleClass(msg);
                            const name = msg.sender?.name || msg.senderType;
                            const init = initials(name);
                            const time = fmtTime(msg.createdAt);

                            return (
                                <div
                                    key={msg.id}
                                    className={`msg-row ${mine ? "mine" : ""}`}
                                >
                                    <div
                                        className={`avatar ${bClass}`}
                                        title={name}
                                    >
                                        {init}
                                    </div>
                                    <div>
                                        <div className={`bubble ${bClass}`}>{msg.message}</div>
                                        <div className="msg-meta">
                                            {name} · {time}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={messagesEndRef} />
                    </div>

                    <div className="input-area">
            <textarea
                className="chat-textarea"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyDown={handleTextareaKeyDown}
                placeholder="сообщение... (Enter — отправить, Shift+Enter — перенос)"
                disabled={!connected || ticketClosed}
                rows={1}
                style={{ height: "auto" }}
                onInput={(e) => {
                    const el = e.currentTarget;
                    el.style.height = "auto";
                    el.style.height =
                        Math.min(el.scrollHeight, 120) + "px";
                }}
            />
                        <button
                            className="send-btn"
                            disabled={!connected || ticketClosed}
                            onClick={sendMsg}
                        >
                            → send
                        </button>
                        <button
                            className="close-btn"
                            disabled={!connected || ticketClosed}
                            onClick={closeTicket}
                        >
                            закрыть тикет
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
