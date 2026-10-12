"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { errorText } from "@/lib/format";

// Lanza una llamada a la API con estado "enviando" y error ya traducido.
// Al terminar, router.refresh() vuelve a pedir los datos de la página al servidor.
export function useApiAction() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function run<T>(action: () => Promise<T>, onSuccess?: (result: T) => void) {
    setError(null);
    startTransition(async () => {
      try {
        const result = await action();
        onSuccess?.(result);
        router.refresh();
      } catch (e) {
        setError(errorText(e instanceof Error ? e.message : ""));
      }
    });
  }

  return { run, isPending, error };
}
