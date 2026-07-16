import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { fetchMe, loginUser, logoutUser } from "../api/auth.api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [initializing, setInitializing] = useState(true);

  // On first load, ask the backend who we are via the httpOnly cookie.
  // GET /me returns 401 if there's no valid token -- that's a normal
  // "logged out" state here, not an error to surface.
  useEffect(() => {
    (async () => {
      try {
        const res = await fetchMe();
        if (res.ok) setUser(res.user);
      } catch {
        setUser(null);
      } finally {
        setInitializing(false);
      }
    })();
  }, []);

  const login = useCallback(async (email, password) => {
    const res = await loginUser({ email, password });
    if (res.ok) setUser(res.user);
    return res;
  }, []);

  // Called after OTP verification succeeds -- backend sets the cookie and
  // returns the freshly-verified user in the same response.
  const setVerifiedUser = useCallback((u) => setUser(u), []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }, []);

  const clearSession = useCallback(() => setUser(null), []);

  return (
    <AuthContext.Provider
      value={{ user, setUser, initializing, login, logout, setVerifiedUser, clearSession }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
