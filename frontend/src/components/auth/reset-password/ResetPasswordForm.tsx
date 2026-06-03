import Field from "../global/Field";
import Button from "../global/Button";
import type {ResetPasswordFormProps} from "../../../types/auth/auth.types";

export default function ResetPasswordForm({
                                              newPassword,
                                              setNewPassword,
                                              confirmPassword,
                                              setConfirmPassword,
                                              handleSubmit,
                                              navigate
                                          }: ResetPasswordFormProps) {
    const isFormValid = newPassword.trim().length > 0 &&
        confirmPassword.trim().length > 0 &&
        newPassword === confirmPassword;

    return (
        <form onSubmit={handleSubmit}>
            <Field
                className="input-group"
                label="new password"
                id="reset-new-password"
                type="password"
                value={newPassword}
                onInput={(e: any) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                required
            />

            <Field
                className="input-group"
                label="confirm password"
                id="reset-confirm-password"
                type="password"
                value={confirmPassword}
                onInput={(e: any) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
            />

            <Button
                type="submit"
                className="submit-button"
                isDisabled={!isFormValid}
            >
                Сменить пароль
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