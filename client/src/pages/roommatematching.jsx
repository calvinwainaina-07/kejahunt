// TEMPORARY PROTOTYPE DATA: replace local roommate profiles, alerts, and connections with backend APIs.
// Roommate profiles, matching scores, and connection requests for the prototype.
import { useState } from "react";
import { Link } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { roommates } from "../data/mockData";

const profileStorageKey = "kejahunt-roommate-profile";
// Traits are shared by the account form and the candidate matching logic.

function readRoommateProfile() {
  try {
    const savedProfile = JSON.parse(localStorage.getItem(profileStorageKey) || "null");
    // Profiles created before traits were added should still render safely.
    return savedProfile
      ? {
          ...savedProfile,
          location: savedProfile.location || "Not specified",
          contact: savedProfile.contact || "Not specified",
          email: savedProfile.email || "Not specified",
          traits: Array.isArray(savedProfile.traits) ? savedProfile.traits : [],
        }
      : null;
  } catch {
    return null;
  }
}

function calculateMatch(roommate, profile) {
  // A profile is required before a meaningful personalised score can be calculated.
  if (!profile) return "--";

  // Score shared traits most heavily, then budget, lifestyle, and preferred location.
  const sharedTraits = (profile.traits || []).filter((trait) => roommate.tags.includes(trait)).length;
  const traitScore = Math.round((sharedTraits / roommate.tags.length) * 25);
  const budgetDifference = Math.abs(Number(profile.budget) - roommate.budget);
  const budgetScore = budgetDifference <= 3000 ? 15 : budgetDifference <= 7000 ? 10 : budgetDifference <= 12000 ? 5 : 0;
  const lifestyleScore = profile.lifestyle === roommate.lifestyle ? 5 : 0;
  const locationScore = profile.location?.trim().toLowerCase() === roommate.location.toLowerCase() ? 5 : 0;

  return Math.min(100, 50 + traitScore + budgetScore + lifestyleScore + locationScore);
}

export default function RoommateMatching() {
  // Local state controls account editing, alerts, card actions, and the profile viewer.
  const [connectedRoommateIds, setConnectedRoommateIds] = useState([]);
  const [roommateProfile] = useState(readRoommateProfile);
  const [accountAlert, setAccountAlert] = useState("");
  const [selectedRoommate, setSelectedRoommate] = useState(null);
  const [connectedContact, setConnectedContact] = useState(null);
  const hasRoommateAccount = Boolean(roommateProfile);

  function connectWithRoommate(roommate) {
    // A user must complete their own profile before requesting a connection.
    if (!hasRoommateAccount) {
      setAccountAlert("Create your roommate profile first to start connecting with potential roommates.");
      return;
    }

    setConnectedRoommateIds((currentIds) => [...currentIds, roommate.id]);
    setAccountAlert(`${roommate.name} has been notified that you want to connect.`);
    setConnectedContact(roommate);
  }

  function showRoommateProfile(roommate) {
    // Open the selected candidate without changing the actions available on their card.
    setSelectedRoommate(roommate);
  }

  function moveProfile(direction) {
    // Wrap around the candidate list for continuous previous/next profile browsing.
    const currentIndex = roommates.findIndex((roommate) => roommate.id === selectedRoommate.id);
    const nextIndex = (currentIndex + direction + roommates.length) % roommates.length;
    showRoommateProfile(roommates[nextIndex]);
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <main className="flex-1 px-6 py-8 sm:px-12 sm:py-10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-[28px] font-bold text-textPrimary">Roommate Matching</h1>
            <p className="mt-1 text-sm text-textSecondary">People looking for a place near you, matched on lifestyle, budget, and traits</p>
          </div>
          <Link to="/roommate-profile" className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white">
            {hasRoommateAccount ? "My roommate profile" : "Create roommate account"}
          </Link>
        </div>

        {accountAlert && (
          <div role="alert" className="mt-7 flex items-start justify-between gap-4 rounded-xl border border-accent/30 bg-accent/10 px-5 py-4 text-sm text-textPrimary">
            <div><p className="font-bold">Roommate Matching</p><p className="mt-1 text-textSecondary">{accountAlert}</p></div>
            <button type="button" onClick={() => setAccountAlert("")} aria-label="Dismiss alert" className="text-lg font-semibold text-textSecondary hover:text-primary">×</button>
          </div>
        )}

        {/* Candidate cards recalculate their percentage whenever the saved profile changes. */}
        <div className="mt-7 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {roommates.map((roommate) => {
            const requestSent = connectedRoommateIds.includes(roommate.id);
            const match = calculateMatch(roommate, roommateProfile);
            return (
              <div key={roommate.id} className="flex flex-col gap-3.5 rounded-2xl border border-border bg-surface p-5.5">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primaryLight font-bold text-primary">{roommate.name.charAt(0)}</div>
                  <div><p className="font-semibold text-textPrimary">{roommate.name}, {roommate.age}</p><p className="text-xs text-textSecondary">Looking in {roommate.location}</p><p className="mt-0.5 text-xs text-textSecondary">Budget: KSh {roommate.budget.toLocaleString()}/mo</p></div>
                </div>
                <span className="self-start rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-white">{match}{match === "--" ? "" : "%"} match</span>
                <div className="flex flex-wrap gap-2">{roommate.tags.map((tag) => <span key={tag} className="rounded bg-primaryLight px-2.5 py-1 text-[11px] font-medium text-primary">{tag}</span>)}</div>
                <div className="mt-auto grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => showRoommateProfile(roommate)} className="rounded-lg border border-primary px-3 py-3 text-sm font-semibold text-primary hover:bg-primaryLight">View profile</button>
                  <button type="button" onClick={() => connectWithRoommate(roommate)} disabled={requestSent} className="rounded-lg bg-accent px-3 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-70">{requestSent ? "Request sent" : "Connect"}</button>
                </div>
              </div>
            );
          })}
        </div>
      </main>

      {selectedRoommate && <RoommateProfile roommate={selectedRoommate} onClose={() => setSelectedRoommate(null)} onPrevious={() => moveProfile(-1)} onNext={() => moveProfile(1)} />}
      {connectedContact && <ConnectionDetails roommate={connectedContact} onClose={() => setConnectedContact(null)} />}
    </div>
  );
}

