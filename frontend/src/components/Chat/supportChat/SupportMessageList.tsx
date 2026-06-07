import { useEffect, useRef } from "react";
import { SupportMessage } from "../../../types/chat/support.types";
import { formatTime } from "../../../utils/Chat/formatters";

interface SupportMessageListProps {
    messages: SupportMessage[];
    isMsgLoading: boolean;
    currentUserId?: number;
}

export function SupportMessageList({ messages, isMsgLoading, currentUserId }: SupportMessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const getAvatarClass = (senderType: string, isMine: boolean) => {
        if (isMine) return "mine";
        if (senderType === "USER") return "user";
        if (senderType === "SUPPORT") return "support";
        return "other";
    };

    const getBubbleClass = (senderType: string, isMine: boolean) => {
        if (isMine) return "mine";
        if (senderType === "USER") return "user";
        if (senderType === "SUPPORT") return "support";
        return "other";
    };

    const getAvatarLabel = (senderType: string, isMine: boolean) => {
        if (isMine) return "Я";
        if (senderType === "USER") return "П";
        if (senderType === "SUPPORT") return "С";
        return "?";
    };

    if (isMsgLoading) {
        return (
            <div className="messages">
                <div style={{ display: "flex", justifyContent: "center", paddingTop: "40px" }}>
                    <div className="loader" />
                </div>
            </div>
        );
    }

    if (messages.length === 0) {
        return (
            <div className="messages">
                <div className="empty">
                    <div className="empty-icon">💬</div>
                    <p>Напишите первое сообщение оператору поддержки</p>
                </div>
            </div>
        );
    }

    return (
        <div className="messages">
            {messages.map((msg) => {
                const isMine = currentUserId !== undefined && msg.senderId === currentUserId;
                const avatarClass = getAvatarClass(msg.senderType, isMine);
                const bubbleClass = getBubbleClass(msg.senderType, isMine);
                const avatarLabel = getAvatarLabel(msg.senderType, isMine);

                return (
                    <div key={msg.id} className={`msg-row ${isMine ? "mine" : ""}`}>
                        <div className={`avatar ${avatarClass}`}>
                            {avatarLabel}
                        </div>
                        <div style={{ maxWidth: "80%" }}>
                            <div className={`bubble ${bubbleClass}`}>
                                {msg.message}
                            </div>
                            <div className="msg-meta">
                                {formatTime(msg.createdAt)}
                            </div>
                        </div>
                    </div>
                );
            })}
            <div ref={messagesEndRef} />
        </div>
    );
}