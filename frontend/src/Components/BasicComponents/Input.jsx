import { glassField, glassDisabled } from "./styles";

export default function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  disabled = false,
  className = "",
  ...props
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      disabled={disabled}
      className={`${disabled ? glassDisabled : glassField} ${className}`}
      {...props}
    />
  );
}