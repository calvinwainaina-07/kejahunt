import { useCallback, useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { apiRequest } from "../api";

const times = ["09:00", "10:00", "11:30", "14:00", "15:30", "17:00"];

function isPlaceholderListing(property) {
  const text = (value) => String(value || "").trim().toLowerCase();
  return [text(property.title), text(property.location)].includes("string");
}

export default function Bookings() {
  const [searchParams] = useSearchParams();
  const requestedPropertyId = Number(searchParams.get("property"));
  const [account, setAccount] = useState(null);
  const [properties, setProperties] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedPropertyId, setSelectedPropertyId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState(times[0]);
  const [note, setNote] = useState("");
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    try {
      const [auth, propertyData, viewingData] = await Promise.all([apiRequest("/auth/user"), apiRequest("/properties?available=true"), apiRequest("/viewings")]);
      setAccount(auth.user);
      const availableProperties = (propertyData || []).filter((property) => !isPlaceholderListing(property));
      setProperties(availableProperties);
      setRequests(viewingData || []);
      const requested = availableProperties.find((property) => property.id === requestedPropertyId);
      setSelectedPropertyId((current) => current || requested?.id || availableProperties[0]?.id || "");
    } catch (requestError) { setError(requestError.message); }
  }, [requestedPropertyId]);
  useEffect(() => { load(); }, [load]);

  const role = account?.role || "hunter";
  const propertyFor = (id) => properties.find((property) => property.id === id);
  const selectedProperty = propertyFor(Number(selectedPropertyId));

  async function requestViewing(event) {
    event.preventDefault();
    try {
      await apiRequest("/viewings", { method: "POST", body: JSON.stringify({ property_id: Number(selectedPropertyId), requested_date: date, requested_time: time, note }) });
      setNotice("Viewing request sent. The property owner has been notified.");
      setDate(""); setNote(""); await load();
    } catch (requestError) { setError(requestError.message); }
  }

  async function updateRequest(id, status) {
    try {
      await apiRequest(`/viewings/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
      setNotice(status === "Confirmed" ? "Viewing confirmed and the hunter has been notified." : status === "Declined" ? "Viewing request declined." : "The hunter has been asked to select another time.");
      await load();
    } catch (requestError) { setError(requestError.message); }
  }

  return <div className="flex min-h-screen bg-bg"><Sidebar role={role} /><main className="flex-1 px-6 py-8 sm:px-12 sm:py-10"><p className="text-sm font-semibold text-accent">{role === "owner" ? "Property Owner" : "House Hunter"}</p><h1 className="mt-1 text-[28px] font-bold text-textPrimary">{role === "owner" ? "Viewing requests" : "Book a viewing"}</h1><p className="mt-1 text-sm text-textSecondary">{role === "owner" ? "Respond to viewing requests and keep your appointments organised." : "Choose a home and request a convenient time to visit."}</p>{notice && <Alert text={notice} onDismiss={() => setNotice("")} />}{error && <p className="mt-4 text-sm text-red-600" role="alert">{error}</p>}{role === "owner" ? <OwnerRequests requests={requests} propertyFor={propertyFor} onUpdate={updateRequest} /> : <div className="mt-7 grid max-w-6xl gap-6 lg:grid-cols-[0.9fr_1.1fr]"><form onSubmit={requestViewing} className="rounded-2xl border border-border bg-surface p-6"><h2 className="text-lg font-bold text-textPrimary">Request an appointment</h2><label className="mt-6 block text-xs font-semibold tracking-wide text-textSecondary">PROPERTY<select required value={selectedPropertyId} onChange={(event) => setSelectedPropertyId(event.target.value)} className="mt-2 w-full rounded-lg border border-border/50 bg-bg px-3.5 py-3 text-sm text-textPrimary outline-none"><option value="" disabled>{properties.length ? "Select a listing" : "No available listings"}</option>{properties.map((property) => <option key={property.id} value={property.id}>{property.title} — {property.location}</option>)}</select></label><div className="mt-4 grid gap-4 sm:grid-cols-2"><label className="text-xs font-semibold tracking-wide text-textSecondary">PREFERRED DATE<input type="date" required value={date} min={new Date().toISOString().slice(0, 10)} onChange={(event) => setDate(event.target.value)} className="mt-2 w-full rounded-lg border border-border/50 bg-bg px-3.5 py-3 text-sm" /></label><label className="text-xs font-semibold tracking-wide text-textSecondary">PREFERRED TIME<select value={time} onChange={(event) => setTime(event.target.value)} className="mt-2 w-full rounded-lg border border-border/50 bg-bg px-3.5 py-3 text-sm">{times.map((option) => <option key={option}>{option}</option>)}</select></label></div><label className="mt-4 block text-xs font-semibold tracking-wide text-textSecondary">NOTE FOR THE OWNER (OPTIONAL)<textarea value={note} onChange={(event) => setNote(event.target.value)} rows="3" className="mt-2 w-full resize-none rounded-lg border border-border/50 bg-bg px-3.5 py-3 text-sm" /></label><button disabled={!selectedProperty || !date} type="submit" className="mt-6 w-full rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white disabled:opacity-60">Send viewing request</button></form><HunterAppointments requests={requests} propertyFor={propertyFor} /></div>}</main></div>;
}

function Alert({ text, onDismiss }) { return <div className="mt-6 flex items-center justify-between rounded-xl border border-success/30 bg-green-50 px-4 py-3 text-sm text-success"><span>{text}</span><button type="button" onClick={onDismiss} className="font-bold">×</button></div>; }
function HunterAppointments({ requests, propertyFor }) { return <section className="rounded-2xl border border-border bg-surface p-6"><h2 className="text-lg font-bold text-textPrimary">Your appointments</h2><div className="mt-5 space-y-4">{requests.length ? requests.map((request) => <Appointment key={request.id} request={request} property={propertyFor(request.property_id)} />) : <p className="py-10 text-center text-sm text-textSecondary">You have not requested a viewing yet.</p>}</div></section>; }
function OwnerRequests({ requests, propertyFor, onUpdate }) { return <section className="mt-7 max-w-5xl rounded-2xl border border-border bg-surface"><div className="border-b border-border/30 px-6 py-5"><h2 className="text-lg font-bold text-textPrimary">Incoming requests</h2></div><div className="divide-y divide-border/30">{requests.length ? requests.map((request) => <div key={request.id} className="p-6"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="font-semibold text-textPrimary">{request.hunter_name}</p><p className="mt-1 text-sm text-textSecondary">wants to view {propertyFor(request.property_id)?.title}</p></div><Status status={request.status} /></div><p className="mt-4 text-sm text-textSecondary">{formatDate(request.requested_date)} at {request.requested_time}</p>{request.note && <p className="mt-2 rounded-lg bg-bg px-3 py-2 text-sm text-textSecondary">“{request.note}”</p>}<div className="mt-5 flex flex-wrap gap-3"><button type="button" onClick={() => onUpdate(request.id, "Confirmed")} disabled={request.status !== "Pending"} className="rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50">Accept</button><button type="button" onClick={() => onUpdate(request.id, "Reschedule requested")} disabled={request.status !== "Pending"} className="rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary disabled:opacity-50">Reschedule</button><button type="button" onClick={() => onUpdate(request.id, "Declined")} disabled={request.status !== "Pending"} className="rounded-lg border border-red-300 px-4 py-2.5 text-sm font-semibold text-red-600 disabled:opacity-50">Decline</button></div></div>) : <p className="px-6 py-10 text-center text-sm text-textSecondary">There are no incoming viewing requests.</p>}</div></section>; }
function Appointment({ request, property }) { return <article className="rounded-xl border border-border/50 p-4"><div className="flex items-start justify-between gap-4"><div><p className="font-semibold text-textPrimary">{property?.title || "Property"}</p><p className="mt-1 text-sm text-textSecondary">{property?.location}</p></div><Status status={request.status} /></div><p className="mt-4 text-sm font-medium text-textPrimary">{formatDate(request.requested_date)} · {request.requested_time}</p><Link to={`/property/${request.property_id}`} className="mt-3 inline-block text-sm font-semibold text-primary">View listing →</Link></article>; }
function Status({ status }) { const styles = { Pending: "bg-amber-100 text-amber-800", Confirmed: "bg-green-100 text-green-700", Declined: "bg-red-100 text-red-700", "Reschedule requested": "bg-primaryLight text-primary" }; return <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${styles[status] || "bg-bg text-textSecondary"}`}>{status}</span>; }
function formatDate(value) { return new Intl.DateTimeFormat("en-KE", { day: "numeric", month: "long", year: "numeric" }).format(new Date(`${value}T12:00:00`)); }
