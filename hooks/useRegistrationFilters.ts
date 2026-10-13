"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { AdminSlot, RegistrationStatus } from "@/lib/types";

export type Tab = "PENDING" | "ACCEPTED" | "CLOSED";

const TAB_STATUSES: Record<Tab, RegistrationStatus[]> = {
  PENDING: ["PENDING"],
  ACCEPTED: ["ACCEPTED"],
  CLOSED: ["REJECTED", "WITHDRAWN"],
};

// 'Gómez' → 'gomez': el buscador no distingue mayúsculas ni tildes
function normalize(text: string) {
  return text.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

// Pestaña de estado + buscador por nombre sobre los turnos del panel. Con useDeferredValue
// el input responde al momento y el filtrado va detrás, sin frenar la escritura.
export function useRegistrationFilters(slots: AdminSlot[]) {
  const [tab, setTab] = useState<Tab>("PENDING");
  const [search, setSearch] = useState("");
  const deferredSearch = useDeferredValue(search);

  // Cada turno con sus solicitudes que encajan (matches); los que no tienen ninguna no se enseñan
  const filteredSlots = useMemo(() => {
    const text = normalize(deferredSearch.trim());

    return slots
      .map((slot) => ({
        ...slot,
        matches: slot.registrations.filter(
          (registration) =>
            TAB_STATUSES[tab].includes(registration.status) &&
            normalize(
              `${registration.athlete.firstName} ${registration.athlete.lastName}`,
            ).includes(text),
        ),
      }))
      .filter((slot) => slot.matches.length > 0);
  }, [slots, tab, deferredSearch]);

  // Cuántas hay en cada pestaña, para el texto del botón
  const counts = useMemo(() => {
    const registrations = slots.flatMap((slot) => slot.registrations);
    const count = (tab: Tab) =>
      registrations.filter((registration) => TAB_STATUSES[tab].includes(registration.status))
        .length;

    return { PENDING: count("PENDING"), ACCEPTED: count("ACCEPTED"), CLOSED: count("CLOSED") };
  }, [slots]);

  return { tab, setTab, search, setSearch, filteredSlots, counts };
}
