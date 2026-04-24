import { NextRequest, NextResponse } from "next/server";
import { generarJWT } from "@/lib/jwt";
import { AuthErrors } from "@/lib/errors";
import { cusGetUserInfo, cusLogin } from "@/lib/cus";
import { POOL_PG as db } from "@/lib/db";
import {
  buscarUsuarioCusAction,
  registrarUsuarioAction,
} from "@/modules/login/services/login.server";
import { ViewUsers } from "@/modules/login/types/login.types";
import { LoginService } from "@/modules/login/services/login.service";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { curp, password } = body;

    // 1. Validar campos requeridos
    if (!curp || !password) {
      throw AuthErrors.MISSING_FIELDS;
    }

    // 2. Autenticar contra CUS
    const validaCus = await cusLogin(curp, password);

    if (!validaCus.ok) {
      throw validaCus.status === 401
        ? AuthErrors.INVALID_CREDENTIALS
        : AuthErrors.CUS_UNAVAILABLE;
    }

    const cusAuth = JSON.parse(validaCus.text);
    const { id_usuario_general } = cusAuth;

    if (!id_usuario_general) {
      throw AuthErrors.CUS_UNAVAILABLE;
    }

    // 3. Buscar usuario en BD local
    let dataUser = await buscarUsuarioCusAction(id_usuario_general);

    // 4. Auto-registro si no existe localmente
    if (!dataUser.data) {
      const cusInfo = await cusGetUserInfo(id_usuario_general).catch(() => {
        throw AuthErrors.CUS_UNAVAILABLE;
      });

      const cus = cusInfo.data;

      const nuevoUsuario: ViewUsers = {
        email: cus.email,
        password_hash: password,
        rolId: 7,
        Isactivo: true,
        ultimoAcceso: new Date().toISOString(),
        creacion: new Date().toISOString(),
        actualizacion: new Date().toISOString(),
        curp: cus.curp,
        idUsuarioCus: cus.id_general,
        nombres: cus.nombre,
        apPaterno: cus.primer_apellido?.trim() ?? "",
        apMaterno: cus.segundo_apellido?.trim() ?? "",
        permissions: [''],
        rolName: 'CIUDADANO'

      };

      //Registrar usuario
      const resultUser = await registrarUsuarioAction(nuevoUsuario);

      if (!resultUser.success) {
        throw AuthErrors.REGISTRATION_FAILED; // asegúrate de tener este error en AuthErrors
      }

      // Re-buscar al usuario recién registrado
      dataUser = await buscarUsuarioCusAction(id_usuario_general);
    }

    const usuario = dataUser.data;
    console.log(usuario)

    if (!usuario) {
      throw AuthErrors.USER_NOT_FOUND; // asegúrate de tener este error en AuthErrors
    }
    
  // 5. Generar token JWT con info del usuario
    const token = generarJWT({
    userCusId: usuario.idUsuarioCus,
    roleId: usuario.rolId,
    roleName: usuario.rolName,
    permissions: usuario.permissions,
    curp: usuario.curp,
    nombres: usuario.nombres,
    apPaterno: usuario.apPaterno,
    apMaterno: usuario.apMaterno
  });


    // 6. Determinar redirección según rol
    const redirectMap: Record<number, string> = {
      4: "/admin",
      5: "/operator",
      6: "/recepcionista",
      7: '/asignacion'
    };

    const redirectTo = redirectMap[usuario.rolId] ?? "/asignacion";

    console.log(redirectTo)

    console.log(usuario)
    

    return NextResponse.json(
      {
        ok: true,
        token,
        redirectTo,
        user: {
          email: usuario.email,
          nombres: usuario.nombres,
          rolId: usuario.rolId,
          rolName: usuario.rolName,
          idCus: usuario.idUsuarioCus,
          
        },
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    // Errores controlados (AuthErrors)
    if (
      error &&
      typeof error === "object" &&
      "status" in error &&
      "message" in error
    ) {
      return NextResponse.json(
        { ok: false, error: (error as { message: string }).message },
        { status: (error as { status: number }).status }
      );
    }

    // Error inesperado
    console.error("[POST /api/login]", error);
    return NextResponse.json(
      { ok: false, error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}