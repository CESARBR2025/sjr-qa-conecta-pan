// ════════════════════════════════════════════════════
// HTML DEL CORREO - PLANTILLAS
// ════════════════════════════════════════════════════
type TemplateInfraccionProps = {
  nombre: string;
  folio: string;
  concepto?: string;
};

import { EnviarCorreoParams } from "../service/mailer.server";
export function templateInfraccion(): {
  html: string;
  text: string;
} {
  const html = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Notificación de Infracción - SSPM</title>
</head>
<body style="margin:0;padding:0;background:#F4F4F0;font-family:'Segoe UI',Arial,sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F4F4F0;padding:32px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #E0DEDA;">

  <!-- HEADER -->
<tr>
  <td style="background:#0D2B55;padding:32px 24px;text-align:center;">
    
    <!-- LOGO -->
    <div style="margin-bottom:16px;">
      <img 
        src="cid:logo_estrella"
        alt="Logo"
        width="72"
        height="72"
        style="display:block;margin:0 auto;border-radius:50%;border:3px solid #E5C97A;background:#FFFFFF;padding:6px;"
      />
    </div>

    <!-- TÍTULO -->
    <p style="margin:0 0 6px;color:#FFFFFF;font-size:15px;font-weight:700;letter-spacing:1.2px;text-transform:uppercase;font-family:Georgia,serif;">
      Secretaría de Seguridad Pública Municipal
    </p>

    <!-- SUBTÍTULO -->
    <p style="margin:0;color:#C7D6EA;font-size:12px;letter-spacing:0.5px;font-family:Arial,Helvetica,sans-serif;">
      San Juan del Río, Querétaro · Dirección de Tránsito y Vialidad
    </p>

  </td>
</tr>
        <!-- ALERT BAR -->
        <tr>
          <td style="background:#C9A84C;padding:10px 32px;">
            <p style="margin:0;font-size:12px;font-weight:700;color:#0D2B55;letter-spacing:0.8px;text-transform:uppercase;">
              ● &nbsp;Notificación de infracción de tránsito
            </p>
          </td>
        </tr>

        <!-- BODY -->
        <tr>
          <td style="padding:32px 32px 8px;">
            <p style="font-size:15px;color:#1A1A1A;line-height:1.7;margin:0 0 24px;">
              Estimado(a) <strong>{nombreCompleto}</strong>,<br><br>
              Le informamos que se ha registrado una infracción de tránsito a su nombre en el municipio de San Juan del Río, Querétaro. A continuación encontrará el resumen del registro oficial.
            </p>
            <hr style="border:none;border-top:1px solid #EBEBEB;margin:0 0 24px;" />

            <!-- CARD: INFRACTOR -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DEDA;border-radius:10px;overflow:hidden;margin-bottom:20px;">
              <tr>
                <td style="background:#F7F6F2;padding:10px 20px;border-bottom:1px solid #E0DEDA;">
                  <span style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#6B6860;">Datos del infractor</span>
                </td>
              </tr>
              <tr><td style="padding:4px 20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  {fila("Nombre completo", nombreCompleto)}
                  {fila("CURP", curpInfractor)}
                </table>
              </td></tr>
            </table>

            <!-- CARD: VEHÍCULO -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DEDA;border-radius:10px;overflow:hidden;margin-bottom:20px;">
              <tr>
                <td style="background:#F7F6F2;padding:10px 20px;border-bottom:1px solid #E0DEDA;">
                  <span style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#6B6860;">Datos del vehículo</span>
                </td>
              </tr>
              <tr><td style="padding:4px 20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  {fila("Placas", placa)}
                  {fila("Vehículo", vehiculo)}
                  {fila("Color", color)}
                </table>
              </td></tr>
            </table>

            <!-- CARD: INFRACCIÓN -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #E0DEDA;border-radius:10px;overflow:hidden;margin-bottom:20px;">
              <tr>
                <td style="background:#F7F6F2;padding:10px 20px;border-bottom:1px solid #E0DEDA;">
                  <span style="font-size:11px;font-weight:700;letter-spacing:0.8px;text-transform:uppercase;color:#6B6860;">Detalle de la infracción</span>
                </td>
              </tr>
              <tr><td style="padding:4px 20px 0;">
                <table width="100%" cellpadding="0" cellspacing="0">
                  {fila("Folio", folio)}
                  {fila("Artículo", articuloDescripcion)}
                  {fila("Fracción", conceptoDescripcion, true)}
                </table>
              </td></tr>
            </table>
          </td>
        </tr>

        <!-- NOTE -->
        <tr>
          <td style="padding:0 32px 28px;">
            <table width="100%" cellpadding="0" cellspacing="0" style="border-left:3px solid #0D2B55;background:#F7F6F2;border-radius:0 8px 8px 0;">
              <tr>
                <td style="padding:14px 16px;">
                  <p style="margin:0;font-size:13px;color:#555;line-height:1.6;">
                    Este correo es únicamente una notificación informativa. Para consultar el estado de su infracción o iniciar un trámite, acuda en persona a las oficinas de la SSPM en Ciudad Vive Oriente.
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>

        <!-- FOOTER -->
        <tr>
          <td style="background:#F7F6F2;border-top:1px solid #E0DEDA;padding:20px 32px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#888;line-height:1.7;">
              Secretaría de Seguridad Pública Municipal de San Juan del Río<br>
             Av de las Garzas 57 s/n, Indeco, 76808 San Juan del Río, Qro.<br>
              <span style="opacity:0.6;">Este es un mensaje automático. Por favor no responda a este correo.</span>
            </p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>

</body>
</html>`;

  const text = `SSPM - Notificación de Infracción de Tránsito
San Juan del Río, Querétaro

Estimado(a) {nombreCompleto},

Se ha registrado una infracción de tránsito a su nombre.

DATOS DEL INFRACTOR
Nombre: {nombreCompleto}
CURP: {curpInfractor}

DATOS DEL VEHÍCULO
Placas: {placa}
Vehículo: {vehiculo}
Color: {color}

DETALLE DE LA INFRACCIÓN
Folio: {folio}
Artículo: {articuloDescripcion}
Fracción: {conceptoDescripcion}

Para consultar su infracción comuníquese al (427) 272-0000
o acuda a las oficinas de la SSPM.

Av. Constituyentes s/n, Centro, San Juan del Río, Qro.
Este es un mensaje automático.`;

  return { html, text };
}

// Helper para filas de tabla
function fila(label: string, value: string, isLast = false): string {
  return `
    <tr>
      <td style="font-size:12px;color:#888;font-weight:500;padding:10px 0;border-bottom:{isLast ? "none" : "1px solid #EBEBEB"};width:140px;">${label}</td>
      <td style="font-size:14px;color:#1A1A1A;font-weight:500;padding:10px 0;border-bottom:{isLast ? "none" : "1px solid #EBEBEB"};text-align:right;">${value}</td>
    </tr>`;
}
