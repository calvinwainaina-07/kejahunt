// TEMPORARY PROTOTYPE DATA: replace local saved-listing state with authenticated API requests.
// Saved-listing page with removal actions stored in component state.
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { properties } from "../data/mockData";

export default function SavedListings() {
  // Start with the fixture data; removing a card only affects this page's local state.
  const [savedListings, setSavedListings] = useState(properties);

  function removeListing(id) {
    // Filter creates a new array without the listing the user removed.
    setSavedListings((currentListings) =>
      currentListings.filter((listing) => listing.id !== id),
    );
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-12 py-10 flex flex-col gap-6">
        <div>
          <h1 className="text-[28px] font-bold text-textPrimary">Saved Listings</h1>
          <p className="text-textSecondary text-sm mt-1">
            {savedListings.length} homes you've bookmarked
          </p>
        </div>

        {/* Show saved homes, or an empty-state route back to browsing. */}
        <div className="flex flex-col gap-3">
          {savedListings.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-5 bg-surface border border-border rounded-xl px-5 py-4"
            >
              <div className="w-20 h-15 bg-primaryLight rounded-lg shrink-0" />
              <div className="flex-1">
                <p className="font-semibold text-textPrimary">{p.title}</p>
                <p className="text-xs text-textSecondary">{p.type}</p>
              </div>
              <p className="text-accent font-bold text-sm whitespace-nowrap">
                KSh {p.rent.toLocaleString()}/mo
              </p>
              <button
                type="button"
                onClick={() => removeListing(p.id)}
                className="border border-border/30 rounded-lg px-3.5 py-2 text-sm font-medium text-danger"
              >
                Remove
              </button>
            </div>
          ))}
          {savedListings.length === 0 && (
            <div className="rounded-xl border border-dashed border-border bg-surface px-5 py-12 text-center">
              <p className="font-semibold text-textPrimary">No saved listings yet</p>
              <p className="mt-1 text-sm text-textSecondary">Browse available homes and save the ones you like.</p>
              <Link to="/dashboard" className="mt-4 inline-block text-sm font-semibold text-accent">
                Browse homes
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
