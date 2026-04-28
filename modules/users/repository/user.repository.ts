import { UserMiddleware } from "@/middleware/middleware.types";
import {
  DBUsersAsigarRol,
  DBUsersTable,
  ViewUsersAsigarRol,
} from "../types/users.types";
import { ViewUsersTable } from "../types/users.types";
import { POOL_PG } from "@/lib/db";

// ============================================================
// QUERIES SQL
// ============================================================

const SQL = {
  LISTAR_USUARIOS_PENDIENTES: `
   
select
	concat_ws(' ', u.nombre , u.ap_paterno ) as nombre,
	u.curp , u.estatus, u.last_login  as ultimo_acceso ,
	r."name" as rol_name,
  u.id as user_id
	
from users u 
join roles r on u.role_id  = r.id 
where u.estatus = 'pending_approval'
  `,

  LISTAR_USUARIOS_REGISTRADOS: `
   
select
	 concat_ws(' ', u.nombre , u.ap_paterno ) as nombre,
	u.curp , u.estatus, u.last_login  as ultimo_acceso ,
	r."name" as rol_name,
  u.id as user_id
	
from users u 
join roles r on u.role_id  = r.id 
where u.estatus = 'approval'
  `,
} as const;

// ============================================================
// REPOSITORIO
// ============================================================

export class UsersRepository {
  async listarUsuariosPendientesRP(): Promise<DBUsersAsigarRol[]> {
    const res = await POOL_PG.query<DBUsersAsigarRol>(
      SQL.LISTAR_USUARIOS_PENDIENTES,
    );

    return res.rows;
  }

  // Usuarios registrados
  async listarUsuariosRegistradosRP(): Promise<DBUsersAsigarRol[]> {
    const res = await POOL_PG.query<DBUsersAsigarRol>(
      SQL.LISTAR_USUARIOS_REGISTRADOS,
    );

    return res.rows;
  }
}
