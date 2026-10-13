import Link from "next/link";
import { redirect } from "next/navigation";
import PrintButton from "@/components/PrintButton/PrintButton";
import { apiGet, getSessionUser } from "@/lib/api-server";
import { formatDate, formatTime, sexText } from "@/lib/format";
import { Event, EventRegistrations } from "@/lib/types";
import styles from "./page.module.css";

// La lista en papel para pasar lista el día del evento: aceptadas por turno, por apellido
export default async function PrintPage({
  searchParams,
}: {
  searchParams: Promise<{ edicion?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin/imprimir");
  if (user.role !== "ADMIN") redirect("/");

  const events = (await apiGet<Event[]>("/admin/events")) ?? [];
  const { edicion } = await searchParams;
  const selected = events.find((event) => event.slug === edicion) ?? events[0];
  if (!selected) return <p>Todavía no hay ninguna edición.</p>;

  const board = await apiGet<EventRegistrations>(`/admin/events/${selected.slug}/registrations`);
  const slots = board?.slots ?? [];

  return (
    <>
      <div className={`no-print ${styles.actions}`}>
        <Link href={`/admin?edicion=${selected.slug}`} className="button button-secondary">
          Volver al panel
        </Link>
        <PrintButton />
      </div>

      <h1>
        {selected.name} {selected.edition} · Aceptados
      </h1>
      <p>
        {formatDate(selected.startsOn)} · {selected.venueName}
      </p>

      {slots.map((slot) => {
        const accepted = slot.registrations
          .filter((registration) => registration.status === "ACCEPTED")
          .sort((a, b) => a.athlete.lastName.localeCompare(b.athlete.lastName, "es"));

        return (
          <section key={slot.id} className={styles.slot}>
            <h2>
              {formatTime(slot.startsAt)} – {formatTime(slot.endsAt)} · {accepted.length} /{" "}
              {slot.capacity}
            </h2>

            {accepted.length === 0 ? (
              <p>Sin atletas aceptados.</p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nº</th>
                    <th>Apellidos</th>
                    <th>Nombre</th>
                    <th>Sexo</th>
                    <th>Talla</th>
                    <th className={styles.check}>Presente</th>
                  </tr>
                </thead>
                <tbody>
                  {accepted.map((registration, index) => (
                    <tr key={registration.id}>
                      <td>{index + 1}</td>
                      <td>{registration.athlete.lastName}</td>
                      <td>{registration.athlete.firstName}</td>
                      <td>{sexText(registration.athlete.sex)}</td>
                      <td>{registration.athlete.shirtSize ?? "—"}</td>
                      <td className={styles.check}></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </section>
        );
      })}
    </>
  );
}
