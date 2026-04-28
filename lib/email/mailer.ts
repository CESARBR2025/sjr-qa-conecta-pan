// ============================================
// SERVICIO: Mailer (Nodemailer + SMTP)
// Reutilizable en todos los módulos del sistema
// ============================================

import nodemailer from "nodemailer";
import path from "path";
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export interface MailOptions {
  to?: string;
  subject: string;
  text: string;
  html: string;
}

export async function sendMail(options: MailOptions): Promise<void> {
  if (!options.to) {
    console.warn("[mailer] Correo no proporcionado, omitiendo envío.");
    return;
  }

  await transporter.sendMail({
    from: `"Conecta PAN" <${process.env.SMTP_USER}>`,
    to: options.to,
    subject: options.subject,
    text: options.text,
    html: options.html,
    attachments: [
      {
        filename: "Estrella.png", // usa PNG mejor
        path: path.join(process.cwd(), "public/conecta-pan-logo-f2.png"), // ruta LOCAL en tu servidor
        cid: "logo_estrella", // 👈 este es el que usas en el HTML
      },
    ],
  });
}
