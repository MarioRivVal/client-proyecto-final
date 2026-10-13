import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm/LoginForm";
import { getSessionUser } from "@/lib/api-server";
import styles from "./page.module.css";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const user = await getSessionUser();
  if (user) redirect(user.role === "ADMIN" ? "/admin" : "/");

  // Solo rutas de esta web: '//otra-web.com' llevaría fuera
  const { next } = await searchParams;
  const safeNext = next?.startsWith("/") && !next.startsWith("//") ? next : undefined;

  return (
    <div className={styles.layout}>
      <div className={styles.photo} />
      <LoginForm next={safeNext} />
    </div>
  );
}
