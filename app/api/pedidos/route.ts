import { NextRequest, NextResponse } from "next/server";
import { createPedido, getPedidosConFiltros } from "@/lib/db";
import { getSupabaseServer } from "@/lib/supabase-server";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();

    const nombre = formData.get("nombre") as string;
    const telefono = formData.get("telefono") as string;
    const sedeFacultad = formData.get("sede_facultad") as string | null;
    const tipoServicio = formData.get("tipo_servicio") as string;
    const disenoElegido = formData.get("diseno_elegido") as string | null;
    const archivoCarnet = formData.get("archivo_carnet") as File;
    const comprobante = formData.get("comprobante_pago") as File;

    if (!nombre || !telefono || !tipoServicio || !archivoCarnet || !comprobante) {
      return NextResponse.json(
        { error: "Todos los campos obligatorios son requeridos" },
        { status: 400 }
      );
    }

    if (tipoServicio !== "basico" && tipoServicio !== "personalizado") {
      return NextResponse.json(
        { error: "Tipo de servicio inválido" },
        { status: 400 }
      );
    }

    if (tipoServicio === "personalizado" && !disenoElegido) {
      return NextResponse.json(
        { error: "Debes elegir un diseño para el servicio personalizado" },
        { status: 400 }
      );
    }

    const timestamp = Date.now();
    const carnetFileName = `${timestamp}-carnet-${archivoCarnet.name}`;
    const comprobanteFileName = `${timestamp}-comprobante-${comprobante.name}`;

    // Subir archivos a Supabase Storage
    const { error: carnetError } = await getSupabaseServer().storage
      .from("pedidos")
      .upload(carnetFileName, archivoCarnet, { contentType: archivoCarnet.type });

    if (carnetError) {
      console.error("Error subiendo carnet:", carnetError);
      return NextResponse.json(
        { error: "Error subiendo el carnet" },
        { status: 500 }
      );
    }

    const { error: comprobanteError } = await getSupabaseServer().storage
      .from("pedidos")
      .upload(comprobanteFileName, comprobante, { contentType: comprobante.type });

    if (comprobanteError) {
      console.error("Error subiendo comprobante:", comprobanteError);
      return NextResponse.json(
        { error: "Error subiendo el comprobante" },
        { status: 500 }
      );
    }

    // Obtener URLs públicas
    const { data: carnetUrl } = getSupabaseServer().storage.from("pedidos").getPublicUrl(carnetFileName);
    const { data: comprobanteUrl } = getSupabaseServer().storage.from("pedidos").getPublicUrl(comprobanteFileName);

    const pedidoId = await createPedido({
      nombre,
      telefono,
      sede_facultad: sedeFacultad || null,
      tipo_servicio: tipoServicio as "basico" | "personalizado",
      diseno_elegido: disenoElegido || null,
      estado: "pendiente",
      archivo_carnet: carnetUrl.publicUrl,
      comprobante_pago: comprobanteUrl.publicUrl,
      pago_realizado: false,
      carnet_recibido: false,
      diseno_listo: false,
      precio_venta: 10000,
      notas: null,
    });

    return NextResponse.json(
      { id: pedidoId, message: "Pedido creado exitosamente" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creando pedido:", error);
    return NextResponse.json(
      { error: "Error al crear el pedido" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const estado = searchParams.get("estado") || undefined;
    const tipoServicio = searchParams.get("tipo_servicio") || undefined;
    const q = searchParams.get("q") || undefined;
    const pedidos = await getPedidosConFiltros(estado, tipoServicio, q);
    return NextResponse.json(pedidos);
  } catch (error) {
    console.error("Error obteniendo pedidos:", error);
    return NextResponse.json(
      { error: "Error al obtener pedidos" },
      { status: 500 }
    );
  }
}
