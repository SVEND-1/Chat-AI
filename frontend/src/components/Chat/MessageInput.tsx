import { useEffect, useRef, useState } from 'react';

interface MessageInputProps {
    isSending: boolean;
    onSend: (text: string) => void;
}

export function MessageInput({ isSending, onSend }: MessageInputProps) {
    const [input, setInput] = useState('');
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleSend = () => {
        if (!input.trim() || isSending) return;
        onSend(input.trim());
        setInput('');
    };

    return (
        <div className="input-container">
            <div className="input-wrapper">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder="Написать сообщение..."
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => {
                        if (e.key === 'Enter' && !e.shiftKey && !isSending) {
                            e.preventDefault();
                            handleSend();
                        }
                    }}
                    disabled={isSending}
                />
                <button
                    className={`send-btn ${!input.trim() || isSending ? 'disabled' : ''}`}
                    onClick={handleSend}
                    disabled={!input.trim() || isSending}
                >
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
