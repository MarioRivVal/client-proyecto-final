"use client";

import { ReactNode, useEffect, useRef } from "react";
import { useApiAction } from "@/hooks/useApiAction";
import styles from "./ConfirmDialog.module.css";

interface Props {
  title: string;
  children: ReactNode;
  confirmText: string;
  action: () => Promise<unknown>;
  onSuccess?: () => void;
  onClose: () => void;
}

// Ventana de confirmación con <dialog>: el foco, la tecla Esc y el fondo oscuro los pone el
// navegador. Se monta solo mientras está abierta, así cada vez empieza sin el error de la anterior.
export default function ConfirmDialog({
  title,
  children,
  confirmText,
  action,
  onSuccess,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const { run, isPending, error } = useApiAction();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (dialog && !dialog.open) dialog.showModal();
  }, []);

  function handleConfirm() {
    run(action, () => {
      onSuccess?.();
      onClose();
    });
  }

  return (
    <dialog ref={dialogRef} className={styles.dialog} onClose={onClose}>
      <h2>{title}</h2>
      {children}

      {error && <p className="message-error">{error}</p>}

      <div className={styles.actions}>
        <button className="button button-secondary" onClick={onClose} disabled={isPending}>
          Cancelar
        </button>
        <button className="button" onClick={handleConfirm} disabled={isPending}>
          {isPending ? "Enviando…" : confirmText}
        </button>
      </div>
    </dialog>
  );
}
