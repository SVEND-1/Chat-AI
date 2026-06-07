import { useState } from "react";
import { createPortal } from "react-dom";

interface NewTicketModalProps {
    onClose: () => void;
    onCreate: (title: string) => Promise<void>;
}

export function NewTicketModal({ onClose, onCreate }: NewTicketModalProps) {
    const [title, setTitle] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!title.trim() || isSubmitting) return;
        setIsSubmitting(true);
        try {
            await onCreate(title);
            onClose();
        } catch (e) {
            console.error(e);
        } finally {
            setIsSubmitting(false);
        }
    };

    return createPortal(
        <div className="support-modal-overlay" onClick={onClose}>
            <div className="support-modal" onClick={(e) => e.stopPropagation()}>
                <div className="support-modal-header">
                    <h2>Новое обращение</h2>
                    <button className="support-modal-close" onClick={onClose}>
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                                  d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <p className="support-modal-hint">
                    Опишите суть вашего обращения в заголовке. Детали можно уточнить в чате.
                </p>
                <input
                    className="support-modal-input"
                    type="text"
                    placeholder="Например: Не работает оплата подписки"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    autoFocus
                />
                <div className="support-modal-actions">
                    <button className="support-modal-cancel" onClick={onClose}>
                        Отмена
                    </button>
                    <button
                        className="support-modal-submit"
                        onClick={handleSubmit}
                        disabled={!title.trim() || isSubmitting}
                    >
                        {isSubmitting ? "Создание..." : "Создать обращение"}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
}