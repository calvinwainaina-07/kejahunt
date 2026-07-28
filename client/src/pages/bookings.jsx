// TEMPORARY PROTOTYPE DATA: replace appointment state with booking API requests.
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { properties } from "../data/mockData.js";
import { addNotification, readViewingRequests, saveViewingRequests } from "../data/prototypeStorage.js";

const times = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"];

function getHunterName() {
  try { return JSON.parse(localStorage.getItem("kejahunt-profile") || "{}").fullName || "You"; } catch { return "You"; }
}

export default function Bookings() {
  const [searchParams] = useSearchParams();
  const role = sessionStorage.getItem("kejahunt-role") || "hunter";
  const requestedPropertyId = Number(searchParams.get("property"));
  const [requests, setRequests] = useState(readViewingRequests);
  const [selectedPropertyId, setSelectedPropertyId] = useState(
    properties.some((property) => property.id === requestedPropertyId) ? requestedPropertyId : properties[0]?.id,
  );
  const [date, setDate] = useState("");
  const [time, setTime] = useState(times[0]);
  const [note, setNote] = useState("");
  const [notice, setNotice] = useState("");

  const propertyFor = (propertyId) => properties.find((property) => property.id === propertyId);

  function requestViewing(event) {
    event.preventDefault();
    if (!selectedPropertyId || !date) return;
    const property = propertyFor(selectedPropertyId);
    setRequests((current) => {
      const updated = [...current, { id: Date.now(), propertyId: selectedPropertyId, hunter: getHunterName(), date, time, status: "Pending", note }];
      saveViewingRequests(updated);
      return updated;
    });
    addNotification({ type: "Viewing", audience: "hunter", title: "Viewing request sent", message: `Your request to view ${property?.title} on ${formatDate(date)} at ${time} is awaiting confirmation.`, to: "/bookings" });
    addNotification({ type: "Viewing", audience: "owner", title: "New viewing request", message: `${getHunterName()} requested a viewing for ${property?.title} on ${formatDate(date)} at ${time}.`, to: "/bookings" });
    setNotice("Viewing request sent. The property owner will be notified.");
    setDate("");
    setNote("");
  }

  function updateRequest(id, status) {
    const request = requests.find((item) => item.id === id);
    setRequests((current) => {
      const updated = current.map((item) => (item.id === id ? { ...item, status } : item));
      saveViewingRequests(updated);
      return updated;
    });
    if (request) addNotification({ type: "Viewing", audience: "hunter", title: `Viewing ${status.toLowerCase()}`, message: `${propertyFor(request.propertyId)?.title}: your viewing on ${formatDate(request.date)} at ${request.time} was ${status.toLowerCase()}.`, to: "/bookings" });
    setNotice(status === "Confirmed" ? "Viewing confirmed and the hunter has been notified." : "Viewing request declined.");
  }

  function rescheduleRequest(id) {
    const request = requests.find((item) => item.id === id);
    setRequests((current) => {
      const updated = current.map((item) => (item.id === id ? { ...item, status: "Reschedule requested" } : item));
      saveViewingRequests(updated);
      return updated;
    });
    if (request) addNotification({ type: "Viewing", audience: "hunter", title: "New viewing time needed", message: `${propertyFor(request.propertyId)?.title}: the owner asked you to select another viewing time.`, to: "/bookings" });
    setNotice("The hunter has been asked to choose another time.");
  }

  const hunterRequests = requests.filter((request) => request.hunter === "You" || request.hunter === getHunterName());

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role={role} />
      <main className="flex-1 px-6 py-8 sm:px-12 sm:py-10">
        <p className="text-sm font-semibold text-accent">{role === "owner" ? "Property Owner" : "House Hunter"}</p>
        <h1 className="mt-1 text-[28px] font-bold text-textPrimary">{role === "owner" ? "Viewing requests" : "Book a viewing"}</h1>
        <p className="mt-1 text-sm text-textSecondary">
          {role === "owner" ? "Respond to viewing requests and keep your appointments organised." : "Choose a home and request a convenient time to visit."}
        </p>

        {notice && <div className="mt-6 flex items-center justify-between rounded-xl border border-success/30 bg-green-50 px-4 py-3 text-sm text-success"><span>{notice}</span><button type="button" onClick={() => setNotice("")} aria-label="Dismiss notification" className="font-bold">×</button></div>}

        {role === "owner" ? (
          <OwnerRequests requests={requests} propertyFor={propertyFor} onUpdate={updateRequest} onReschedule={rescheduleRequest} />
        ) : (
          <div className="mt-7 grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <form onSubmit={requestViewing} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-lg font-bold text-textPrimary">Request an appointment</h2>
              <p className="mt-1 text-sm text-textSecondary">The owner will confirm your selected time.</p>
              <label className="mt-6 block text-xs font-semibold tracking-wide text-textSecondary">PROPERTY
                <select value={selectedPropertyId} onChange={(event) => setSelectedPropertyId(Number(event.target.value))} className="mt-2 w-full rounded-lg border border-border/50 bg-bg px-3.5 py-3 text-sm text-textPrimary outline-none">
                  {properties.filter((property) => property.status === "Active").map((property) => <option key={property.id} value={property.id}>{property.title} — {property.location}</option>)}
                </select>
              </label>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-xs font-semibold tracking-wide text-textSecondary">PREFERRED DATE
                  <input type="date" required value={date} min="2026-07-28" onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-lg border border-border/50 bg-bg px-3.5 py-3 text-sm text-textPrimary outline-none" />
                </label>
                <label className="text-xs font-semibold tracking-wide text-textSecondary">PREFERRED TIME
                  <select value={time} onChange={(event) => setTime(event.target.value)} className="mt-2 w-full rounded-lg border border-border/50 bg-bg px-3.5 py-3 text-sm text-textPrimary outline-none">
                    {times.map((option) => <option key={option}>{option}</option>)}
                  </select>
                </label>
              </div>
              <label className="mt-4 block text-xs font-semibold tracking-wide text-textSecondary">NOTE FOR THE OWNER (OPTIONAL)
                <textarea value={note} onChange={(event) => setNote(event.target.value)} rows="3" placeholder="Anything the owner should know before the viewing?" className="mt-2 w-full resize-none rounded-lg border border-border/50 bg-bg px-3.5 py-3 text-sm text-textPrimary outline-none" />
              </label>
              <button type="submit" className="mt-6 w-full rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent/90">Send viewing request</button>
            </form>
            <HunterAppointments requests={hunterRequests} propertyFor={propertyFor} />
          </div>
        )}
      </main>
    </div>
  );
}

