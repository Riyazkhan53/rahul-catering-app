import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/main.css";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext";

// Theme
const theme = localStorage.getItem("theme") || "light";
document.documentElement.classList.toggle("dark", theme === "dark");

const rootElement = document.getElementById("root");
const splash = document.getElementById("splash-screen");



// Mount React FIRST
createRoot(rootElement).render(
  <StrictMode>
    <ToastProvider>
      <App />
    </ToastProvider>
  </StrictMode>
);

window.addEventListener("app-ready", () => {
  if (!splash) return;

  splash.style.opacity = "0";
  splash.style.transition = "opacity 0.4s ease";
  setTimeout(() => splash.remove(), 400);
});
