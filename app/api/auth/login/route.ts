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
    if (dataUser.data.length === 0) {
      const cusInfo = await cusGetUserInfo(id_usuario_general).catch(() => {
        throw AuthErrors.CUS_UNAVAILABLE;
      });

      const cus = cusInfo.data;

      const nuevoUsuario: ViewUsers = {
        email: cus.email,
        password_hash: password,
        rolId: 4,
        Isactivo: true,
        ultimoAcceso: new Date().toISOString(),
        creacion: new Date().toISOString(),
        actualizacion: new Date().toISOString(),
        curp: cus.curp,
        idUsuarioCus: cus.id_general,
        nombres: cus.nombre,
        apPaterno: cus.primer_apellido?.trim() ?? "",
        apMaterno: cus.segundo_apellido?.trim() ?? "",
      };

      //Registrar usuario
      const resultUser = await registrarUsuarioAction(nuevoUsuario);

      if (!resultUser.success) {
        throw AuthErrors.REGISTRATION_FAILED; // asegúrate de tener este error en AuthErrors
      }

      // Re-buscar al usuario recién registrado
      dataUser = await buscarUsuarioCusAction(id_usuario_general);
    }

    const usuario = dataUser.data[0];
    console.log(usuario)

    if (!usuario) {
      throw AuthErrors.USER_NOT_FOUND; // asegúrate de tener este error en AuthErrors
    }
    

    
        // 3. Obtener usuario y permisos desde BD
        const query = `
          SELECT 
            u.id,
            u.email,
            concat_ws(' ', u.nombre, u.ap_paterno, u.ap_materno) as nombre,
            u.role_id,
            r.name as role_name,
            ARRAY_AGG(p.name) as permissions
          FROM users u
          JOIN roles r ON u.role_id = r.id
          LEFT JOIN role_permissions rp ON r.id = rp.role_id
          LEFT JOIN permissions p ON rp.permission_id = p.id
          WHERE u.id_usuario_general = $1 AND u.is_active = true
          GROUP BY u.id, u.email, u.nombre, u.role_id, r.name
        `;
    
        const result = await db.query(query, [usuario.idUsuarioCus]);
        
    
        if (result.rows.length === 0) {
          return NextResponse.json(
            { error: "User not found or inactive" },
            { status: 401 }
          );
        }
    
        const userRow = result.rows[0];
        console.log(userRow)
    

      // 5. Generar token JWT con info del usuario
    const token = generarJWT({
    userId: usuario.idUsuarioCus,
    roleId: usuario.rolId,
    roleName: userRow.role_name,
    permissions: userRow.permissions,
    curp: usuario.curp,
    nombres: usuario.nombres,
  });


    // 6. Determinar redirección según rol
    const redirectMap: Record<number, string> = {
      4: "/admin",
      5: "/operator",
      6: "/recepcionista",
    };

    const redirectTo = redirectMap[usuario.rolId] ?? "/dashboard";

    console.log(redirectTo)
    

    return NextResponse.json(
      {
        ok: true,
        token,
        redirectTo,
        user: {
          email: usuario.email,
          nombres: usuario.nombres,
          rolId: usuario.rolId,
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