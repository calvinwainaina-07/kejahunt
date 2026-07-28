import { Link } from "react-router-dom";

// Password-reset screen; connect its form to an email service when the backend is ready.
export default function ForgotPassword() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-[402px] bg-surface border border-border rounded-[32px] shadow-xl px-8 py-10 flex flex-col gap-4">
        {/* The page currently demonstrates the UI; email delivery needs a backend service. */}
        <h1 className="font-serif text-2xl font-bold text-textPrimary">Reset your password</h1>
        <p className="text-textSecondary text-sm">
          Enter the email linked to your account and we'll send you a reset link.
        </p>

        {/* This form validates the email field; a backend will send the actual reset email. */}
        <form className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-semibold text-textSecondary">EMAIL ADDRESS</span>
            <input
              type="email"
              placeholder="you@email.com"
              className="border border-border/30 bg-bg rounded-lg px-3.5 py-3 text-sm outline-none"
            />
          </label>
          <button type="button" className="bg-accent text-white font-semibold py-4 rounded-full">
            Send reset link
          </button>
        </form>

        <Link to="/login" className="text-center text-sm text-accent font-semibold">Back to log in</Link>
      </div>
    </div>
  );
}
