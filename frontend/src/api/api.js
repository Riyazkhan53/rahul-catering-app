const BASE_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
    method: options.method || "GET",
  });

  // 👇 SAFE PARSING
  const text = await res.text();
  let data = {};

  try {
    data = text ? JSON.parse(text) : {};
  } catch (err) {
    console.error("Invalid JSON from server:", text);
  }

  if (!res.ok) {
    throw new Error(data.message || "Server error");
  }

  return data;
}