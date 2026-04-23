const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "/api";

export async function fetchApi<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {})
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(body || "Request failed");
  }

  return response.json() as Promise<T>;
}

export { API_URL };
