// Full listing page opened when a house hunter selects a property card.
import { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { apiRequest } from "../api";
import { useAuth } from "../components/useauth.js";

function normalizeProperty(item) {
  return {
    ...item,
    id: item.id,
    title: item.title,
    rent: Number(item.rent || 0),
    type: item.house_type || item.type || "Apartment",
    location: item.location || "Nairobi",
    description: item.description || "",
    bedrooms: item.bedrooms || 0,
    bathrooms: item.bathrooms || 0,
    images: item.images?.length ? item.images : item.image_url ? [item.image_url] : [],
  };
}

export default function PropertyDetails() {
  const { id } = useParams();
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const { user } = useAuth();
  const isOwner = user?.role === "owner";

  useEffect(() => {
    async function loadProperty() {
      try {
        setSelectedImage(0);
        const data = await apiRequest(`/properties/${id}`);
        setProperty(normalizeProperty(data));
        setError("");
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadProperty();
  }, [id]);

  async function saveListing() {
    if (!property) return;
    setSaving(true);
    try {
      await apiRequest(`/saved-listings/${property.id}`, {
        method: "POST",
      });
      setError("");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="flex min-h-screen bg-bg"><Sidebar /><main className="flex-1 px-6 py-8 sm:px-12 sm:py-10"><p className="text-sm text-textSecondary">Loading listing...</p></main></div>;
  if (error && !property) return <Navigate to="/dashboard" replace />;
  if (!property) return <Navigate to="/dashboard" replace />;

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-6 py-8 sm:px-12 sm:py-10">
        <Link to="/dashboard" className="inline-flex text-sm font-semibold text-primary hover:text-accent">
          ← Back to homes
        </Link>

        <div className="mt-5 grid max-w-6xl gap-6 lg:grid-cols-[1.55fr_0.85fr]">
          <section className="overflow-hidden rounded-2xl border border-border bg-surface">
            <div className="flex h-72 items-center justify-center bg-primaryLight sm:h-96">
              {property.images?.[selectedImage] ? (
                <img src={property.images[selectedImage]} alt={`${property.title} photo ${selectedImage + 1}`} className="h-full w-full object-cover" />
              ) : (
                <span className="text-sm font-medium text-primary">Property photo coming soon</span>
              )}
            </div>
            {property.images?.length > 1 && (
              <div className="grid grid-cols-4 gap-2 p-3">
                {property.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-[4/3] overflow-hidden rounded-md outline-none ring-offset-2 transition focus-visible:ring-2 focus-visible:ring-primary ${selectedImage === index ? "ring-2 ring-primary" : "opacity-75 hover:opacity-100"}`}
                    aria-label={`View photo ${index + 1} of ${property.title}`}
                    aria-pressed={selectedImage === index}
                  >
                    <img src={image} alt={`Thumbnail ${index + 1} of ${property.title}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
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
                <Detail label="Size" value="N/A" />
              </div>

              <section className="mt-7">
                <h2 className="text-lg font-bold text-textPrimary">About this home</h2>
                <p className="mt-2 leading-7 text-textSecondary">{property.description}</p>
              </section>
            </div>
          </section>

          {!isOwner && <aside className="h-fit rounded-2xl border border-border bg-surface p-6">
            <p className="text-xs font-semibold tracking-wide text-textSecondary">LISTED BY</p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
                O
              </div>
              <div>
                <p className="font-semibold text-textPrimary">Property owner</p>
                <p className="text-sm text-textSecondary">Owner contact available through messages</p>
              </div>
            </div>
            <>
              <button type="button" onClick={saveListing} disabled={saving} className="mt-6 block w-full rounded-lg border border-primary px-5 py-3 text-center text-sm font-semibold text-primary hover:bg-primaryLight disabled:opacity-60">
                {saving ? "Saving..." : "Save listing"}
              </button>
              <Link to={`/messages?property=${property.id}`} className="mt-3 block rounded-lg bg-accent px-5 py-3 text-center text-sm font-semibold text-white hover:bg-accent/90">
                Contact owner
              </Link>
              <Link to={`/bookings?property=${property.id}`} className="mt-3 block rounded-lg border border-primary px-5 py-3 text-center text-sm font-semibold text-primary hover:bg-primaryLight">
                Request a viewing
              </Link>
            </>
            {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
          </aside>}
        </div>
      </main>
    </div>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-lg font-bold text-textPrimary">{value}</p>
      <p className="mt-1 text-xs text-textSecondary">{label}</p>
    </div>
  );
}
