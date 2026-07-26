import Sidebar from "../components/Sidebar";
import { properties } from "../data/mockData";

export default function OwnerDashboard() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-12 py-10 flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-[28px] font-bold text-textPrimary">My Listings</h1>
            <p className="text-textSecondary text-sm mt-1">
              Create, update, and manage your house listings
            </p>
          </div>
          <button type="button" className="bg-accent text-white text-sm font-semibold px-5 py-3 rounded-lg">
            + New Listing
          </button>
        </div>

        <div className="bg-surface border border-border rounded-2xl overflow-hidden">
          <div className="grid grid-cols-[2fr_1fr_1fr_1fr_1.2fr] gap-4 px-5 py-3 text-xs font-semibold text-textSecondary border-b border-border/20">
            <span>LISTING</span>
            <span>RENT</span>
            <span>TYPE</span>
            <span>STATUS</span>
            <span>ACTIONS</span>
          </div>
          {properties.map((l) => (
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
                <span className="text-primary">View</span>
                <span className="text-primary">Edit</span>
                <span className="text-danger">Delete</span>
              </span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
