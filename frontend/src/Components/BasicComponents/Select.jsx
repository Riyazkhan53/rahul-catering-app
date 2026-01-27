import { glassField } from "./styles";

export default function Select({ value, onChange, children }) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={`${glassField} appearance-none`}
    >
      {children}
    </select>
  );
}