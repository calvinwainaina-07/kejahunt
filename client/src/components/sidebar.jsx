// TEMPORARY PROTOTYPE AUTH: the role currently comes from sessionStorage; use backend session data later.
// Shared dashboard navigation; NavLink applies the active-route style.
import { NavLink, useNavigate } from "react-router-dom";
import { apiRequest } from "../api";

// Links are shown or hidden according to the signed-in user's role.
const links = [
  { to: "/dashboard", label: "House Hunter Dashboard" },
  { to: "/saved", label: "Saved Listings" },
  { to: "/roommates", label: "Roommate Matching" },
  { to: "/bookings", label: "Viewing Requests" },
  { to: "/messages", label: "Messages" },
  { to: "/notifications", label: "Notifications" },
  { to: "/profile", label: "My Profile" },
  { to: "/owner", label: "Property Owner Dashboard" },
];

export default function Sidebar({ showOwnerDashboard = true, role }) {
  const navigate = useNavigate();
  // A page may set its role explicitly; otherwise use the role stored at sign-in.
  const activeRole = role || sessionStorage.getItem("kejahunt-role") || "hunter";
  // Owners do not need saved listings, while hunters do not see owner management.
  const visibleLinks = links.filter((link) => {
    if ((!showOwnerDashboard || activeRole === "hunter") && link.to === "/owner") return false;
    if (activeRole === "owner" && link.to === "/dashboard") return false;
    if (activeRole === "owner" && ["/saved", "/roommates"].includes(link.to)) return false;
    return true;
  });

  return (
    <aside className="w-60 min-h-screen bg-primary flex flex-col px-6 py-8 shrink-0">
      <h1 className="text-white text-xl font-bold mb-8">KejaHunt</h1>
      <nav className="flex flex-col gap-2">
        {visibleLinks.map((link) => (
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
      {/* Clearing the session role makes the next visit start with a new role choice. */}
      <button
        type="button"
        onClick={async () => {
          try { await apiRequest("/auth/logout", { method: "POST" }); } catch { /* Always clear this browser's UI session. */ }
          sessionStorage.removeItem("kejahunt-role");
          navigate("/login");
        }}
        className="mt-auto w-fit text-sm text-primaryLight/70 transition-colors hover:text-white"
      >
        Log out
      </button>
    </aside>
  );
}
