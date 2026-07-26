import Sidebar from "../components/Sidebar";
import { roommates } from "../data/mockData";

export default function RoommateMatching() {
  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-12 py-10 flex flex-col gap-7">
        <div>
          <h1 className="text-[28px] font-bold text-textPrimary">Roommate Matching</h1>
          <p className="text-textSecondary text-sm mt-1">
            People looking for a place near you, matched on lifestyle and budget
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {roommates.map((r) => (
            <div
              key={r.id}
              className="bg-surface border border-border rounded-2xl p-5.5 flex flex-col gap-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primaryLight" />
                <div>
                  <p className="font-semibold text-textPrimary">
                    {r.name}, {r.age}
                  </p>
                  <p className="text-xs text-textSecondary">
                    Budget: KSh {r.budget.toLocaleString()}/mo
                  </p>
                </div>
              </div>

              <span className="self-start bg-accent text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                {r.match}% match
              </span>

              <div className="flex flex-wrap gap-2">
                {r.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-primaryLight text-primary text-[11px] font-medium px-2.5 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              <button type="button" className="border border-border/30 rounded-lg py-3 text-sm font-semibold">
                Connect
              </button>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
