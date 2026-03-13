import Field from "../global/Field";
import Button from "../global/Button";
import type {LoginFormProps} from "../../../types/auth/auth.types";

export default function LoginForm({
                                      email,
                                      setEmail,
                                      password,
                                      setPassword,
                                      handleSubmit,
                                      navigate
                                  }: LoginFormProps) {
    const isFormValid = email.trim() && password.trim();

    return (
        <form onSubmit={handleSubmit}>
            <Field
                className="input-group"
                label="email"
                id="login-email"
                type="email"
                value={email}
                onInput={(e: any) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
            />

            <Field
                className="input-group"
                label="password"
                id="login-password"
                type="password"
                value={password}
                onInput={(e: any) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
            />

            <div className="forgot-password">
                <Button
                    type="button"
                    className="forgot-button"
                    onClick={() => navigate("/forgot-password")}
                    isDisabled={false}
                >
                    забыли пароль?
                </Button>
            </div>

            <Button
                type="submit"
                className="submit-button"
                isDisabled={!isFormValid}
            >
                Войти
            </Button>

            <p
                onClick={() => navigate("/register")}
                className="auth-link"
                style={{ cursor: "pointer" }}
            >
                Нет аккаунта? Зарегистрироваться
            </p>
        </form>
    );
}