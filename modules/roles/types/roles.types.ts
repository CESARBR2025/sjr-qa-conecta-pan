// ════════════════════════════════════════════════════
// TYPES — ROLES
// Tipos que representan la estructura cruda de la DB.
// Nunca se usan directamente en componentes React.
// ════════════════════════════════════════════════════

// ── Tipos de DB (filas crudas que devuelve PostgreSQL) ────\

//** Interfaz general tabla  */

export interface DBRolesTable {
  id: number
  name: string
  description: string
  created_at: string
  
}




// ════════════════════════════════════════════════════
// TIPOS DE VISTA (LO QUE REGRESA EL MAPPER)
// ════════════════════════════════════════════════════
export interface ViewRolesTable {
  idRol: number
  nombreRol: string
  
}


