// Owner workspace for managing the user's property listings.
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { properties } from "../data/mockData";

export default function OwnerDashboard() {
  // Local state lets the table update immediately after a listing is deleted.
  const [listings, setListings] = useState(properties);
  const activeListings = listings.filter((listing) => listing.status === "Active").length;
  const draftListings = listings.filter((listing) => listing.status === "Draft").length;

  function deleteListing(id) {
    // Keep the shared mock collection and the currently rendered table in sync.
    const listingIndex = properties.findIndex((listing) => listing.id === id);
    if (listingIndex !== -1) properties.splice(listingIndex, 1);
    setListings((currentListings) => currentListings.filter((listing) => listing.id !== id));
  }

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
          <Link to="/owner/new-listing" className="bg-accent text-white text-sm font-semibold px-5 py-3 rounded-lg">
            + New Listing
          </Link>
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

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-4 px-5 py-3 text-xs font-semibold text-textSecondary border-b border-border/20">
            <span>LISTING</span>
            <span>RENT</span>
            <span>TYPE</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>
          {listings.map((l) => (
            <div
              key={l.id}
              className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-4 px-5 py-4.5 items-center border-b border-border/10 last:border-b-0"
            >
              <span className="text-sm text-textPrimary">{l.title}</span>
              <span className="text-sm text-textPrimary">KSh {l.rent.toLocaleString()}</span>
              <span className="text-sm text-textPrimary">{l.type}</span>
              <span>
                <span
                  className={`text-xs font-semibold px-2.5 py-1 rounded ${
                    l.status === "Active" ? "bg-success text-white" : "bg-primaryLight text-textSecondary"
                  }`}
                >
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
          {listings.length === 0 && (
            <p className="px-5 py-10 text-center text-sm text-textSecondary">You do not have any listings yet.</p>
          )}
        </div>
      </main>
    </div>
  );
}
