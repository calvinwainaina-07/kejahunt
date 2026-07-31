// Shared form for creating a listing or editing an existing one.
import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { apiRequest } from "../api";

function normalizeProperty(item) {
  return {
    ...item,
    title: item.title,
    rent: Number(item.rent || 0),
    type: item.house_type || item.type || "Apartment",
    location: item.location || "Nairobi",
    description: item.description || "",
    bedrooms: item.bedrooms || 0,
    bathrooms: item.bathrooms || 0,
    images: item.image_url ? [item.image_url] : [],
  };
}

export default function NewListingDashboard() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditing = Boolean(id);
  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id) return;
    async function loadListing() {
      try {
        const data = await apiRequest(`/properties/${id}`);
        const normalized = normalizeProperty(data);
        setListing(normalized);
        setImages(normalized.images || []);
      } catch (requestError) {
        setError(requestError.message);
      }
    }

    loadListing();
  }, [id]);

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

  async function handleSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const payload = {
      title: formData.get("title"),
      description: formData.get("description"),
      location: formData.get("location") || "Nairobi",
      rent: Number(formData.get("rent")),
      house_type: formData.get("type"),
      bedrooms: Number(formData.get("bedrooms")),
      bathrooms: Number(formData.get("bathrooms")),
      amenities: "Wi-Fi, parking",
      image_url: images[0] || "",
    };

    setIsSubmitting(true);
    try {
      if (isEditing) {
        await apiRequest(`/properties/${id}`, {
          method: "PUT",
          body: JSON.stringify(payload),
        });
      } else {
        await apiRequest("/properties", {
          method: "POST",
          body: JSON.stringify(payload),
        });
      }
      navigate("/owner");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
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
              <label className="flex flex-col gap-2 text-sm font-medium text-textPrimary">
                Location
                <input required name="location" defaultValue={listing?.location || "Nairobi"} placeholder="e.g. Kilimani, Nairobi" className="rounded-lg border border-border px-3.5 py-3 font-normal outline-none focus:border-primary" />
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
            {error && <p className="mt-4 text-sm text-red-600">{error}</p>}
            <div className="mt-6 flex justify-end gap-3">
              <Link to="/owner" className="rounded-lg border border-border px-5 py-3 text-sm font-semibold text-textPrimary">Cancel</Link>
              <button type="submit" disabled={isSubmitting} className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">
                {isSubmitting ? "Working..." : isEditing ? "Save changes" : "Create listing"}
              </button>
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
