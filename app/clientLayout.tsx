"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { usePathname, useRouter } from "next/navigation";
import { getUser } from "@/app/utilities/session";
import { FaSpinner } from "react-icons/fa";

type Rol = "Administrador" | "Medico" | "Enfermero" | "Paciente";

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
  const isLoginPage = pathname === "/" || pathname === "/login";

  useEffect(() => {
    setIsClient(true);

    const user = getUser();

    if (!user && !isLoginPage) {
      setLoading(true);
      const timer = setTimeout(() => {
        router.replace("/");
      }, 3000);
      return () => clearTimeout(timer);
    }

    if (user) {
      setRol(user.roleName);
    }

    setLoading(false);
  }, [pathname]);

  if (!isClient) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-b from-purple-50 to-purple-100 text-center animate-fade-in">
        <FaSpinner className="animate-spin text-6xl text-purple-600 mb-6" />
        <h1 className="text-2xl font-bold text-purple-700 mb-2">
          Acceso no autorizado
        </h1>
        <p className="text-gray-700 max-w-md">
          No puedes acceder sin iniciar sesión.
          <br />
          Serás redirigido al login automáticamente...
        </p>
      </div>
    );
  }

  if (isLoginPage) {
    return <main className="min-h-screen">{children}</main>;
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-6 bg-gray-50">{children}</main>
    </div>
  );
}
