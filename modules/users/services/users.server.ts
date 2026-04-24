'use server';


import { revalidatePath } from 'next/cache';
import { ViewUsersAsigarRol } from '../types/users.types';
import { UsersService } from './users.service';



type ActionReponse = { success: true } | { success: false; error: string };

//Listar articulos

export type UsersResponse = {
  success: boolean;
  data: ViewUsersAsigarRol[] | null;
  error?: string;
};

export async function listarUsuariosPendientesAction(): Promise<UsersResponse> {
  const service = new UsersService();
  try {
    const dataUsuario = await service.svListarUsuariosPendientesAsignar();
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
