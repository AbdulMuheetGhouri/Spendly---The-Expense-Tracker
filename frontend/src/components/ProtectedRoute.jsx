import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Loader from "./Loader";

export default function ProtectedRoute({ children, requireVerified = false }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) return <Loader label="Checking your session" />;

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Mirrors the backend's `isverified` middleware: routes like add/edit
  // expense, analytics, and profile 403 for an unverified account.
  if (requireVerified && !user.isVerified) {
    return <Navigate to="/verify-otp" state={{ userId: user.id }} replace />;
  }

  return children;
}
