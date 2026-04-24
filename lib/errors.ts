// ─── Base Error ────────────────────────────────────────────────────────────────

export class AppError extends Error {
  readonly code: string;
  readonly status: number;

  constructor(message: string, code = "INTERNAL_ERROR", status = 500) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;

    // Mantiene el stack trace correcto en V8 (Node/Next.js)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  toJSON() {
    return {
      ok: false,
      error: this.message,
      code: this.code,
    };
  }
}

// ─── Type guard ────────────────────────────────────────────────────────────────

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

// ─── Factory ───────────────────────────────────────────────────────────────────

function createError(message: string, code: string, status: number): AppError {
  return new AppError(message, code, status);
}

// ─── Auth Errors ───────────────────────────────────────────────────────────────

export const AuthErrors = {
  MISSING_FIELDS: createError(
    "Debes ingresar tu CURP y contraseña",
    "MISSING_FIELDS",
    400,
  ),

  INVALID_CREDENTIALS: createError(
    "La CURP o la contraseña no son correctas",
    "INVALID_CREDENTIALS",
    401,
  ),

  USER_WITHOUT_ROLES: createError(
    "Tu cuenta no tiene permisos asignados. Contacta a soporte",
    "NO_ROLES",
    403,
  ),

  USER_NOT_FOUND: createError(
    "El usuario no fue encontrado",
    "USER_NOT_FOUND",
    404,
  ),

  CUS_UNAVAILABLE: createError(
    "El sistema no está disponible en este momento. Intenta más tarde",
    "CUS_DOWN",
    503,
  ),

  REGISTRATION_FAILED: createError(
    "No se pudo completar el registro del usuario",
    "REGISTRATION_FAILED",
    500,
  ),
} as const;
