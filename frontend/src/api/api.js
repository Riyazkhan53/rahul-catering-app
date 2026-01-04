const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  let res;

  try {
    res = await fetch(`${API_URL}${path}`, {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(options.token && {
          Authorization: `Bearer ${options.token}`,
        }),
      },
      body: options.body ? JSON.stringify(options.body) : undefined,
    });
  } catch {
    throw new Error("Network error");
  }

  const contentType = res.headers.get("content-type");
  const data =
    contentType && contentType.includes("application/json")
      ? await res.json()
      : null;

  if (!res.ok) {
    throw new Error(data?.message || "Server error");
  }

  return data;
}