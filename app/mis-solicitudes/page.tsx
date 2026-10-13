import Link from "next/link";
import { redirect } from "next/navigation";
import RegistrationList from "@/components/RegistrationList/RegistrationList";
import { apiGet, getSessionUser } from "@/lib/api-server";
import { CurrentEvent, MyRegistration } from "@/lib/types";

export default async function MyRegistrationsPage() {
  const user = await getSessionUser();
  if (!user) redirect("/login?next=/mis-solicitudes");
  if (user.role === "ADMIN") redirect("/admin");

  const event = await apiGet<CurrentEvent>("/events/current");
  const registrations = (await apiGet<MyRegistration[]>("/me/registrations")) ?? [];

  const current = registrations.filter((registration) => registration.event.id === event?.id);
  const previous = registrations.filter((registration) => registration.event.id !== event?.id);

  return (
    <>
      <h1>Mis solicitudes</h1>

      <section>
        <h2>
          {event?.name} {event?.edition}
        </h2>
        <p>
          <Link href="/" className="button button-secondary">
            ← Volver a los turnos
          </Link>
        </p>
        {current.length > 0 ? (
          <RegistrationList registrations={current} />
        ) : (
          <p>
            Aún no has solicitado turno en esta edición. <Link href="/">Ver turnos</Link>
          </p>
        )}
      </section>

      {previous.length > 0 && (
        <section>
          <h2>Ediciones anteriores</h2>
          <RegistrationList registrations={previous} />
        </section>
      )}
    </>
  );
}
