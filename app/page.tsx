import Image from "next/image";
import Link from "next/link";
import EventHero from "@/components/EventHero/EventHero";
import SlotList from "@/components/SlotList/SlotList";
import { apiGet, getSessionUser } from "@/lib/api-server";
import { formatDate } from "@/lib/format";
import { CurrentEvent, MyRegistration } from "@/lib/types";
import arena from "@/public/images/competition.jpg";
import styles from "./page.module.css";

export default async function HomePage() {
  const event = await apiGet<CurrentEvent>("/events/current");
  const user = await getSessionUser();

  if (!event) {
    return <p>Todavía no hay ninguna edición publicada.</p>;
  }

  // Si es un atleta, su solicitud activa de esta edición (si la tiene) se marca en su turno
  let activeRegistration: MyRegistration | null = null;
  if (user?.role === "ATHLETE") {
    const registrations = (await apiGet<MyRegistration[]>("/me/registrations")) ?? [];
    activeRegistration =
      registrations.find(
        (registration) =>
          registration.event.id === event.id &&
          (registration.status === "PENDING" || registration.status === "ACCEPTED"),
      ) ?? null;
  }

  return (
    <>
      {/* Atleta y organizador ven la misma portada; esto deja claro con qué cuenta se está */}
      {user?.role === "ATHLETE" && (
        <p className={styles.view}>
          <strong>Vista de atleta</strong> · Hola, {user.firstName}. Elige turno y pulsa
          “Solicitar”.
        </p>
      )}
      {user?.role === "ADMIN" && (
        <p className={styles.view}>
          <strong>Vista de administrador</strong> · Aquí solo se consultan los turnos. Las
          solicitudes se deciden en el <Link href="/admin">Panel</Link>.
        </p>
      )}

      <EventHero event={event} />

      <section className={styles.steps}>
        <div>
          <h2>Cómo funciona</h2>
          <ol>
            <li>Elige un turno de 45 minutos con plazas libres y pulsa “Solicitar”.</li>
            <li>El organizador revisa las solicitudes y acepta o rechaza la tuya.</li>
            <li>
              Consulta la respuesta en “Mis solicitudes”. Solo puedes tener una por edición.
            </li>
          </ol>
          <p className={styles.deadline}>
            Solicitudes abiertas hasta el {formatDate(event.registrationClosesAt)}.
          </p>
        </div>
        <Image
          src={arena}
          alt="Atletas calentando en las calles de la pista de competición"
          className={styles.photo}
          sizes="(min-width: 768px) 540px, 100vw"
        />
      </section>

      <SlotList
        slots={event.slots}
        registrationOpen={event.registrationOpen}
        role={user?.role ?? null}
        activeRegistration={activeRegistration}
      />
    </>
  );
}
