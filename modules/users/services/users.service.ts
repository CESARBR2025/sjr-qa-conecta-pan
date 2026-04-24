import { mapUsersAsignarRol } from "../mappers/users.mapper";
import { UsersRepository } from "../repository/user.repository";
import { ViewUsersAsigarRol } from "../types/users.types";

export class UsersService {
  private repo = new UsersRepository();

  // Treaer usuarios en rol CIDADANO pendientes de asignar
  async svListarUsuariosPendientesAsignar(): Promise<ViewUsersAsigarRol[]> {
    const rows = await this.repo.listarUsuariosPendientesRP();

    return rows.map(mapUsersAsignarRol);
  }
}
