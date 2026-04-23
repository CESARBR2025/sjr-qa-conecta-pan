// ¿Qué hace paso a paso?

// Extrae el token: Busca Authorization: Bearer {token} en los headers
// Verifica el JWT: Decodifica y valida que el token sea válido
// Consulta la BD: Busca al usuario y sus permisos
// Adjunta el usuario: Añade req.user al request
// Continúa: Retorna NextResponse.next() para pasar al siguiente middleware

        
// Posibles errores:

// Sin token → 401
// Token expirado/inválido → 401
// Usuario no encontrado → 401      

import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/jwt";

import { AuthenticatedRequest } from "./middleware.types";
import { UsersService } from "@/modules/login/services/login.service";


export async function authMiddleware(request: NextRequest) {

  const service = new UsersService()


  
  try {
    
    // 1. Extraer token del header
    const authHeader = request.headers.get("authorization");


    if (!authHeader ||  !authHeader?.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "No authorization token provided" },
        { status: 401 }
      );
    }

  
    const token = authHeader.slice(7); //Quitar el Bearer

    // 2. Verificar JWT
    const payload = verifyToken(token);

    if (!payload || !payload.userId) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    //Obtener datos auth de usuario
    const datosAuthUser = await service.svObtenerDatosUserAuth(payload?.userId)

    if(!datosAuthUser){
      return NextResponse.json(
        {error: "User not found or inactive"},
        {status: 401}
      )
    }

    // 4. Adjuntar usuario al request
    const authenticatedRequest = request as AuthenticatedRequest;
      authenticatedRequest.user = {
      id: datosAuthUser.id,
      email: datosAuthUser.email,
      name: datosAuthUser.name,
      roleId: datosAuthUser.roleId,
      roleName: datosAuthUser.roleName,
      permissions: datosAuthUser.permissions.filter(Boolean) || [],
    };

    //Retornar request modificado

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

