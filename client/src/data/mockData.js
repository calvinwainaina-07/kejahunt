// TEMPORARY PROTOTYPE DATA: replace these arrays with backend API responses during integration.
export const properties = [
  // Listing fields match the data displayed on cards, search filters, and owner tools.
  { id: 1, title: "Modern Apartment", location: "Kilimani, Nairobi", type: "Apartment", rent: 35000, status: "Active", bedrooms: 2, bathrooms: 2, size: "85 sqm", description: "A bright, modern home close to shops and transport.", owner: "Amina Wanjiku" },
  { id: 2, title: "Cozy Studio", location: "Ruaka, Nairobi", type: "Studio", rent: 22000, status: "Active", bedrooms: 1, bathrooms: 1, size: "42 sqm", description: "A comfortable studio in a secure compound.", owner: "David Kimani" },
  { id: 3, title: "Two Bedroom Home", location: "Westlands, Nairobi", type: "House", rent: 65000, status: "Draft", bedrooms: 2, bathrooms: 2, size: "120 sqm", description: "A spacious home with plenty of natural light.", owner: "Grace Njeri" },
];

export const roommates = [
  // Candidate profiles power the cards, profile dialog, and matching calculation.
  { id: 1, name: "Nia", age: 25, budget: 30000, location: "Kilimani, Nairobi", lifestyle: "Quiet home", tags: ["Non-smoker", "Early riser"], about: "I work in design, enjoy calm evenings, and keep shared spaces tidy.", contact: { phone: "+254 711 234 567", email: "nia@kejahunt.test" } },
  { id: 2, name: "Brian", age: 27, budget: 35000, location: "Westlands, Nairobi", lifestyle: "Social home", tags: ["Professional", "Quiet"], about: "I am a working professional who enjoys football and occasional dinners with friends.", contact: { phone: "+254 722 345 678", email: "brian@kejahunt.test" } },
  { id: 3, name: "Wanjiku", age: 24, budget: 28000, location: "Ruaka, Nairobi", lifestyle: "Flexible", tags: ["Student", "Pet friendly"], about: "I am a postgraduate student and animal lover looking for a friendly shared home.", contact: { phone: "+254 733 456 789", email: "wanjiku@kejahunt.test" } },
];

export const conversations = [
  // Messaging copies these fixtures into component state before users send new messages.
  { id: 1, owner: "Amina Wanjiku", hunter: "You", propertyId: 1, preview: "The apartment is still available.", messages: [{ text: "Hi, is this apartment still available?", sender: "hunter" }, { text: "Yes, it is. Would you like to arrange a viewing?", sender: "owner" }] },
  { id: 2, owner: "David Kimani", hunter: "You", propertyId: 2, preview: "Viewing is available this weekend.", messages: [] },
];

// Prototype viewing data shared by the appointments screens until it is backed by an API.
export const viewingRequests = [
  { id: 1, propertyId: 1, hunter: "Nia Kamau", date: "2026-08-01", time: "10:00", status: "Pending", note: "I would like to see the parking and security areas too." },
  { id: 2, propertyId: 2, hunter: "You", date: "2026-08-03", time: "14:00", status: "Confirmed", note: "" },
];

export const notificationItems = [
  { id: 1, type: "Viewing", title: "Viewing confirmed", message: "David Kimani confirmed your viewing for Cozy Studio on 3 August at 2:00 PM.", time: "10 min ago", read: false },
  { id: 2, type: "Message", title: "New message from Amina Wanjiku", message: "The apartment is still available. Would you like to arrange a viewing?", time: "1 hour ago", read: false },
  { id: 3, type: "Listing", title: "Saved listing availability changed", message: "Modern Apartment is now available for viewings.", time: "Yesterday", read: true },
  { id: 4, type: "Roommate", title: "New roommate connection", message: "Brian accepted your request to connect.", time: "2 days ago", read: true },
];
