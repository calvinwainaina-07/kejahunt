// Interactive inbox that keeps selected threads and draft messages in local state.
import { useState } from "react";
import Sidebar from "../components/sidebar.jsx";
import { conversations } from "../data/mockData";

export default function Messaging() {
  // Copy mock data so sending a message never changes the imported fixtures directly.
  const [messageThreads, setMessageThreads] = useState(() =>
    conversations.map((conversation) => ({ ...conversation, messages: [...conversation.messages] })),
  );
  const [activeConversationId, setActiveConversationId] = useState(conversations[0]?.id);
  const [draftMessage, setDraftMessage] = useState("");
  const active = messageThreads.find((conversation) => conversation.id === activeConversationId);

  function sendMessage(event) {
    // Ignore blank messages, then append the message to the active conversation.
    event.preventDefault();
    const messageText = draftMessage.trim();
    if (!messageText || !active) return;

    setMessageThreads((currentThreads) =>
      currentThreads.map((conversation) =>
        conversation.id === active.id
          ? {
              ...conversation,
              preview: messageText,
              messages: [...conversation.messages, { text: messageText, fromMe: true }],
            }
          : conversation,
      ),
    );
    setDraftMessage("");
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-24 py-12">
        <div className="flex bg-surface border border-border rounded-2xl overflow-hidden h-[calc(100vh-6rem)]">
          {/* Conversation list */}
          <div className="w-[360px] border-r border-border/20 flex flex-col pt-5 overflow-y-auto">
            <h2 className="text-xl font-bold px-5 pb-3">Messages</h2>
            {messageThreads.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => setActiveConversationId(c.id)}
                className={`w-full px-5 py-3.5 text-left transition-colors ${c.id === activeConversationId ? "bg-primaryLight" : "hover:bg-bg"}`}
              >
                <p className="text-sm font-semibold text-textPrimary">{c.name}</p>
                <p className="text-xs text-textSecondary truncate">{c.preview}</p>
              </button>
            ))}
          </div>

          {/* Thread */}
          <div className="flex-1 flex flex-col bg-bg">
            <div className="bg-surface border-b border-border/20 px-6 py-4.5">
              <p className="text-sm font-semibold">{active?.name}</p>
            </div>
            <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-3.5">
              {active?.messages.length === 0 && (
                <p className="m-auto text-sm text-textSecondary">Start the conversation by sending a message.</p>
              )}
              {active?.messages.map((m, i) => (
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
            <form onSubmit={sendMessage} className="bg-surface px-6 py-4 flex gap-3 items-center">
              <input
                value={draftMessage}
                onChange={(event) => setDraftMessage(event.target.value)}
                placeholder="Type a message..."
                className="flex-1 border border-border/30 rounded-lg px-3.5 py-2.5 text-sm outline-none"
              />
              <button type="submit" disabled={!draftMessage.trim()} className="bg-accent text-white text-sm font-semibold px-4.5 py-2.5 rounded-lg disabled:cursor-not-allowed disabled:opacity-60">
                Send
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
