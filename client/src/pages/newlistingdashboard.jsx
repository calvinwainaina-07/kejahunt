// TEMPORARY PROTOTYPE DATA: send creates and edits to the backend instead of modifying mock data.
// Shared form for creating a listing or editing an existing one.
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { properties } from "../data/mockData";

export default function NewListingDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  // An id in the URL switches this form from create mode to edit mode.
  const listing = properties.find((property) => property.id === Number(id));
  const isEditing = Boolean(listing);
  const [images, setImages] = useState(listing?.images || []);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");

  async function addImages(event) {
    const selectedFiles = Array.from(event.target.files || []);
    const remainingSlots = 5 - images.length;
    const acceptedFiles = selectedFiles.filter((file) => file.type.startsWith("image/")).slice(0, remainingSlots);

    setImageError(
      selectedFiles.length > remainingSlots
        ? "You can add up to five photos per listing."
        : selectedFiles.length !== acceptedFiles.length
          ? "Only image files can be added."
          : "",
    );

    const newImages = await Promise.all(acceptedFiles.map(readImage));
    setImages((currentImages) => [...currentImages, ...newImages]);
    // Reset the field so the owner can select the same file again if needed.
    event.target.value = "";
  }

  function removeImage(indexToRemove) {
    setImages((currentImages) => currentImages.filter((_, index) => index !== indexToRemove));
    setImageError("");
  }

  function addImageUrl() {
    if (images.length >= 5) {
      setImageError("You can add up to five photos per listing.");
      return;
    }

    try {
      const url = new URL(imageUrl.trim());
      if (!/^https?:$/.test(url.protocol)) throw new Error("Unsupported protocol");
      setImages((currentImages) => [...currentImages, url.href]);
      setImageUrl("");
      setImageError("");
    } catch {
      setImageError("Enter a valid image URL that starts with http:// or https://.");
    }
  }

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
      images,
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
              <div className="sm:col-span-2">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <label htmlFor="property-images" className="text-sm font-medium text-textPrimary">Property photos</label>
                  <span className="text-xs text-textSecondary">Up to 5 photos</span>
                </div>
                <p className="mt-1 text-sm text-textSecondary">Add clear photos of the exterior, rooms, and amenities.</p>
                <input id="property-images" type="file" accept="image/*" multiple onChange={addImages} className="mt-3 block w-full rounded-lg border border-border bg-white px-3.5 py-2.5 text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primaryLight file:px-3 file:py-2 file:font-semibold file:text-primary hover:file:bg-primaryLight/70" />
                <div className="mt-3 flex flex-col gap-2 sm:flex-row">
                  <label className="sr-only" htmlFor="property-image-url">Image URL</label>
                  <input id="property-image-url" type="url" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") { event.preventDefault(); addImageUrl(); } }} placeholder="Or paste an image URL, e.g. https://example.com/home.jpg" className="min-w-0 flex-1 rounded-lg border border-border px-3.5 py-3 text-sm outline-none focus:border-primary" />
                  <button type="button" onClick={addImageUrl} className="rounded-lg border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-primaryLight">Add URL</button>
                </div>
                {imageError && <p className="mt-2 text-sm text-red-600">{imageError}</p>}
                {images.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
                    {images.map((image, index) => (
                      <div key={`${image}-${index}`} className="group relative aspect-[4/3] overflow-hidden rounded-lg border border-border bg-primaryLight">
                        <img src={image} alt={`Property preview ${index + 1}`} className="h-full w-full object-cover" />
                        <button type="button" onClick={() => removeImage(index)} className="absolute right-2 top-2 rounded-md bg-white/95 px-2 py-1 text-xs font-semibold text-textPrimary shadow-sm hover:bg-white" aria-label={`Remove photo ${index + 1}`}>Remove</button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
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

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("The selected image could not be read."));
    reader.readAsDataURL(file);
  });
}
