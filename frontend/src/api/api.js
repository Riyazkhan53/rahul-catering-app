const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const {
    method = "GET",
    body,
    responseType = "json",
  } = options;

  let res;

  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        ...(body ? { "Content-Type": "application/json" } : {}),
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  } catch {
    throw new Error("Network error");
  }

  if (!res.ok) {
    // Try to extract error message safely
    let errorMessage = "Server error";
    try {
      const err = await res.json();
      errorMessage = err?.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  // ✅ THIS IS THE KEY FIX
  if (responseType === "blob") {
    return await res.blob();
  }

  // Default JSON
  return await res.json();
}