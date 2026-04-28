import { DBRolesTable, ViewRolesTable } from "../types/roles.types";

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
  UPDATE users
    SET
     role_id = $1,
     estatus = 'approval'
    WHERE id = $2;
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
  async actualizarRolUsuarioNuevo(
    idRol: number,
    userId: string,
  ): Promise<void> {
    try {
      console.log(userId);

      await POOL_PG.query(SQL.ACTUALIZAR_ROL_USUARIO_1, [idRol, userId]);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
