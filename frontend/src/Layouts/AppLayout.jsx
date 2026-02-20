export default function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-app text-app transition-colors duration-300">
      {children}
    </div>
  );
}