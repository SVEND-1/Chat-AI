import Field from "../global/Field";
import Button from "../global/Button";
import type {ForgotPasswordFormProps} from "../../../types/auth/auth.types";

export default function ForgotPasswordForm({
                                               email,
                                               setEmail,
                                               handleSubmit,
                                               navigate
                                           }: ForgotPasswordFormProps) {
    const isFormValid = email.trim().length > 0;

    return (
        <form onSubmit={handleSubmit}>
            <Field
                className="input-group"
                label="email"
                id="forgot-email"
                type="email"
                value={email}
                onInput={(e: any) => setEmail(e.target.value)}
                placeholder="your@email.com"
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
                Вернуться к входу
            </p>
        </form>
    );
}