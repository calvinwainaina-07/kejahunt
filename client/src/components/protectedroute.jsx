import { useEffect, useState } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { apiRequest } from "../api";

export default function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const [state, setState] = useState({ status: "checking", user: null });

  useEffect(() => {
    let active = true;

    apiRequest("/auth/user")
      .then(({ user }) => {
        if (!active) return;
        sessionStorage.setItem("kejahunt-role", user.role);
        setState({ status: "authenticated", user });
      })
      .catch(() => {
        if (!active) return;
        sessionStorage.removeItem("kejahunt-role");
        setState({ status: "unauthenticated", user: null });
      });

    return () => { active = false; };
  }, []);

  if (state.status === "checking") {
    return <main className="grid min-h-screen place-items-center bg-bg p-6 text-sm text-textSecondary">Checking your session…</main>;
  }

  if (state.status === "unauthenticated") {
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (roles && !roles.includes(state.user.role)) {
    return <Navigate to={state.user.role === "owner" ? "/owner" : "/dashboard"} replace />;
  }

  return children;
}
