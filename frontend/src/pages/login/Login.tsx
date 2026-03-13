import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api/authApi";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthTitle from "../../components/auth/AuthTitle";
import AuthSubtitle from "../../components/auth/AuthSubtitle";
import LoginForm from "../../components/auth/login/LoginForm";
import type { LoginResponse } from "../../api/authApi.ts";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await login({ email, password });

            const data: LoginResponse = response.data;

            if (data.success) {
                // сохраняем токен
                localStorage.setItem("token", data.token);

                // можно сохранить пользователя при необходимости
                if (data.user) {
                    localStorage.setItem("user", JSON.stringify(data.user));
                }

                navigate("/dashboard");
            } else {
                alert(data.message || "Неверные данные");
            }

        } catch (error: any) {
            console.error("Login error:", error);

            const message =
                error.response?.data?.message ||
                "Ошибка соединения с сервером";

            alert(message);
        }
    };

    return (
        <AuthContainer>
            <div className="auth-form-wrapper">
                <div className="auth-form">
                    <AuthTitle>AI chats</AuthTitle>
                    <AuthSubtitle>login</AuthSubtitle>

                    <LoginForm
                        email={email}
                        setEmail={setEmail}
                        password={password}
                        setPassword={setPassword}
                        handleSubmit={handleSubmit}
                        navigate={navigate}
                    />
                </div>
            </div>
        </AuthContainer>
    );
}
