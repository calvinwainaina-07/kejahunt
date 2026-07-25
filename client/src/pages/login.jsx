export default function Login() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center p-6">
      <div className="w-full max-w-[402px] bg-surface border border-border rounded-[32px] shadow-xl px-8 py-10 flex flex-col gap-4">
        {/* Logo */}
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-11 h-11 rounded-xl bg-primary flex items-center justify-center text-white text-lg">
            ⌂
          </div>
          <span className="font-serif text-xl font-bold text-primary">KejaHunt</span>
        </div>

        <div>
          <h1 className="font-serif text-[28px] font-bold text-textPrimary leading-tight">
            Welcome back
          </h1>
          <p className="text-textSecondary text-sm mt-1">
            Sign in to continue to your dashboard
          </p>
        </div>

        {/* Login / Register tabs (static, "Log In" shown as active) */}
        <div className="flex gap-1.5 bg-primaryLight rounded-2xl p-1.5">
          <div className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center bg-surface text-primary shadow-sm">
            Log In
          </div>
          <div className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-center text-textSecondary">
            Register
          </div>
        </div>

        {/* House Hunter / Property Owner toggle (static, "House Hunter" shown as active) */}
        <div className="flex gap-1.5 bg-primaryLight rounded-2xl p-1.5">
          <div className="flex-1 py-3 rounded-xl text-sm font-semibold text-center bg-primary text-white">
            🔍 House Hunter
          </div>
          <div className="flex-1 py-3 rounded-xl text-sm font-semibold text-center text-textSecondary">
            🏠 Property Owner
          </div>
        </div>

        <form className="flex flex-col gap-4">
          <Field label="EMAIL ADDRESS">
            <input
              type="email"
              placeholder="you@email.com"
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

          <span className="self-end text-accent text-sm font-semibold -mt-2">
            Forgot password?
          </span>

          <button
            type="button"
            className="bg-accent text-white font-semibold py-4 rounded-full flex items-center justify-center gap-2"
          >
            Sign In
            <span>→</span>
          </button>
        </form>

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
    <label className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-textSecondary tracking-wide">{label}</span>
      <div className="border border-border/30 bg-bg rounded-lg px-3.5 py-3">{children}</div>
    </label>
  );
}
