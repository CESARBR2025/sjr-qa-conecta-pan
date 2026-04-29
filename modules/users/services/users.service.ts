import {
  mapUsersAsignarRol,
  mapUsersAsignarRolResponse,
  UsersAsignarRolResponse,
} from "../mappers/users.mapper";
import { UsersRepository } from "../repository/user.repository";
import { ViewUsersAsigarRol } from "../types/users.types";

export class UsersService {
  private repo = new UsersRepository();

  // Treaer usuarios en rol CIDADANO pendientes de asignar
  async svListarUsuariosPendientesAsignar(): Promise<ViewUsersAsigarRol[]> {
    const rows = await this.repo.listarUsuariosPendientesRP();

    return rows.map(mapUsersAsignarRol);
  }

  async svListarUsuariosRegistrados(): Promise<UsersAsignarRolResponse> {
    const rows = await this.repo.listarUsuariosRegistradosRP();
    console.log(rows);
    return mapUsersAsignarRolResponse(rows[0]);
  }
}
