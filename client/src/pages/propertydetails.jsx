// TEMPORARY PROTOTYPE DATA: replace the property lookup with a listing-details API request.
// Full listing page opened when a house hunter selects a property card.
import { Link, Navigate, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { properties } from "../data/mockData";

export default function PropertyDetails() {
  // The URL id determines which shared listing data to display.
  const { id } = useParams();
  const property = properties.find((listing) => listing.id === Number(id));

  // Keep an invalid listing URL from rendering an empty details page.
  if (!property) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-6 py-8 sm:px-12 sm:py-10">
        <Link to="/dashboard" className="inline-flex text-sm font-semibold text-primary hover:text-accent">
          ← Back to homes
        </Link>

        {/* Main property information is paired with a quick owner contact panel. */}
        <div className="mt-5 grid max-w-6xl gap-6 lg:grid-cols-[1.55fr_0.85fr]">
          <section className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex h-72 items-center justify-center bg-primaryLight text-sm font-medium text-primary sm:h-96">
              Property photo coming soon
            </div>
            <div className="p-6 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <span className="rounded-full bg-primaryLight px-3 py-1 text-xs font-semibold text-primary">{property.type}</span>
                  <h1 className="mt-3 text-3xl font-bold text-textPrimary">{property.title}</h1>
                  <p className="mt-2 text-sm text-textSecondary">{property.location}</p>
                </div>
                <p className="text-xl font-bold text-accent">KSh {property.rent.toLocaleString()}<span className="text-sm font-medium">/mo</span></p>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 border-y border-border/30 py-5 text-center">
                <Detail label="Bedrooms" value={property.bedrooms} />
                <Detail label="Bathrooms" value={property.bathrooms} />
                <Detail label="Size" value={property.size} />
              </div>

              <section className="mt-7">
                <h2 className="text-lg font-bold text-textPrimary">About this home</h2>
                <p className="mt-2 leading-7 text-textSecondary">{property.description}</p>
              </section>
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
            <p className="text-xs font-semibold tracking-wide text-textSecondary">LISTED BY</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                {property.owner.charAt(0)}
              </div>
              <div>
                <p className="font-semibold text-textPrimary">{property.owner}</p>
                <p className="text-sm text-textSecondary">Property owner</p>
              </div>
            </div>
            <Link to={`/messages?property=${property.id}`} className="mt-6 block rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:bg-accent/90">
              Contact owner
            </Link>
            <Link to={`/bookings?property=${property.id}`} className="mt-3 block rounded-lg border border-primary px-5 py-3 text-center text-sm font-semibold text-primary hover:bg-primaryLight">
              Request a viewing
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  // Small reusable statistic used for bedrooms, bathrooms, and floor size.
  return (
    <div>
      <p className="text-lg font-bold text-textPrimary">{value}</p>
      <p className="mt-1 text-xs text-textSecondary">{label}</p>
    </div>
  );
}
