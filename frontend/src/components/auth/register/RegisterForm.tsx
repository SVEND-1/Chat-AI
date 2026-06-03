import type { RegisterFormProps } from "../../../types/auth/auth.types";
import Field from "../global/Field";
import Button from "../global/Button";

export default function RegisterForm({ form, setForm, handleSubmit, navigate }: RegisterFormProps) {
    const isFormValid = form.email.trim() && form.password.trim() && form.name.trim();

    return (
        <form onSubmit={handleSubmit}>
            <Field
                className="input-group"
                label="Name"
                id="register-name"
                type="text"
                value={form.name}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                    setForm({ ...form, name: e.currentTarget.value })
                }
                placeholder="Your name"
                required
            />

            <Field
                className="input-group"
                label="Email"
                id="register-email"
                type="email"
                value={form.email}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                    setForm({ ...form, email: e.currentTarget.value })
                }
                placeholder="your@email.com"
                required
            />

            <Field
                className="input-group"
                label="Password"
                id="register-password"
                type="password"
                value={form.password}
                onInput={(e: React.FormEvent<HTMLInputElement>) =>
                    setForm({ ...form, password: e.currentTarget.value })
                }
                placeholder="••••••••"
                required
            />

            <Button
                type="submit"
                className="submit-button"
                isDisabled={!isFormValid}
            >
                Получить код
            </Button>

            <p
                onClick={() => navigate("/")}
                className="auth-link"
                style={{ cursor: "pointer" }}
            >
                Уже есть аккаунт? Войти
            </p>
        </form>
    );
}