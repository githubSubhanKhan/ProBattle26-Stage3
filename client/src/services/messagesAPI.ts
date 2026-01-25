const baseURL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${baseURL}/api/messages`;

// services/messagesAPI.ts
export const searchConversations = async (userId: string, q: string) => {
  const res = await fetch(
    `${BASE_URL}/search?userId=${userId}&q=${q}`
  );
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
};