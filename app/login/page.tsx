import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm/LoginForm";
import { getSessionUser } from "@/lib/api-server";

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

  return <LoginForm next={safeNext} />;
}
