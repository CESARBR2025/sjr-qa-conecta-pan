"use server";

import { revalidatePath } from "next/cache";
import { ViewRolesTable } from "../types/roles.types";
import { RolesService } from "./roles.service";

type ActionReponse = { success: true } | { success: false; error: string };

//Listar articulos

export type RolesResponse = {
  success: boolean;
  data: ViewRolesTable[] | null;
  error?: string;
};

export async function listarRolesAction(): Promise<RolesResponse> {
  const service = new RolesService();
  try {
    const dataUsuario = await service.svListarRolesActuales();
    return {
      success: true,
      data: dataUsuario,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, data: null, error: error.message };
    }

    return {
      success: false,
      data: null,
      error: "Ocurrio error inesperado",
    };
  }
}

//Actualizar rol usuario nuevo
type ActualizarRolResponse = {
  success: boolean;
  data: any | null;
  error?: string;
};

export async function actualizarRolAction(
  idRol: number,
  userId: string,
): Promise<ActualizarRolResponse> {
  const service = new RolesService();
  console.log(userId);
  console.log(idRol);
  try {
    const dataUsuario = await service.svActualizarRolUsuarioNuevo(
      idRol,
      userId,
    );
    return {
      success: true,
      data: dataUsuario,
    };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, data: null, error: error.message };
    }

    return {
      success: false,
      data: null,
      error: "Ocurrio error inesperado",
    };
  }
}
