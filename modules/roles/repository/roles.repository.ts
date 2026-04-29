import {
  DBNuevoRol,
  DBPermissionsTable,
  DBRolesPermisos,
  DBRolesTable,
  RepositoryResponseActualizarPermisos,
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
left JOIN role_permissions rp ON r.id = rp.role_id
left JOIN permissions p ON rp.permission_id = p.id
GROUP BY r.name, r.description 
ORDER BY r.name;


  `,

  //! Actualizar permisos

  ACTUALIZAR_PERMISOS_GET_ROLE_ID: `
SELECT id
FROM roles
WHERE name = $1
LIMIT 1;
`,

  ACTUALIZAR_PERMISOS_GET_PERMISSION_IDS: `
SELECT id, name
FROM permissions
WHERE name = ANY($1);
`,

  ACTUALIZAR_PERMISOS_DELETE_ROLE_PERMISSIONS: `
DELETE FROM role_permissions
WHERE role_id = $1;
`,

  //! Traer universo de permisos
  UNIVERSO_PERMISOS: `
SELECT
  id,
  name,
  description
FROM permissions
ORDER BY name;
`,

  //! Crear nuevo rol
  // ============================================================
  // SQL
  // ============================================================

  CREAR_NUEVO_ROL: `
INSERT INTO roles (
  name,
  description,
  created_at
)
VALUES (
  UPPER($1),
  $2,
  NOW()
)
RETURNING
  id,
  name,
  description,
  created_at;
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

  //! 4 cosas para asignación nueva de permisos a roles

  async actualizarPermisosRolRP(
    roleCode: string,
    permissions: string[],
  ): Promise<void> {
    const client = await POOL_PG.connect();

    try {
      await client.query("BEGIN");

      //? 1. Buscar role_id usando roleCode

      const roleResult = await client.query(
        SQL.ACTUALIZAR_PERMISOS_GET_ROLE_ID,
        [roleCode],
      );

      if (roleResult.rows.length === 0) {
        throw new Error(`Rol no encontrado: ${roleCode}`);
      }

      const roleId = roleResult.rows[0].id;

      //? 2.Buscar permission_id

      const permissionResult = await client.query(
        SQL.ACTUALIZAR_PERMISOS_GET_PERMISSION_IDS,
        [permissions],
      );

      const permissionIds = permissionResult.rows.map((row) => row.id);
      console.log(permissionIds);

      //? Validación: Si faltan permisos -> error
      if (permissionIds.length !== permissions.length) {
        throw new Error(
          "Uno o más permisos no existen en la tabla permissions",
        );
      }

      //? 3. Eliminar permisos actuales del rol
      await client.query(SQL.ACTUALIZAR_PERMISOS_DELETE_ROLE_PERMISSIONS, [
        roleId,
      ]);

      //? 4. Insertar nuevos registros
      if (permissionIds.length > 0) {
        const values: string[] = [];
        const params: any[] = [];

        permissionIds.forEach((permissionId, index) => {
          values.push(`($1, $${index + 2})`);
          params.push(permissionId);
        });

        const insertQuery = `
        INSERT INTO role_permissions (
          role_id,
          permission_id
        )
        VALUES ${values.join(", ")}
      `;

        await client.query(insertQuery, [roleId, ...params]);
      }

      await client.query("COMMIT");

      return;
    } catch (error) {
      await client.query("ROLLBACK");
      console.log(error);

      throw error;
    } finally {
      client.release();
    }
  }

  //! Universo de permisos
  async listarTodosLosPermisosRP(): Promise<DBPermissionsTable[]> {
    try {
      const res = await POOL_PG.query<DBPermissionsTable>(
        SQL.UNIVERSO_PERMISOS,
      );

      return res.rows;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
  //! Crear nuevo rol
  async crearNuevoRolRP(
    roleCode: string,
    description: string,
  ): Promise<DBNuevoRol> {
    try {
      const res = await POOL_PG.query<DBNuevoRol>(SQL.CREAR_NUEVO_ROL, [
        roleCode,
        description,
      ]);

      return res.rows[0];
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}
