import { LoginRepository } from "../repository/login.repository";
import { DBUsers, ViewUsers } from "../types/login.types";
import { mapBuscarUsuarioCus } from "../mappers/login.mappers";
import { UserMiddleware } from "@/middleware/middleware.types";

export class LoginService {
  private repo = new LoginRepository();

  // Treaer datos de tabla ligera
  async svBuscarUsuarioCus(correo: string): Promise<ViewUsers> {
    const rows = await this.repo.buscarUsuarioGeneralRP(correo);
    console.log(rows);
    console.log(rows);
    return mapBuscarUsuarioCus(rows);
  }

  //Registrar nuevo usuario
  async svRegistrarNuevoUsuario(data: ViewUsers) {
    const rows = await this.repo.registrarNuevoUsuario(data);
  }
}
