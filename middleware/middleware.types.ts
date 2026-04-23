// ¿Qué hace?
// Define la estructura del usuario que va a viajar en el request
// AuthenticatedRequest es un NextRequest normal pero con la propiedad user adjunta

import { NextRequest } from "next/server"

export interface UserMiddleware {
    
    email: string
    roleId: number
    roleName: string
    permissions: string[]
    userCus: number
    
}

export interface AuthenticatedRequest extends NextRequest {
    user?: UserMiddleware
}