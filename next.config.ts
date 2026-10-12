import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,

  // Web y API comparten dominio: el navegador llama siempre a /api/v1/…
  // En producción esa ruta la manda Coolify a la API; en desarrollo la reenvía Next.
  async rewrites() {
    if (process.env.NODE_ENV === "production") return [];
    const api = process.env.API_INTERNAL_URL ?? "http://localhost:3200";
    return [{ source: "/api/:path*", destination: `${api}/api/:path*` }];
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        ],
      },
    ];
  },
};

export default nextConfig;
