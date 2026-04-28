import {
  DBRolesPermisos,
  DBRolesTable,
  ViewRolesTable,
} from "../types/roles.types";

import { POOL_PG } from "@/lib/db";

// ============================================================
// QUERIES SQL
// ============================================================

const SQL = {
  LISTAR_ROLES: `
   SELECT id, name
FROM public.roles;

  `,

  ACTUALIZAR_ROL_USUARIO_1: `
 UPDATE users u
SET
  role_id = $1,
  estatus = 'approval'
FROM roles r
WHERE u.id = $2
  AND r.id = $1
RETURNING 
  u.id,
  u.email,
  u.nombre,
  u.ap_paterno,
  u.ap_materno,
  u.role_id,
  r.name AS role_name,
  u.estatus,
  u.updated_at;`,

  GROUP_ROLES_PERMISOS: `
  SELECT 
  r.name AS role,
  r.description,
  ARRAY_AGG(p.name ORDER BY p.name) AS permissions
FROM roles r
JOIN role_permissions rp ON r.id = rp.role_id
JOIN permissions p ON rp.permission_id = p.id
GROUP BY r.name, r.description 
ORDER BY r.name;


  `,
} as const;

// ============================================================
// REPOSITORIO
// ============================================================

export class RolesRepository {
  async listarRolesActuales(): Promise<DBRolesTable[]> {
    const res = await POOL_PG.query<DBRolesTable>(SQL.LISTAR_ROLES);

    return res.rows;
  }
  async actualizarRolUsuarioNuevoRP(
    idRol: number,
    userId: string,
  ): Promise<void> {
    try {
      console.log(userId);

      const resp = await POOL_PG.query(SQL.ACTUALIZAR_ROL_USUARIO_1, [
        idRol,
        userId,
      ]);
      console.log(resp);
      return resp.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //Agrupar roles y permisos
  async agruparRolesPermisosRP(): Promise<DBRolesPermisos[]> {
    try {
      const resp = await POOL_PG.query(SQL.GROUP_ROLES_PERMISOS);
      console.log(resp);
      return resp.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
