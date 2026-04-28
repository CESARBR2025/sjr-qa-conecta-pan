import { NextRequest, NextResponse } from "next/server";
import { AuthErrors } from "@/lib/errors";
import crypto from "crypto";
import { POOL_PG } from "@/lib/db";
import bcrypt from "bcryptjs";
import { sendMail } from "@/lib/email/mailer";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const { nombre, apellidoPaterno, apellidoMaterno, email, password, curp } =
      body;

    // 1. Validar campos requeridos
    if (
      !nombre ||
      !apellidoPaterno ||
      !apellidoMaterno ||
      !email ||
      !password ||
      !curp
    ) {
      console.log("entro");
      throw AuthErrors.MISSING_FIELDS;
    }
    console.log("paso");

    // 2. Validar password minima
    if (password.length < 8) {
      return NextResponse.json(
        {
          ok: false,
          message: "La contraseña debe tener mínimo 8 caracteres",
        },
        { status: 400 },
      );
    }

    // 3. Validar si ya existe el correo
    const existingUser = await POOL_PG.query(
      `
        SELECT id FROM users WHERE email = $1 
        LIMIT 1
        `,
      [email],
    );

    if (existingUser.rows.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          message: "Este correo ya se encuentra registrado",
        },
        { status: 409 },
      );
    }

    // 4. Hashear password
    const hashedPassword = await bcrypt.hash(password, 12);

    // 5. Generar token de verificacion
    const rawToken = crypto.randomBytes(32).toString("hex");

    const tokenHash = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    console.log("paso");

    //Definir expiracion
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24);
    console.log(expiresAt);

    // 7. Crear usuario
    const newUser = await POOL_PG.query(
      `
  INSERT INTO users (
    nombre,
    ap_paterno,
    ap_materno,
    email,
    password_hash,
    role_id,
    is_active,
    last_login,
    created_at,
    updated_at,
    curp,
    estatus,
    email_verified,
    id_usuario_general
  )
  VALUES (
    $1,
    $2,
    $3,
    $4,
    $5,
    7,
    true,
    NOW(),
    NOW(),
    NOW(),
    $6,
    'pending_verification',
    false,
    10
  )
  RETURNING id
  `,
      [nombre, apellidoPaterno, apellidoMaterno, email, hashedPassword, curp],
    );

    const userId = newUser.rows[0].id;

    // 8. Guardar token
    await POOL_PG.query(
      `
      INSERT INTO verification_tokens (
        user_id,
        token_hash,
        expires_at,
        used,
        created_at
      )
      VALUES (
        $1,
        $2,
        $3,
        false,
        NOW()
      )
      `,
      [userId, tokenHash, expiresAt],
    );

    // 9. Url de verificacion
    const verifyUrl = `${process.env.LOCAL_HOST}/api/auth/verify-account?token=${rawToken}`;

    // 10. Enviar correo
    const text = `
Hola ${nombre},

Gracias por registrarte.

Confirma tu cuenta dando clic en el siguiente enlace:

${verifyUrl}

Este enlace expirará en 24 horas.
    `;

    const html = `
      <div style="font-family: Arial, sans-serif; padding: 24px;">
        <h2>Confirma tu cuenta</h2>

        <p>
          Hola <strong>${nombre}</strong>,
        </p>

        <p>
          Gracias por registrarte.
          Para continuar, confirma tu correo electrónico.
        </p>

        <a
          href="${verifyUrl}"
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
          Confirmar cuenta
        </a>

        <p style="margin-top: 24px; font-size: 14px; color: #666;">
          Este enlace expirará en 24 horas.
        </p>

        <p style="margin-top: 16px; font-size: 14px;">
          Si el botón no funciona, copia y pega este enlace:
          <br />
          ${verifyUrl}
        </p>
      </div>
    `;

    await sendMail({
      to: email,
      subject: "Confirma tu cuenta",
      text,
      html,
    });

    // 11. Respuesta final
    return NextResponse.json(
      {
        ok: true,
        message: "Registro exitoso. Revisa tu correo para confirmar tu cuenta.",
        redirect: "/login/check-email",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("REGISTER_ERROR:", error);

    return NextResponse.json(
      {
        ok: false,
        message: "Ocurrió un error al registrar la cuenta",
      },
      { status: 500 },
    );
  }
}
