
import { NextRequest, NextResponse } from "next/server";
import { AuthenticatedRequest } from "./auth.middleware";

export function requirePermission(...requiredPermissions: string[]) {
  return (handler: Function) => {
    return async (req: AuthenticatedRequest) => {
      const user = req.user;

      if (!user) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      // Verificar que usuario tiene al menos uno de los permisos requeridos
      const hasPermission = requiredPermissions.some((perm) =>
        user.permissions.includes(perm)
      );

      if (!hasPermission) {
        return NextResponse.json(
          {
            error: "Insufficient permissions",
            required: requiredPermissions,
            have: user.permissions,
          },
          { status: 403 }
        );
      }

      return handler(req);
    };
  };
}

export function requireRole(...roles: string[]) {
  return (handler: Function) => {
    return async (req: AuthenticatedRequest) => {
      const user = req.user;

      if (!user) {
        return NextResponse.json(
          { error: "Authentication required" },
          { status: 401 }
        );
      }

      if (!roles.includes(user.roleName)) {
        return NextResponse.json(
          {
            error: "Insufficient role",
            required: roles,
            have: user.roleName,
          },
          { status: 403 }
        );
      }

      return handler(req);
    };
  };
}