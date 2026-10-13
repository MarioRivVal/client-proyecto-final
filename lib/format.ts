import { RegistrationStatus, Sex } from "./types";

// La API devuelve las fechas en UTC; se enseñan siempre en hora de Madrid
const TIME_ZONE = "Europe/Madrid";

// '2027-03-13T09:00:00.000Z' → '10:00'
export function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("es-ES", {
    timeZone: TIME_ZONE,
    hour: "2-digit",
    minute: "2-digit",
  });
}

// '2027-03-13' → 'sábado, 13 de marzo de 2027'
export function formatDate(date: string) {
  return new Date(date).toLocaleDateString("es-ES", {
    timeZone: TIME_ZONE,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// '2026-10-05T16:22:00.000Z' → '5 oct 2026, 18:22'
export function formatDateTime(date: string) {
  return new Date(date).toLocaleString("es-ES", {
    timeZone: TIME_ZONE,
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export const STATUS_TEXTS: Record<RegistrationStatus, string> = {
  PENDING: "Pendiente",
  ACCEPTED: "Aceptada",
  REJECTED: "Rechazada",
  WITHDRAWN: "Retirada",
};

export function sexText(sex: Sex | null) {
  if (sex === null) return "—";
  return sex === "FEMALE" ? "Mujer" : "Hombre";
}

const ERROR_TEXTS: Record<string, string> = {
  INVALID_CREDENTIALS: "Email o contraseña incorrectos.",
  SLOT_FULL: "El turno ya está completo.",
  ALREADY_HAS_ACTIVE: "Ya tienes una solicitud en esta edición.",
  NOT_PENDING: "Esta solicitud ya no está pendiente.",
  REGISTRATION_CLOSED: "El plazo de solicitudes está cerrado.",
  NOT_FOUND: "No se ha encontrado.",
  VALIDATION_ERROR: "Revisa los datos del formulario.",
  ThrottlerException: "Demasiados intentos. Espera un minuto.",
};

export function errorText(code: string) {
  const key = code.split(":")[0];
  return ERROR_TEXTS[key] ?? "Algo ha fallado. Inténtalo de nuevo.";
}
