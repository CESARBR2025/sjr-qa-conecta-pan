import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

interface JwtPayload {
  idUser: string;
  roleId: number;
  roleName: string;
  permissions: string[];
  exp: number;
}

const routePermissions: Record<string, string[]> = {
  "/admin": ["ADMIN", "SUPER_ADMIN"],
  "/admin/usuarios": ["ADMIN", "SUPER_ADMIN"],
  "/admin/configuracion": ["SUPER_ADMIN"],
  "/eventos": ["ADMIN", "SUPER_ADMIN"],
};

const publicRoutes = [
  "/login",
  "/register",
  "/verify",
  "/unauthorized",
  "/login/check-email",
  "/login/en-espera-validation",
];

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  console.log("PATHNAME:", pathname);
  console.log("TOKEN EXISTS:", !!token);

  if (publicRoutes.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  try {
    const { payload } = await jwtVerify(token, secret);

    console.log("DECODED:", payload);

    const userRole = payload.roleName as string;

    for (const route in routePermissions) {
      if (pathname.startsWith(route)) {
        const allowedRoles = routePermissions[route];

        if (!allowedRoles.includes(userRole)) {
          return NextResponse.redirect(new URL("/unauthorized", request.url));
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    console.log("JWT ERROR:", error);

    const response = NextResponse.redirect(new URL("/login", request.url));

    response.cookies.delete("accessToken");

    return response;
  }
}

export const config = {
  matcher: ["/admin/:path*", "/eventos/:path*", "/configuracion/:path*"],
};
