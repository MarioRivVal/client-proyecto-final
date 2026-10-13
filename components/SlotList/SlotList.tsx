"use client";

import Link from "next/link";
import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { apiPost } from "@/lib/api";
import { formatTime } from "@/lib/format";
import { MyRegistration, Role, SlotWithPlaces } from "@/lib/types";
import styles from "./SlotList.module.css";

interface Props {
  slots: SlotWithPlaces[];
  registrationOpen: boolean;
  role: Role | null;
  activeRegistration: MyRegistration | null;
}

export default function SlotList({ slots, registrationOpen, role, activeRegistration }: Props) {
  const [toRequest, setToRequest] = useState<SlotWithPlaces | null>(null);
  const [success, setSuccess] = useState(false);

  // Un atleta solo puede tener una solicitud activa por edición
  const canRequest = registrationOpen && role !== "ADMIN" && activeRegistration === null;

  return (
    <section>
      <h2>Turnos</h2>

      {!registrationOpen && <p className="message-error">El plazo de solicitudes está cerrado.</p>}
      {success && (
        <p className="message-success">Solicitud enviada: el organizador te responderá.</p>
      )}

      <ul className={styles.list}>
        {slots.map((slot) => {
          const myStatus =
            activeRegistration?.slot.id === slot.id ? activeRegistration.status : null;
          const isFull = slot.freePlaces === 0;

          return (
            <li key={slot.id} className={`card ${styles.item}`}>
              <p className={styles.time}>{formatTime(slot.startsAt)}</p>
              <p className={styles.until}>hasta las {formatTime(slot.endsAt)}</p>
              <p className={isFull ? styles.full : styles.places}>
                {isFull
                  ? "Completo"
                  : `${slot.freePlaces} ${slot.freePlaces === 1 ? "plaza libre" : "plazas libres"}`}
              </p>

              {myStatus && (
                <p className={styles.mine}>
                  Tu solicitud: <StatusBadge status={myStatus} />
                </p>
              )}

              {canRequest && !isFull && role === null && (
                <Link href="/login?next=/" className="button">
                  Solicitar
                </Link>
              )}
              {canRequest && !isFull && role === "ATHLETE" && (
                <button className="button" onClick={() => setToRequest(slot)}>
                  Solicitar
                </button>
              )}
            </li>
          );
        })}
      </ul>

      {toRequest && (
        <ConfirmDialog
          title="Solicitar turno"
          confirmText="Solicitar"
          action={() => apiPost("/me/registrations", { slotId: toRequest.id })}
          onSuccess={() => setSuccess(true)}
          onClose={() => setToRequest(null)}
        >
          <p>
            ¿Solicitar el turno de las {formatTime(toRequest.startsAt)} a las{" "}
            {formatTime(toRequest.endsAt)}? El organizador te responderá.
          </p>
        </ConfirmDialog>
      )}
    </section>
  );
}
