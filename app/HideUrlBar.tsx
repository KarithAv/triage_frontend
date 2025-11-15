"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function HideUrlBar() {
  const pathname = usePathname();

  useEffect(() => {
    // No ocultar URL en login
    if (pathname === "/") return;

    // Cambiar solo lo visible en la barra del navegador
    window.history.replaceState(null, "", "/app");

  }, [pathname]);

  return null;
}
