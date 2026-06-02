import { useState, useEffect, useRef, useCallback } from "react";
import "../../style/support-chat.css";

// ============================= TYPES =============================

// Данные пользователя
interface User {
    id: number;
    email: string;
    role: "USER" | "SUPPORT";
    token: string;
}

// Тикет
interface Ticket {
    id: number;
    title: string;
    status: "OPEN" | "IN_PROGRESS" | "CLOSED";
    user?: { id: number; email: string };
    support?: { id: number; email: string } | null;
    createdAt: string;
    updatedAt: string;
    closedAt?: string;
}

// Сообщение от REST API
interface RestMessage {
    id: number;
    message: string;
    senderType: "USER" | "SUPPORT";
    sender: { id: number; email: string };
    createdAt: string;
}

// Сообщение WebSocket (исходящее)
interface WsOutgoingMessage {
    id: number;
    ticketId: number;
    senderId: number;
    senderEmail: string;
    senderType: "USER" | "SUPPORT";
    message: string;
    createdAt: string;
}

// Ошибка WebSocket
interface WsErrorMessage {
    type: "ERROR";
    message: string;
}

type WsMessage = WsOutgoingMessage | WsErrorMessage;

// Отображаемое сообщение в чате
interface DisplayMessage {
    id: number;
    text: string;
    senderEmail: string;
    senderType: string;
    time: string;
    isOwn: boolean;
}

type ConnectionStatus = "connecting" | "connected" | "disconnected" | "error";

// ============================= HELPERS =============================

function formatTime(isoString: string): string {
    try {
        const date = new Date(isoString);
        return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
    } catch {
        return "";
    }
}

function isErrorMessage(msg: WsMessage): msg is WsErrorMessage {
    return (msg as WsErrorMessage).type === "ERROR";
}

// ============================= API КЛИЕНТ =============================

const API_BASE_URL = "http://localhost:8080/api";

// Вспомогательная функция для запросов с токеном
async function apiRequest<T>(
    endpoint: string,
    token: string,
    options?: RequestInit
): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            ...options?.headers,
        },
    });
    if (!res.ok) {
        const errorText = await res.text();
        throw new Error(`API Error ${res.status}: ${errorText}`);
    }
    return res.json();
}

// Логин – предполагается эндпоинт /auth/login, возвращающий { id, email, role, token }
async function login(email: string, password: string): Promise<User> {
    // Заглушка – реальный запрос к бэкенду. Если логин не реализован, можно использовать
    // предопределённых пользователей (см. ниже закомментированный вариант).
    // Для примера шлём POST /auth/login
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error("Login failed");
    return res.json();

    /* Альтернатива без бэкенда (для отладки):
    if (email === "user@example.com" && password === "user") {
      return {
        id: 7,
        email: "user@example.com",
        role: "USER",
        token: "dummy-user-token",
      };
    }
    if (email === "support@example.com" && password === "support") {
      return {
        id: 8,
        email: "support@example.com",
        role: "SUPPORT",
        token: "dummy-support-token",
      };
    }
    throw new Error("Invalid credentials");
    */
}

// Получение списка тикетов текущего пользователя
async function fetchTickets(token: string): Promise<Ticket[]> {
    return apiRequest<Ticket[]>("/support-ticket", token);
}

// Создание нового тикета (только для USER)
async function createTicket(token: string, title: string): Promise<Ticket> {
    return apiRequest<Ticket>("/support-ticket", token, {
        method: "POST",
        body: JSON.stringify({ title }),
    });
}

// Получение истории сообщений тикета
async function fetchMessages(ticketId: number, token: string): Promise<RestMessage[]> {
    return apiRequest<RestMessage[]>(`/support-message/${ticketId}`, token);
}

// ============================= КОМПОНЕНТ =============================

