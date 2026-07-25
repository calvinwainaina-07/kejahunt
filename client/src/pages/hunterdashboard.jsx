// House-hunter dashboard containing search controls and property cards.
import Sidebar from '../components/sidebar.jsx';
import PropertyCard from '../components/propertycard.jsx';

const properties = [
  { id: 1, title: 'Modern 1 Bedroom Apartment', location: 'Kilimani, Nairobi', rent: 'KSh 35,000 / month' },
  { id: 2, title: 'Spacious Studio Apartment', location: 'Ruaka, Nairobi', rent: 'KSh 22,000 / month' },
  { id: 3, title: 'Two Bedroom Home', location: 'Westlands, Nairobi', rent: 'KSh 65,000 / month' },
];

export default function HunterDashboard() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-12 py-10 flex flex-col gap-7">
        <h1 className="text-[28px] font-bold text-textPrimary">Find your next home</h1>

        <div className="flex items-center gap-3 bg-surface border border-border rounded-xl px-4 py-3.5">
          <input
            placeholder="Search location e.g. Kilimani, Ruaka..."
            className="flex-1 bg-transparent outline-none text-sm placeholder:text-textSecondary/70"
          />
          <span className="bg-primaryLight rounded-full px-3.5 py-2 text-sm text-primary font-medium">
            Rent: Any
          </span>
          <span className="bg-primaryLight rounded-full px-3.5 py-2 text-sm text-primary font-medium">
            Type: Any
          </span>
          <button type="button" className="bg-accent text-white text-sm font-semibold px-5 py-2.5 rounded-lg">
            Search
          </button>
        </div>

        <p className="text-sm text-textSecondary font-medium">
          {properties.length} homes available in Nairobi
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((p) => (
            <PropertyCard key={p.id} property={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
