"use client";

import { useRouter } from "next/navigation";
import { FormEvent } from "react";
import { useApiAction } from "@/hooks/useApiAction";
import { apiPost } from "@/lib/api";
import { Role } from "@/lib/types";
import styles from "./LoginForm.module.css";

interface LoginResponse {
  firstName: string;
  role: Role;
}

export default function LoginForm({ next }: { next?: string }) {
  const router = useRouter();
  const { run, isPending, error } = useApiAction();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);

    run(
      () =>
        apiPost<LoginResponse>("/auth/login", {
          email: form.get("email"),
          password: form.get("password"),
        }),
      (user) => router.push(next ?? (user.role === "ADMIN" ? "/admin" : "/")),
    );
  }

  return (
    <form className={`card ${styles.form}`} onSubmit={handleSubmit}>
      <h1>Entrar</h1>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input id="email" name="email" type="email" autoComplete="email" required />
      </div>

      <div className="field">
        <label htmlFor="password">Contraseña</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          required
        />
      </div>

      {error && <p className="message-error">{error}</p>}

      <button className={`button ${styles.submit}`} disabled={isPending}>
        {isPending ? "Entrando…" : "Entrar"}
      </button>

      <p className={styles.help}>¿No tienes usuario? Pídeselo al organizador.</p>
    </form>
  );
}
