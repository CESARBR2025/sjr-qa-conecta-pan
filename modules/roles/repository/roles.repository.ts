
import { DBRolesTable, ViewRolesTable } from '../types/roles.types';

import { POOL_PG } from '@/lib/db';

// ============================================================
// QUERIES SQL
// ============================================================

const SQL = {
  

  LISTAR_ROLES: `
   SELECT id, name
FROM public.roles;

  `,

  ACTUALIZAR_ROL_USUARIO_1: `
  UPDATE users
SET role_id = $1
WHERE id_usuario_general = $2;
  `,

  ACTUALIZAR_ROL_USUARIO_2: `
  UPDATE users_status
SET 
  status = 'ASIGNADO',
  updated_at = NOW()
WHERE user_id = $1;
  
  `

  

} as const;

// ============================================================
// REPOSITORIO
// ============================================================

export class RolesRepository {

  
  async listarRolesActuales(): Promise<DBRolesTable[]> {
    
    const res = await POOL_PG.query<DBRolesTable>(SQL.LISTAR_ROLES);

    return res.rows;
  }

  
    async  actualizarRolUsuarioNuevo(idCus: number, idRol: number, userId: string): Promise<void> {
      const client = await POOL_PG.connect()
       console.log(userId)
  
      try{
        await client.query("BEGIN")
  
        // 1. Insert en usuarios para obtener el id
        const userResult =  await client.query(
          SQL.ACTUALIZAR_ROL_USUARIO_1,[
            idRol,
            idCus
          ]
        )

       
        // 2. Insert en users_status
        const userResultDos = await client.query(
          SQL.ACTUALIZAR_ROL_USUARIO_2, [
            userId,  
          ]
        )
        await client.query("COMMIT")
  
      }catch (error){
        await client.query("ROLLBACK")
           console.log(error)
        throw error
     
      } finally {
        client.release()
      }
  
    
   
    }
  


}