function RoommateProfile({ roommate, onClose, onPrevious, onNext }) {
  // Modal viewer accepts navigation callbacks so users can browse candidates in sequence.
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="roommate-profile-title" className="fixed inset-0 z-10 flex items-center justify-center bg-primary/50 p-5">
      <section className="w-full max-w-lg overflow-hidden rounded-3xl bg-surface shadow-2xl">
        <div className="bg-primary p-6 text-white"><div className="flex items-start justify-between gap-4"><div className="flex items-center gap-4"><div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/15 text-2xl font-bold">{roommate.name.charAt(0)}</div><div><p className="text-xs font-semibold tracking-wider text-primaryLight">ROOMMATE PROFILE</p><h2 id="roommate-profile-title" className="mt-1 text-2xl font-bold">{roommate.name}, {roommate.age}</h2></div></div><button type="button" onClick={onClose} aria-label="Close profile" className="text-2xl text-primaryLight hover:text-white">×</button></div></div>
        <div className="p-6"><div className="rounded-xl bg-primaryLight p-4"><p className="text-xs font-semibold text-textSecondary">PREFERRED HOME</p><p className="mt-1 text-lg font-bold text-primary">{roommate.location}</p><p className="mt-1 text-sm font-medium text-textSecondary">KSh {roommate.budget.toLocaleString()}/mo · {roommate.lifestyle}</p></div><h3 className="mt-6 text-sm font-bold text-textPrimary">About</h3><p className="mt-2 text-sm leading-6 text-textSecondary">{roommate.about}</p>
        <div className="mt-5 flex flex-wrap gap-2">{roommate.tags.map((tag) => <span key={tag} className="rounded-full bg-primaryLight px-3 py-1.5 text-xs font-medium text-primary">{tag}</span>)}</div>
        <div className="mt-7 grid grid-cols-2 gap-3 border-t border-border/30 pt-5"><button type="button" onClick={onPrevious} className="rounded-lg border border-primary px-4 py-3 text-sm font-semibold text-primary hover:bg-primaryLight">← Previous</button><button type="button" onClick={onNext} className="rounded-lg bg-accent px-4 py-3 text-sm font-semibold text-white hover:bg-accent/90">Next →</button></div></div>
      </section>
    </div>
  );
}

function ConnectionDetails({ roommate, onClose }) {
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="connection-details-title" className="fixed inset-0 z-20 flex items-center justify-center bg-primary/60 p-5">
      <section className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100 text-xl font-bold text-green-700">✓</div>
        <h2 id="connection-details-title" className="mt-5 text-xl font-bold text-textPrimary">Connection request sent</h2>
        <p className="mt-2 text-sm leading-6 text-textSecondary">{roommate.name} has been notified that you would like to connect. Their contact details are available below.</p>
        <div className="mt-5 rounded-xl bg-primaryLight p-4"><p className="font-semibold text-textPrimary">{roommate.name}</p><p className="mt-2 text-sm text-textSecondary">Phone: <a href={`tel:${roommate.contact.phone}`} className="font-medium text-primary hover:text-accent">{roommate.contact.phone}</a></p><p className="mt-1 text-sm text-textSecondary">Email: <a href={`mailto:${roommate.contact.email}`} className="font-medium text-primary hover:text-accent">{roommate.contact.email}</a></p></div>
        <button type="button" onClick={onClose} className="mt-6 w-full rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white hover:bg-accent/90">Done</button>
      </section>
    </div>
  );
}
