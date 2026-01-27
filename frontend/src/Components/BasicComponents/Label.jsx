import { labelStyle } from "./styles";

export default function Label({ children }) {
  return <label className={labelStyle}>{children}</label>;
}