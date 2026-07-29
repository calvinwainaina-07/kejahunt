// TEMPORARY PROTOTYPE AUTH: replace browser storage with secure backend authentication.
// Authentication screen and entry point.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  // The chosen role decides which dashboard opens after prototype sign-in.
  const [selectedRole, setSelectedRole] = useState("hunter");
  const navigate = useNavigate();

  function signIn(event) {
    // Save the role for sidebar navigation until the user logs out.
    event.preventDefault();
    // Keep the login email available to the profile page in this browser-only demo.
    const email = new FormData(event.currentTarget).get("email");
    const savedProfile = JSON.parse(localStorage.getItem("kejahunt-profile") || "{}");
    localStorage.setItem("kejahunt-profile", JSON.stringify({ ...savedProfile, email }));
    sessionStorage.setItem("kejahunt-role", selectedRole);
    navigate(selectedRole === "owner" ? "/owner" : "/dashboard");
  }

  return (
    // Centers the sign-in card vertically and horizontally on the page.
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      {/* Main authentication card. */}
      <div className="w-full max-w-[402px] bg-surface border border-border rounded-[32px] shadow-xl px-8 py-10 flex flex-col gap-4">
        {/* Brand area. */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white text-lg">

          </div>
          <span className="font-serif text-xl font-bold text-primary">KejaHunt</span>
        </div>

        {/* Introductory copy that explains the purpose of this page. */}
        <div>
          <h1 className="font-serif text-[28px] font-bold text-textPrimary leading-tight">
            Welcome back
          </h1>
          <p className="text-textSecondary text-sm mt-1">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Choose the dashboard to open after signing in. */}
        <div className="flex gap-1.5 bg-primaryLight rounded-2xl p-1.5">
          <button
            type="button"
            onClick={() => setSelectedRole("hunter")}
            className={`flex-1 rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
              selectedRole === "hunter"
                ? "bg-primary text-white shadow-sm"
                : "text-textSecondary hover:bg-surface/70"
            }`}
          >
            House Hunter
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole("owner")}
            className={`flex-1 rounded-xl py-3 text-center text-sm font-semibold transition-colors ${
              selectedRole === "owner"
                ? "bg-primary text-white shadow-sm"
                : "text-textSecondary hover:bg-surface/70"
            }`}
          >
            Property Owner
          </button>
        </div>

        {/* Credentials form. Submission behavior will be added when authentication is connected. */}
        <form onSubmit={signIn} className="flex flex-col gap-4">
          <Field label="EMAIL ADDRESS">
            <input
              name="email"
              type="email"
              required
              placeholder="you@gmail.com"
              className="w-full bg-transparent outline-none text-sm placeholder:text-textSecondary/70"
            />
          </Field>

          <Field label="PASSWORD">
            <input
              type="password"
              required
              placeholder="••••••••"
              className="w-full bg-transparent outline-none text-sm placeholder:text-textSecondary/70"
            />
          </Field>

          {/* This becomes a password-reset link once routing is added. */}
          <Link to="/forgot-password" className="self-end text-accent text-sm font-semibold -mt-2">
            Forgot password?
          </Link>

          <button
            type="submit"
            className="bg-accent text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2"
          >
            Sign In
            <span>→</span>
          </button>
        </form>

        {/* Prompt for new users; this can link to the registration page later. */}
        <p className="text-center text-sm text-textSecondary">
          Don't have an account?{" "}
          <Link to="/signup" className="text-accent font-bold hover:underline">Sign up free</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    // Reusable wrapper that gives each input a consistent label and border.
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-textSecondary tracking-wide">{label}</span>
      <div className="border border-border/30 bg-bg rounded-lg px-3.5 py-3">{children}</div>
    </label>
  );
}
