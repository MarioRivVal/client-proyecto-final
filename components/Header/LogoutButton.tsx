"use client";

import { useRouter } from "next/navigation";
import { useApiAction } from "@/hooks/useApiAction";
import { apiPost } from "@/lib/api";
import styles from "./Header.module.css";

export default function LogoutButton() {
  const router = useRouter();
  const { run, isPending } = useApiAction();

  function logout() {
    run(() => apiPost("/auth/logout"), () => router.push("/"));
  }

  return (
    <button className={styles.logout} onClick={logout} disabled={isPending}>
      Salir
    </button>
  );
}
