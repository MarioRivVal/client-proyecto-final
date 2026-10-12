import { cookies } from "next/headers";
import { SessionUser } from "./types";

const API_URL = process.env.API_INTERNAL_URL ?? "http://localhost:3200";

// Llamadas a la API desde el servidor de Next, reenviando la cookie de sesión del usuario.
// Devuelve null si no hay sesión, no tiene permiso o no existe.
export async function apiGet<T>(path: string): Promise<T | null> {
  const session = (await cookies()).get("session");

  const response = await fetch(`${API_URL}/api/v1${path}`, {
    cache: "no-store",
    headers: session ? { Cookie: `session=${session.value}` } : {},
  });

  if ([401, 403, 404].includes(response.status)) return null;
  if (!response.ok) throw new Error(`API ${response.status} en GET ${path}`);

  return response.json();
}

export function getSessionUser() {
  return apiGet<SessionUser>("/auth/me");
}
