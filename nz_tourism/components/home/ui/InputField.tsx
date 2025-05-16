interface InputFieldProps {
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  className?: string;
}

const InputField: React.FC<InputFieldProps> = ({
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  className = ''
}) => {
  return (
    <div className={`input-field ${className}`}>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`input-control ${error ? 'input-error' : ''}`}
      />
      {error && (
        <p className="input-error-message">
          {error}
        </p>
      )}
    </div>
  );
};

export default InputField; 