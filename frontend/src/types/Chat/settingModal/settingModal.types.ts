export type SettingsTab = 'general' | 'about-program' | 'about-us' | 'profile';

export interface SettingsModalProps {
    onClose: () => void;
}

export interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    icon: React.ReactNode;
    label: string;
}