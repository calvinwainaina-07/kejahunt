import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./useauth.js";

export default function ProtectedRoute({ children, roles }) {
  const location = useLocation();
  const state = useAuth();

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
