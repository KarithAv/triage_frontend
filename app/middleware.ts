import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Permisos correctos según la BD real
const roleRoutesById: Record<number, string[]> = {
  1: ["/administrator"], // Administrador
  2: ["/nurse"],         // Enfermero
  3: ["/patient"],       // Paciente
  4: ["/doctor"],        // Médico
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Token HttpOnly
  const token = req.cookies.get("X-Auth")?.value;

  // Cookie visible con datos reducidos
  const userRaw = req.cookies.get("user")?.value;
  let user: any = null;

  if (userRaw) {
    try {
      user = JSON.parse(userRaw);
    } catch {
      user = null;
    }
  }

  //-------------- 🔒 VALIDACIONES DE AUTENTICACIÓN --------------
  if (!token || !user || typeof user.roleIdUs !== "number") {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  //-------------- 🔐 VALIDACIONES DE ACCESO POR ROL --------------
  const roleId = user.roleIdUs;

  const allowedRoutes = roleRoutesById[roleId] || [];

  const allowed = allowedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (!allowed) {
    const url = req.nextUrl.clone();
    url.pathname = "/";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Solo se ejecuta en rutas privadas
export const config = {
  matcher: [
    "/administrator/:path*",
    "/doctor/:path*",
    "/nurse/:path*",
    "/patient/:path*",
  ],
};
