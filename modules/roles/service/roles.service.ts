import {
  mapAgruparRolesPermisos,
  mapUsersAsignarRol,
} from "../mappers/roles.mappers";
import { RolesRepository } from "../repository/roles.repository";
import { ViewRolesPermisos, ViewRolesTable } from "../types/roles.types";

export class RolesService {
  private repo = new RolesRepository();

  // Treaer usuarios en rol CIDADANO pendientes de asignar
  async svListarRolesActuales(): Promise<ViewRolesTable[]> {
    const rows = await this.repo.listarRolesActuales();

    return rows.map(mapUsersAsignarRol);
  }

  // Actualizar rol usuario nuevo
  async svActualizarRolUsuarioNuevo(
    idRol: number,
    userId: string,
  ): Promise<any> {
    console.log(userId);
    console.log(idRol);
    const rows = await this.repo.actualizarRolUsuarioNuevoRP(idRol, userId);
    console.log(rows);
    return rows;
  }

  //Traer roles y permisos
  // Treaer usuarios en rol CIDADANO pendientes de asignar
  async svListarRolesPermisos(): Promise<ViewRolesPermisos[]> {
    const rows = await this.repo.agruparRolesPermisosRP();

    return rows.map(mapAgruparRolesPermisos);
  }
}
