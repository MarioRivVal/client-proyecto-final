import localFont from "next/font/local";

// Fuentes en local: el build de Coolify no siempre llega a Google Fonts
export const archivoBlack = localFont({
  src: "./_fonts/archivo-black-400.woff2",
  weight: "400",
  variable: "--font-archivo-black",
  display: "swap",
});

export const inter = localFont({
  src: [
    { path: "./_fonts/inter-400.woff2", weight: "400" },
    { path: "./_fonts/inter-500.woff2", weight: "500" },
    { path: "./_fonts/inter-700.woff2", weight: "700" },
  ],
  variable: "--font-inter",
  display: "swap",
});
