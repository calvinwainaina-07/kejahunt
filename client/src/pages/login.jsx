export default function Login() {
  return (
    // Centers the sign-in card vertically and horizontally on the page.
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      {/* Main authentication card. */}
      <div className="w-full max-w-[402px] bg-surface border border-border rounded-[32px] shadow-xl px-8 py-10 flex flex-col gap-4">
        {/* Logo */}
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

        {/* House Hunter / Property Owner toggle (static, "House Hunter" shown as active) */}
        <div className="flex gap-1.5 bg-primaryLight rounded-2xl p-1.5">
          <div className="flex-1 py-3 rounded-xl text-sm font-semibold text-center text-primary shadow-sm bg-surface">
             House Hunter
          </div>
          <div className="flex-1 py-3 rounded-xl text-sm font-semibold text-center text-primary shadow-sm bg-surface">
            Property Owner
          </div>
        </div>

        {/* Credentials form. Submission behavior will be added when authentication is connected. */}
        <form className="flex flex-col gap-4">
          <Field label="EMAIL ADDRESS">
            <input
              type="email"
              placeholder="you@gmail.com"
              className="w-full bg-transparent outline-none text-sm placeholder:text-textSecondary/70"
            />
          </Field>

          <Field label="PASSWORD">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full bg-transparent outline-none text-sm placeholder:text-textSecondary/70"
            />
          </Field>

          {/* This becomes a password-reset link once routing is added. */}
          <span className="self-end text-accent text-sm font-semibold -mt-2">
            Forgot password?
          </span>

          {/* Social sign-in option; connect this button to Google OAuth when authentication is added. */}
          <button
            type="button"
            className="flex items-center justify-center gap-3 rounded-full border border-border bg-surface py-3.5 text-sm font-semibold text-textPrimary transition-colors hover:bg-bg"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true" className="h-5 w-5">
              <path
                fill="#4285F4"
                d="M21.8 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.5a4.7 4.7 0 0 1-2 3.1v2.5h3.2c1.9-1.8 3.1-4.3 3.1-7.4Z"
              />
              <path
                fill="#34A853"
                d="M12 22c2.7 0 5-.9 6.7-2.4l-3.2-2.5c-.9.6-2 .9-3.5.9-2.7 0-5-1.8-5.8-4.3H2.9v2.6A10 10 0 0 0 12 22Z"
              />
              <path
                fill="#FBBC05"
                d="M6.2 13.7a6 6 0 0 1 0-3.4V7.7H2.9a10 10 0 0 0 0 8.6l3.3-2.6Z"
              />
              <path
                fill="#EA4335"
                d="M12 6c1.6 0 3 .5 4.1 1.6l3.1-3A10 10 0 0 0 2.9 7.7l3.3 2.6C7 7.8 9.3 6 12 6Z"
              />
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            className="bg-accent text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2"
          >
            Sign In
            <span>→</span>
          </button>
        </form>

        {/* Prompt for new users; this can link to the registration page later. */}
        <p className="text-center text-sm text-textSecondary">
          Don&apos;t have an account?{" "}
          <span className="text-accent font-bold">Sign up free</span>
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
