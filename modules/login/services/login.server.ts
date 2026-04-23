'use server';

import { UsersService } from './login.service';
import { revalidatePath } from 'next/cache';
import { ViewUsers } from '../types/login.types';


type ActionReponse = { success: true } | { success: false; error: string };

//Listar articulos

export type UsersResponse = {
  success: boolean;
  data: ViewUsers | null;
  error?: string;
};

export async function buscarUsuarioCusAction(id: number): Promise<UsersResponse> {
  const service = new UsersService();
  try {
    const dataUsuario = await service.svBuscarUsuarioCus(id);
    return {
      success: true,
      data: dataUsuario,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, data: null , error: error.message };
    }

    return {
      success: false,
      data: null,
      error: 'Ocurrio error inesperado',
    };
  }
}


//Crear articulo
export async function registrarUsuarioAction(data: ViewUsers): Promise<ActionReponse> {
  const service = new UsersService();

  try {
    await service.svRegistrarNuevoUsuario(data);
    

    return { success: true };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }

    return {
      success: false,
      error: 'Ocurrio error inesperado',
    };
  }
}
