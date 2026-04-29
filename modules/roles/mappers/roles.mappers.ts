import {
  DBRolesPermisos,
  DBRolesTable,
  ViewRolesPermisos,
  ViewRolesTable,
} from "../types/roles.types";

export function mapUsersAsignarRol(row: DBRolesTable): ViewRolesTable {
  return {
    idRol: row.id,
    nombreRol: row.name,
  };
}

export function mapAgruparRolesPermisos(
  row: DBRolesPermisos,
): ViewRolesPermisos {
  return {
    roleName: row.role,
    description: row.description,
    permissions: row.permissions,
    allPermissions: row.allPermissions,
  };
}
