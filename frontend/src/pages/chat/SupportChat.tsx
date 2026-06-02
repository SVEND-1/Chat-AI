import { useState, useEffect, useRef, useCallback } from "react";
import "../../style/support-chat.css";

// ============================= TYPES =============================

interface WsOutgoingMessage {
    id: number;
    ticketId: number;
    senderId: number;
    senderEmail: string;
    senderType: "USER" | "SUPPORT" | string;
    message: string;
    createdAt: string; // ISO datetime
}

interface WsErrorMessage {
    type: "ERROR";
    message: string;
}

type WsMessage = WsOutgoingMessage | WsErrorMessage;

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

// ============================= КОНСТАНТЫ =============================

const TICKET_ID = 42;
const TOKEN = "your-jwt-here";
const CURRENT_USER_ID = 7;
const WS_BASE_URL = "ws://localhost:8080";

// ============================= COMPONENT =============================

export default function SupportChat() {
    const ticketId = TICKET_ID;
    const token = TOKEN;
    const currentUserId = CURRENT_USER_ID;
    const wsBaseUrl = WS_BASE_URL;

    const [messages, setMessages] = useState<DisplayMessage[]>([]);
    const [input, setInput] = useState("");
    const [status, setStatus] = useState<ConnectionStatus>("connecting");
    const [errorBanner, setErrorBanner] = useState<string | null>(null);

    const wsRef = useRef<WebSocket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    // ───── scroll to bottom ─────
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // ───── WebSocket lifecycle ─────
    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;

        setStatus("connecting");
        const url = `${wsBaseUrl}/ws/support/${ticketId}?token=${token}`;
        const ws = new WebSocket(url);
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
                const display: DisplayMessage = {
                    id: msg.id,
                    text: msg.message,
                    senderEmail: msg.senderEmail,
                    senderType: msg.senderType,
                    time: formatTime(msg.createdAt),
                    isOwn: msg.senderId === currentUserId,
                };
                setMessages((prev) => [...prev, display]);
            } catch {
                // ignore malformed frames
            }
        };

        ws.onclose = (ev) => {
            setStatus("disconnected");
            // auto-reconnect unless server closed with code >= 4000 (access denied etc)
            if (ev.code < 4000) {
                reconnectTimer.current = setTimeout(() => connect(), 3000);
            }
        };

        ws.onerror = () => {
            setStatus("error");
        };
    }, [ticketId, token, currentUserId, wsBaseUrl]);

    useEffect(() => {
        connect();
        return () => {
            reconnectTimer.current && clearTimeout(reconnectTimer.current);
            wsRef.current?.close();
        };
    }, [connect]);

    // ───── Send ─────
    const handleSend = () => {
        const text = input.trim();
        if (!text || wsRef.current?.readyState !== WebSocket.OPEN) return;

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

    // ───── Status indicator ─────
    const statusLabel: Record<ConnectionStatus, string> = {
        connecting: "Подключение...",
        connected: "В сети",
        disconnected: "Переподключение...",
        error: "Ошибка соединения",
    };

    const canSend = status === "connected" && input.trim().length > 0;

    // ───── Render ─────
    return (
        <div className="sc-root">
            {/* Header */}
            <div className="sc-header">
                <div className="sc-header-left">
                    <span className="sc-ticket-label">Тикет #{ticketId}</span>
                    <div className={`sc-status sc-status--${status}`}>
                        <span className="sc-status-dot" />
                        <span className="sc-status-text">{statusLabel[status]}</span>
                    </div>
                </div>
            </div>

            {/* Error banner */}
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

            {/* Messages */}
            <div className="sc-messages">
                {messages.length === 0 && status === "connected" && (
                    <div className="sc-empty">
                        <svg viewBox="0 0 24 24" width="40" height="40" fill="none" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25-.781 0-1.544-.094-2.273-.27-.365.326-.793.636-1.294.883-.784.39-1.684.577-2.602.637-.447.03-.835-.33-.788-.777.119-1.104.418-2.118.908-3.022C4.717 16.408 3 14.357 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                        </svg>
                        <p>Начните диалог с поддержкой</p>
                    </div>
                )}

                {messages.map((msg) => (
                    <div key={msg.id} className={`sc-msg ${msg.isOwn ? "sc-msg--own" : "sc-msg--other"}`}>
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

            {/* Input */}
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
                            <path strokeLinecap="round" strokeLinejoin="round"
                                  d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}