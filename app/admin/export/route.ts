import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import { API_URL } from "@/lib/api-server";

// Pide el CSV a la API con la cookie del organizador y se lo pasa tal cual al navegador
export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get("edicion");
  if (!slug) return new Response("Falta la edición.", { status: 400 });

  const session = (await cookies()).get("session");
  const response = await fetch(
    `${API_URL}/api/v1/admin/events/${encodeURIComponent(slug)}/registrations.csv`,
    {
      cache: "no-store",
      headers: session ? { Cookie: `session=${session.value}` } : {},
    },
  );

  if (!response.ok) {
    return new Response("No se ha podido descargar el CSV.", { status: response.status });
  }

  // El nombre del archivo (aceptadas-<edición>.csv) ya viene de la API
  return new Response(response.body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": response.headers.get("Content-Disposition") ?? "attachment",
    },
  });
}
