import Cookies from "js-cookie";
import AuthService from "@/app/services/authService";

/* =====================================================
   Obtener usuario desde la cookie visible
===================================================== */
export function getUser() {
  const saved = Cookies.get("user");
  if (!saved) return null;

  try {
    return JSON.parse(saved); // { id, firstNameUs, lastNameUs, roleIdUs }
  } catch {
    return null;
  }
}

/* =====================================================
   Obtener ID del usuario
===================================================== */
export function getUserId() {
  const user = getUser();
  return user ? user.id : null;
}

/* =====================================================
   Mapeo REAL de roles según la base de datos
===================================================== */
const roleMap: Record<number, string> = {
  1: "Administrador",
  2: "Enfermero",
  3: "Paciente",
  4: "Médico",
};

/* =====================================================
   Obtener nombre del rol desde roleIdUs
===================================================== */
export function getRoleName() {
  const user = getUser();
  if (!user) return null;

  return roleMap[user.roleIdUs] ?? null;
}

/* =====================================================
   Obtener nombre completo del usuario
===================================================== */
export function getUserName() {
  const user = getUser();
  return user ? `${user.firstNameUs} ${user.lastNameUs}` : null;
}

/* =====================================================
   Verificar si el usuario está autenticado
===================================================== */
export function isAuthenticated() {
  return Boolean(getUser());
}

/* =====================================================
   Cerrar sesión
===================================================== */
export async function logout() {
  try {
    await AuthService.logout();
  } catch (error) {
    console.error("Error durante el logout:", error);
  } finally {
    Cookies.remove("user", { path: "/" });
    window.location.href = "/";
  }
}
