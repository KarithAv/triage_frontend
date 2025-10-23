import React from "react";

// Sintaxis de Función Normal (Declaración de Función)
export default function Badge({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <span
      // Clases base para el estilo del Badge, combinadas con las clases dinámicas (className)
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${className}`}
    >
      {children}
    </span>
  );
}
