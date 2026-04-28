import { DBUsersAsigarRol, ViewUsersAsigarRol } from "../types/users.types";

export function mapUsersAsignarRol(row: DBUsersAsigarRol): ViewUsersAsigarRol {
  return {
    idCus: row.id_usuario_general,
    nombreUsuario: row.nombre,
    curp: row.curp,
    estatus: row.estatus,
    ultimoAcceso: row.ultimo_acceso,
    nombreRol: row.rol_name,
    userId: row.user_id,
  };
}
