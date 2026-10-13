"use client";

export default function PrintButton() {
  return (
    <button className="button" onClick={() => window.print()}>
      Imprimir
    </button>
  );
}
