const API_URL = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  const res = await fetch(`${API_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.token && {
        Authorization: `Bearer ${options.token}`,
      }),
    },
    method: options.method || "GET",
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  // 👇 SAFETY CHECK
  let data = null;
  const contentType = res.headers.get("content-type");

  if (contentType && contentType.includes("application/json")) {
    data = await res.json();
  }

  if (!res.ok) {
    throw new Error(data?.message || "Server error");
  }

  return data;
}