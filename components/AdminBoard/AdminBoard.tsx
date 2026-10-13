"use client";

import { useState } from "react";
import ConfirmDialog from "@/components/ConfirmDialog/ConfirmDialog";
import StatusBadge from "@/components/StatusBadge/StatusBadge";
import { Tab, useRegistrationFilters } from "@/hooks/useRegistrationFilters";
import { apiPost } from "@/lib/api";
import { formatDateTime, formatTime, sexText, STATUS_TEXTS } from "@/lib/format";
import { AdminRegistration, AdminSlot } from "@/lib/types";
import styles from "./AdminBoard.module.css";

const TABS: { id: Tab; label: string }[] = [
  { id: "PENDING", label: "Pendientes" },
  { id: "ACCEPTED", label: "Aceptadas" },
  { id: "CLOSED", label: "Rechazadas y retiradas" },
];

// '3 mujeres · 2 hombres', contando solo las aceptadas
function sexSummary(registrations: AdminRegistration[]) {
  const accepted = registrations.filter((registration) => registration.status === "ACCEPTED");
  const women = accepted.filter((registration) => registration.athlete.sex === "FEMALE").length;
  const men = accepted.filter((registration) => registration.athlete.sex === "MALE").length;
  const womenText = `${women} ${women === 1 ? "mujer" : "mujeres"}`;
  const menText = `${men} ${men === 1 ? "hombre" : "hombres"}`;
  return `${womenText} · ${menText}`;
}

function fullName(registration: AdminRegistration) {
  return `${registration.athlete.firstName} ${registration.athlete.lastName}`;
}

interface ToAccept {
  registration: AdminRegistration;
  slot: AdminSlot;
}

interface Props {
  slots: AdminSlot[];
  readOnly: boolean;
}

export default function AdminBoard({ slots, readOnly }: Props) {
  const { tab, setTab, search, setSearch, filteredSlots, counts } = useRegistrationFilters(slots);
  const [success, setSuccess] = useState<string | null>(null);
  const [toAccept, setToAccept] = useState<ToAccept | null>(null);
  const [toReject, setToReject] = useState<AdminRegistration | null>(null);
  const [reason, setReason] = useState("");

  const allRegistrations = slots.flatMap((slot) => slot.registrations);
  const capacity = slots.reduce((total, slot) => total + slot.capacity, 0);

  function openReject(registration: AdminRegistration) {
    setReason("");
    setToReject(registration);
  }

  return (
    <section>
      <p className={styles.summary}>
        Aceptadas: {counts.ACCEPTED} / {capacity} plazas · {sexSummary(allRegistrations)}
      </p>

      {readOnly && <p className={styles.notice}>Edición anterior: solo se puede consultar.</p>}

      <div className={styles.tabs}>
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={id === tab ? `${styles.tab} ${styles.active}` : styles.tab}
            onClick={() => setTab(id)}
            aria-pressed={id === tab}
          >
            {label} ({counts[id]})
          </button>
        ))}
      </div>

      <div className={`field ${styles.search}`}>
        <label htmlFor="search">Buscar por nombre</label>
        <input
          id="search"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Nombre o apellidos"
        />
      </div>

      {success && <p className="message-success">{success}</p>}

      {filteredSlots.length === 0 && (
        <p className={styles.empty}>
          {search ? `Nadie coincide con “${search}”.` : "No hay solicitudes en esta pestaña."}
        </p>
      )}

      <ul className={styles.slots}>
        {filteredSlots.map((slot) => {
          const isFull = slot.accepted >= slot.capacity;

          return (
            <li key={slot.id} className="card">
              <div className={styles.heading}>
                <h3 className={styles.time}>
                  {formatTime(slot.startsAt)} – {formatTime(slot.endsAt)}
                </h3>
                <p className={isFull ? styles.full : styles.occupancy}>
                  {slot.accepted} / {slot.capacity} plazas · {sexSummary(slot.registrations)}
                </p>
              </div>

              <ul className={styles.registrations}>
                {slot.matches.map((registration) => (
                  <li key={registration.id} className={styles.registration}>
                    {/* Mismo name en todas: al abrir una ficha, el navegador cierra la anterior */}
                    <details name="registration" className={styles.details}>
                      <summary className={styles.title}>
                        <span className={styles.who}>
                          <strong>{fullName(registration)}</strong>
                          <span className={styles.contact}>{registration.athlete.email}</span>
                          <span className={styles.contact}>
                            {registration.athlete.phone ?? "Sin teléfono"}
                          </span>
                        </span>
                        {tab !== "PENDING" && <StatusBadge status={registration.status} />}
                        <span className={styles.arrow} aria-hidden="true">
                          ▾
                        </span>
                      </summary>

                      <dl className={styles.data}>
                        <dt>Sexo</dt>
                        <dd>{sexText(registration.athlete.sex)}</dd>
                        <dt>Talla</dt>
                        <dd>{registration.athlete.shirtSize ?? "—"}</dd>
                        <dt>Enviada</dt>
                        <dd>{formatDateTime(registration.createdAt)}</dd>
                        {registration.decidedAt && (
                          <>
                            <dt>{STATUS_TEXTS[registration.status]}</dt>
                            <dd>{formatDateTime(registration.decidedAt)}</dd>
                          </>
                        )}
                        {registration.rejectionReason && (
                          <>
                            <dt>Motivo</dt>
                            <dd>{registration.rejectionReason}</dd>
                          </>
                        )}
                      </dl>

                      {registration.status === "PENDING" && !readOnly && (
                        <div className={styles.actions}>
                          <button
                            className="button"
                            onClick={() => setToAccept({ registration, slot })}
                            disabled={isFull}
                          >
                            Aceptar
                          </button>
                          <button
                            className="button button-secondary"
                            onClick={() => openReject(registration)}
                          >
                            Rechazar
                          </button>
                          {isFull && <p className={styles.fullNote}>El turno ya está completo.</p>}
                        </div>
                      )}
                    </details>
                  </li>
                ))}
              </ul>
            </li>
          );
        })}
      </ul>

      {toAccept && (
        <ConfirmDialog
          title="Aceptar solicitud"
          confirmText="Aceptar"
          action={() => apiPost(`/admin/registrations/${toAccept.registration.id}/accept`)}
          onSuccess={() => setSuccess(`Aceptada: ${fullName(toAccept.registration)}.`)}
          onClose={() => setToAccept(null)}
        >
          <p>
            ¿Aceptar a <strong>{fullName(toAccept.registration)}</strong> en el turno de las{" "}
            {formatTime(toAccept.slot.startsAt)}? Ocupará una de sus {toAccept.slot.capacity}{" "}
            plazas.
          </p>
        </ConfirmDialog>
      )}

      {toReject && (
        <ConfirmDialog
          title="Rechazar solicitud"
          confirmText="Rechazar"
          action={() =>
            apiPost(`/admin/registrations/${toReject.id}/reject`, {
              reason: reason.trim() || undefined,
            })
          }
          onSuccess={() => setSuccess(`Rechazada: ${fullName(toReject)}.`)}
          onClose={() => setToReject(null)}
        >
          <p>
            ¿Rechazar la solicitud de <strong>{fullName(toReject)}</strong>? El atleta verá el
            motivo en sus solicitudes.
          </p>
          <div className="field">
            <label htmlFor="reason">Motivo (opcional)</label>
            <textarea
              id="reason"
              rows={3}
              maxLength={200}
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              placeholder="Turno completo, prueba el de las 12:15"
            />
          </div>
        </ConfirmDialog>
      )}
    </section>
  );
}
