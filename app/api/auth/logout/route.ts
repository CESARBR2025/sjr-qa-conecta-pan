// app/api/auth/logout/route.ts

import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json(
      {
        ok: true,
        message: "Sesión cerrada correctamente",
      },
      { status: 200 },
    );

    /**
     * Eliminar cookie JWT
     */
    response.cookies.set("accessToken", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: new Date(0), // expira inmediatamente
    });

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Error al cerrar sesión",
      },
      { status: 500 },
    );
  }
}
