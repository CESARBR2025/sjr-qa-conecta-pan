// ════════════════════════════════════════════════════
// TYPES — ROLES
// Tipos que representan la estructura cruda de la DB.
// Nunca se usan directamente en componentes React.
// ════════════════════════════════════════════════════

// ── Tipos de DB (filas crudas que devuelve PostgreSQL) ────\

//** Interfaz general tabla  */

export interface DBRolesTable {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface DBRolesPermisos {
  role: string;
  description: string;
  permissions: string[];
}

export interface RepositoryResponseActualizarPermisos {
  success: boolean;
  message: string;
}

export interface DBPermissionsTable {
  id: number;
  name: string;
  description: string;
}

// ════════════════════════════════════════════════════
// TIPOS DE VISTA (LO QUE REGRESA EL MAPPER)
// ════════════════════════════════════════════════════

export interface ViewRolesPermisos {
  roleName: string;
  description: string;
  permissions: string[];
  allPermissions: string[];
}
export interface ViewRolesTable {
  idRol: number;
  nombreRol: string;
}
