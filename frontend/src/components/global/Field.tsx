const Field = (props: any) => {
    const {
        className = '',
        id,
        label,
        type = 'text',
        value,
        onInput,
        placeholder,
        required
    } = props;

    return (
        <div className={`field ${className}`}>
            <label className="input-label" htmlFor={id}>
                {label}
            </label>
            <input
                className="input-field"
                id={id}
                type={type}
                value={value}
                onInput={onInput}
                placeholder={placeholder}
                required={required}
                autoComplete="off"
            />
        </div>
    );
};

export default Field;