import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3500,
            style: {
              background: "rgba(255, 255, 255, 0.92)",
              color: "#1D2B33",
              borderRadius: "12px",
              fontFamily: "Inter, sans-serif",
              fontSize: "0.9rem",
              boxShadow: "0 8px 24px rgba(34, 129, 154, 0.18)",
            },
            success: { iconTheme: { primary: "#22819A", secondary: "#fff" } },
            error: { iconTheme: { primary: "#C15C5C", secondary: "#fff" } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
