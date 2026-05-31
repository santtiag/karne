import { getSupabase } from "./supabase";

export interface Pedido {
  id: number;
  nombre: string;
  telefono: string;
  sede_facultad: string | null;
  tipo_servicio: "basico" | "personalizado";
  diseno_elegido: string | null;
  estado: "pendiente" | "en_proceso" | "listo" | "entregado";
  archivo_carnet: string;
  comprobante_pago: string;
  pago_realizado: boolean;
  carnet_recibido: boolean;
  diseno_listo: boolean;
  precio_venta: number;
  notas: string | null;
  created_at: string;
  updated_at: string;
}

export async function createPedido(
  data: Omit<Pedido, "id" | "created_at" | "updated_at">
) {
  const { data: result, error } = await getSupabase()
    .from("pedidos")
    .insert({
      nombre: data.nombre,
      telefono: data.telefono,
      sede_facultad: data.sede_facultad,
      tipo_servicio: data.tipo_servicio,
      diseno_elegido: data.diseno_elegido,
      estado: data.estado,
      archivo_carnet: data.archivo_carnet,
      comprobante_pago: data.comprobante_pago,
      pago_realizado: data.pago_realizado ?? false,
      carnet_recibido: data.carnet_recibido ?? false,
      diseno_listo: data.diseno_listo ?? false,
      precio_venta: data.precio_venta ?? 10000,
      notas: data.notas,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Error creando pedido: ${error.message}`);
  }

  return result.id as number;
}

export async function createPedidoAdmin(
  data: Pick<
    Pedido,
    | "nombre"
    | "telefono"
    | "sede_facultad"
    | "tipo_servicio"
    | "precio_venta"
    | "notas"
  >
) {
  const { data: result, error } = await getSupabase()
    .from("pedidos")
    .insert({
      nombre: data.nombre,
      telefono: data.telefono,
      sede_facultad: data.sede_facultad || null,
      tipo_servicio: data.tipo_servicio,
      estado: "pendiente",
      archivo_carnet: "",
      comprobante_pago: "",
      pago_realizado: false,
      carnet_recibido: false,
      diseno_listo: false,
      precio_venta: data.precio_venta ?? 10000,
      notas: data.notas || null,
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Error creando pedido: ${error.message}`);
  }

  return result.id as number;
}

export async function getPedidos(estado?: string, tipoServicio?: string) {
  let query = getSupabase()
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  if (estado) {
    query = query.eq("estado", estado);
  }

  if (tipoServicio) {
    query = query.eq("tipo_servicio", tipoServicio);
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Error obteniendo pedidos: ${error.message}`);
  }

  return (data as Pedido[]) || [];
}

export async function getPedidosConFiltros(
  estado?: string,
  tipoServicio?: string,
  query?: string
) {
  let q = getSupabase()
    .from("pedidos")
    .select("*")
    .order("created_at", { ascending: false });

  if (estado) {
    q = q.eq("estado", estado);
  }

  if (tipoServicio) {
    q = q.eq("tipo_servicio", tipoServicio);
  }

  if (query) {
    q = q.or(`nombre.ilike.%${query}%,telefono.ilike.%${query}%`);
  }

  const { data, error } = await q;

  if (error) {
    throw new Error(`Error obteniendo pedidos: ${error.message}`);
  }

  return (data as Pedido[]) || [];
}

export async function getPedidoById(id: number) {
  const { data, error } = await getSupabase()
    .from("pedidos")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw new Error(`Error obteniendo pedido: ${error.message}`);
  }

  return data as Pedido;
}

export async function updatePedidoEstado(id: number, estado: string) {
  const { error } = await getSupabase()
    .from("pedidos")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Error actualizando pedido: ${error.message}`);
  }
}

export async function updatePedido(
  id: number,
  data: Partial<
    Omit<
      Pedido,
      "id" | "created_at" | "updated_at" | "archivo_carnet" | "comprobante_pago"
    >
  >
) {
  const { error } = await getSupabase()
    .from("pedidos")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Error actualizando pedido: ${error.message}`);
  }
}

export async function deletePedido(id: number) {
  const { error } = await getSupabase().from("pedidos").delete().eq("id", id);

  if (error) {
    throw new Error(`Error eliminando pedido: ${error.message}`);
  }
}
