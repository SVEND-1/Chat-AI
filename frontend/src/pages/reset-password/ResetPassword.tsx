import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { resetPassword } from "../../api/authApi";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthTitle from "../../components/auth/AuthTitle";
import AuthSubtitle from "../../components/auth/AuthSubtitle";
import ResetPasswordForm from "../../components/auth/reset-password/ResetPasswordForm";
import "../../style/AuthForm.css";
import "../../style/auth.css";

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const resetId = searchParams.get("resetId");

    const [newPassword, setNewPassword] = useState<string>("");
    const [confirmPassword, setConfirmPassword] = useState<string>("");

    useEffect(() => {
        if (!resetId) {
            alert("Некорректная ссылка восстановления");
            navigate("/");
        }
    }, [resetId, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!resetId) return;

        try {
            const response = await resetPassword({
                resetId,
                newPassword,
                confirmPassword,
            });

            if (response.data.success) {
                alert("Пароль успешно изменён");
                navigate("/");
            } else {
                alert(response.data.message || "Ошибка сброса");
            }

        } catch (error: any) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Ошибка при сбросе пароля"
            );
        }
    };

    return (
        <AuthContainer>
            <div className="auth-form-wrapper">
                <div className="auth-form">
                    <AuthTitle>AI chats</AuthTitle>
                    <AuthSubtitle>reset password</AuthSubtitle>

                    <ResetPasswordForm
                        newPassword={newPassword}
                        setNewPassword={setNewPassword}
                        confirmPassword={confirmPassword}
                        setConfirmPassword={setConfirmPassword}
                        handleSubmit={handleSubmit}
                        navigate={navigate}
                    />
                </div>
            </div>
        </AuthContainer>
    );
}
