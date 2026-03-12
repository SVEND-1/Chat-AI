import  {type FormEvent} from 'react';
import { useNavigate } from "react-router-dom";
import { sendRegisterCode } from "../../api/authApi";
import type { RegisterFormProps } from "../../types/auth/auth.types";
import AuthContainer from "../../components/auth/AuthContainer";
import AuthTitle from "../../components/auth/AuthTitle";
import AuthSubtitle from "../../components/auth/AuthSubtitle";
import RegisterForm from "../../components/auth/RegisterForm";
import * as React from "react";
import "../../style/auth.css";
import "../../style/AuthForm.css";

export default function Register() {
    const navigate = useNavigate();

    const [form, setForm] = React.useState({
        email: "",
        password: "",
        name: "",
    });

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            const response = await sendRegisterCode(form);
            if (response.data.success) {
                const registrationId = response.data.registrationId;
                navigate(`/verify?registrationId=${registrationId}`);
            } else {
                alert(response.data.message || "Ошибка регистрации");
            }
        } catch (err) {
            console.error(err);
            alert("Ошибка регистрации, попробуйте снова");
        }
    };

    const registerFormProps: RegisterFormProps = {
        form,
        setForm,
        handleSubmit,
        navigate,
    };

    return (
        <AuthContainer>
            <div className="auth-form-wrapper">
                <div className="auth-form">
                    <AuthTitle>AI chats</AuthTitle>
                    <AuthSubtitle>Register</AuthSubtitle>
                    <RegisterForm {...registerFormProps} />
                </div>
            </div>
        </AuthContainer>
    );
}
