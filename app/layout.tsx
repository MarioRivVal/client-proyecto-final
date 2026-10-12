import type { Metadata } from "next";
import Header from "@/components/Header/Header";
import { getSessionUser } from "@/lib/api-server";
import { archivoBlack, inter } from "./fonts";
import "./style.css";

export const metadata: Metadata = {
  title: "FORTENOW · Inscripciones",
  description: "Solicita tu turno en el clasificatorio de FORTENOW.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getSessionUser();

  return (
    <html lang="es" className={`${archivoBlack.variable} ${inter.variable}`}>
      <body>
        <Header user={user} />
        <main className="container">{children}</main>
      </body>
    </html>
  );
}
