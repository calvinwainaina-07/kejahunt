// Public landing page that introduces KejaHunt before a visitor creates an account.
import { Link } from "react-router-dom";

const benefits = [
  { icon: "⌂", title: "Find the right home", text: "Browse homes, compare options, and save the listings you love." },
  { icon: "◷", title: "Book viewings easily", text: "Choose a convenient time and track your appointment in one place." },
  { icon: "✉", title: "Talk directly", text: "Message property owners and keep every conversation organised." },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-bg">
      <header className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
        <Link to="/" className="text-2xl font-bold text-primary">KejaHunt</Link>
        <div className="flex items-center gap-4">
          <Link to="/login" className="text-sm font-semibold text-primary hover:text-accent">Sign in</Link>
          <Link to="/signup" className="rounded-full bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent/90">Get started</Link>
        </div>
      </header>

      <main>
        <section className="mx-auto grid max-w-7xl gap-10 px-6 pb-16 pt-12 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-24">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.18em] text-accent">Homes made simpler</p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-tight text-primary sm:text-5xl">Find a place that feels like home.</h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-textSecondary">KejaHunt helps you discover homes in Nairobi, schedule viewings, speak with property owners, and find compatible roommates.</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/signup" className="rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-white hover:bg-accent/90">Find a home</Link>
              <Link to="/signup" className="rounded-lg border border-primary px-6 py-3.5 text-sm font-semibold text-primary hover:bg-primaryLight">List a property</Link>
            </div>
          </div>
          <div className="rounded-3xl bg-primary p-6 text-white shadow-xl sm:p-8">
            <p className="text-sm font-semibold text-primaryLight">YOUR NEXT MOVE</p>
            <div className="mt-5 rounded-2xl bg-white p-5 text-textPrimary"><p className="text-xs font-semibold tracking-wide text-textSecondary">BROWSE WITH CONFIDENCE</p><p className="mt-2 text-xl font-bold">Homes, viewings, and conversations in one place.</p><div className="mt-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-full bg-primaryLight font-bold text-primary">K</span><p className="text-sm text-textSecondary">Built for house hunters and property owners.</p></div></div>
            <div className="mt-5 grid grid-cols-2 gap-3"><div className="rounded-xl bg-white/10 p-4"><p className="text-2xl font-bold">Easy</p><p className="mt-1 text-sm text-primaryLight">Viewing requests</p></div><div className="rounded-xl bg-white/10 p-4"><p className="text-2xl font-bold">Direct</p><p className="mt-1 text-sm text-primaryLight">Owner messaging</p></div></div>
          </div>
        </section>

        <section className="border-y border-border/30 bg-surface"><div className="mx-auto max-w-7xl px-6 py-16 sm:px-10"><div className="max-w-2xl"><p className="text-sm font-semibold text-accent">HOW KEJAHUNT HELPS</p><h2 className="mt-2 text-3xl font-bold text-primary">Everything you need for your home search.</h2></div><div className="mt-10 grid gap-5 md:grid-cols-3">{benefits.map((benefit) => <article key={benefit.title} className="rounded-2xl border border-border/40 bg-bg p-6"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primaryLight text-xl font-bold text-primary">{benefit.icon}</span><h3 className="mt-5 text-lg font-bold text-primary">{benefit.title}</h3><p className="mt-2 text-sm leading-6 text-textSecondary">{benefit.text}</p></article>)}</div></div></section>

        <section className="mx-auto max-w-7xl px-6 py-16 sm:px-10"><div className="rounded-3xl bg-primary px-6 py-10 text-center text-white sm:px-10"><h2 className="text-3xl font-bold">Ready to find your next home?</h2><p className="mx-auto mt-3 max-w-xl text-primaryLight">Create a free account to start browsing homes, booking viewings, or managing your properties.</p><Link to="/signup" className="mt-7 inline-block rounded-lg bg-accent px-6 py-3.5 text-sm font-semibold text-white hover:bg-accent/90">Create a free account</Link></div></section>
      </main>

      <footer className="border-t border-border/30 px-6 py-6 text-center text-sm text-textSecondary">© {new Date().getFullYear()} KejaHunt. Find your next home.</footer>
    </div>
  );
}
