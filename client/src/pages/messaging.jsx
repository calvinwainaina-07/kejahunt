// TEMPORARY PROTOTYPE STORAGE: replace browser persistence with authenticated real-time messages.
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { properties } from "../data/mockData.js";
import { addNotification, readConversations, saveConversations } from "../data/Storage.js";

function getHunterName() {
  try { return JSON.parse(localStorage.getItem("kejahunt-profile") || "{}").fullName || "You"; } catch { return "You"; }
}

export default function Messaging() {
  const role = sessionStorage.getItem("kejahunt-role") || "hunter";
  const [searchParams] = useSearchParams();
  const requestedPropertyId = Number(searchParams.get("property"));
  const [messageThreads, setMessageThreads] = useState(readConversations);
  const [activeConversationId, setActiveConversationId] = useState(null);
  const [draftMessage, setDraftMessage] = useState("");

  // Starting from a listing creates or opens that listing's owner conversation.
  useEffect(() => {
    if (role !== "hunter" || !requestedPropertyId) return;
    const property = properties.find((item) => item.id === requestedPropertyId);
    if (!property) return;
    setMessageThreads((current) => {
      const existing = current.find((thread) => thread.propertyId === property.id && thread.hunter === getHunterName());
      if (existing) { setActiveConversationId(existing.id); return current; }
      const newThread = { id: Date.now(), owner: property.owner, hunter: getHunterName(), propertyId: property.id, preview: "Start a conversation about this property.", messages: [] };
      const updated = [newThread, ...current];
      saveConversations(updated);
      setActiveConversationId(newThread.id);
      return updated;
    });
  }, [requestedPropertyId, role]);

  const visibleThreads = role === "owner" ? messageThreads : messageThreads.filter((thread) => thread.hunter === "You" || thread.hunter === getHunterName());
  const active = visibleThreads.find((thread) => thread.id === activeConversationId) || visibleThreads[0];

  function selectConversation(id) { setActiveConversationId(id); }

  function sendMessage(event) {
    event.preventDefault();
    const messageText = draftMessage.trim();
    if (!messageText || !active) return;
    const updated = messageThreads.map((thread) => thread.id === active.id ? { ...thread, preview: messageText, messages: [...thread.messages, { text: messageText, sender: role }] } : thread);
    setMessageThreads(updated);
    saveConversations(updated);
    addNotification({ type: "Message", audience: role === "owner" ? "hunter" : "owner", title: role === "owner" ? "New reply from a property owner" : "New message from a house hunter", message: `${role === "owner" ? active.owner : active.hunter}: ${messageText}`, to: "/messages" });
    setDraftMessage("");
  }

  return <div className="flex min-h-screen bg-bg"><Sidebar role={role} /><main className="flex-1 px-6 py-8 sm:px-12 sm:py-10"><div className="flex h-[calc(100vh-4rem)] overflow-hidden rounded-2xl border border-border bg-surface"><div className="w-[340px] shrink-0 overflow-y-auto border-r border-border/20 pt-5"><h1 className="px-5 pb-3 text-xl font-bold">Messages</h1>{visibleThreads.map((thread) => <button key={thread.id} type="button" onClick={() => selectConversation(thread.id)} className={`w-full px-5 py-3.5 text-left transition-colors ${thread.id === active?.id ? "bg-primaryLight" : "hover:bg-bg"}`}><p className="text-sm font-semibold text-textPrimary">{role === "owner" ? thread.hunter : thread.owner}</p><p className="mt-0.5 text-xs text-textSecondary">{properties.find((property) => property.id === thread.propertyId)?.title}</p><p className="mt-1 truncate text-xs text-textSecondary">{thread.preview}</p></button>)}{!visibleThreads.length && <p className="px-5 py-10 text-center text-sm text-textSecondary">No conversations yet.</p>}</div><div className="flex flex-1 flex-col bg-bg">{active ? <><div className="border-b border-border/20 bg-surface px-6 py-4"><p className="text-sm font-semibold">{role === "owner" ? active.hunter : active.owner}</p><p className="mt-0.5 text-xs text-textSecondary">{properties.find((property) => property.id === active.propertyId)?.title}</p></div><div className="flex flex-1 flex-col gap-3.5 overflow-y-auto p-6">{active.messages.length === 0 && <p className="m-auto text-sm text-textSecondary">Start the conversation by sending a message.</p>}{active.messages.map((message, index) => <div key={index} className={`flex ${message.sender === role ? "justify-end" : "justify-start"}`}><div className={`max-w-xs rounded-2xl px-4 py-2.5 text-sm ${message.sender === role ? "bg-accent text-white" : "border border-border/20 bg-surface"}`}>{message.text}</div></div>)}</div><form onSubmit={sendMessage} className="flex items-center gap-3 bg-surface px-6 py-4"><input value={draftMessage} onChange={(event) => setDraftMessage(event.target.value)} placeholder="Type a message..." className="flex-1 rounded-lg border border-border/30 px-3.5 py-2.5 text-sm outline-none" /><button type="submit" disabled={!draftMessage.trim()} className="rounded-lg bg-accent px-4.5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">Send</button></form></> : <p className="m-auto text-sm text-textSecondary">Select a conversation to start messaging.</p>}</div></div></main></div>;
}
