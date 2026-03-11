
export interface ForgotPasswordFormProps {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    navigate: (path: string) => void;
}

export interface LoginFormProps {
    email: string;
    setEmail: React.Dispatch<React.SetStateAction<string>>;
    password: string;
    setPassword: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    navigate: (path: string) => void;
}

export interface RegisterFormProps {
    form: {
        email: string;
        password: string;
        name: string;
    };
    setForm: React.Dispatch<React.SetStateAction<{
        email: string;
        password: string;
        name: string;
    }>>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    navigate: (path: string) => void;
}

export interface ResetPasswordFormProps {
    newPassword: string;
    setNewPassword: React.Dispatch<React.SetStateAction<string>>;
    confirmPassword: string;
    setConfirmPassword: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    navigate: (path: string) => void;
}

export interface VerifyResetCodeFormProps {
    code: string;
    setCode: React.Dispatch<React.SetStateAction<string>>;
    handleSubmit: (e: React.FormEvent) => Promise<void>;
    navigate: (path: string) => void;
}

export interface AuthResponse {
    success: boolean;
    message?: string;
    registrationId?: string;
    resetId?: string;
    token?: string;
}

export interface ForgotPasswordResponse {
    data: {
        success: boolean;
        resetId: string;
        message?: string;
    }
}

export interface VerifyResetCodeResponse {
    data: {
        success: boolean;
        message?: string;
    }
}

export interface ResetPasswordResponse {
    data: {
        success: boolean;
        message?: string;
    }
}

export interface RegisterResponse {
    data: {
        success: boolean;
        registrationId: string;
        message?: string;
    }
}

export interface LoginResponse {
    data: {
        success: boolean;
        token: string;
        user?: {
            id: string;
            email: string;
            name: string;
            role: string;
        };
        message?: string;
    }
}

export interface LogoutResponse {
    data: {
        success: boolean;
        message?: string;
    }
}