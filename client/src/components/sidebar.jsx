// Shared dashboard navigation; NavLink applies the active-route style.
import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", label: "Browse Homes" },
  { to: "/saved", label: "Saved Listings" },
  { to: "/roommates", label: "Roommate Matching" },
  { to: "/messages", label: "Messages" },
  { to: "/owner", label: "My Listings (Owner)" },
];

export default function Sidebar() {
  return (
    <aside className="w-60 min-h-screen bg-primary flex flex-col px-6 py-8 shrink-0">
      <h1 className="text-white text-xl font-bold mb-8">KejaHunt</h1>
      <nav className="flex flex-col gap-2">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              `px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-accent text-white font-semibold"
                  : "text-primaryLight/90 hover:bg-white/10 font-medium"
              }`
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <span className="mt-auto text-sm text-primaryLight/70">Log out</span>
    </aside>
  );
}
