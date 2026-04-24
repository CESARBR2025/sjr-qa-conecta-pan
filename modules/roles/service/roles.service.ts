import { mapUsersAsignarRol } from "../mappers/roles.mappers";
import { RolesRepository } from "../repository/roles.repository";
import { ViewRolesTable } from "../types/roles.types";

export class RolesService {
  private repo = new RolesRepository();

  

  // Treaer usuarios en rol CIDADANO pendientes de asignar
  async svListarRolesActuales(): Promise<ViewRolesTable[]> {
    
    const rows = await this.repo.listarRolesActuales();
    
    return rows.map(mapUsersAsignarRol)
  }


   // Actualizar rol usuario nuevo
  async svActualizarRolUsuarioNuevo(idCus: number, idRol: number, userId: string): Promise<any> {
    
    console.log(userId)
    const rows = await this.repo.actualizarRolUsuarioNuevo(idCus, idRol, userId);
    
    return rows
  }


  

}
