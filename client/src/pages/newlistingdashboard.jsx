// TEMPORARY PROTOTYPE DATA: send creates and edits to the backend instead of modifying mock data.
// Shared form for creating a listing or editing an existing one.
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { properties } from "../data/mockData";

export default function NewListingDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  // An id in the URL switches this form from create mode to edit mode.
  const listing = properties.find((property) => property.id === Number(id));
  const isEditing = Boolean(listing);

  function handleSubmit(event) {
    // FormData collects the uncontrolled form inputs in one place.
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const listingDetails = {
      title: formData.get("title"),
      rent: Number(formData.get("rent")),
      type: formData.get("type"),
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      description: formData.get("description"),
    };

    // Reuse the same form for both flows, based on whether the route includes a listing id.
    if (isEditing) {
      // Update the current in-memory listing.
      Object.assign(listing, listingDetails);
    } else {
      // Add a draft listing with the metadata a newly created listing needs.
      properties.push({
        id: Math.max(0, ...properties.map((property) => property.id)) + 1,
        ...listingDetails,
        status: "Draft",
        size: "Not specified",
        owner: "You",
      });
    }
    navigate("/owner");
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role="owner" />
      <main className="flex-1 px-12 py-10">
        <Link to="/owner" className="text-sm font-semibold text-primary">
          ← Back to my listings
        </Link>
        <div className="mt-5 max-w-3xl">
          <h1 className="text-[28px] font-bold text-textPrimary">{isEditing ? "Edit listing" : "Create new listing"}</h1>
          <p className="mt-1 text-sm text-textSecondary">
            {isEditing ? "Update the details of your property listing." : "Add the details of the property you would like to list."}
          </p>

          {/* defaultValue fills fields when editing without making the whole form controlled. */}
          <form onSubmit={handleSubmit} className="mt-7 rounded-2xl border border-border bg-surface p-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="flex flex-col gap-2 text-sm font-medium text-textPrimary sm:col-span-2">
                Listing title
                <input required name="title" defaultValue={listing?.title} placeholder="e.g. Modern two-bedroom apartment" className="rounded-lg border border-border px-3.5 py-3 font-normal outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-textPrimary">
                Monthly rent (KSh)
                <input required min="0" name="rent" type="number" defaultValue={listing?.rent} placeholder="35000" className="rounded-lg border border-border px-3.5 py-3 font-normal outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-textPrimary">
                Property type
                <select required name="type" defaultValue={listing?.type || ""} className="rounded-lg border border-border bg-white px-3.5 py-3 font-normal outline-none focus:border-primary">
                  <option value="" disabled>Select a type</option>
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Studio</option>
                  <option>Room</option>
                </select>
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-textPrimary">
                Bedrooms
                <input required min="0" name="bedrooms" type="number" defaultValue={listing?.bedrooms} placeholder="2" className="rounded-lg border border-border px-3.5 py-3 font-normal outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-textPrimary">
                Bathrooms
                <input required min="0" name="bathrooms" type="number" defaultValue={listing?.bathrooms} placeholder="1" className="rounded-lg border border-border px-3.5 py-3 font-normal outline-none focus:border-primary" />
              </label>
              <label className="flex flex-col gap-2 text-sm font-medium text-textPrimary sm:col-span-2">
                Description
                <textarea required name="description" rows="5" defaultValue={listing?.description} placeholder="Describe the property, its location, and amenities." className="resize-y rounded-lg border border-border px-3.5 py-3 font-normal outline-none focus:border-primary" />
              </label>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <Link to="/owner" className="rounded-lg border border-border px-5 py-3 text-sm font-semibold text-textPrimary">Cancel</Link>
              <button type="submit" className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white">{isEditing ? "Save changes" : "Create listing"}</button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