export default function SupportChat() {
    // Состояние авторизации
    const [user, setUser] = useState<User | null>(null);
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    // Состояние тикетов
    const [tickets, setTickets] = useState<Ticket[]>([]);
    const [selectedTicketId, setSelectedTicketId] = useState<number | null>(null);
    const [isCreatingTicket, setIsCreatingTicket] = useState(false);
    const [newTicketTitle, setNewTicketTitle] = useState("");

    // Состояние чата
    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<ConnectionStatus>("disconnected");
    const [errorBanner, setErrorBanner] = useState<string | null>(null);

    // WebSocket
    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // Загружаем список тикетов при смене пользователя
    useEffect(() => {
        if (user) {
            loadTickets();
        }
    }, [user]);

    // Загрузка списка тикетов
    const loadTickets = async () => {
        if (!user) return;
        try {
            const data = await fetchTickets(user.token);
            setTickets(data);
            // Если есть тикеты и не выбран ни один, выбираем первый
            if (data.length > 0 && selectedTicketId === null) {
                setSelectedTicketId(data[0].id);
            }
        } catch (err) {
            console.error("Failed to load tickets", err);
            setErrorBanner("Не удалось загрузить тикеты");
            setTimeout(() => setErrorBanner(null), 4000);
        }
    };

    // Загрузка истории сообщений при смене тикета
    useEffect(() => {
        if (user && selectedTicketId !== null) {
            loadMessageHistory(selectedTicketId);
            connectWebSocket(selectedTicketId);
        }
        return () => {
            disconnectWebSocket();
        };
    }, [selectedTicketId, user]);

    const loadMessageHistory = async (ticketId: number) => {
        if (!user) return;
        try {
            const history = await fetchMessages(ticketId, user.token);
            const displayMessages = history.map((msg) => ({
                id: msg.id,
                text: msg.message,
                senderEmail: msg.sender.email,
                senderType: msg.senderType,
                time: formatTime(msg.createdAt),
                isOwn: msg.sender.id === user.id,
            }));
            setMessages(displayMessages);
        } catch (err) {
            console.error("Failed to load messages", err);
            setErrorBanner("Не удалось загрузить историю чата");
            setTimeout(() => setErrorBanner(null), 4000);
        }
    };

    const connectWebSocket = (ticketId: number) => {
        if (!user) return;
        disconnectWebSocket(); // закрываем предыдущее соединение

        setStatus("connecting");
        const wsUrl = `ws://localhost:8080/ws/support/${ticketId}?token=${user.token}`;
        const ws = new WebSocket(wsUrl);
        wsRef.current = ws;

        ws.onopen = () => {
            setStatus("connected");
            setErrorBanner(null);
            inputRef.current?.focus();
        };

        ws.onmessage = (event) => {
            try {
                const parsed: WsMessage = JSON.parse(event.data);
                if (isErrorMessage(parsed)) {
                    setErrorBanner(parsed.message);
                    setTimeout(() => setErrorBanner(null), 4000);
                    return;
                }
                const msg = parsed as WsOutgoingMessage;
                // Добавляем новое сообщение, только если оно относится к текущему тикету
                if (msg.ticketId === ticketId) {
                    const newMsg: DisplayMessage = {
                        id: msg.id,
                        text: msg.message,
                        senderEmail: msg.senderEmail,
                        senderType: msg.senderType,
                        time: formatTime(msg.createdAt),
                        isOwn: msg.senderId === user.id,
                    };
                    setMessages((prev) => [...prev, newMsg]);
                    // Обновляем список тикетов, чтобы в боковой панели отображалось последнее сообщение (опционально)
                    // Для простоты просто перезагрузим список, но можно сделать более аккуратно
                    loadTickets();
                }
            } catch (e) {
                // ignore malformed frames
            }
        };

        ws.onclose = (ev) => {
            setStatus("disconnected");
            if (ev.code < 4000) {
                reconnectTimer.current = setTimeout(() => {
                    if (selectedTicketId === ticketId) {
                        connectWebSocket(ticketId);
                    }
                }, 3000);
            }
        };

        ws.onerror = () => {
            setStatus("error");
        };
    };

    const disconnectWebSocket = () => {
        if (reconnectTimer.current) {
            clearTimeout(reconnectTimer.current);
            reconnectTimer.current = null;
        }
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
    };

    const handleSend = () => {
        const text = input.trim();
        if (!text || status !== "connected" || !wsRef.current) return;
        wsRef.current.send(JSON.stringify({ message: text }));
        setInput("");
        setTimeout(() => inputRef.current?.focus(), 0);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoginError("");
        try {
            const loggedUser = await login(loginEmail, loginPassword);
            setUser(loggedUser);
        } catch (err) {
            setLoginError("Неверный email или пароль");
        }
    };

    const handleLogout = () => {
        disconnectWebSocket();
        setUser(null);
        setSelectedTicketId(null);
        setTickets([]);
        setMessages([]);
        setStatus("disconnected");
    };

    const handleCreateTicket = async () => {
        if (!user || user.role !== "USER") return;
        setIsCreatingTicket(true);
        try {
            const newTicket = await createTicket(user.token, newTicketTitle);
            setTickets((prev) => [newTicket, ...prev]);
            setSelectedTicketId(newTicket.id);
            setNewTicketTitle("");
        } catch (err) {
            setErrorBanner("Ошибка создания тикета");
            setTimeout(() => setErrorBanner(null), 4000);
        } finally {
            setIsCreatingTicket(false);
        }
    };

    // Автоматическая прокрутка вниз
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // Статусная строка
    const statusLabel: Record<ConnectionStatus, string> = {
        connecting: "Подключение...",
        connected: "В сети",
        disconnected: "Переподключение...",
        error: "Ошибка соединения",
    };

    const canSend = status === "connected" && input.trim().length > 0;

    // Если не залогинены – форма входа
    if (!user) {
        return (
            <div className="sc-login-container">
                <div className="sc-login-card">
                    <h2>Чат поддержки</h2>
                    <form onSubmit={handleLogin}>
                        <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Пароль"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />
                        {loginError && <div className="sc-login-error">{loginError}</div>}
                        <button type="submit">Войти</button>
                    </form>
                    <div className="sc-login-hint">
                        <p>Тестовые учётные данные:</p>
                        <p>Пользователь: user@example.com / user</p>
                        <p>Поддержка: support@example.com / support</p>
                    </div>
                </div>
            </div>
        );
    }

    // Основной интерфейс чата
    return (
        <div className="sc-root">
            {/* Верхняя панель */}
            <div className="sc-header">
                <div className="sc-header-left">
          <span className="sc-user-role">
            {user.role === "SUPPORT" ? "👩‍💼 Поддержка" : "👤 Пользователь"} ({user.email})
          </span>
                    <div className={`sc-status sc-status--${status}`}>
                        <span className="sc-status-dot" />
                        <span className="sc-status-text">{statusLabel[status]}</span>
                    </div>
                </div>
                <button className="sc-logout-btn" onClick={handleLogout}>
                    Выйти
                </button>
            </div>

            {/* Баннер ошибок */}
            {errorBanner && (
                <div className="sc-error-banner">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12.01" y2="16" />
                    </svg>
                    {errorBanner}
                </div>
            )}

            <div className="sc-layout">
                {/* Боковая панель с тикетами */}
                <aside className="sc-sidebar">
                    <div className="sc-sidebar-header">
                        <h3>Мои тикеты</h3>
                        {user.role === "USER" && (
                            <button
                                className="sc-new-ticket-btn"
                                onClick={() => setIsCreatingTicket(!isCreatingTicket)}
                            >
                                +
                            </button>
                        )}
                    </div>
                    {user.role === "USER" && isCreatingTicket && (
                        <div className="sc-new-ticket-form">
                            <input
                                type="text"
                                placeholder="Тема тикета"
                                value={newTicketTitle}
                                onChange={(e) => setNewTicketTitle(e.target.value)}
                                disabled={isCreatingTicket}
                            />
                            <button onClick={handleCreateTicket} disabled={!newTicketTitle.trim()}>
                                Создать
                            </button>
                        </div>
                    )}
                    <div className="sc-ticket-list">
                        {tickets.length === 0 && <div className="sc-no-tickets">Нет тикетов</div>}
                        {tickets.map((ticket) => (
                            <div
                                key={ticket.id}
                                className={`sc-ticket-item ${selectedTicketId === ticket.id ? "sc-ticket-item--active" : ""}`}
                                onClick={() => setSelectedTicketId(ticket.id)}
                            >
                                <div className="sc-ticket-title">{ticket.title}</div>
                                <div className="sc-ticket-status" data-status={ticket.status}>
                                    {ticket.status === "OPEN" && "Открыт"}
                                    {ticket.status === "IN_PROGRESS" && "В работе"}
                                    {ticket.status === "CLOSED" && "Закрыт"}
                                </div>
                            </div>
                        ))}
                    </div>
                </aside>

                {/* Область чата */}
                <div className="sc-chat-area">
                    {selectedTicketId === null ? (
                        <div className="sc-no-ticket-selected">
                            <p>Выберите тикет из списка слева</p>
                        </div>
                    ) : (
                        <>
                            <div className="sc-messages">
                                {messages.length === 0 && status === "connected" && (
                                    <div className="sc-empty">
                                        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25-.781 0-1.544-.094-2.273-.27-.365.326-.793.636-1.294.883-.784.39-1.684.577-2.602.637-.447.03-.835-.33-.788-.777.119-1.104.418-2.118.908-3.022C4.717 16.408 3 14.357 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                                            />
                                        </svg>
                                        <p>Начните диалог с поддержкой</p>
                                    </div>
                                )}
                                {messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`sc-msg ${msg.isOwn ? "sc-msg--own" : "sc-msg--other"}`}
                                    >
                                        {!msg.isOwn && (
                                            <div className="sc-sender-info">
                                                <span className="sc-sender-email">{msg.senderEmail}</span>
                                                {msg.senderType === "SUPPORT" && (
                                                    <span className="sc-badge">Поддержка</span>
                                                )}
                                            </div>
                                        )}
                                        <div className="sc-bubble">
                                            <span className="sc-bubble-text">{msg.text}</span>
                                            <span className="sc-bubble-time">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="sc-input-area">
                                <div className={`sc-input-wrapper ${status !== "connected" ? "sc-input-wrapper--disabled" : ""}`}>
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        className="sc-input"
                                        placeholder={status === "connected" ? "Написать сообщение..." : "Нет соединения..."}
                                        value={input}
                                        disabled={status !== "connected"}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={handleKeyDown}
                                    />
                                    <button
                                        className={`sc-send-btn ${canSend ? "sc-send-btn--active" : ""}`}
                                        onClick={handleSend}
                                        disabled={!canSend}
                                        aria-label="Отправить"
                                    >
                                        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.5">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}