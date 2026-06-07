import { useRef, useState, useEffect } from "react";
import { SupportTicket } from "../../../types/chat/support.types";

interface SupportInputProps {
    ticket: SupportTicket;
    wsConnected: boolean;
    wsError: string | null;
    onSend: (text: string) => void;
}

export function SupportInput({ ticket, wsConnected, wsError, onSend }: SupportInputProps) {
    const [input, setInput] = useState("");
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, [ticket.id]);

    const handleSend = () => {
        if (!input.trim() || !wsConnected) return;
        onSend(input.trim());
        setInput("");
    };

    if (ticket.status === "CLOSED") {
        return (
            <div className="input-container">
                <div className="support-closed-banner">
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                    </svg>
                    Тикет закрыт — переписка завершена
                </div>
            </div>
        );
    }

    if (ticket.support == null) {
        return (
            <div className="input-container">
                <div
                    className="support-closed-banner"
                    style={{ borderColor: "rgba(255,165,0,0.2)", color: "#ffb84d", background: "rgba(255,165,0,0.05)" }}
                >
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    Ожидаем подключения оператора поддержки...
                </div>
            </div>
        );
    }

    return (
        <div className="input-container">
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
        </div>
    );
}
