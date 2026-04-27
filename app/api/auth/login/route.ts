import { NextRequest, NextResponse } from "next/server";
import { generarJWT } from "@/lib/jwt";
import { AuthErrors } from "@/lib/errors";
import { cusGetUserInfo, cusLogin } from "@/lib/cus";
import { enviarCorreoAuth } from "@/modules/email/service/mailer.server";
import { POOL_PG as db } from "@/lib/db";
import {
  buscarUsuarioCusAction,
  registrarUsuarioAction,
} from "@/modules/login/services/login.server";
import { ViewUsers } from "@/modules/login/types/login.types";
import { LoginService } from "@/modules/login/services/login.service";

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
    let dataUser = await buscarUsuarioCusAction(correo);
    console.log(dataUser);

    if (!dataUser || !dataUser.data) {
      throw AuthErrors.USER_NOT_FOUND;
    }

    let user = dataUser.data;

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
    });

    // 5. Redirect por rol
    const redirectMap: Record<number, string> = {
      4: "/admin",
      5: "/operator",
      6: "/recepcionista",
      7: "/admin",
    };

    const redirectTo = redirectMap[user!.rolId] ?? "/asignacion";

    // 6. Response OK

    return NextResponse.json(
      {
        ok: true,
        token,
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
