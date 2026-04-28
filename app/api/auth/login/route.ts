import { NextRequest, NextResponse } from "next/server";
import { generarJWT } from "@/lib/jwt";
import { AuthErrors } from "@/lib/errors";
import { buscarUsuarioCorreoAction } from "@/modules/login/services/login.server";
import { POOL_PG } from "@/lib/db";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  console.log("entro");
  try {
    const body = await req.json();
    const { correo, password } = body;

    // 1. Validar campos requeridos
    if (!correo || !password) {
      throw AuthErrors.MISSING_FIELDS;
    }

    // 2. Buscar usuario en BD local
    let dataUser = await buscarUsuarioCorreoAction(correo);
    console.log(dataUser);

    if (!dataUser || !dataUser.data) {
      throw AuthErrors.USER_NOT_FOUND;
    }

    let user = dataUser.data;

    /**
     * IMPORTANTE:
     * user.password_hash debe venir desde la query
     */

    // 3. Validar password con hash
    const passwordValido = await bcrypt.compare(password, user.password_hash);

    if (!passwordValido) {
      throw AuthErrors.INVALID_CREDENTIALS;
    }

    // 3. Validar estructura de usuario
    if (!user.rolId || !user.permissions) {
      throw AuthErrors.USER_WITHOUT_ROLES;
    }

    // 4. Generar JWT seguro con datos
    const token = generarJWT({
      idUser: String(user!.idUser),
      roleId: user!.rolId,
      roleName: user!.rolName,
      permissions: user!.permissions,
      curp: user!.curp,
      nombres: user!.nombres,
      apPaterno: user!.apPaterno,
      apMaterno: user!.apMaterno,
      correo: user.email,
    });

    // 5. Redirect por rol
    const redirectMap: Record<number, string> = {
      4: "/admin",
      5: "/operator",
      6: "/recepcionista",
      7: "/admin",
    };

    const redirectTo = redirectMap[user!.rolId] ?? "/asignacion";

    // Actualizar last_login
    // 8. Guardar token
    await POOL_PG.query(
      `
          UPDATE users
            SET
              last_login = NOW()
          WHERE curp = $1
            
          `,
      [user.curp],
    );

    // 6. Response OK

    const response = NextResponse.json(
      {
        ok: true,
        redirectTo,
        user: {
          email: user.email,
          nombres: user.nombres,
          rolId: user.rolId,
          rolName: user.rolName,
          idUser: user.idUser,
        },
      },
      { status: 200 },
    );

    //Concatenar el token a las cookies
    response.cookies.set("accessToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24, // 24h
    });

    return response;
  } catch (error: unknown) {
    console.error("🔥 LOGIN ERROR COMPLETO:", error);
    // ─── ERRORES CONTROLADOS ─────────────────────────────
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      "message" in error
    ) {
      return NextResponse.json(
        {
          ok: false,
          error: (error as { message: string }).message,
        },
        {
          status: (error as { status: number }).status,
        },
      );
    }

    // ─── ERROR INESPERADO ────────────────────────────────
    console.error("[POST /api/login]", error);

    return NextResponse.json(
      {
        ok: false,
        error: AuthErrors.CUS_UNAVAILABLE.message,
      },
      { status: AuthErrors.CUS_UNAVAILABLE.status },
    );
  }
}
