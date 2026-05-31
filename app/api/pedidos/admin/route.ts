import { NextRequest, NextResponse } from "next/server";
import { createPedidoAdmin } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { nombre, telefono, sede_facultad, tipo_servicio, precio_venta, notas } =
      body;

    if (!nombre || !telefono || !tipo_servicio) {
      return NextResponse.json(
        { error: "Nombre, teléfono y tipo de servicio son requeridos" },
        { status: 400 }
      );
    }

    if (tipo_servicio !== "basico" && tipo_servicio !== "personalizado") {
      return NextResponse.json(
        { error: "Tipo de servicio inválido" },
        { status: 400 }
      );
    }

    const pedidoId = await createPedidoAdmin({
      nombre,
      telefono,
      sede_facultad: sede_facultad || null,
      tipo_servicio,
      precio_venta: precio_venta ?? 10000,
      notas: notas || null,
    });

    return NextResponse.json(
      { id: pedidoId, message: "Pedido creado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando pedido admin:", error);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}
