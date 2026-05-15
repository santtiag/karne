import { NextRequest, NextResponse } from "next/server";
import { getPedidoById, updatePedidoEstado } from "@/lib/db";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const pedido = await getPedidoById(Number(id));
    if (!pedido) {
      return NextResponse.json(
        { error: "Pedido no encontrado" },
        { status: 404 }
      );
    }
    return NextResponse.json(pedido);
  } catch (error) {
    console.error("Error obteniendo pedido:", error);
    return NextResponse.json(
      { error: "Error al obtener el pedido" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { estado } = body;

    if (!estado) {
      return NextResponse.json(
        { error: "El estado es requerido" },
        { status: 400 }
      );
    }

    await updatePedidoEstado(Number(id), estado);
    return NextResponse.json({ message: "Estado actualizado" });
  } catch (error) {
    console.error("Error actualizando pedido:", error);
    return NextResponse.json(
      { error: "Error al actualizar el pedido" },
      { status: 500 }
    );
  }
}
