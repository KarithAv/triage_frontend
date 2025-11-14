"use client";

import Link from "next/link";
import { Users, UserPlus, ClipboardList, LogOut, Activity } from "lucide-react";
import { JSX, useEffect, useState } from "react";
import { getUser, logout } from "../app/utilities/session";

type Rol = "Administrador" | "Médico" | "Enfermero" | "Paciente";

interface UserData {
  id: number;
  firstNameUs: string;
  lastNameUs: string;
  roleIdUs: number;
}

// 🔥 MAPEO REAL según roleIdUs de tu BD
const roleMap: Record<number, Rol> = {
  1: "Administrador",
  2: "Enfermero",
  3: "Paciente",
  4: "Médico",
};

const menuByRol: Record<
  Rol,
  {
    name: string;
    path?: string;
    icon?: JSX.Element;
    children?: { name: string; path: string; icon?: JSX.Element }[];
  }[]
> = {
  Administrador: [
    { name: "INICIO", path: "/administrator" },
    { name: "GESTIÓN DE USUARIOS", path: "/administrator/users" },
    { name: "REPORTES", path: "/administrator/reports" },
    { name: "ESTADÍSTICAS", path: "/administrator/dashboard" },
  ],
  Enfermero: [
    { name: "INICIO", path: "/nurse" },
    {
      name: "PACIENTES",
      children: [
        {
          name: "Lista de Pacientes",
          path: "/nurse/patients/patientsList",
          icon: <ClipboardList size={16} />,
        },
        {
          name: "Nuevo Paciente",
          path: "/nurse/patients/registerPatient",
          icon: <UserPlus size={16} />,
        },
      ],
    },
    {
      name: "REGISTRO CLÍNICO",
      children: [
        {
          name: "Signos Vitales y Sintomas",
          path: "/nurse/triage/register",
          icon: <Activity size={16} />,
        },
      ],
    },
    { name: "ALERTAS", path: "/nurse/alerts" },
  ],
  Médico: [
    { name: "INICIO", path: "/doctor" },
    { name: "GESTIÓN DE CONSULTAS", path: "/doctor/triagePatientList" },
  ],
  Paciente: [
    { name: "INICIO", path: "/patient" },
    { name: "MI ESTADO", path: "/patient/status" },
    { name: "HISTORIAL DE ATENCIÓN", path: "/patient/clinicHistory" },
  ],
};

export default function Sidebar() {
  const [user, setUser] = useState<UserData | null>(null);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [roleName, setRoleName] = useState<Rol | null>(null);

  useEffect(() => {
    const u = getUser();
    if (u) {
      setUser(u);

      // 🔥 MAPEAR roleIdUs → roleName real
      const mapped = roleMap[u.roleIdUs];
      setRoleName(mapped);
    }
  }, []);

  if (!user || !roleName) return null;

  const menu = menuByRol[roleName];

  return (
    <aside className="fixed top-0 left-0 h-screen w-64 green-bg text-white flex flex-col shadow-xl">
      {/* Header */}
      <div className="purple-bg h-20 flex items-center px-6">
        <img src="/images/Cerebro.png" alt="Logo" className="h-12 mr-3" />
        <span className="text-white font-extrabold text-lg">Intelligent TriAge</span>
      </div>

      {/* Usuario */}
      <div className="flex flex-col items-center py-6 border-b border-white/30">
        <div className="w-16 h-16 rounded-full bg-white/30 flex items-center justify-center">
          <span className="text-2xl">👤</span>
        </div>
        <p className="mt-2 font-semibold">
          {user.firstNameUs} {user.lastNameUs}
        </p>

        {/* Solo mostrar nombre del rol */}
        <p className="text-sm opacity-80 capitalize">{roleName}</p>
      </div>

      {/* Menú */}
      <nav className="flex-1 px-4 py-6 space-y-3">
        {menu.map((item) =>
          item.children ? (
            <div key={item.name}>
              <button
                onClick={() =>
                  setOpenSubmenu(openSubmenu === item.name ? null : item.name)
                }
                className="w-full p-3 rounded-lg bg-white/20 hover:bg-white/30 font-bold transition flex justify-between items-center"
              >
                {item.name}
                <span>{openSubmenu === item.name ? "▲" : "▼"}</span>
              </button>

              {openSubmenu === item.name && (
                <div className="ml-4 mt-2 space-y-2">
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      href={child.path}
                      className="flex items-center gap-2 text-sm hover:underline"
                    >
                      {child.icon} {child.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <Link
              key={item.path}
              href={item.path ?? "#"}
              className="block w-full p-3 rounded-lg bg-white/20 hover:bg-white/30 font-bold transition text-center"
            >
              {item.icon} {item.name}
            </Link>
          )
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-white/30">
        <button
          onClick={logout}
          className="block w-full p-3 rounded-lg bg-white/20 hover:bg-white/30 font-bold transition text-center flex items-center justify-center gap-2"
        >
          <LogOut size={18} /> CERRAR SESIÓN
        </button>
      </div>
    </aside>
  );
}
