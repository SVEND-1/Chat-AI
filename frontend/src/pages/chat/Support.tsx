import { useState, useEffect, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import "../../style/chat.css";
import "../../style/support.css";
import logoIcon from "../../assets/icons/icon.svg";

// ===================== TYPES =====================

interface UserDefaultResponse {
    id: number;
    email: string;
}

interface SupportTicket {
    id: number;
    user: UserDefaultResponse;
    support: UserDefaultResponse;
    title: string;
    status: "OPEN" | "IN_PROGRESS" | "CLOSED";
    createdAt: string;
    updatedAt: string;
    closedAt: string | null;
}

interface SupportMessage {
    id: number;
    senderId: number;
    senderEmail: string;
    senderType: "USER" | "SUPPORT" | "ADMIN";
    message: string;
    createdAt: string;
}

// ===================== API =====================

const API_BASE = "http://localhost:8080/api";
const WS_BASE = "ws://localhost:8080/ws/support";

/** Читает JWT из cookie по имени (обычно "token" или "jwt") */
function getTokenFromCookie(): string {
    const cookies = document.cookie.split(";");
    for (const c of cookies) {
        const [key, val] = c.trim().split("=");
        if (key === "token" || key === "jwt" || key === "access_token") {
            return decodeURIComponent(val ?? "");
        }
    }
    return "";
}

/** Читает текущего пользователя из /api/users/me */
async function fetchCurrentUser(): Promise<UserDefaultResponse | null> {
    try {
        const res = await fetch(`${API_BASE}/users/me`, { credentials: "include" });
        if (!res.ok) return null;
        return res.json();
    } catch {
        return null;
    }
}

async function fetchTickets(): Promise<SupportTicket[]> {
    const res = await fetch(`${API_BASE}/support-ticket`, { credentials: "include" });
    if (!res.ok) throw new Error("Ошибка загрузки тикетов");
    return res.json();
}

async function createTicket(title: string): Promise<SupportTicket> {
    const res = await fetch(`${API_BASE}/support-ticket`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
    });
    if (!res.ok) throw new Error("Ошибка создания тикета");
    return res.json();
}

async function closeTicket(id: number): Promise<SupportTicket> {
    const res = await fetch(`${API_BASE}/support-ticket/${id}`, {
        method: "PATCH",
        credentials: "include",
    });
    if (!res.ok) throw new Error("Ошибка закрытия тикета");
    return res.json();
}

async function fetchMessages(ticketId: number): Promise<SupportMessage[]> {
    const res = await fetch(`${API_BASE}/support-message/${ticketId}`, {
        credentials: "include",
    });
    if (!res.ok) throw new Error("Ошибка загрузки сообщений");
    const data = await res.json();
    // REST возвращает SupportMessageResponse с вложенными объектами — нормализуем
    return data.map((m: any) => ({
        id: m.id,
        senderId: m.sender?.id ?? 0,
        senderEmail: m.sender?.email ?? "",
        senderType: m.senderType,
        message: m.message,
        createdAt: m.createdAt,
    }));
}

// ===================== HELPERS =====================

