import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { apiRequest } from "../api";

export default function SavedListings() {
  const [savedListings, setSavedListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSavedListings() {
      try {
        const saved = await apiRequest("/saved-listings");
        const properties = await Promise.all((saved || []).map(async (item) => {
          const property = await apiRequest(`/properties/${item.property_id}`);
          return { ...property, savedId: item.id };
        }));
        setSavedListings(properties);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }
    loadSavedListings();
  }, []);

  async function removeListing(id) {
    try {
      await apiRequest(`/saved-listings/${id}`, { method: "DELETE" });
      setSavedListings((current) => current.filter((listing) => listing.id !== id));
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  return <div className="flex min-h-screen bg-bg"><Sidebar /><main className="flex flex-1 flex-col gap-6 px-12 py-10"><div><h1 className="text-[28px] font-bold text-textPrimary">Saved Listings</h1><p className="mt-1 text-sm text-textSecondary">{savedListings.length} homes you've bookmarked</p></div>{error && <p className="text-sm text-red-600" role="alert">{error}</p>}<div className="flex flex-col gap-3">{loading ? <p className="py-10 text-center text-sm text-textSecondary">Loading saved listings...</p> : savedListings.map((property) => <div key={property.id} className="flex items-center gap-5 rounded-xl border border-border bg-surface px-5 py-4"><div className="h-15 w-20 shrink-0 overflow-hidden rounded-lg bg-primaryLight">{property.image_url && <img src={property.image_url} alt="" className="h-full w-full object-cover" />}</div><div className="flex-1"><Link to={`/property/${property.id}`} className="font-semibold text-textPrimary hover:text-primary">{property.title}</Link><p className="text-xs text-textSecondary">{property.house_type}</p></div><p className="whitespace-nowrap text-sm font-bold text-accent">KSh {Number(property.rent).toLocaleString()}/mo</p><button type="button" onClick={() => removeListing(property.id)} className="rounded-lg border border-border/30 px-3.5 py-2 text-sm font-medium text-danger">Remove</button></div>)}{!loading && savedListings.length === 0 && <div className="rounded-xl border border-dashed border-border bg-surface px-5 py-12 text-center"><p className="font-semibold text-textPrimary">No saved listings yet</p><p className="mt-1 text-sm text-textSecondary">Browse available homes and save the ones you like.</p><Link to="/dashboard" className="mt-4 inline-block text-sm font-semibold text-accent">Browse homes</Link></div>}</div></main></div>;
}
