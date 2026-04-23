
import { DBUsers, ViewUsers } from '../types/login.types';




export function mapBuscarUsuarioCus(row: DBUsers): ViewUsers {
  return {
    idUser: row.id,
    email: row.email,
    password_hash: row.password_hash,
    rolId: row.role_id,
    rolName: row.rolename,
    permissions: row.permissions,
    Isactivo:row.is_active,
    ultimoAcceso: row.last_login,
    creacion: row.created_at,
    actualizacion: row.updated_at,
    curp: row.curp,
    idUsuarioCus: row.id_usuario_general,
    nombres: row.nombre,
    apPaterno: row.ap_paterno,
    apMaterno: row.ap_materno 
    
  };
}
