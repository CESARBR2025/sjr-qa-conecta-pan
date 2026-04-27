// ════════════════════════════════════════════════════
// LOGICA DE NEGOCIO PARA ENVIO DE CORREOS
// ════════════════════════════════════════════════════
"use server";

import { sendMail } from "@/lib/email/mailer";
import { templateInfraccion } from "../templates/auth.template";

export interface EnviarCorreoParams {
  //Necesarios para envio
  correo: string;
  nombre: string;
  apPaterno: string;
  Estatus: string;
}

export async function enviarCorreoAuth() {
  const CORREO = "barcenasrosalescesarivan@gmail.com";

  const url = "http://localhost:3000/admin/usuarios/solicitudes";

  const text = `
    Existe una nueva solicitud de usuario pendiente de revisión.
    Ingresa al sistema para asignar el rol correspondiente:
    ${url}
  `;

  const html = `
    <div style="font-family: Arial, sans-serif; padding: 24px;">
      <h2>Nueva Solicitud de Usuario</h2>

      <p>
        Se ha registrado una nueva solicitud de usuario pendiente de revisión.
      </p>

      <p>
        Da clic en el siguiente botón para asignar el rol correspondiente:
      </p>

      <a
        href="${url}"
        style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #1F69E7;
          color: #ffffff;
          text-decoration: none;
          border-radius: 8px;
          font-weight: 600;
        "
      >
        Asignar
      </a>

      <p style="margin-top: 24px; font-size: 14px; color: #666;">
        Si el botón no funciona, copia y pega este enlace en tu navegador:
      </p>

      <p style="font-size: 14px;">
        ${url}
      </p>
    </div>
  `;

  await sendMail({
    to: CORREO,
    subject: "Nueva Solicitud de Usuario Pendiente de Revisión",
    text,
    html,
  });

  console.log("✅ Correo enviado a:", CORREO);
}
