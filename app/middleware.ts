import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const publicRoutes = ["/"];

const roleRoutes: Record<string, string[]> = {
  Administrador: ["/administrator", "/users"],
  Medico: ["/medico"],
  Enfermero: ["/nurse", "/patients", "/triage"],
  Paciente: ["/paciente"],
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;
  const userData = req.cookies.get("user")?.value
    ? JSON.parse(req.cookies.get("user")!.value)
    : null;

  if (publicRoutes.includes(pathname)) return NextResponse.next();

  if (!token || !userData) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  // Si hay usuario, validar acceso según rol
  const userRole = userData.roleName;
  const allowedRoutes = roleRoutes[userRole] || [];

  // Si la ruta actual no pertenece al rol → redirigir
  const hasAccess = allowedRoutes.some((route) => pathname.startsWith(route));
  if (!hasAccess) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Definir en qué rutas aplica el middleware
export const config = {
  matcher: [
    "/administrator/:path*",
    "/medico/:path*",
    "/nurse/:path*",
    "/paciente/:path*",
  ],
};
