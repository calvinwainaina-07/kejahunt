// Registration page that routes a new user to their selected role's workspace.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, saveAccessToken } from "../api";

export default function SignUp() {
  // Store the role choice until an authentication backend replaces this prototype flow.
  const [selectedRole, setSelectedRole] = useState("hunter");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  async function createAccount(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    setError("");
    setIsSubmitting(true);
    try {
      const result = await apiRequest("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          full_name: formData.get("fullName"),
          email: formData.get("email"),
          password: formData.get("password"),
          role: selectedRole,
          phone: formData.get("phone"),
        }),
      });
      saveAccessToken(result.access_token);
      sessionStorage.setItem("kejahunt-role", result.user.role);
      navigate(result.user.role === "owner" ? "/owner" : "/dashboard");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg p-6">
      <div className="flex w-full max-w-[402px] flex-col gap-4 rounded-[32px] border border-border bg-surface px-8 py-10 shadow-xl">
        <div className="flex items-center gap-2.5">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-lg text-white" />
          <span className="font-serif text-xl font-bold text-primary">KejaHunt</span>
        </div>

        <div>
          <h1 className="font-serif text-[28px] font-bold leading-tight text-textPrimary">Create your account</h1>
          <p className="mt-1 text-sm text-textSecondary">Join KejaHunt for free.</p>
        </div>

        <div className="flex gap-1.5 rounded-2xl bg-primaryLight p-1.5">
          <button type="button" onClick={() => setSelectedRole("hunter")} className={`flex-1 rounded-xl py-3 text-sm font-semibold ${selectedRole === "hunter" ? "bg-primary text-white shadow-sm" : "text-textSecondary hover:bg-surface/70"}`}>
            House Hunter
          </button>
          <button type="button" onClick={() => setSelectedRole("owner")} className={`flex-1 rounded-xl py-3 text-sm font-semibold ${selectedRole === "owner" ? "bg-primary text-white shadow-sm" : "text-textSecondary hover:bg-surface/70"}`}>
            Property Owner
          </button>
        </div>

        {/* Required fields create the initial profile shown on the My Profile page. */}
        <form onSubmit={createAccount} className="flex flex-col gap-4">
          <Field label="FULL NAME">
            <input required name="fullName" type="text" placeholder="Your name" className="w-full bg-transparent text-sm outline-none placeholder:text-textSecondary/70" />
          </Field>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
          <Field label="EMAIL ADDRESS">
            <input required name="email" type="email" placeholder="you@gmail.com" className="w-full bg-transparent text-sm outline-none placeholder:text-textSecondary/70" />
          </Field>
          <Field label="PHONE NUMBER">
            <input required name="phone" type="tel" placeholder="e.g. +254 700 000 000" className="w-full bg-transparent text-sm outline-none placeholder:text-textSecondary/70" />
          </Field>
          <Field label="PASSWORD">
            <input required minLength="8" name="password" type="password" placeholder="At least 8 characters" className="w-full bg-transparent text-sm outline-none placeholder:text-textSecondary/70" />
          </Field>
          <button type="submit" disabled={isSubmitting} className="rounded-full bg-accent py-4 font-semibold text-white disabled:opacity-60">
            {isSubmitting ? "Creating account..." : "Create free account"}
          </button>
        </form>

        <p className="text-center text-sm text-textSecondary">
          Already have an account? <Link to="/login" className="font-bold text-accent hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}

function Field({ label, children }) {
  // Shared labelled input wrapper keeps registration fields visually consistent.
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold tracking-wide text-textSecondary">{label}</span>
      <div className="rounded-lg border border-border/30 bg-bg px-3.5 py-3">{children}</div>
    </label>
  );
}
