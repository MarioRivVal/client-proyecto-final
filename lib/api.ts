// Llamadas a la API desde el navegador. Misma web y misma API: basta la ruta relativa

export async function apiPost<T>(path: string, body?: unknown): Promise<T> {
  const response = await fetch(`/api/v1${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    // El código ('SLOT_FULL'…) lo traduce useApiAction
    throw new Error(error.code ?? "UNKNOWN");
  }

  return response.status === 204 ? (undefined as T) : response.json();
}
