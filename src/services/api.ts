const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!BASE_URL) {
  throw new Error("Missing NEXT_PUBLIC_API_URL");
}

export async function apiFetch(
  path: string,
  options: RequestInit = {}
) {
  const res = await fetch(BASE_URL + path, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    let message = "API Error";

    try {
      const data = await res.json();
      message = data.message || message;
    } catch {}

    throw new Error(message);
  }

  return res.json();
}
