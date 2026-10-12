import Link from "next/link";
import { SessionUser } from "@/lib/types";
import LogoutButton from "./LogoutButton";
import styles from "./Header.module.css";

export default function Header({ user }: { user: SessionUser | null }) {
  return (
    <header className={styles.header}>
      <div className={styles.content}>
        <Link href="/" className={styles.logo}>
          FORTENOW
        </Link>

        <nav className={styles.nav}>
          {user === null && (
            <Link href="/login" className="button">
              Entrar
            </Link>
          )}
          {user?.role === "ATHLETE" && (
            <Link href="/mis-solicitudes" className={styles.link}>
              Mis solicitudes
            </Link>
          )}
          {user?.role === "ADMIN" && (
            <Link href="/admin" className={styles.link}>
              Panel
            </Link>
          )}
          {user !== null && <LogoutButton />}
        </nav>
      </div>
    </header>
  );
}
