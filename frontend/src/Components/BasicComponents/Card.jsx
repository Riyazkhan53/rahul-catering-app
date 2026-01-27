import { glassCard } from "./styles";

export default function Card({ children, className = "" }) {
  return (
    <div className={`${glassCard} ${className}`}>
      {children}
    </div>
  );
}