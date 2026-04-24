import { DBRolesTable, ViewRolesTable } from "../types/roles.types";

export function mapUsersAsignarRol(row: DBRolesTable): ViewRolesTable {
  return {
    idRol: row.id,
    nombreRol: row.name,
  };
}
