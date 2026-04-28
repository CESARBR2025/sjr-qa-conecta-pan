"use server";

import { revalidatePath } from "next/cache";
import { ViewRolesPermisos, ViewRolesTable } from "../types/roles.types";
import { RolesService } from "./roles.service";
import { sendMail } from "@/lib/email/mailer";

type ActionReponse = { success: true } | { success: false; error: string };

//Listar articulos

export type RolesResponse = {
  success: boolean;
  data: ViewRolesTable[] | null;
  error?: string;
};

export type RolesPermisosResponse = {
  success: boolean;
  data: ViewRolesPermisos[] | null;
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
    console.log(dataUsuario);

    //2. Enviar correo
    // 10. Enviar correo
    const text = `
Hola ${dataUsuario.nombre || "Usuario"},

Te informamos que tu rol en la plataforma ha sido actualizado.

Nuevo rol asignado: ${dataUsuario.nombre}

A partir de este momento, tendrás acceso a las funcionalidades correspondientes a este rol dentro del sistema.

Si tienes alguna duda o consideras que esto es un error, puedes contactar al equipo de administración.

Saludos,
Equipo de la plataforma
`;

    const html = `
  <div style="font-family: Arial, sans-serif; padding: 24px; background-color: #FAFBFF; border-radius: 12px;">

    <h2 style="color: #1F69E7; margin-bottom: 16px;">
      Actualización de rol en la plataforma
    </h2>

    <p>
      Hola <strong>${dataUsuario.nombre || "Usuario"}</strong>,
    </p>

    <p>
      Te informamos que tu rol en la plataforma ha sido <strong>actualizado</strong>.
    </p>

    <div style="
      margin: 20px 0;
      padding: 16px;
      background-color: #ffffff;
      border: 1px solid #EAF1FC;
      border-radius: 10px;
    ">
      <p style="margin: 0; font-size: 14px; color: #666;">
        Nuevo rol asignado:
      </p>
      <p style="margin: 6px 0 0 0; font-size: 18px; font-weight: 700; color: #1F69E7;">
        ${dataUsuario.role_name}
      </p>
    </div>

    <p style="font-size: 14px; color: #333;">
      A partir de este momento, tendrás acceso a las funcionalidades correspondientes a este rol dentro del sistema.
    </p>

    <p style="font-size: 14px; color: #333;">
      Si no reconoces este cambio o consideras que es un error, por favor contacta al equipo de administración.
    </p>

    <p style="margin-top: 24px; font-size: 14px; color: #666;">
      Saludos,<br/>
      Equipo de la plataforma
    </p>

  </div>
`;

    sendMail({
      to: dataUsuario.email,
      subject: "Nueva solicitud de usuario",
      text,
      html,
    }).catch((err) => {
      console.error("ERROR EMAIL ADMIN:", err);
    });

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

export async function listarRolesPermisosAction(): Promise<RolesPermisosResponse> {
  const service = new RolesService();
  try {
    const dataUsuario = await service.svListarRolesPermisos();
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
