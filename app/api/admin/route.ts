import { NextRequest, NextResponse } from "next/server";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_TOKEN = "admin-session-token-2026";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { password } = body;

    if (!ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: "Admin password no configurado" },
        { status: 500 }
      );
    }

    if (password === ADMIN_PASSWORD) {
      return NextResponse.json({ token: ADMIN_TOKEN });
    }

    return NextResponse.json(
      { error: "Contraseña incorrecta" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Error en la autenticación" },
      { status: 500 }
    );
  }
}
