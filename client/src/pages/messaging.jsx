
import Sidebar from "../components/Sidebar";
import { conversations } from "../data/mockData";

export default function Messaging() {
  const active = conversations[0];

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-24 py-12">
        <div className="flex bg-surface border border-border rounded-2xl overflow-hidden h-[calc(100vh-6rem)]">
          {/* Conversation list */}
          <div className="w-[360px] border-r border-border/20 flex flex-col pt-5 overflow-y-auto">
            <h2 className="text-xl font-bold px-5 pb-3">Messages</h2>
            {conversations.map((c, i) => (
              <div key={c.id} className={`px-5 py-3.5 ${i === 0 ? "bg-primaryLight" : ""}`}>
                <p className="text-sm font-semibold text-textPrimary">{c.name}</p>
                <p className="text-xs text-textSecondary truncate">{c.preview}</p>
              </div>
            ))}
          </div>

          {/* Thread */}
          <div className="flex-1 flex flex-col bg-bg">
            <div className="bg-surface border-b border-border/20 px-6 py-4.5">
              <p className="text-sm font-semibold">{active.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3.5">
              {active.messages.map((m, i) => (
                <div key={i} className={`flex ${m.fromMe ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      m.fromMe ? "bg-accent text-white" : "bg-surface border border-border/20"
                    }`}
                  >
                    {m.text}
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-surface px-6 py-4 flex gap-3 items-center">
              <input
                placeholder="Type a message..."
                className="flex-1 border border-border/30 rounded-lg px-3.5 py-2.5 text-sm outline-none"
              />
              <button type="button" className="bg-accent text-white text-sm font-semibold px-4.5 py-2.5 rounded-lg">
                Send
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
