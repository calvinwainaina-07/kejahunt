// Temporary local data used until these values are loaded from a backend API.
export const properties = [
  // Listing fields match the data displayed on cards, search filters, and owner tools.
  { id: 1, title: "Modern Apartment", location: "Kilimani, Nairobi", type: "Apartment", rent: 35000, status: "Active", bedrooms: 2, bathrooms: 2, size: "85 sqm", description: "A bright, modern home close to shops and transport.", owner: "Amina Wanjiku" },
  { id: 2, title: "Cozy Studio", location: "Ruaka, Nairobi", type: "Studio", rent: 22000, status: "Active", bedrooms: 1, bathrooms: 1, size: "42 sqm", description: "A comfortable studio in a secure compound.", owner: "David Kimani" },
  { id: 3, title: "Two Bedroom Home", location: "Westlands, Nairobi", type: "House", rent: 65000, status: "Draft", bedrooms: 2, bathrooms: 2, size: "120 sqm", description: "A spacious home with plenty of natural light.", owner: "Grace Njeri" },
];

export const roommates = [
  // Candidate profiles power the roommate-matching cards.
  { id: 1, name: "Nia", age: 25, budget: 30000, match: 94, tags: ["Non-smoker", "Early riser"] },
  { id: 2, name: "Brian", age: 27, budget: 35000, match: 88, tags: ["Professional", "Quiet"] },
  { id: 3, name: "Wanjiku", age: 24, budget: 28000, match: 82, tags: ["Student", "Pet friendly"] },
];

export const conversations = [
  // Messages are copied into component state before users send new ones.
  { id: 1, name: "Amina Wanjiku", preview: "The apartment is still available.", messages: [{ text: "Hi, is this apartment still available?", fromMe: true }, { text: "Yes, it is. Would you like to arrange a viewing?", fromMe: false }] },
  { id: 2, name: "David Kimani", preview: "Viewing is available this weekend.", messages: [] },
];
