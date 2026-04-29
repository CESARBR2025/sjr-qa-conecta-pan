import { DBUsersAsigarRol, ViewUsersAsigarRol } from "../types/users.types";

export function mapUsersAsignarRol(row: DBUsersAsigarRol): ViewUsersAsigarRol {
  return {
    nombreUsuario: row.nombre,
    curp: row.curp,
    estatus: row.estatus,
    ultimoAcceso: row.ultimo_acceso,
    nombreRol: row.rol_name,
    userId: row.user_id,
    email: row.email,
  };
}

export interface UsersAsignarRolResponse {
  resumen: {
    totalUsuarios: number;
    usuariosActivos: number;
    rolesAsignados: number;
    ultimoAcceso: string;
  };
  usuarios: ViewUsersAsigarRol[];
}

export function mapUser(row: DBUsersAsigarRol): ViewUsersAsigarRol {
  return {
    userId: row.user_id,
    nombreUsuario: row.nombre,
    curp: row.curp,
    estatus: row.estatus,
    ultimoAcceso: row.ultimo_acceso,
    nombreRol: row.rol_name,
    email: row.email,
  };
}

export function mapUsersAsignarRolResponse(dbResult: any) {
  return {
    resumen: {
      totalUsuarios: dbResult.resumen.total_usuarios,
      usuariosActivos: dbResult.resumen.usuarios_activos,
      rolesAsignados: dbResult.resumen.roles_asignados,
      ultimoAcceso: dbResult.resumen.ultimo_acceso,
    },

    usuarios: dbResult.usuarios.map(mapUser),
  };
}
