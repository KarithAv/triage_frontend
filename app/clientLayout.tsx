"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { getUser } from "@/app/utilities/session";
import { FaSpinner } from "react-icons/fa";

type Rol = "Administrador" | "Médico" | "Enfermero" | "Paciente";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  const [rol, setRol] = useState<Rol | null>(null);
  const [loading, setLoading] = useState(true);
  const [isClient, setIsClient] = useState(false);
  const isLoginPage = pathname === "/" || pathname === "/login" || pathname === "/not-authorized";

  // 🔥 Mapeo de rutas por rol (SIN CAMBIAR NOMBRES)
  const routesByRole: Record<Rol, string[]> = {
    Administrador: ["/administrator"],
    Enfermero: ["/nurse"],
    Médico: ["/doctor"],
    Paciente: ["/patient"],
  };

  useEffect(() => {
    setIsClient(true);

    const user = getUser();

    // ⛔ No autenticado → redirigir al login
    if (!user && !isLoginPage) {
      setLoading(true);
      router.replace("/");
      return;
    }

    // 🔥 Si hay usuario
    if (user) {
      const userRole = user.roleName as Rol;
      setRol(userRole);

      // Validación global de rutas por rol
      const allowedPrefixes = routesByRole[userRole] ?? [];
      const isAllowed = allowedPrefixes.some((prefix) =>
        pathname.startsWith(prefix)
      );

      // ⛔ Si la ruta NO corresponde al rol → bloquear
      if (!isAllowed && !isLoginPage) {
        router.replace("/not-authorized");
        return;
      }
    }

    setLoading(false);
  }, [pathname]);

  // Evita errores durante SSR
  if (!isClient) return null;

  // Cargando mientras se valida
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-purple-100 text-center animate-fade-in">
        <FaSpinner className="animate-spin text-6xl text-purple-600 mb-6" />
        <h1 className="text-2xl font-bold text-purple-700 mb-2">
          Validando acceso...
        </h1>
        <p className="text-gray-700 max-w-md">
          Por favor espera un momento.
        </p>
      </div>
    );
  }

  // Login sin sidebar
  if (isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  // Ruta válida por rol → render normal
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
