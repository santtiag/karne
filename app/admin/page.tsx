"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  MessageCircle,
  Eye,
  RefreshCw,
  FileImage,
  FileText,
  Download,
  Sparkles,
  Palette,
} from "lucide-react";

interface Pedido {
  id: number;
  nombre: string;
  telefono: string;
  sede_facultad: string | null;
  tipo_servicio: string;
  diseno_elegido: string | null;
  estado: string;
  archivo_carnet: string;
  comprobante_pago: string;
  created_at: string;
  updated_at: string;
}

const ESTADOS = [
  { value: "pendiente", label: "Pendiente", color: "bg-yellow-500/20 text-yellow-500 border-yellow-500/20" },
  { value: "en_proceso", label: "En proceso", color: "bg-blue-500/20 text-blue-500 border-blue-500/20" },
  { value: "listo", label: "Listo", color: "bg-green-500/20 text-green-500 border-green-500/20" },
  { value: "entregado", label: "Entregado", color: "bg-muted text-muted-foreground border-border" },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567";

export default function AdminPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [loading, setLoading] = useState(true);
  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroEstado !== "todos") params.append("estado", filtroEstado);
      if (filtroTipo !== "todos") params.append("tipo_servicio", filtroTipo);
      const url = `/api/pedidos?${params.toString()}`;
      const res = await fetch(url);
      const data = await res.json();
      setPedidos(Array.isArray(data) ? data : []);
    } catch {
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, [filtroEstado, filtroTipo]);

  const updateEstado = async (id: number, estado: string) => {
    setUpdating(id);
    try {
      await fetch(`/api/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ estado }),
      });
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, estado } : p))
      );
    } catch {
      alert("Error actualizando estado");
    } finally {
      setUpdating(null);
    }
  };

  const getEstadoBadge = (estado: string) => {
    const estadoInfo = ESTADOS.find((e) => e.value === estado);
    return (
      <Badge variant="outline" className={estadoInfo?.color || ""}>
        {estadoInfo?.label || estado}
      </Badge>
    );
  };

  const getTipoBadge = (tipo: string) => {
    if (tipo === "personalizado") {
      return (
        <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
          <Palette className="w-3 h-3 mr-1" /> Personalizado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-muted text-muted-foreground">
        <Sparkles className="w-3 h-3 mr-1" /> Básico
      </Badge>
    );
  };

  const openWhatsApp = (telefono: string, nombre: string, estado: string) => {
    const mensaje = encodeURIComponent(
      `Hola ${nombre}, tu pedido de carnet está *${estado}*. Te avisamos cuando esté listo para recoger.`
    );
    window.open(`https://wa.me/57${telefono.replace(/\D/g, "")}?text=${mensaje}`, "_blank");
  };

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <CardTitle className="text-2xl">Panel de administración</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Gestiona los pedidos de carnets estudiantiles
                </p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Select value={filtroTipo} onValueChange={(v) => v && setFiltroTipo(v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Tipo de servicio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos los tipos</SelectItem>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filtroEstado} onValueChange={(v) => v && setFiltroEstado(v)}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder="Filtrar por estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos</SelectItem>
                    {ESTADOS.map((e) => (
                      <SelectItem key={e.value} value={e.value}>
                        {e.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button variant="outline" size="icon" onClick={fetchPedidos}>
                  <RefreshCw className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-12 text-muted-foreground">
                  Cargando pedidos...
                </div>
              ) : pedidos.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No hay pedidos{(filtroEstado !== "todos" || filtroTipo !== "todos") && " con estos filtros"}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#ID</TableHead>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pedidos.map((pedido) => (
                        <TableRow key={pedido.id}>
                          <TableCell className="font-mono text-sm">
                            #{pedido.id}
                          </TableCell>
                          <TableCell className="font-medium">{pedido.nombre}</TableCell>
                          <TableCell>{pedido.telefono}</TableCell>
                          <TableCell>{getTipoBadge(pedido.tipo_servicio)}</TableCell>
                          <TableCell className="text-muted-foreground text-sm">
                            {new Date(pedido.created_at).toLocaleDateString("es-CO")}
                          </TableCell>
                          <TableCell>{getEstadoBadge(pedido.estado)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Select
                                value={pedido.estado}
                                onValueChange={(v) => v && updateEstado(pedido.id, v)}
                                disabled={updating === pedido.id}
                              >
                                <SelectTrigger className="w-[130px] h-8 text-xs">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {ESTADOS.map((e) => (
                                    <SelectItem key={e.value} value={e.value}>
                                      {e.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => setSelectedPedido(pedido)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() =>
                                  openWhatsApp(
                                    pedido.telefono,
                                    pedido.nombre,
                                    ESTADOS.find((e) => e.value === pedido.estado)?.label || pedido.estado
                                  )
                                }
                              >
                                <MessageCircle className="w-4 h-4 text-green-500" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Dialog Detalle */}
      <Dialog open={!!selectedPedido} onOpenChange={() => setSelectedPedido(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pedido #{selectedPedido?.id}</DialogTitle>
            <DialogDescription>
              Detalles del pedido de {selectedPedido?.nombre}
            </DialogDescription>
          </DialogHeader>
          {selectedPedido && (
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Nombre</p>
                  <p className="font-medium">{selectedPedido.nombre}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Teléfono</p>
                  <p className="font-medium">{selectedPedido.telefono}</p>
                </div>
                {selectedPedido.sede_facultad && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Sede / Facultad</p>
                    <p className="font-medium">{selectedPedido.sede_facultad}</p>
                  </div>
                )}
                <div>
                  <p className="text-muted-foreground">Tipo de servicio</p>
                  <div className="mt-1">{getTipoBadge(selectedPedido.tipo_servicio)}</div>
                </div>
                <div>
                  <p className="text-muted-foreground">Estado</p>
                  <div className="mt-1">{getEstadoBadge(selectedPedido.estado)}</div>
                </div>
                {selectedPedido.tipo_servicio === "personalizado" && selectedPedido.diseno_elegido && (
                  <div className="col-span-2">
                    <p className="text-muted-foreground">Diseño elegido</p>
                    <img
                      src={`/disenos/${selectedPedido.diseno_elegido}`}
                      alt="Diseño elegido"
                      className="w-full aspect-[3/4] object-cover rounded-md bg-black/20 mt-1"
                    />
                  </div>
                )}
              </div>

              <div className="space-y-3 pt-2">
                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Carnet original</span>
                    </div>
                    <a
                      href={selectedPedido.archivo_carnet}
                      download
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-3 h-3" /> Descargar
                    </a>
                  </div>
                  {selectedPedido.archivo_carnet.match(/\.(jpg|jpeg|png|webp)$/i) ? (
                    <img
                      src={selectedPedido.archivo_carnet}
                      alt="Carnet"
                      className="w-full h-40 object-contain rounded-md bg-black/20"
                    />
                  ) : (
                    <a
                      href={selectedPedido.archivo_carnet}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block text-center py-8 text-sm text-muted-foreground hover:text-foreground"
                    >
                      Ver archivo PDF
                    </a>
                  )}
                </div>

                <div className="p-3 rounded-lg border border-border bg-muted/30">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <FileImage className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">Comprobante de pago</span>
                    </div>
                    <a
                      href={selectedPedido.comprobante_pago}
                      download
                      className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="w-3 h-3" /> Descargar
                    </a>
                  </div>
                  <img
                    src={selectedPedido.comprobante_pago}
                    alt="Comprobante"
                    className="w-full h-40 object-contain rounded-md bg-black/20"
                  />
                </div>
              </div>

              <Button
                className="w-full mt-2"
                onClick={() => {
                  openWhatsApp(
                    selectedPedido.telefono,
                    selectedPedido.nombre,
                    ESTADOS.find((e) => e.value === selectedPedido.estado)?.label || selectedPedido.estado
                  );
                }}
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                Notificar por WhatsApp
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
