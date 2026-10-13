import Link from "next/link";
import { redirect } from "next/navigation";
import AdminBoard from "@/components/AdminBoard/AdminBoard";
import { apiGet, getSessionUser } from "@/lib/api-server";
import { formatDate } from "@/lib/format";
import { Event, EventRegistrations } from "@/lib/types";
import styles from "./page.module.css";

export default async function AdminPage({
  searchParams,
}: {
  searchParams: Promise<{ edicion?: string }>;
}) {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");

  // La API las da de la más reciente a la más antigua: la primera es la actual
  const events = (await apiGet<Event[]>("/admin/events")) ?? [];
  if (events.length === 0) return <p>Todavía no hay ninguna edición.</p>;

  const { edicion } = await searchParams;
  const selected = events.find((event) => event.slug === edicion) ?? events[0];
  const board = await apiGet<EventRegistrations>(`/admin/events/${selected.slug}/registrations`);

  return (
    <>
      <div className={styles.top}>
        <h1 className={styles.title}>
          Panel · {selected.name} {selected.edition}
        </h1>
        <div className={styles.links}>
          <Link
            href={`/admin/imprimir?edicion=${selected.slug}`}
            className="button button-secondary"
          >
            Imprimir lista
          </Link>
          {/* <a> y no <Link>: es una descarga, no una página */}
          <a href={`/admin/export?edicion=${selected.slug}`} className="button button-secondary">
            CSV de aceptadas
          </a>
        </div>
      </div>

      <p className={styles.date}>{formatDate(selected.startsOn)}</p>

      <nav className={styles.editions} aria-label="Ediciones">
        {events.map((event) => {
          const isSelected = event.id === selected.id;
          return (
            <Link
              key={event.id}
              href={`/admin?edicion=${event.slug}`}
              className={isSelected ? `${styles.edition} ${styles.current}` : styles.edition}
              aria-current={isSelected ? "page" : undefined}
            >
              {event.edition}
            </Link>
          );
        })}
      </nav>

      {/* key: al cambiar de edición, pestaña y buscador empiezan de cero */}
      <AdminBoard
        key={selected.slug}
        slots={board?.slots ?? []}
        readOnly={selected.id !== events[0].id}
      />
    </>
  );
}
