const API_URL = import.meta.env.VITE_API_URL || (import.meta.env.DEV ? "/api" : "http://127.0.0.1:8000");
const COLLECTION_PATHS = new Set([
  "/properties",
  "/roommates",
  "/saved-listings",
  "/messages",
  "/viewings",
]);

function getErrorMessage(detail) {
  if (typeof detail === "string") return detail;

  // FastAPI validation failures return an array of objects. Convert those
  // objects into text before displaying them in the UI.
  if (Array.isArray(detail)) {
    const messages = detail
      .map((item) => {
        if (typeof item === "string") return item;
        if (!item || typeof item !== "object") return "";
        const field = Array.isArray(item.loc) ? item.loc.at(-1) : "";
        return field ? `${field}: ${item.msg || "Invalid value"}` : item.msg;
      })
      .filter(Boolean);
    if (messages.length) return messages.join(". ");
  }

  return "Something went wrong. Please try again.";
}

export async function apiRequest(path, options = {}) {
  const [pathname, query] = path.split("?");
  const normalizedPath = COLLECTION_PATHS.has(pathname) ? `${pathname}/` : pathname;
  const requestPath = query ? `${normalizedPath}?${query}` : normalizedPath;
  let response;
  try {
    response = await fetch(`${API_URL}${requestPath}`, {
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });
  } catch {
    throw new Error("Cannot connect to the KejaHunt API. Make sure the API is running, then try again.");
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(getErrorMessage(body.detail));
  }

  if (response.status === 204) return null;
  const body = await response.text();
  return body ? JSON.parse(body) : null;
}
