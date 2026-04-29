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
   

WITH base_users AS (
  SELECT 
    u.id,
    u.nombre,
    u.ap_paterno,
    u.curp,
    u.estatus,
    u.last_login,
    u.email,
    r.name AS rol_name
  FROM users u
  JOIN roles r ON u.role_id = r.id
),

kpis AS (
  SELECT
    COUNT(*) AS total_usuarios,
    COUNT(*) FILTER (WHERE last_login >= NOW() - interval '7 days' ) AS usuarios_activos,
    COUNT(DISTINCT rol_name) AS roles_asignados,
    MAX(last_login) AS ultimo_acceso
  FROM base_users
)

SELECT
  (SELECT row_to_json(kpis) FROM kpis) AS resumen,

  (
    SELECT json_agg(
      json_build_object(
        'user_id', id,
        'nombre', CONCAT(nombre, ' ', ap_paterno),
        'curp', curp,
        'estatus', estatus,
        'rol_name', rol_name,
        'email', email,
        'ultimo_acceso', last_login
      )
    )
    FROM base_users
  ) AS usuarios;
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
