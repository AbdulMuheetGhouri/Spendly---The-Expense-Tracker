import { useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { registerAuthHandlers } from "../api/axios";
import { useAuth } from "../context/AuthContext";

const PUBLIC_PATHS = ["/", "/login", "/register", "/verify-otp"];

// Wires the axios response interceptor (see api/axios.js) to actual
// navigation + context updates, so any 401/403 anywhere in the app
// funnels through one place instead of being handled ad hoc per call site.
export default function AuthEventBridge() {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearSession } = useAuth();
  const locationRef = useRef(location);
  locationRef.current = location;

  useEffect(() => {
    registerAuthHandlers({
      unauthorized: () => {
        if (PUBLIC_PATHS.includes(locationRef.current.pathname)) return;
        clearSession();
        toast.error("Your session expired. Please log in again.");
        navigate("/login", { replace: true });
      },
      unverified: (data) => {
        toast.error(data?.message || "Please verify your email to continue.");
        navigate("/verify-otp", { state: { userId: data?.userId } });
      },
    });
  }, [navigate, clearSession]);

  return null;
}
