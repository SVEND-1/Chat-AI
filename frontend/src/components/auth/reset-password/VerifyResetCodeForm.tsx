import Field from "../global/Field";
import Button from "../global/Button";

const VerifyResetCodeForm = ({ code, setCode, handleSubmit, navigate }: any) => {
    return (
        <form onSubmit={handleSubmit}>
            <Field
                className="input-group"
                label="verification code"
                id="verification-code"
                type="text"
                value={code}
                onInput={(e: any) => setCode(e.target.value)}
                placeholder="Введите код из email"
                required
            />

            <Button
                type="submit"
                className="submit-button"
                isDisabled={code.trim().length === 0}
            >
                Подтвердить код
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
};

export default VerifyResetCodeForm;