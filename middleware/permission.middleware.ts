// ¿Qué hace paso a paso?

// Verifica que exista usuario: Si no hay req.user → 401
// Comprueba permisos: Mira si el usuario tiene AL MENOS UNO de los permisos requeridos
// Si falla: Retorna 403 Forbidden
// Si pasa: Retorna null (significa: todo bien, continúa)

/**
 * Ya tenemos middlewares de auth y permission
 * Necesitamos acceder al crud de usuarios
 * Necesitamos crear slidebar con pestania de Gestion de usuarios
 * Teniendo eso ya podemos realizar rp y servicio para entrar a la vista
 */

import { NextResponse } from "next/server";
import { AuthenticatedRequest } from "./middleware.types";

export function permissionMiddleware(requiredPermissions: string[]) {
  return async (request: AuthenticatedRequest) => {
    // 1. Verificar que el usuario exista
    const user = request.user;

    if (!user) {
      return NextResponse.json(
        { error: "Authenteication required" },
        { status: 401 },
      );
    }

    // 2. Verificar que tenga algun permiso requerido
    const hasPermission = requiredPermissions.some((perm) =>
      user.permissions.includes(perm),
    );

    if (!hasPermission) {
      return NextResponse.json({
        error: "Insufficient permission",
        required: requiredPermissions,
        userPermissions: user.permissions,
      });
    }

    // 3. Si tiene permisos continua
    return null;
  };
}
