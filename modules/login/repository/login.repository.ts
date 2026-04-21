import { DBUsers, ViewUsers } from '../types/login.types';
import { POOL_PG } from '@/lib/db';

// ============================================================
// QUERIES SQL
// ============================================================

const SQL = {
  BUSCAR_USUARIO_GENERAL: `
    SELECT * FROM users WHERE id_usuario_general = $1
  `,
  REGISTRAR_NUEVO_USUARIO: `
  INSERT INTO users 
    (email, password_hash, role_id, is_active, last_login, created_at,
    updated_at, curp, id_usuario_general, nombre, ap_paterno, ap_materno)
  VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
   RETURNING *
  `,


} as const;

// ============================================================
// REPOSITORIO
// ============================================================

export class UsersRepository {
  async buscarUsuarioGeneralRP(id: number): Promise<DBUsers[]> {
    console.log(id)
    const res = await POOL_PG.query<DBUsers>(SQL.BUSCAR_USUARIO_GENERAL,[
        id
    ] );

    return res.rows;
  }

  async  registrarNuevoUsuario(data: ViewUsers): Promise<void> {
    console.log(data)
 await POOL_PG.query(SQL.REGISTRAR_NUEVO_USUARIO, [
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
     
    ]);
  }

  

}
