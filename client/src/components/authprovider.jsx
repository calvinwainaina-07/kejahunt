import { useCallback, useEffect, useState } from "react";
import { apiRequest, clearAccessToken } from "../api";
import { AuthContext } from "./authcontext.js";

export function AuthProvider({ children }) {
  const [state, setState] = useState({ status: "checking", user: null });

  const refreshSession = useCallback(async () => {
    setState((current) => ({ ...current, status: "checking" }));
    try {
      const { user } = await apiRequest("/auth/user");
      sessionStorage.setItem("kejahunt-role", user.role);
      setState({ status: "authenticated", user });
      return user;
    } catch (error) {
      clearAccessToken();
      sessionStorage.removeItem("kejahunt-role");
      setState({ status: "unauthenticated", user: null });
      throw error;
    }
  }, []);

  const clearSession = useCallback(() => {
    clearAccessToken();
    sessionStorage.removeItem("kejahunt-role");
    setState({ status: "unauthenticated", user: null });
  }, []);

  useEffect(() => {
    refreshSession().catch(() => {});
  }, [refreshSession]);

  return <AuthContext.Provider value={{ ...state, refreshSession, clearSession }}>{children}</AuthContext.Provider>;
}
