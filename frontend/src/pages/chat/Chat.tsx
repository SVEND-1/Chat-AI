import { useState, useEffect, useRef } from "react";
import {Link, useNavigate} from "react-router-dom";
import "../../style/chat.css";
import logoIcon from '../../assets/icons/icon.svg'
import SettingsModal from "../../components/Chat/settingModal/SettingModal";


interface Message {
    id: number;
    text: string;
    time: string;
    isUser: boolean;
}

interface ChatRoom {
    id: string;
    name: string;
    messages: Message[];
}



export default function Chat() {
    const navigate = useNavigate();
    const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
    const [currentChatId, setCurrentChatId] = useState<string | null>(null);
    const [input, setInput] = useState("");
    const [showProfileMenu, setShowProfileMenu] = useState(false);

    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const inputRef = useRef<HTMLInputElement>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const currentChat = chatRooms.find(chat => chat.id === currentChatId);


    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [currentChatId]);

    // Scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [currentChat?.messages]);

    const handleSend = () => {
        if (!input.trim() || !currentChatId) return;

        const newMessage: Message = {
            id: Date.now(),
            text: input,
            time: new Date().toLocaleTimeString().slice(0, 5),
            isUser: true,
        };

        setChatRooms(prev => prev.map(chat =>
            chat.id === currentChatId
                ? { ...chat, messages: [...chat.messages, newMessage] }
                : chat
        ));

        setInput("");

        // Keep focus on input after sending
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }, 0);
    };

    const handleCreateChat = () => {
        const newChat: ChatRoom = {
            id: `chat-${Date.now()}`,
            name: `Новый чат ${chatRooms.length + 1}`,
            messages: [],
        };

        setChatRooms(prev => [...prev, newChat]);
        setCurrentChatId(newChat.id);
    };

    const switchChat = (chatId: string) => {
        setCurrentChatId(chatId);
    };

    const handleDeleteClick = (chatId: string, e: React.MouseEvent) => {
        e.stopPropagation();

        setChatRooms(prev => prev.filter(chat => chat.id !== chatId));

        if (currentChatId === chatId) {
            const remainingChats = chatRooms.filter(chat => chat.id !== chatId);
            setCurrentChatId(remainingChats.length > 0 ? remainingChats[0].id : null);
        }
    };

    const toggleProfileMenu = () => {
        setShowProfileMenu(!showProfileMenu);
    };

    // Функции для открытия/закрытия
    const openSettingsModal = () => {
        setShowProfileMenu(false);
        setShowSettingsModal(true);
    };

    const closeSettingsModal = () => {
        setShowSettingsModal(false);
    };


    return (
        <div className="app">
            {/* SIDEBAR */}
            <div className="sidebar">
                <div className="logo">
                    <img src={logoIcon} alt="Lumen logo" className="logo-icon" />
                    <span>Lumen</span>
                </div>

                <button className="create-chat-btn" onClick={handleCreateChat}>
                    <svg viewBox="0 0 24 24" strokeWidth="1.5">
                        <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 4.5v15m7.5-7.5h-15"
                        />
                    </svg>
                    <span>Новый чат</span>
                </button>

                {chatRooms.length > 0 && (
                    <div className="chat-list">
                        <h3 className="chat-list-title">История чатов</h3>
                        {chatRooms.map(chat => (
                            <div key={chat.id} className="chat-item-wrapper">
                                <button
                                    className={`chat-item ${chat.id === currentChatId ? 'active' : ''}`}
                                    onClick={() => switchChat(chat.id)}
                                >
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25-.781 0-1.544-.094-2.273-.27-.365.326-.793.636-1.294.883-.784.39-1.684.577-2.602.637-.447.03-.835-.33-.788-.777.119-1.104.418-2.118.908-3.022C4.717 16.408 3 14.357 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                                        />
                                    </svg>
                                    <span className="chat-name">{chat.name}</span>
                                </button>
                                <button
                                    className="delete-chat-btn"
                                    onClick={(e) => handleDeleteClick(chat.id, e)}
                                    title="Удалить чат"
                                >
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="16" height="16">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                                        />
                                    </svg>
                                </button>
                            </div>
                        ))}
                    </div>
                )}

                <div className="sidebar-footer">
                    <button className="subscribe-btn" onClick={() => window.location.href = "/subscription"}>
                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z"
                            />
                        </svg>
                        <span>Оформить подписку</span>
                    </button>

                    <div className="profile-section">
                        <button className="profile-btn" onClick={toggleProfileMenu}>
                            <div className="profile-avatar">
                                <svg viewBox="0 0 24 24" strokeWidth="1.5">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                                    />
                                </svg>
                            </div>
                            <span>Профиль</span>
                        </button>

                        {showProfileMenu && (
                            <div className="profile-menu">
                                <button
                                    className="profile-menu-item"
                                    onClick={openSettingsModal}
                                >
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.074-.04.147-.083.22-.128.332-.183.582-.495.644-.869l.214-1.281z"
                                        />
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                        />
                                    </svg>
                                    Настройки
                                </button>
                                <Link to="/support" className="profile-menu-item">
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                                        />
                                    </svg>
                                    Поддержка
                                </Link>
                                <button className="profile-menu-item logout">
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="18" height="18">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75"
                                        />
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
                <div className="chat-page">
                    {currentChat ? (
                        <>
                            <div className="chat-header">
                                <h1>{currentChat.name}</h1>
                            </div>

                            <div className="messages-wrapper">
                                {currentChat.messages.map((msg) => (
                                    <div
                                        key={msg.id}
                                        className={`message ${msg.isUser ? "right" : "left"}`}
                                    >
                                        <div className={`message-content ${msg.isUser ? "user-message" : ""}`}>
                                            <div className="message-text">{msg.text}</div>
                                            <span className="message-time">{msg.time}</span>
                                        </div>
                                    </div>
                                ))}
                                <div ref={messagesEndRef} />
                            </div>

                            <div className="input-container">
                                <div className="input-wrapper">
                                    <input
                                        ref={inputRef}
                                        type="text"
                                        placeholder="Написать сообщение..."
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === "Enter" && !e.shiftKey) {
                                                e.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                    />
                                    <button
                                        className={`send-btn ${!input.trim() ? 'disabled' : ''}`}
                                        onClick={handleSend}
                                        disabled={!input.trim()}
                                    >
                                        <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                                            <path
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5"
                                            />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-state-content">
                                <svg viewBox="0 0 24 24" strokeWidth="1.5" width="64" height="64">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25-.781 0-1.544-.094-2.273-.27-.365.326-.793.636-1.294.883-.784.39-1.684.577-2.602.637-.447.03-.835-.33-.788-.777.119-1.104.418-2.118.908-3.022C4.717 16.408 3 14.357 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z"
                                    />
                                </svg>
                                <h2>Добро пожаловать в Lumen</h2>
                                <p>Начните новый чат, чтобы задать вопрос нейросети</p>
                                <button className="start-chat-btn" onClick={handleCreateChat}>
                                    <svg viewBox="0 0 24 24" strokeWidth="1.5" width="20" height="20">
                                        <path
                                            stroke="currentColor"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 4.5v15m7.5-7.5h-15"
                                        />
                                    </svg>
                                    Новый чат
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            {showSettingsModal && (
                <SettingsModal onClose={closeSettingsModal} />
            )}
        </div>
    );
}