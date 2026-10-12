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
