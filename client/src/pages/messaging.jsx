import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { apiRequest } from "../api";

export default function Messaging() {
  const [searchParams] = useSearchParams();
  const requestedPropertyId = Number(searchParams.get("property"));
  const [messages, setMessages] = useState([]);
  const [properties, setProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [draft, setDraft] = useState("");
  const [error, setError] = useState("");

  async function load() {
    try {
      const [messageData, propertyData, account] = await Promise.all([apiRequest("/messages"), apiRequest("/properties"), apiRequest("/auth/user")]);
      setMessages(messageData || []); setProperties(propertyData || []); setUser(account.user);
    } catch (requestError) { setError(requestError.message); }
  }
  useEffect(() => { load(); }, []);
  const selectedProperty = useMemo(() => properties.find((property) => property.id === requestedPropertyId) || properties[0], [properties, requestedPropertyId]);
  const visibleMessages = selectedProperty ? messages.filter((message) => message.property_id === selectedProperty.id) : [];

  async function sendMessage(event) {
    event.preventDefault();
    if (!draft.trim() || !selectedProperty || !user) return;
    const receiverId = user.role === "owner" ? visibleMessages.find((message) => message.sender_id !== user.id)?.sender_id : selectedProperty.owner_user_id;
    if (!receiverId) { setError("Open this conversation after the other participant has sent a message."); return; }
    try {
      await apiRequest("/messages", { method: "POST", body: JSON.stringify({ receiver_id: receiverId, property_id: selectedProperty.id, message: draft.trim() }) });
      setDraft(""); await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return <div className="flex min-h-screen bg-bg"><Sidebar role={user?.role} /><main className="flex-1 px-6 py-8 sm:px-12 sm:py-10"><h1 className="text-2xl font-bold text-textPrimary">Messages</h1>{error && <p className="mt-3 text-sm text-red-600">{error}</p>}<div className="mt-6 grid max-w-5xl gap-5 lg:grid-cols-[280px_1fr]"><aside className="rounded-2xl border border-border bg-surface p-4"><p className="mb-3 text-sm font-semibold">Property conversations</p>{properties.map((property) => <a key={property.id} href={`#/messages?property=${property.id}`} className={`mb-2 block rounded-lg px-3 py-2 text-sm ${selectedProperty?.id === property.id ? "bg-primaryLight text-primary" : "text-textSecondary hover:bg-bg"}`}>{property.title}</a>)}</aside><section className="flex min-h-[440px] flex-col rounded-2xl border border-border bg-surface"><div className="border-b border-border/30 p-5"><h2 className="font-bold text-textPrimary">{selectedProperty?.title || "Select a property"}</h2></div><div className="flex-1 space-y-3 p-5">{visibleMessages.length ? visibleMessages.map((message) => <div key={message.id} className={`flex ${message.sender_id === user?.id ? "justify-end" : "justify-start"}`}><p className={`max-w-md rounded-2xl px-4 py-2.5 text-sm ${message.sender_id === user?.id ? "bg-accent text-white" : "bg-primaryLight text-textPrimary"}`}>{message.message}</p></div>) : <p className="text-sm text-textSecondary">Start the conversation about this property.</p>}</div><form onSubmit={sendMessage} className="flex gap-3 border-t border-border/30 p-4"><input value={draft} onChange={(event) => setDraft(event.target.value)} className="flex-1 rounded-lg border border-border px-3 py-2.5 text-sm" placeholder="Type a message..." /><button className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white">Send</button></form></section></div></main></div>;
}
