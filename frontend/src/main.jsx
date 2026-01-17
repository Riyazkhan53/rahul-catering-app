import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import "./styles/main.css";
import { ToastProvider } from "./context/ToastContext";

const theme = localStorage.getItem("theme") || "light";
document.documentElement.classList.toggle("dark", theme === "dark");

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("controllerchange", () => {
    window.location.reload();
  });
}

window.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-screen");
  if (splash) {
    splash.style.opacity = "0";
    splash.style.transition = "opacity 0.4s ease";
    setTimeout(() => splash.remove(), 400);
  }
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>,
)
