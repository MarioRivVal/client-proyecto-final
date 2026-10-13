// Lo que devuelve la API

export type Role = "ATHLETE" | "ADMIN";

export type RegistrationStatus = "PENDING" | "ACCEPTED" | "REJECTED" | "WITHDRAWN";

export interface SessionUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: Role;
}

export interface Event {
  id: string;
  slug: string;
  name: string;
  edition: number;
  startsOn: string;
  venueName: string;
  venueAddress: string;
  registrationOpensAt: string;
  registrationClosesAt: string;
}

export interface Slot {
  id: string;
  code: string;
  startsAt: string;
  endsAt: string;
  capacity: number;
}

export interface SlotWithPlaces extends Slot {
  freePlaces: number;
}

export interface CurrentEvent extends Event {
  registrationOpen: boolean;
  slots: SlotWithPlaces[];
}

export type Sex = "MALE" | "FEMALE";

export interface AdminRegistration {
  id: string;
  status: RegistrationStatus;
  rejectionReason: string | null;
  createdAt: string;
  decidedAt: string | null;
  athlete: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    sex: Sex | null;
    shirtSize: string | null;
  };
}

export interface AdminSlot extends Slot {
  accepted: number;
  registrations: AdminRegistration[];
}

export interface EventRegistrations {
  event: Pick<Event, "slug" | "name" | "edition" | "startsOn">;
  slots: AdminSlot[];
}

export interface MyRegistration {
  id: string;
  status: RegistrationStatus;
  rejectionReason: string | null;
  createdAt: string;
  event: Event;
  slot: Slot;
}
