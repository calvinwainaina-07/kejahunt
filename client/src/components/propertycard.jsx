// Reusable preview card that links to a listing's full details page.
import { Link } from "react-router-dom";

export default function PropertyCard({ property }) {
  // `property` is supplied by listing pages so this card can be reused consistently.
  return (
    // The whole card is a link so a user can open a listing from anywhere on the card.
    <Link to={`/property/${property.id}`} className="bg-surface border border-border rounded-2xl overflow-hidden flex flex-col transition-shadow hover:shadow-md">
      {/* Show the first owner-uploaded photo when the listing has one. */}
      <div className="relative h-44 bg-primaryLight border-b border-border">
        {property.images?.[0] && <img src={property.images[0]} alt={property.title} className="h-full w-full object-cover" />}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white border border-border flex items-center justify-center text-sm">
          ☆
        </div>
      </div>
      {/* Keep the most important listing information visible at a glance. */}
      <div className="p-4 flex flex-col gap-1.5">
        <span className="font-semibold text-textPrimary">{property.title}</span>
        <p className="text-accent font-bold text-[15px]">
          KSh {property.rent.toLocaleString()}/mo
        </p>
        <span className="self-start text-xs font-medium bg-primaryLight text-primary px-2.5 py-1 rounded">
          {property.type}
        </span>
      </div>
    </Link>
  );
}
