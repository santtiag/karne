import { supabase } from "./supabase";

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
  created_at: string;
  updated_at: string;
}

export async function createPedido(
  data: Omit<Pedido, "id" | "created_at" | "updated_at">
) {
  const { data: result, error } = await supabase
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
    })
    .select("id")
    .single();

  if (error) {
    throw new Error(`Error creando pedido: ${error.message}`);
  }

  return result.id as number;
}

export async function getPedidos(estado?: string, tipoServicio?: string) {
  let query = supabase.from("pedidos").select("*").order("created_at", { ascending: false });

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

export async function getPedidoById(id: number) {
  const { data, error } = await supabase
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
  const { error } = await supabase
    .from("pedidos")
    .update({ estado, updated_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    throw new Error(`Error actualizando pedido: ${error.message}`);
  }
}
