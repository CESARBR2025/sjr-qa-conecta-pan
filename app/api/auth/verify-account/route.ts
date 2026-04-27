import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

import { POOL_PG as db } from "@/lib/db";

export async function GET(req: NextRequest) {
  console.log("entro");
  try {
    /**
     * 1. Obtener token desde query params
     * Ejemplo:
     * /api/verify-account?token=abc123
     */
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("token");

    console.log(token);
    /**
     * 2. Validar que exista token
     */
    if (!token) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/login/verify-error?reason=missing_token`,
      );
    }

    console.log("paso");

    /**
     * 3. Generar hash del token recibido
     * (nunca buscamos el raw token en DB)
     */
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    /**
     * 4. Buscar token válido
     * Debe cumplir:
     * - no usado
     * - no expirado
     */
    const tokenResult = await db.query(
      `
      SELECT
        id,
        user_id,
        expires_at,
        used
      FROM verification_tokens
      WHERE token_hash = $1
        AND used = false
        AND expires_at > NOW()
      LIMIT 1
      `,
      [tokenHash],
    );

    console.log("paso");
    /**
     * 5. Si no existe token válido
     */
    if (tokenResult.rows.length === 0) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/verify-error?reason=invalid_or_expired`,
      );
    }

    const verificationToken = tokenResult.rows[0];
    const userId = verificationToken.user_id;
    const verificationTokenId = verificationToken.id;
    console.log(verificationToken);
    console.log(userId);
    console.log(verificationTokenId);

    /**
     * 6. Actualizar usuario
     *
     * email_verified = true
     * status = pending_approval
     */
    await db.query(
      `
      UPDATE users
      SET
        email_verified = true,
        estatus = 'pending_approval',
        updated_at = NOW()
      WHERE id = $1
      `,
      [userId],
    );

    console.log("paso");
    /**
     * 7. Marcar token como usado
     */
    await db.query(
      `
      UPDATE verification_tokens
      SET
        used = true
      WHERE id = $1
      `,
      [verificationTokenId],
    );

    /**
     * 8. (Opcional PRO)
     * Invalidar otros tokens viejos del mismo usuario
     */
    await db.query(
      `
      UPDATE verification_tokens
      SET used = true
      WHERE user_id = $1
        AND id != $2
      `,
      [userId, verificationTokenId],
    );

    /**
     * 9. Redireccionar a pantalla "en espera"
     */
    return NextResponse.redirect(`${process.env.LOCAL_HOST}/login/en-espera`);
  } catch (error) {
    console.error("VERIFY_ACCOUNT_ERROR:", error);

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/verify-error?reason=server_error`,
    );
  }
}
