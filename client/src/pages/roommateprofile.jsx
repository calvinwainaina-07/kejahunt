// Dedicated profile page for creating and maintaining the signed-in user's roommate profile.
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";

const profileStorageKey = "kejahunt-roommate-profile";
const accountStorageKey = "kejahunt-profile";
const traitOptions = ["Non-smoker", "Early riser", "Professional", "Quiet", "Student", "Pet friendly"];

function readProfile() {
  try { return JSON.parse(localStorage.getItem(profileStorageKey) || "null"); } catch { return null; }
}

function readAccountProfile() {
  try { return JSON.parse(localStorage.getItem(accountStorageKey) || "{}"); } catch { return {}; }
}

export default function RoommateProfile() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(readProfile);
  // Account details are the source of truth for a roommate's identity and contact details.
  const [accountProfile] = useState(readAccountProfile);
  const [message, setMessage] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  const fullName = accountProfile.fullName || profile?.fullName || "KejaHunt user";
  const phone = accountProfile.phone || profile?.contact || "";
  const email = accountProfile.email || profile?.email || "";

  function saveProfile(event) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updated = { fullName, budget: formData.get("budget"), location: formData.get("location"), contact: phone || formData.get("contact"), email: email || formData.get("email"), lifestyle: formData.get("lifestyle"), about: formData.get("about"), traits: formData.getAll("traits") };
    localStorage.setItem("kejahunt-roommate-account", "true");
    localStorage.setItem(profileStorageKey, JSON.stringify(updated));
    setProfile(updated);
    setMessage("Your roommate profile has been saved. Your matches will update when you return to Roommate Matching.");
  }

  function deleteProfile() {
    localStorage.removeItem("kejahunt-roommate-account");
    localStorage.removeItem(profileStorageKey);
    navigate("/roommates");
  }

  return <div className="flex min-h-screen bg-bg"><Sidebar /><main className="flex-1 px-6 py-8 sm:px-12 sm:py-10"><Link to="/roommates" className="text-sm font-semibold text-primary hover:text-accent">← Back to roommate matching</Link><div className="mt-5 max-w-3xl"><p className="text-sm font-semibold text-accent">Roommate matching</p><h1 className="mt-1 text-[28px] font-bold text-textPrimary">{profile ? "My roommate profile" : "Create your roommate profile"}</h1><p className="mt-1 text-sm text-textSecondary">Your preferences help KejaHunt calculate better roommate matches.</p><div className="mt-5 rounded-xl border border-border bg-primaryLight/40 p-4"><p className="text-xs font-semibold tracking-wide text-textSecondary">YOUR KEJAHUNT ACCOUNT DETAILS</p><p className="mt-2 font-semibold text-textPrimary">{fullName}</p><p className="mt-1 text-sm text-textSecondary">{phone || "Phone number not added"} · {email || "Email address not added"}</p><p className="mt-2 text-xs text-textSecondary">These details are pulled from My Profile. Update them there if they need to change.</p></div>{message && <p className="mt-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{message}</p>}<form onSubmit={saveProfile} className="mt-7 rounded-2xl border border-border bg-surface p-5 sm:p-6"><div className="grid gap-4 sm:grid-cols-2"><Field label="YOUR MONTHLY BUDGET"><input required name="budget" min="0" type="number" defaultValue={profile?.budget || ""} placeholder="e.g. 30000" className="input" /></Field><Field label="WHERE DO YOU WANT TO LIVE?"><input required name="location" defaultValue={profile?.location || ""} placeholder="e.g. Kilimani, Nairobi" className="input" /></Field><Field label="YOUR CONTACT NUMBER"><input required name="contact" type="tel" readOnly={Boolean(accountProfile.phone)} defaultValue={phone} placeholder="e.g. +254 700 000 000" className="input read-only:bg-bg read-only:text-textSecondary" /></Field><Field label="YOUR EMAIL ADDRESS"><input required name="email" type="email" readOnly={Boolean(accountProfile.email)} defaultValue={email} placeholder="you@example.com" className="input read-only:bg-bg read-only:text-textSecondary" /></Field><Field label="LIFESTYLE"><select required name="lifestyle" defaultValue={profile?.lifestyle || ""} className="input"><option value="" disabled>Select a preference</option><option>Quiet home</option><option>Social home</option><option>Flexible</option></select></Field><Field label="YOUR TRAITS" className="sm:col-span-2"><div className="flex flex-wrap gap-3 rounded-lg border border-border/40 p-3">{traitOptions.map((trait) => <label key={trait} className="flex items-center gap-2 text-sm text-textPrimary"><input name="traits" type="checkbox" value={trait} defaultChecked={profile?.traits?.includes(trait)} className="accent-accent" />{trait}</label>)}</div></Field><Field label="TELL ROOMMATES ABOUT YOURSELF" className="sm:col-span-2"><textarea required name="about" rows="4" maxLength="300" defaultValue={profile?.about || ""} placeholder="Share your routine, interests, and what you value in a shared home." className="input resize-y" /></Field></div><div className="mt-5 flex flex-wrap gap-3"><button type="submit" className="rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white">Save profile</button>{profile && <button type="button" onClick={() => setConfirmDelete(true)} className="rounded-lg border border-red-300 px-5 py-3 text-sm font-semibold text-red-600">Delete profile</button>}</div></form></div>{confirmDelete && <div role="dialog" aria-modal="true" className="fixed inset-0 z-20 flex items-center justify-center bg-primary/60 p-5"><section className="w-full max-w-md rounded-2xl bg-surface p-6"><h2 className="text-xl font-bold text-textPrimary">Delete roommate profile?</h2><p className="mt-2 text-sm text-textSecondary">This only removes your roommate-matching profile.</p><div className="mt-6 flex justify-end gap-3"><button type="button" onClick={() => setConfirmDelete(false)} className="rounded-lg border border-border px-4 py-2.5 text-sm font-semibold">Keep profile</button><button type="button" onClick={deleteProfile} className="rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white">Delete</button></div></section></div>}</main></div>;
}

function Field({ label, className = "", children }) { return <label className={`flex flex-col gap-1.5 ${className}`}><span className="text-xs font-semibold tracking-wide text-textSecondary">{label}</span>{children}</label>; }
