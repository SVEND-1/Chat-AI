import { useEffect, useRef } from 'react';
import { Message } from '../../types/Chat/chat.types';

interface MessageListProps {
    messages: Message[];
    isSending: boolean;
}

export function MessageList({ messages, isSending }: MessageListProps) {
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    return (
        // justify-content: flex-start — сообщения идут сверху вниз в хронологическом порядке.
        // Новые сообщения добавляются в конец массива и оказываются снизу.
        // Скролл автоматически прокручивается к последнему сообщению.
        <div className="messages-wrapper">
            {messages.map(msg => (
                <div key={msg.id} className={`message ${msg.isUser ? 'right' : 'left'}`}>
                    <div className={`message-content ${msg.isUser ? 'user-message' : ''}`}>
                        <div className="message-text">{msg.text}</div>
                        <span className="message-time">{msg.time}</span>
                    </div>
                </div>
            ))}

            {isSending && (
                <div className="message left">
                    <div className="message-content">
                        <div className="typing-indicator">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>
                    </div>
                </div>
            )}

            {/* Якорь для автоскролла вниз */}
            <div ref={messagesEndRef} />
        </div>
    );
}
