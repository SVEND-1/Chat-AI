interface EmptyStateProps {
    onCreateChat: () => void;
}

export function EmptyState({ onCreateChat }: EmptyStateProps) {
    return (
        <div className="empty-state">
            <div className="empty-state-content">
                <svg viewBox="0 0 24 24" strokeWidth="1.5" width="64" height="64">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25-.781 0-1.544-.094-2.273-.27-.365.326-.793.636-1.294.883-.784.39-1.684.577-2.602.637-.447.03-.835-.33-.788-.777.119-1.104.418-2.118.908-3.022C4.717 16.408 3 14.357 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                </svg>
                <h2>Добро пожаловать в Lumen</h2>
                <p>Начните новый чат, чтобы задать вопрос нейросети</p>
                <button className="start-chat-btn" onClick={onCreateChat}>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Новый чат
                </button>
            </div>
        </div>
    );
}
