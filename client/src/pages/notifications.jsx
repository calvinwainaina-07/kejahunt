// TEMPORARY PROTOTYPE DATA: replace notification fixtures with the authenticated notification API.
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar.jsx";
import { readNotificationsForRole, saveNotifications } from "../data/Storage.js";

const icons = { Viewing: "◷", Message: "✉", Listing: "⌂", Roommate: "♧" };
const routes = { Viewing: "/bookings", Message: "/messages", Listing: "/saved", Roommate: "/roommates" };

export default function Notifications() {
  const navigate = useNavigate();
  const role = sessionStorage.getItem("kejahunt-role") || "hunter";
  const [notifications, setNotifications] = useState(() => readNotificationsForRole(role));
  const unreadCount = useMemo(() => notifications.filter((notification) => !notification.read).length, [notifications]);

  function updateNotifications(updater) {
    setNotifications((current) => {
      const updated = updater(current);
      // Keep notifications for the other role untouched in this browser-only prototype.
      const otherRoleNotifications = readNotificationsForRole(role === "owner" ? "hunter" : "owner");
      saveNotifications([...updated, ...otherRoleNotifications]);
      return updated;
    });
  }
  function openNotification(notification) {
    updateNotifications((current) => current.map((item) => item.id === notification.id ? { ...item, read: true } : item));
    navigate(notification.to || routes[notification.type] || "/notifications");
  }
  function markAllRead() { updateNotifications((current) => current.map((notification) => ({ ...notification, read: true }))); }

  return <div className="flex min-h-screen bg-bg"><Sidebar /><main className="flex-1 px-6 py-8 sm:px-12 sm:py-10"><div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-sm font-semibold text-accent">Activity centre</p><h1 className="mt-1 text-[28px] font-bold text-textPrimary">Notifications</h1><p className="mt-1 text-sm text-textSecondary">Stay up to date with your homes, conversations, viewings, and matches.</p></div><button type="button" onClick={markAllRead} disabled={!unreadCount} className="rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary disabled:cursor-not-allowed disabled:opacity-50 hover:bg-primaryLight">Mark all as read</button></div><section className="mt-7 max-w-4xl overflow-hidden rounded-2xl border border-border bg-surface"><div className="border-b border-border/30 px-6 py-4"><p className="text-sm font-semibold text-textPrimary">{unreadCount ? `${unreadCount} unread notification${unreadCount === 1 ? "" : "s"}` : "You’re all caught up"}</p></div><div className="divide-y divide-border/30">{notifications.map((notification) => <button key={notification.id} type="button" onClick={() => openNotification(notification)} className={`flex w-full gap-4 px-6 py-5 text-left transition-colors hover:bg-bg ${notification.read ? "" : "bg-primaryLight/45"}`}><span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-lg text-white" aria-hidden="true">{icons[notification.type]}</span><span className="min-w-0 flex-1"><span className="flex flex-wrap items-center justify-between gap-2"><span className="font-semibold text-textPrimary">{notification.title}</span><span className="text-xs text-textSecondary">{notification.time}</span></span><span className="mt-1 block text-sm leading-6 text-textSecondary">{notification.message}</span></span>{!notification.read && <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-accent" aria-label="Unread" />}</button>)}</div></section></main></div>;
}
