

import { UsersRepository } from '../repository/login.repository';
import { DBUsers, ViewUsers } from '../types/login.types';
import { mapBuscarUsuarioCus } from '../mappers/login.mappers';


export class UsersService {
  private repo = new UsersRepository();

  // Treaer datos de tabla ligera
  async svBuscarUsuarioCus(id: number): Promise<ViewUsers[]> {
    console.log("entro")
    const rows = await this.repo.buscarUsuarioGeneralRP(id);
    console.log(rows)
    console.log(rows)
    return rows.map(mapBuscarUsuarioCus); // aplicar el mapper
  }

  //Registrar nuevo usuario
  async svRegistrarNuevoUsuario(data: ViewUsers){
    const rows = await this.repo.registrarNuevoUsuario(data)
    
  }
  

}
