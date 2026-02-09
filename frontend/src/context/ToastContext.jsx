import { createContext, useContext, useState } from "react";
import Toast from "../Components/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = "success", duration = 3000) => {
    const id = Date.now();

    setToasts((prev) => [
      ...prev,
      { id, message, type },
    ]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

      {/* Toast Container */}
      <div className="fixed top-4 sm:top-6 right-3 sm:right-6 z-50 space-y-2 sm:space-y-3 max-w-[calc(100vw-1.5rem)] sm:max-w-none">
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);