// TEMPORARY PROTOTYPE DATA: replace the imported property fixtures with API-fetched listings.
// House-hunter dashboard containing search controls and property cards.
import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import PropertyCard from "../components/propertycard.jsx";
import { Link } from "react-router-dom";
import { properties } from "../data/mockData";
import { readNotificationsForRole, readViewingRequests } from "../data/Storage.js";

// Each option supplies the price check used by the selected rent filter.
const rentRanges = {
  any: () => true,
  under30000: (rent) => rent < 30000,
  from30000to50000: (rent) => rent >= 30000 && rent <= 50000,
  over50000: (rent) => rent > 50000,
};

export default function HunterDashboard() {
  // Keep edits separate from active filters until the user submits the search form.
  const [searchText, setSearchText] = useState("");
  const [rentRange, setRentRange] = useState("any");
  const [propertyType, setPropertyType] = useState("any");
  const [activeFilters, setActiveFilters] = useState({ searchText: "", rentRange: "any", propertyType: "any" });
  const unreadNotifications = readNotificationsForRole("hunter").filter((notification) => !notification.read).length;
  const pendingViewings = readViewingRequests().filter((request) => request.hunter === "You" && request.status === "Pending").length;

  function handleSearch(event) {
    // Prevent a page reload and commit all current filter controls at once.
    event.preventDefault();
    setActiveFilters({ searchText, rentRange, propertyType });
  }

  // Recalculate visible property cards from the last submitted search criteria.
  const filteredProperties = properties.filter((property) => {
    const searchTarget = `${property.title} ${property.location || ""} ${property.type}`.toLowerCase();
    const matchesSearch = searchTarget.includes(activeFilters.searchText.trim().toLowerCase());
    const matchesRent = rentRanges[activeFilters.rentRange](property.rent);
    const matchesType = activeFilters.propertyType === "any" || property.type === activeFilters.propertyType;

    return matchesSearch && matchesRent && matchesType;
  });

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-12 py-10 flex flex-col gap-7">
        <div>
          <p className="text-sm font-semibold text-accent">House Hunter Dashboard</p>
          <h1 className="mt-1 text-[28px] font-bold text-textPrimary">Find your next home</h1>
          <p className="mt-1 text-sm text-textSecondary">Search and compare available homes that match your needs.</p>
        </div>

        {/* Dashboard shortcuts keep viewing requests and account activity easy to find after sign-in. */}
        <section className="grid gap-4 sm:grid-cols-2">
          <Link to="/bookings" className="rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-textSecondary">VIEWING REQUESTS</p>
                <h2 className="mt-2 text-lg font-bold text-textPrimary">Manage your appointments</h2>
                <p className="mt-1 text-sm text-textSecondary">{pendingViewings ? `${pendingViewings} request awaiting an owner response.` : "Request and track property viewings."}</p>
              </div>
              <span className="rounded-full bg-primaryLight px-3 py-1 text-sm font-bold text-primary">{pendingViewings}</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-accent">Open viewing requests →</p>
          </Link>
          <Link to="/notifications" className="rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-md">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-wide text-textSecondary">NOTIFICATIONS</p>
                <h2 className="mt-2 text-lg font-bold text-textPrimary">Keep up with your activity</h2>
                <p className="mt-1 text-sm text-textSecondary">Viewing decisions, messages, listing updates, and roommate requests.</p>
              </div>
              <span className="rounded-full bg-accent px-3 py-1 text-sm font-bold text-white">{unreadNotifications}</span>
            </div>
            <p className="mt-4 text-sm font-semibold text-accent">Open notifications →</p>
          </Link>
        </section>

        {/* Filters only apply when the user submits, avoiding unnecessary list updates. */}
        <form onSubmit={handleSearch} className="flex flex-wrap items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3.5">
          <input
            value={searchText}
            onChange={(event) => setSearchText(event.target.value)}
            placeholder="Search location e.g. Kilimani, Ruaka..."
            className="min-w-48 flex-1 bg-transparent outline-none text-sm placeholder:text-textSecondary/70"
          />
          <select value={rentRange} onChange={(event) => setRentRange(event.target.value)} className="bg-primaryLight rounded-full px-3.5 py-2 text-sm font-medium text-primary outline-none">
            <option value="any">Rent: Any</option>
            <option value="under30000">Rent: Under KSh 30,000</option>
            <option value="from30000to50000">Rent: KSh 30,000–50,000</option>
            <option value="over50000">Rent: Over KSh 50,000</option>
          </select>
          <select value={propertyType} onChange={(event) => setPropertyType(event.target.value)} className="bg-primaryLight rounded-full px-3.5 py-2 text-sm font-medium text-primary outline-none">
            <option value="any">Type: Any</option>
            <option value="Apartment">Apartment</option>
            <option value="Studio">Studio</option>
            <option value="House">House</option>
            <option value="Room">Room</option>
          </select>
          <button type="submit" className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
            Search
          </button>
        </form>

        <p className="text-sm text-textSecondary font-medium">
          {filteredProperties.length} homes available in Nairobi
        </p>

        {/* Each card navigates to a property-specific details page. */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
        {filteredProperties.length === 0 && (
          <p className="rounded-xl border border-dashed border-border bg-surface px-5 py-10 text-center text-sm text-textSecondary">
            No homes match those search filters. Try a different search or filter.
          </p>
        )}
      </main>
    </div>
  );
}
