"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { apiPost } from "@/lib/api";
import { formatDate, formatDateTime, formatTime } from "@/lib/format";
import { MyRegistration } from "@/lib/types";
import styles from "./RegistrationList.module.css";

export default function RegistrationList({ registrations }: { registrations: MyRegistration[] }) {
  const [toWithdraw, setToWithdraw] = useState<MyRegistration | null>(null);

  return (
    <>
      <ul className={styles.list}>
        {registrations.map((registration) => (
          <li key={registration.id} className={`card ${styles.item}`}>
            <div className={styles.header}>
              <h3 className={styles.title}>
                {registration.event.name} {registration.event.edition}
              </h3>
              <StatusBadge status={registration.status} />
            </div>

            <p className={styles.slot}>
              {formatDate(registration.event.startsOn)} · turno de las{" "}
              {formatTime(registration.slot.startsAt)}
            </p>
            <p className={styles.sent}>Enviada el {formatDateTime(registration.createdAt)}</p>

            {registration.rejectionReason && (
              <p className={styles.reason}>Motivo: {registration.rejectionReason}</p>
            )}

            {registration.status === "PENDING" && (
              <button
                className="button button-secondary"
                onClick={() => setToWithdraw(registration)}
              >
                Retirar
              </button>
            )}
          </li>
        ))}
      </ul>

      {toWithdraw && (
        <ConfirmDialog
          title="Retirar solicitud"
          confirmText="Retirar"
          action={() => apiPost(`/me/registrations/${toWithdraw.id}/withdraw`)}
          onClose={() => setToWithdraw(null)}
        >
          <p>
            ¿Retirar tu solicitud del turno de las {formatTime(toWithdraw.slot.startsAt)}? No se
            puede deshacer, pero podrás pedir otro turno mientras el plazo siga abierto.
          </p>
        </ConfirmDialog>
      )}
    </>
  );
}
