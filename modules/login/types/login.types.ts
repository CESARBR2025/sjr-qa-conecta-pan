// ════════════════════════════════════════════════════
// TYPES — USERS
// Tipos que representan la estructura cruda de la DB.
// Nunca se usan directamente en componentes React.
// ════════════════════════════════════════════════════

// ── Tipos de DB (filas crudas que devuelve PostgreSQL) ────\

//** Interfaz general tabla de articulos_reglamento */

export interface DBUsers {
  id: number;
  email: string
  password_hash: string
  role_id: number
  rolename: string;
  permissions: string[]
  is_active: boolean
  last_login: string
  created_at: string
  updated_at: string
  curp: string
  id_usuario_general: number;
  nombre: string
  ap_paterno: string
  ap_materno: string
  
}

// ════════════════════════════════════════════════════
// TIPOS DE VISTA (LO QUE REGRESA EL MAPPER)
// ════════════════════════════════════════════════════

//** Regreso de mapper */
export interface ViewUsers {
idUser?: number;
  email: string
  password_hash: string
  rolId: number
  permissions: string[]
  rolName: string;
  Isactivo: boolean
  ultimoAcceso: string
  creacion: string
  actualizacion: string
  curp: string
  idUsuarioCus: number;
  nombres: string
  apPaterno: string
  apMaterno: string
}
