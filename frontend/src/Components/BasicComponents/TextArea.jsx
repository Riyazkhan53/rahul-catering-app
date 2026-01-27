import { glassField } from "./styles";

export default function Textarea({
  value,
  onChange,
  placeholder,
  rows = 3,
}) {
  return (
    <textarea
      rows={rows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${glassField} resize-none`}
    />
  );
}