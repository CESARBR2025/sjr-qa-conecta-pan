import { UserMiddleware } from '@/middleware/middleware.types';
import { DBUsers, ViewUsers } from '../types/login.types';
import { POOL_PG } from '@/lib/db';

// ============================================================
// QUERIES SQL
// ============================================================

const SQL = {
  

  BUSCAR_USUARIO_GENERAL: `
    SELECT u.*, r.name as roleName, ARRAY_AGG(p.name) as permissions FROM users u 
    join roles r on u.role_id  = r.id 
    LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE u.id_usuario_general = $1 AND u.is_active = true
      GROUP BY u.id, u.email, u.nombre , u.role_id, r.name
  `,
  REGISTRAR_NUEVO_USUARIO: `
  INSERT INTO users 
    (email, password_hash, role_id, is_active, last_login, created_at,
    updated_at, curp, id_usuario_general, nombre, ap_paterno, ap_materno)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
   RETURNING *
  `,

  REGISTRAR_NUEVO_USUARIO_USERS_STATUS : `
   INSERT INTO users_status (
        user_id,
        status,
        created_at,
        updated_at
      )
      VALUES ($1, $2, NOW(), NOW())
  `


} as const;

// ============================================================
// REPOSITORIO
// ============================================================

export class LoginRepository {

    

  async buscarUsuarioGeneralRP(id: number): Promise<DBUsers> {
    console.log(id)
    const res = await POOL_PG.query<DBUsers>(SQL.BUSCAR_USUARIO_GENERAL,[
        id
    ] );

    return res.rows[0];
  }

  async  registrarNuevoUsuario(data: ViewUsers): Promise<void> {
    const client = await POOL_PG.connect()

    try{
      await client.query("BEGIN")

      // 1. Insert en usuarios para obtener el id
      const userResult =  await client.query(
        SQL.REGISTRAR_NUEVO_USUARIO,[
           data.email,
     data.password_hash,
     data.rolId,
     data.Isactivo,
     data.ultimoAcceso,
     data.creacion,
     data.actualizacion,
     data.curp,
     data.idUsuarioCus,
     data.nombres,
     data.apPaterno,
     data.apMaterno
        ]
      )

      const userId = userResult.rows[0].id
      console.log(userId)

      // 2. Insert en users_status
      const userResultDos = await client.query(
        SQL.REGISTRAR_NUEVO_USUARIO_USERS_STATUS, [
          userId,  'PENDIENTE'
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
