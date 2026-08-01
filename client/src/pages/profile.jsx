// TEMPORARY PROTOTYPE STORAGE: replace localStorage profile and password actions with authenticated API requests.
// Profile workspace for viewing and updating a user's contact details and password.
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { apiRequest } from "../api";
import { useAuth } from "../components/useauth.js";

const emptyProfile = { fullName: "", email: "", phone: "", location: "" };

export default function Profile() {
  // Profile state drives both the read-only summary and the editable form.
  const [profile, setProfile] = useState(emptyProfile);
  const [savedMessage, setSavedMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const navigate = useNavigate();
  const { clearSession } = useAuth();
  const role = sessionStorage.getItem("kejahunt-role") || "hunter";

  useEffect(() => {
    apiRequest("/users/me").then((user) => setProfile({ fullName: user.full_name, email: user.email, phone: user.phone || "", location: user.location || "" })).catch((error) => setSavedMessage(error.message));
  }, []);

  function updateProfileField(event) {
    // One handler updates any profile input using its `name` attribute.
    const { name, value } = event.target;
    setProfile((currentProfile) => ({ ...currentProfile, [name]: value }));
  }

  async function saveProfile(event) {
    event.preventDefault();
    try {
      const user = await apiRequest("/users/me", { method: "PUT", body: JSON.stringify({ full_name: profile.fullName, email: profile.email, phone: profile.phone, location: profile.location }) });
      setProfile({ fullName: user.full_name, email: user.email, phone: user.phone || "", location: user.location || "" });
      setSavedMessage("Profile details saved.");
    } catch (error) { setSavedMessage(error.message); }
  }

  async function changePassword(event) {
    // Validate current and confirmed passwords before replacing the saved value.
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const currentPassword = formData.get("currentPassword");
    const newPassword = formData.get("newPassword");

    if (newPassword !== formData.get("confirmPassword")) {
      setPasswordMessage("New passwords do not match.");
      return;
    }

    try {
      const result = await apiRequest("/users/me/password", { method: "PUT", body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }) });
      setPasswordMessage(result.message);
      event.currentTarget.reset();
    } catch (error) { setPasswordMessage(error.message); }
  }

  async function deleteAccount() {
    try {
      await apiRequest("/users/me", { method: "DELETE" });
      clearSession();
      navigate("/signup", { replace: true });
    } catch (error) {
      setSavedMessage(error.message);
      setShowDeleteConfirmation(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar role={role} />
      <main className="flex-1 px-12 py-10">
        <div>
          <h1 className="text-[28px] font-bold text-textPrimary">My Profile</h1>
          <p className="mt-1 text-sm text-textSecondary">View and manage your personal account details.</p>
        </div>

        <div className="mt-7 grid max-w-5xl gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          {/* Read-only summary lets users verify the information they have saved. */}
          <section className="rounded-2xl border border-border bg-surface p-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-white">
              {(profile.fullName || "K").charAt(0).toUpperCase()}
            </div>
            <h2 className="mt-4 text-xl font-bold text-textPrimary">{profile.fullName || "KejaHunt user"}</h2>
            <p className="mt-1 text-sm capitalize text-textSecondary">{role === "owner" ? "Property owner" : "House hunter"}</p>

            <dl className="mt-6 space-y-4 border-t border-border/30 pt-5 text-sm">
              <div>
                <dt className="font-medium text-textSecondary">Email address</dt>
                <dd className="mt-1 text-textPrimary">{profile.email || "Not added"}</dd>
              </div>
              <div>
                <dt className="font-medium text-textSecondary">Phone number</dt>
                <dd className="mt-1 text-textPrimary">{profile.phone || "Not added"}</dd>
              </div>
              <div>
                <dt className="font-medium text-textSecondary">Location</dt>
                <dd className="mt-1 text-textPrimary">{profile.location || "Not added"}</dd>
              </div>
            </dl>
          </section>

          <div className="space-y-6">
            <form onSubmit={saveProfile} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-lg font-bold text-textPrimary">Profile details</h2>
              <p className="mt-1 text-sm text-textSecondary">Keep your contact details up to date.</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                <Field label="FULL NAME">
                  <input required name="fullName" value={profile.fullName} onChange={updateProfileField} className="w-full rounded-lg border border-border/40 px-3 py-2.5 outline-none focus:border-primary" />
                </Field>
                <Field label="PHONE NUMBER">
                  <input name="phone" type="tel" value={profile.phone} onChange={updateProfileField} placeholder="e.g. +254 700 000 000" className="w-full rounded-lg border border-border/40 px-3 py-2.5 outline-none focus:border-primary" />
                </Field>
                <Field label="EMAIL ADDRESS" className="sm:col-span-2">
                  <input required name="email" type="email" value={profile.email} onChange={updateProfileField} className="w-full rounded-lg border border-border/40 px-3 py-2.5 outline-none focus:border-primary" />
                </Field>
                <Field label="LOCATION" className="sm:col-span-2">
                  <input name="location" value={profile.location} onChange={updateProfileField} placeholder="e.g. Nairobi, Kenya" className="w-full rounded-lg border border-border/40 px-3 py-2.5 outline-none focus:border-primary" />
                </Field>
              </div>
              {savedMessage && <p className="mt-4 text-sm font-medium text-success">{savedMessage}</p>}
              <button type="submit" className="mt-5 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white">Save profile</button>
            </form>

            <form onSubmit={changePassword} className="rounded-2xl border border-border bg-surface p-6">
              <h2 className="text-lg font-bold text-textPrimary">Change password</h2>
              <div className="mt-5 grid gap-4">
                <Field label="CURRENT PASSWORD">
                  <input required name="currentPassword" type="password" className="w-full rounded-lg border border-border/40 px-3 py-2.5 outline-none focus:border-primary" />
                </Field>
                <Field label="NEW PASSWORD">
                  <input required minLength="8" name="newPassword" type="password" className="w-full rounded-lg border border-border/40 px-3 py-2.5 outline-none focus:border-primary" />
                </Field>
                <Field label="CONFIRM NEW PASSWORD">
                  <input required minLength="8" name="confirmPassword" type="password" className="w-full rounded-lg border border-border/40 px-3 py-2.5 outline-none focus:border-primary" />
                </Field>
              </div>
              {passwordMessage && <p className={`mt-4 text-sm font-medium ${passwordMessage.includes("incorrect") || passwordMessage.includes("do not match") ? "text-accent" : "text-success"}`}>{passwordMessage}</p>}
              <button type="submit" className="mt-5 rounded-lg bg-accent px-5 py-3 text-sm font-semibold text-white">Update password</button>
            </form>

            {/* Destructive actions are visually separated from normal profile updates. */}
            <section className="rounded-2xl border border-red-200 bg-surface p-6">
              <h2 className="text-lg font-bold text-textPrimary">Delete account</h2>
              <p className="mt-1 text-sm text-textSecondary">Permanently remove your profile, password, and roommate matching details from this prototype.</p>
              <button type="button" onClick={() => setShowDeleteConfirmation(true)} className="mt-5 rounded-lg border border-red-300 px-5 py-3 text-sm font-semibold text-red-600 hover:bg-red-50">Delete account</button>
            </section>
          </div>
        </div>
      </main>
      {showDeleteConfirmation && <DeleteAccountConfirmation onCancel={() => setShowDeleteConfirmation(false)} onConfirm={deleteAccount} />}
    </div>
  );
}

function Field({ label, className = "", children }) {
  // Reusable field wrapper accepts layout classes for full-width inputs.
  return (
    <label className={`flex flex-col gap-1.5 ${className}`}>
      <span className="text-xs font-semibold tracking-wide text-textSecondary">{label}</span>
      {children}
    </label>
  );
}

function DeleteAccountConfirmation({ onCancel, onConfirm }) {
  // The dialog requires an explicit confirmation before profile data is erased.
  return (
    <div role="dialog" aria-modal="true" aria-labelledby="delete-profile-title" className="fixed inset-0 z-20 flex items-center justify-center bg-primary/60 p-5">
      <section className="w-full max-w-md rounded-3xl bg-surface p-6 shadow-2xl">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-xl font-bold text-red-600">!</div>
        <h2 id="delete-profile-title" className="mt-5 text-xl font-bold text-textPrimary">Delete your account?</h2>
        <p className="mt-2 text-sm leading-6 text-textSecondary">This permanently removes your account, listings, messages, saved properties, viewing requests, and roommate profile.</p>
        <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button type="button" onClick={onCancel} className="rounded-lg border border-border px-5 py-3 text-sm font-semibold text-textPrimary hover:bg-bg">Keep account</button>
          <button type="button" onClick={onConfirm} className="rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white hover:bg-red-700">Delete account</button>
        </div>
      </section>
    </div>
  );
}
