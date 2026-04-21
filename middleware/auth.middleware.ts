
import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";
import { POOL_PG as db } from "@/lib/db";

export interface AuthenticatedRequest extends NextRequest {
  user?: {
    id: string;
    email: string;
    name: string;
    roleId: number;
    roleName: string;
    permissions: string[];
  };
}

export async function authMiddleware(request: NextRequest) {
  try {
    // 1. Extraer token del header
    const authHeader = request.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

    const token = authHeader.slice(7);

    // 2. Verificar y decodificar JWT
    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // 3. Obtener usuario y permisos desde BD
    const query = `
      SELECT 
        u.id,
        u.email,
        u.name,
        u.role_id,
        r.name as role_name,
        ARRAY_AGG(p.name) as permissions
      FROM users u
      JOIN roles r ON u.role_id = r.id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id = $1 AND u.is_active = true
      GROUP BY u.id, u.email, u.name, u.role_id, r.name
    `;

    const result = await db.query(query, [payload.userId]);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "User not found or inactive" },
        { status: 401 }
      );
    }

    const userRow = result.rows[0];

    // 4. Adjuntar usuario al request
    const authenticatedRequest = request as AuthenticatedRequest;
    authenticatedRequest.user = {
      id: userRow.id,
      email: userRow.email,
      name: userRow.name,
      roleId: userRow.role_id,
      roleName: userRow.role_name,
      permissions: userRow.permissions.filter(Boolean) || [],
    };

    return NextResponse.next({
      request: authenticatedRequest,
    });
  } catch (error) {
    console.error("Auth middleware error:", error);
    return NextResponse.json(
      { error: "Authentication failed" },
      { status: 401 }
    );
  }
}

// Exportar middleware aplicable
export const config = {
  matcher: ["/api/:path*", "/(dashboard)/:path*"],
};