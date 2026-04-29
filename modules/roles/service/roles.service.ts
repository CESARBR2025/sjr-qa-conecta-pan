import {
  mapAgruparRolesPermisos,
  mapUsersAsignarRol,
} from "../mappers/roles.mappers";
import { RolesRepository } from "../repository/roles.repository";
import {
  DBPermissionsTable,
  RepositoryResponseActualizarPermisos,
  ViewRolesPermisos,
  ViewRolesTable,
} from "../types/roles.types";

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

  //! Cambiar permisos a roles

  async svActualizarRolesPermisos(
    roleCode: string,
    permissions: string[],
  ): Promise<RepositoryResponseActualizarPermisos> {
    try {
      //? Validación de negocio
      if (!roleCode) {
        return {
          success: false,
          message: "No se recibió el rol a actualizar",
        };
      }

      //? Llamada al repositorio
      await this.repo.actualizarPermisosRolRP(roleCode, permissions);

      //? Repuesta exitosa
      return {
        success: true,
        message: `Permisos actualizados exitosamente para ${roleCode}`,
      };
    } catch (error) {
      console.log(error);

      //? Normalización de errores
      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : `Error inesperado al actualizar permisos de ${roleCode}`,
      };
    }
  }

  //! Universo de permisos
  async svListarTodosLosPermisos(): Promise<DBPermissionsTable[]> {
    try {
      const response = await this.repo.listarTodosLosPermisosRP();

      return response;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  //! Crear nuevo rol
  async svCrearNuevoRol(
    roleCode: string,
    description: string,
  ): Promise<RepositoryResponseActualizarPermisos> {
    try {
      //? Validaciones de negocio
      if (!roleCode?.trim()) {
        return {
          success: false,
          message: "El nombre del rol es obligatorio",
        };
      }

      if (!description?.trim()) {
        return {
          success: false,
          message: "La descripción del rol es obligatoria",
        };
      }

      //? Normalizacion
      const normalizedRoleCode = roleCode.trim().toUpperCase();

      //? Peticion a repo
      await this.repo.crearNuevoRolRP(normalizedRoleCode, description.trim());

      return {
        success: true,
        message: `Rol ${normalizedRoleCode} creado correctamente`,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error inesperado al crear el nuevo rol",
      };
    }
  }

  //! Eliminar rol existente
  async svEliminarRol(
    roleCode: string,
  ): Promise<RepositoryResponseActualizarPermisos> {
    try {
      //? Validación basica

      if (!roleCode?.trim()) {
        return {
          success: false,
          message: "El código del rol es obligatorio",
        };
      }

      //? Normalización
      const normalizedRoleCode = roleCode.trim().toUpperCase();

      //? lLamada al repositorio
      await this.repo.eliminarRolRP(normalizedRoleCode);

      return {
        success: true,
        message: `Rol ${normalizedRoleCode} eliminado correctamente`,
      };
    } catch (error) {
      console.log(error);

      return {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Error inesperado al eliminar el rol",
      };
    }
  }
}
