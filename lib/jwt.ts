import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;
console.log(JWT_SECRET)

export interface JwtPayload {
  userId: number;
  roleId: number;
  roleName: string
  permissions: string[]
  curp: string;
  nombres: string;
  iat?: number;
  exp?: number;
}

// Crear token
export function generarJWT(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET, {
    expiresIn: "1d", // 1 día
  });
}

export function verifyToken(token: string): JwtPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

    // Validación mínima de estructura
    if (!decoded || !decoded.userId) {
      return null;
    }

    return decoded;
  } catch (error) {
    // Token inválido, expirado o manipulado
    return null;
  }
}