function HunterAppointments({ requests, propertyFor }) {
  return <section className="rounded-2xl border border-border bg-surface p-6"><h2 className="text-lg font-bold text-textPrimary">Your appointments</h2><div className="mt-5 space-y-4">{requests.length ? requests.map((request) => <Appointment key={request.id} request={request} property={propertyFor(request.propertyId)} />) : <p className="py-10 text-center text-sm text-textSecondary">You have not requested a viewing yet.</p>}</div></section>;
}

function OwnerRequests({ requests, propertyFor, onUpdate, onReschedule }) {
  return <section className="mt-7 max-w-5xl rounded-2xl border border-border bg-surface"><div className="border-b border-border/30 px-6 py-5"><h2 className="text-lg font-bold text-textPrimary">Incoming requests</h2></div><div className="divide-y divide-border/30">{requests.filter((request) => request.hunter !== "You").map((request) => <div key={request.id} className="p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-semibold text-textPrimary">{request.hunter}</p><p className="mt-1 text-sm text-textSecondary">wants to view {propertyFor(request.propertyId)?.title}</p></div><Status status={request.status} /></div><p className="mt-4 text-sm text-textSecondary">{formatDate(request.date)} at {request.time}</p>{request.note && <p className="mt-2 rounded-lg bg-bg px-3 py-2 text-sm text-textSecondary">“{request.note}”</p>}<div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => onUpdate(request.id, "Confirmed")} disabled={request.status !== "Pending"} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50">Accept</button><button type="button" onClick={() => onReschedule(request.id)} disabled={request.status !== "Pending"} className="rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50">Reschedule</button><button type="button" onClick={() => onUpdate(request.id, "Declined")} disabled={request.status !== "Pending"} className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 disabled:cursor-not-allowed disabled:opacity-50">Decline</button></div></div>)}{requests.every((request) => request.hunter === "You") && <p className="px-6 py-10 text-center text-sm text-textSecondary">There are no incoming viewing requests.</p>}</div></section>;
}

function Appointment({ request, property }) {
  return <article className="rounded-xl border border-border/50 p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-textPrimary">{property?.title}</p><p className="mt-1 text-sm text-textSecondary">{property?.location}</p></div><Status status={request.status} /></div><p className="mt-4 text-sm font-medium text-textPrimary">{formatDate(request.date)} · {request.time}</p><Link to={`/property/${request.propertyId}`} className="mt-3 inline-block text-sm font-semibold text-primary hover:text-accent">View listing →</Link></article>;
}

function Status({ status }) { const styles = { Pending: "bg-amber-100 text-amber-800", Confirmed: "bg-green-100 text-green-700", Declined: "bg-red-100 text-red-700", "Reschedule requested": "bg-primaryLight text-primary" }; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-bg text-textSecondary"}`}>{status}</span>; }
function formatDate(value) { return new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }
