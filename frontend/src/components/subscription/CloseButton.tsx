import React from 'react';
import '../../style/subscription/CloseButton.css';
import { useNavigate } from 'react-router-dom';

interface CloseButtonProps {
    onClose?: () => void;
}


const CloseButton: React.FC<CloseButtonProps> = ({ onClose }) => {

    const navigate = useNavigate();

    const handleClose = (): void => {

        if (onClose) {
            onClose();

        }

        navigate('/chat');

    };

    return (
        <button className="close-button" onClick={handleClose} aria-label="Закрыть">
            <svg
                className="close-button__icon"
                viewBox="0 0 24 24"
                width="20"
                height="20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M18 6L6 18M6 6L18 18"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                />
            </svg>
        </button>
    );
};

export default CloseButton;