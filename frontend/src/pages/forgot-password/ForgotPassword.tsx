import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthTitle from "../../components/auth/AuthTitle";
import AuthSubtitle from "../../components/auth/AuthSubtitle";
import ForgotPasswordForm from "../../components/auth/forgot-password/ForgotPasswordForm";
import "../../style/AuthForm.css";
import "../../styles/auth.css";

export default function ForgotPassword() {
    const [email, setEmail] = useState<string>("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const response = await forgotPassword(email);

            if (response.data.success) {
                navigate(`/reset-verify?resetId=${response.data.resetId}`);
            } else {
                alert(response.data.message || "Ошибка отправки кода");
            }

        } catch (error: any) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Ошибка отправки кода восстановления"
            );
        }
    };

    return (
        <AuthContainer>
            <div className="auth-form-wrapper">
                <div className="auth-form">
                    <AuthTitle>AI chats</AuthTitle>
                    <AuthSubtitle>forgot password</AuthSubtitle>

                    <ForgotPasswordForm
                        email={email}
                        setEmail={setEmail}
                        handleSubmit={handleSubmit}
                        navigate={navigate}
                    />
                </div>
            </div>
        </AuthContainer>
    );
}