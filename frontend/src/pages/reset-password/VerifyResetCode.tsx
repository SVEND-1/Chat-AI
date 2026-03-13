import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { verifyResetCode } from "../../api/authApi";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthTitle from "../../components/auth/AuthTitle";
import AuthSubtitle from "../../components/auth/AuthSubtitle";
import VerifyResetCodeForm from "../../components/auth/reset-password/VerifyResetCodeForm";

export default function VerifyResetCode() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const resetId = searchParams.get("resetId");
    const [code, setCode] = useState<string>("");

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
            const response = await verifyResetCode(resetId, code);

            if (response.data.success) {
                navigate(`/reset-password?resetId=${resetId}`);
            } else {
                alert(response.data.message || "Неверный код");
            }

        } catch (error: any) {
            console.error(error);
            alert(
                error.response?.data?.message ||
                "Ошибка проверки кода"
            );
        }
    };

    return (
        <AuthContainer>
            <div className="auth-form-wrapper">
                <div className="auth-form">
                    <AuthTitle>AI chats</AuthTitle>
                    <AuthSubtitle>verify reset code</AuthSubtitle>

                    <VerifyResetCodeForm
                        code={code}
                        setCode={setCode}
                        handleSubmit={handleSubmit}
                        navigate={navigate}
                    />
                </div>
            </div>
        </AuthContainer>
    );
}
