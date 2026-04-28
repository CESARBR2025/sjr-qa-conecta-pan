// ════════════════════════════════════════════════════
// TYPES — USERS
// Tipos que representan la estructura cruda de la DB.
// Nunca se usan directamente en componentes React.
// ════════════════════════════════════════════════════

// ── Tipos de DB (filas crudas que devuelve PostgreSQL) ────\

//** Interfaz general tabla de articulos_reglamento */

export interface DBUsersTable {
  id: number;
  email: string;
  password_hash: string;
  role_id: number;
  rolename: string;
  permissions: string[];
  is_active: boolean;
  last_login: string;
  created_at: string;
  updated_at: string;
  curp: string;
  id_usuario_general: number;
  nombre: string;
  ap_paterno: string;
  ap_materno: string;
}

//Interfaz para usuarios con estatus pendiente
export interface DBUsersAsigarRol {
  id_usuario_general: number;
  nombre: string;
  curp: string;
  estatus: string;
  ultimo_acceso: string;
  rol_name: string;
  user_id: string;
}

// ════════════════════════════════════════════════════
// TIPOS DE VISTA (LO QUE REGRESA EL MAPPER)
// ════════════════════════════════════════════════════
export interface ViewUsersAsigarRol {
  idCus: number;
  nombreUsuario: string;
  curp: string;
  estatus: string;
  ultimoAcceso: string;
  nombreRol: string;
  userId: string;
}

//** Regreso de mapper */
export interface ViewUsersTable {
  idUser?: number;
  email: string;
  password_hash: string;
  rolId: number;
  permissions: string[];
  rolName: string;
  Isactivo: boolean;
  ultimoAcceso: string;
  creacion: string;
  actualizacion: string;
  curp: string;
  idUsuarioCus: number;
  nombres: string;
  apPaterno: string;
  apMaterno: string;
}