function formatTime(iso: string): string {
    try {
        return new Date(iso).toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
}

function formatDate(iso: string): string {
    try {
        return new Date(iso).toLocaleDateString("ru-RU", { day: "numeric", month: "long" });
    } catch {
        return "";
    }
}

const STATUS_LABELS: Record<string, string> = {
    OPEN: "Открыт",
    IN_PROGRESS: "В работе",
    CLOSED: "Закрыт",
};

// ===================== COMPONENT =====================

export default function Support() {
    const [tickets, setTickets] = useState<SupportTicket[]>([]);
    const [currentTicket, setCurrentTicket] = useState<SupportTicket | null>(null);
    const [messages, setMessages] = useState<SupportMessage[]>([]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isMsgLoading, setIsMsgLoading] = useState(false);
    const [wsConnected, setWsConnected] = useState(false);
    const [wsError, setWsError] = useState<string | null>(null);
    const [showNewTicket, setShowNewTicket] = useState(false);
    const [newTicketTitle, setNewTicketTitle] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const reconnectTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentTicketIdRef = useRef<number | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Загружаем текущего пользователя и тикеты при монтировании
    useEffect(() => {
        setIsLoading(true);
        Promise.all([fetchCurrentUser(), fetchTickets()])
            .then(([user, data]) => {
                if (user) setCurrentUserId(user.id);
                setTickets(data);
                if (data.length > 0) selectTicket(data[0], user?.id ?? null);
            })
            .catch(console.error)
            .finally(() => setIsLoading(false));
    }, []);

    // Скролл вниз при новых сообщениях
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Фокус на инпут при смене тикета
    useEffect(() => {
        inputRef.current?.focus();
    }, [currentTicket]);

    // Подключаем WebSocket
    const connectWs = useCallback((ticketId: number) => {
        // Закрываем предыдущее соединение и таймер переподключения
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }

        const token = getTokenFromCookie();
        const url = token
            ? `${WS_BASE}/${ticketId}?token=${encodeURIComponent(token)}`
            : `${WS_BASE}/${ticketId}`;

        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
            setWsConnected(true);
            setWsError(null);
        };

        ws.onmessage = (event) => {
            try {
                const data = JSON.parse(event.data);
                // Обрабатываем ошибки от сервера
                if (data.type === "ERROR") {
                    console.error("WS Error:", data.message);
                    setWsError(data.message);
                    return;
                }
                // WsOutgoingMessage
                const newMsg: SupportMessage = {
                    id: data.id,
                    senderId: data.senderId,
                    senderEmail: data.senderEmail,
                    senderType: data.senderType,
                    message: data.message,
                    createdAt: data.createdAt,
                };
                setMessages((prev) => {
                    // Избегаем дублирования
                    if (prev.some((m) => m.id === newMsg.id)) return prev;
                    return [...prev, newMsg];
                });
            } catch (e) {
                console.error("WS parse error", e);
            }
        };

        ws.onclose = (event) => {
            setWsConnected(false);
            // Переподключаемся только если тикет всё ещё активен и это не намеренное закрытие
            if (event.code !== 1000 && currentTicketIdRef.current === ticketId) {
                reconnectTimerRef.current = setTimeout(() => {
                    if (currentTicketIdRef.current === ticketId) {
                        connectWs(ticketId);
                    }
                }, 3000);
            }
        };

        ws.onerror = (e) => {
            console.error("WS error", e);
            setWsConnected(false);
        };
    }, []);

    // Очищаем WS при размонтировании
    useEffect(() => {
        return () => {
            if (reconnectTimerRef.current) clearTimeout(reconnectTimerRef.current);
            wsRef.current?.close(1000);
        };
    }, []);

    const selectTicket = async (ticket: SupportTicket, knownUserId?: number | null) => {
        setCurrentTicket(ticket);
        setMessages([]);
        setWsError(null);
        setWsConnected(false);
        currentTicketIdRef.current = ticket.id;

        // Закрываем старое соединение при смене тикета
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }
        wsRef.current?.close(1000);
        wsRef.current = null;

        setIsMsgLoading(true);
        try {
            const msgs = await fetchMessages(ticket.id);
            setMessages(msgs);
            // Определяем текущего пользователя
            if (knownUserId !== undefined && knownUserId !== null) {
                setCurrentUserId(knownUserId);
            } else {
                const userMsg = msgs.find((m) => m.senderType === "USER");
                if (userMsg) setCurrentUserId(userMsg.senderId);
                else if (ticket.user?.id) setCurrentUserId(ticket.user.id);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setIsMsgLoading(false);
        }

        // Подключаем WS только если тикет не закрыт и support назначен
        if (ticket.status !== "CLOSED" && ticket.support != null) {
            connectWs(ticket.id);
        }
    };

    const handleSend = () => {
        if (!input.trim() || !currentTicket || !wsConnected) return;
        if (currentTicket.status === "CLOSED") return;

        const payload = JSON.stringify({ message: input.trim() });
        wsRef.current?.send(payload);
        setInput("");
    };

    const handleCreateTicket = async () => {
        if (!newTicketTitle.trim()) return;
        try {
            const ticket = await createTicket(newTicketTitle.trim());
            setTickets((prev) => [ticket, ...prev]);
            setNewTicketTitle("");
            setShowNewTicket(false);
            // При создании тикета support ещё не назначен — WS не подключаем
            selectTicket(ticket, currentUserId);
        } catch (e) {
            console.error(e);
        }
    };

    const handleCloseTicket = async () => {
        if (!currentTicket) return;
        try {
            const updated = await closeTicket(currentTicket.id);
            setTickets((prev) => prev.map((t) => (t.id === updated.id ? updated : t)));
            setCurrentTicket(updated);
            currentTicketIdRef.current = null;
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
            wsRef.current?.close(1000);
            setWsConnected(false);
        } catch (e) {
            console.error(e);
        }
    };

    // ===================== RENDER =====================

    return (
        <div className="app">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="logo">
                    <img src={logoIcon} alt="Lumen logo" className="logo-icon" />
                    <span>Lumen</span>
                </div>

                {/* Кнопка нового тикета */}
                <button className="create-chat-btn" onClick={() => setShowNewTicket(true)}>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                              d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    <span>Новый тикет</span>
                </button>

                {/* Список тикетов */}
                {tickets.length > 0 && (
                    <div className="chat-list">
                        <h3 className="chat-list-title">Мои обращения</h3>
                        {tickets.map((ticket) => (
                            <div key={ticket.id} className="chat-item-wrapper">
                                <button
                                    className={`chat-item support-ticket-item ${ticket.id === currentTicket?.id ? "active" : ""}`}
                                    onClick={() => selectTicket(ticket, currentUserId)}
                                >
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M16.5 6v.75a3.75 3.75 0 0 1-7.5 0V6m-1.5 0h10.5m-10.5 0H4.5m15 0H19.5M7.5 6H16.5M3 18l1.5-9h15L21 18H3Z" />
                                    </svg>
                                    <div className="ticket-info">
                                        <span className="chat-name">{ticket.title}</span>
                                        <span className={`ticket-status-badge status-${ticket.status.toLowerCase()}`}>
                                            {STATUS_LABELS[ticket.status]}
                                        </span>
                                    </div>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                {/* Навигация обратно в чат */}
                <div className="sidebar-footer">
                    <Link to="/chat" className="subscribe-btn" style={{ textDecoration: "none" }}>
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM12 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm3.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0ZM21 12c0 4.556-4.03 8.25-9 8.25a9.9 9.9 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a52.497 52.497 0 0 0-.106-.384c-.27-.99-.353-1.63-.353-1.63C3.622 18.073 3 15.136 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                        </svg>
                        <span>AI Чат</span>
                    </Link>

                    <div className="profile-section">
                        <button className="profile-btn" onClick={() => setShowProfileMenu(!showProfileMenu)}>
                            <div className="profile-avatar">
                                <svg viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                </svg>
                            </div>
                            <span>Профиль</span>
                        </button>

                        {showProfileMenu && (
                            <div className="profile-menu">
                                <Link to="/settings" className="profile-menu-item">
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 0 1 0 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 0 1 0-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.074-.04.147-.083.22-.128.332-.183.582-.495.644-.869l.214-1.281Z" />
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                    Настройки
                                </Link>
                                <button className="profile-menu-item logout">
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15M12 9l-3 3m0 0 3 3m-3-3h12.75" />
                                    </svg>
                                    Выйти
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="main-content">
                {/* Модал создания тикета */}
                {showNewTicket && (
                    <div className="support-modal-overlay" onClick={() => setShowNewTicket(false)}>
                        <div className="support-modal" onClick={(e) => e.stopPropagation()}>
                            <div className="support-modal-header">
                                <h2>Новое обращение</h2>
                                <button className="support-modal-close" onClick={() => setShowNewTicket(false)}>
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M6 18 18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            <p className="support-modal-hint">Опишите суть вашего обращения в заголовке. Детали можно уточнить в чате.</p>
                            <input
                                className="support-modal-input"
                                type="text"
                                placeholder="Например: Не работает оплата подписки"
                                value={newTicketTitle}
                                onChange={(e) => setNewTicketTitle(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleCreateTicket()}
                                autoFocus
                            />
                            <div className="support-modal-actions">
                                <button className="support-modal-cancel" onClick={() => setShowNewTicket(false)}>
                                    Отмена
                                </button>
                                <button
                                    className="support-modal-submit"
                                    onClick={handleCreateTicket}
                                    disabled={!newTicketTitle.trim()}
                                >
                                    Создать обращение
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {isLoading ? (
                    <div className="empty-state">
                        <div className="empty-state-content">
                            <div className="loader"></div>
                            <p>Загрузка обращений...</p>
                        </div>
                    </div>
                ) : currentTicket ? (
                    <div className="chat-page">
                        {/* Шапка тикета */}
                        <div className="chat-header support-chat-header">
                            <div className="support-header-left">
                                <h1>{currentTicket.title}</h1>
                                <div className="support-header-meta">
                                    <span className={`ticket-status-badge status-${currentTicket.status.toLowerCase()}`}>
                                        {STATUS_LABELS[currentTicket.status]}
                                    </span>
                                    <span className="support-header-date">
                                        Создан {formatDate(currentTicket.createdAt)}
                                    </span>
                                    <span className={`ws-indicator ${wsConnected ? "connected" : "disconnected"}`}>
                                        <span className="ws-dot"></span>
                                        {wsConnected
                                            ? "Подключено"
                                            : currentTicket.support == null
                                                ? "Ожидание оператора"
                                                : "Нет соединения"}
                                    </span>
                                </div>
                            </div>
                            {currentTicket.status !== "CLOSED" && (
                                <button className="close-ticket-btn" onClick={handleCloseTicket}>
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M9 12.75 11.25 15 15 9.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Закрыть тикет
                                </button>
                            )}
                        </div>

                        {/* Сообщения */}
                        <div className="messages-wrapper">
                            {isMsgLoading ? (
                                <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
                                    <div className="loader"></div>
                                </div>
                            ) : messages.length === 0 ? (
                                <div className="support-empty-chat">
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="48" height="48">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                    </svg>
                                    <p>Напишите первое сообщение оператору поддержки</p>
                                </div>
                            ) : (
                                messages.map((msg) => {
                                    const isUser = msg.senderType === "USER";
                                    return (
                                        <div key={msg.id} className={`message ${isUser ? "right" : "left"}`}>
                                            <div className={`message-content ${isUser ? "user-message" : ""}`}>
                                                {!isUser && (
                                                    <div className="support-sender-label">
                                                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="12" height="12">
                                                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                                  d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                                                        </svg>
                                                        Поддержка
                                                    </div>
                                                )}
                                                <div className="message-text">{msg.message}</div>
                                                <span className="message-time">{formatTime(msg.createdAt)}</span>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Инпут */}
                        <div className="input-container">
                            {currentTicket.status === "CLOSED" ? (
                                <div className="support-closed-banner">
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                    </svg>
                                    Тикет закрыт — переписка завершена
                                </div>
                            ) : currentTicket.support == null ? (
                                <div className="support-closed-banner" style={{ borderColor: "rgba(255,165,0,0.2)", color: "#ffb84d", background: "rgba(255,165,0,0.05)" }}>
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                              d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                    </svg>
                                    Ожидаем подключения оператора поддержки...
                                </div>
                            ) : (
                                <>
                                    {wsError && (
                                        <div style={{ padding: "6px 20px", color: "#ff6b6b", fontSize: "12px", textAlign: "center" }}>
                                            ⚠ {wsError}
                                        </div>
                                    )}
                                    <div className="input-wrapper">
                                        <input
                                            ref={inputRef}
                                            type="text"
                                            placeholder={wsConnected ? "Написать сообщение..." : "Переподключение..."}
                                            value={input}
                                            onChange={(e) => setInput(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleSend();
                                                }
                                            }}
                                            disabled={!wsConnected}
                                        />
                                        <button
                                            className={`send-btn ${!input.trim() || !wsConnected ? "disabled" : ""}`}
                                            onClick={handleSend}
                                            disabled={!input.trim() || !wsConnected}
                                        >
                                            <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                                      d="M6 12 3.269 3.126A59.768 59.768 0 0 1 21.485 12 59.77 59.77 0 0 1 3.27 20.876L5.999 12Zm0 0h7.5" />
                                            </svg>
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-state-content">
                            <svg viewBox="0 0 24 24" strokeWidth="1.5" width="64" height="64">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z" />
                            </svg>
                            <h2>Служба поддержки</h2>
                            <p>Создайте обращение, и наша команда поможет решить любой вопрос</p>
                            <button className="start-chat-btn" onClick={() => setShowNewTicket(true)}>
                                <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                          d="M12 4.5v15m7.5-7.5h-15" />
                                </svg>
                                Новое обращение
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
