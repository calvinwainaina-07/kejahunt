// Browser-only persistence for the prototype until these flows are connected to the Flask API.
import { conversations, notificationItems, viewingRequests } from "./mockData.js";

const bookingsKey = "kejahunt-viewing-requests";
const notificationsKey = "kejahunt-notifications";
const conversationsKey = "kejahunt-conversations";

function read(key, fallback) {
  try {
    const saved = localStorage.getItem(key);
    return saved ? JSON.parse(saved) : fallback.map((item) => ({ ...item }));
  } catch {
    return fallback.map((item) => ({ ...item }));
  }
}

function save(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function readViewingRequests() {
  return read(bookingsKey, viewingRequests);
}

export function saveViewingRequests(requests) {
  save(bookingsKey, requests);
}

export function readNotifications() {
  return read(notificationsKey, notificationItems);
}

export function saveNotifications(notifications) {
  save(notificationsKey, notifications);
}

export function addNotification(notification) {
  const notifications = readNotifications();
  saveNotifications([{ id: Date.now(), read: false, time: "Just now", ...notification }, ...notifications]);
}

export function readNotificationsForRole(role) {
  // Old fixture notifications belong to the hunter; new notifications declare their audience.
  return readNotifications().filter((notification) => (notification.audience || "hunter") === role);
}

export function readConversations() {
  return read(conversationsKey, conversations).map((conversation) => ({
    ...conversation,
    owner: conversation.owner || conversation.name || "Property owner",
    hunter: conversation.hunter || "You",
    // Support messages saved by the earlier component-local prototype shape.
    messages: Array.isArray(conversation.messages) ? conversation.messages.map((message) => ({ ...message, sender: message.sender || (message.fromMe ? "hunter" : "owner") })) : [],
  }));
}

export function saveConversations(updatedConversations) {
  save(conversationsKey, updatedConversations);
}
