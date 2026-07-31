// Owner workspace for managing the user's property listings.
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { apiRequest } from "../api";

function normalizeProperty(item) {
  return {
    ...item,
    id: item.id,
    title: item.title,
    rent: Number(item.rent || 0),
    type: item.house_type || item.type || "Apartment",
    location: item.location || "Nairobi",
    status: item.available === false ? "Draft" : "Active",
  };
}

export default function OwnerDashboard() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    async function loadData() {
      try {
        const [propertiesResult, notificationResult] = await Promise.allSettled([
          apiRequest("/properties"),
          apiRequest("/notifications/unread-count"),
        ]);
        if (propertiesResult.status === "rejected") throw propertiesResult.reason;
        setListings((propertiesResult.value || []).map(normalizeProperty));
        setUnreadNotifications(
          notificationResult.status === "fulfilled"
            ? Number(notificationResult.value?.unread || 0)
            : 0,
        );
        setError("");
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  async function deleteListing(id) {
    try {
      await apiRequest(`/properties/${id}`, { method: "DELETE" });
      setListings((currentListings) => currentListings.filter((listing) => listing.id !== id));
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  const activeListings = listings.filter((listing) => listing.status === "Active").length;
  const draftListings = listings.filter((listing) => listing.status === "Draft").length;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role="owner" />
      <main className="flex-1 px-12 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-accent">Property Owner Dashboard</p>
            <h1 className="mt-1 text-[28px] font-bold text-textPrimary">My Listings</h1>
            <p className="text-textSecondary text-sm mt-1">
              Create, update, and manage your house listings
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/owner/new-listing" className="bg-accent text-white text-sm font-semibold px-5 py-3 rounded-lg">
              + New Listing
            </Link>
          </div>
        </div>

        <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium text-textSecondary">TOTAL LISTINGS</p>
            <p className="mt-2 text-2xl font-bold text-textPrimary">{listings.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium text-textSecondary">ACTIVE LISTINGS</p>
            <p className="mt-2 text-2xl font-bold text-success">{activeListings}</p>
          </div>
          <div className="rounded-xl border border-border bg-surface p-4">
            <p className="text-xs font-medium text-textSecondary">DRAFT LISTINGS</p>
            <p className="mt-2 text-2xl font-bold text-primary">{draftListings}</p>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2">
          <Link to="/bookings" className="rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-textSecondary">VIEWING REQUESTS</p>
                <h2 className="mt-2 text-lg font-bold text-textPrimary">Review appointments</h2>
                <p className="mt-1 text-sm text-textSecondary">Accept, decline, or reschedule hunter viewing requests.</p>
              </div>
              <span className="rounded-full bg-primaryLight px-3 py-1 text-sm font-bold text-primary">0</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-accent">Open viewing requests →</p>
          </Link>
          <Link to="/notifications" className="rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-textSecondary">NOTIFICATIONS</p>
                <h2 className="mt-2 text-lg font-bold text-textPrimary">Stay informed</h2>
                <p className="mt-1 text-sm text-textSecondary">See messages, viewing activity, and listing updates.</p>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-white">{unreadNotifications}</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-accent">Open notifications →</p>
          </Link>
        </section>

        {error && <p className="text-sm text-red-600" role="alert">{error}</p>}
        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-4 px-5 py-3 text-xs font-semibold text-textSecondary border-b border-border/20">
            <span>LISTING</span>
            <span>RENT</span>
            <span>TYPE</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>
          {loading ? (
            <p className="px-5 py-10 text-center text-sm text-textSecondary">Loading your listings...</p>
          ) : listings.map((l) => (
            <div key={l.id} className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-4 px-5 py-4.5 items-center border-b border-border/10 last:border-b-0">
              <span className="text-sm text-textPrimary">{l.title}</span>
              <span className="text-sm text-textPrimary">KSh {l.rent.toLocaleString()}</span>
              <span className="text-sm text-textPrimary">{l.type}</span>
              <span>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded ${l.status === "Active" ? "bg-success text-white" : "bg-primaryLight text-textSecondary"}`}>
                  {l.status}
                </span>
              </span>
              <span className="flex gap-3.5 text-sm font-medium">
                <Link to={`/property/${l.id}`} className="text-primary">View</Link>
                <Link to={`/owner/edit/${l.id}`} className="text-primary">Edit</Link>
                <button type="button" onClick={() => deleteListing(l.id)} className="text-danger">Delete</button>
              </span>
            </div>
          ))}
          {!loading && listings.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-textSecondary">You do not have any listings yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
