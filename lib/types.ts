// Lo que devuelve la API

export type Role = "ATHLETE" | "ADMIN";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}
