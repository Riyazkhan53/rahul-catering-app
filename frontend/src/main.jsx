import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./styles/main.css";
import App from "./App.jsx";
import { ToastProvider } from "./context/ToastContext";
import { ThemeProvider } from "./context/ThemeContext";


// Theme
const theme = localStorage.getItem("theme") || "light";
document.documentElement.classList.toggle("dark", theme === "dark");

const rootElement = document.getElementById("root");



// Mount React FIRST
createRoot(rootElement).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <App />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>
);
