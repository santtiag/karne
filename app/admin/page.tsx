"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  MessageCircle,
  RefreshCw,
  Eye,
  Trash2,
  Plus,
  Search,
  LogOut,
  DollarSign,
  TrendingUp,
  Package,
  Users,
  Phone,
  CheckCircle2,
} from "lucide-react";

interface Pedido {
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

const ESTADOS = [
  { value: "pendiente", label: "Pendiente", color: "bg-yellow-500/20 text-yellow-600 border-yellow-500/30" },
  { value: "en_proceso", label: "En proceso", color: "bg-blue-500/20 text-blue-600 border-blue-500/30" },
  { value: "listo", label: "Listo", color: "bg-green-500/20 text-green-600 border-green-500/30" },
  { value: "entregado", label: "Entregado", color: "bg-muted text-muted-foreground border-border" },
];

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573146654681";
const COSTO_PRODUCCION = 6000;
const ADMIN_TOKEN_KEY = "admin_auth_token";

function isToday(dateStr: string) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

function formatCOP(n: number) {
  return `$${n.toLocaleString("es-CO")}`;
}

export default function AdminPage() {
  const [auth, setAuth] = useState(false);
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [loginLoading, setLoginLoading] = useState(false);

  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [updating, setUpdating] = useState<number | null>(null);

  const [selectedPedido, setSelectedPedido] = useState<Pedido | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<Pedido | null>(null);

  const [formData, setFormData] = useState<Partial<Pedido>>({});

  // Auth check
  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY);
    if (token) setAuth(true);
  }, []);

  const fetchPedidos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filtroEstado !== "todos") params.append("estado", filtroEstado);
      if (searchQuery.trim()) params.append("q", searchQuery.trim());
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
    if (auth) fetchPedidos();
  }, [auth, filtroEstado]);

  // Debounce search
  useEffect(() => {
    if (!auth) return;
    const t = setTimeout(() => fetchPedidos(), 400);
    return () => clearTimeout(t);
  }, [searchQuery, auth]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setLoginLoading(true);
    try {
      const res = await fetch("/api/admin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token);
        setAuth(true);
      } else {
        setLoginError(data.error || "Contraseña incorrecta");
      }
    } catch {
      setLoginError("Error de conexión");
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem(ADMIN_TOKEN_KEY);
    setAuth(false);
    setPassword("");
  };

  const updateField = async (id: number, data: Partial<Pedido>) => {
    setUpdating(id);
    try {
      await fetch(`/api/pedidos/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      setPedidos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...data } : p))
      );
    } catch {
      alert("Error actualizando pedido");
    } finally {
      setUpdating(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await fetch(`/api/pedidos/${deleteConfirm.id}`, { method: "DELETE" });
      setPedidos((prev) => prev.filter((p) => p.id !== deleteConfirm.id));
      setDeleteConfirm(null);
    } catch {
      alert("Error eliminando pedido");
    }
  };

  const openCreate = () => {
    setFormData({
      nombre: "",
      telefono: "",
      sede_facultad: "",
      tipo_servicio: "basico",
      precio_venta: 10000,
      notas: "",
      estado: "pendiente",
      pago_realizado: false,
      carnet_recibido: false,
      diseno_listo: false,
    });
    setIsCreating(true);
  };

  const openEdit = (pedido: Pedido) => {
    setFormData({ ...pedido });
    setSelectedPedido(pedido);
    setIsEditing(true);
  };

  const saveForm = async () => {
    if (isCreating) {
      try {
        const res = await fetch("/api/pedidos/admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          setIsCreating(false);
          fetchPedidos();
        } else {
          const data = await res.json();
          alert(data.error || "Error creando pedido");
        }
      } catch {
        alert("Error creando pedido");
      }
    } else if (isEditing && selectedPedido) {
      await updateField(selectedPedido.id, formData);
      setIsEditing(false);
      setSelectedPedido(null);
    }
  };

  const openWhatsApp = (telefono: string, mensaje: string) => {
    const clean = telefono.replace(/\D/g, "");
    const num = clean.startsWith("57") ? clean : `57${clean}`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  const getWhatsAppMessage = (pedido: Pedido, tipo: string) => {
    const base = `Hola ${pedido.nombre}`;
    switch (tipo) {
      case "pedir_carnet":
        return `${base}, para continuar con tu pedido de carnet necesito que me envíes una foto clara de tu carnet estudiantil o tu diseño. ¡Gracias!`;
      case "recordar_pago":
        return `${base}, tu carnet ya está listo. El total es ${formatCOP(pedido.precio_venta)}. ¿Cómo prefieres hacer el pago?`;
      case "mostrar_diseno":
        return `${base}, ya terminé el diseño personalizado de tu carnet. Te envío el borrador para que lo revises.`;
      case "avisar_listo":
        return `${base}, tu carnet ya está listo para recoger. Cuéntame cuándo pasas por él.`;
      default:
        return `${base}, te escribo por tu pedido de carnet.`;
    }
  };

  const metrics = useMemo(() => {
    const hoy = pedidos.filter((p) => isToday(p.created_at));
    const ingresosHoy = hoy.reduce((sum, p) => sum + (p.precio_venta || 0), 0);
    const gananciaHoy = hoy.reduce((sum, p) => sum + ((p.precio_venta || 0) - COSTO_PRODUCCION), 0);
    const pendientes = pedidos.filter((p) => p.estado !== "entregado").length;
    return {
      pedidosHoy: hoy.length,
      ingresosHoy,
      gananciaHoy,
      pendientes,
    };
  }, [pedidos]);

  const getEstadoBadge = (estado: string) => {
    const info = ESTADOS.find((e) => e.value === estado);
    return (
      <Badge variant="outline" className={info?.color || ""}>
        {info?.label || estado}
      </Badge>
    );
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-sm w-full"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Panel de administración</CardTitle>
              <p className="text-sm text-muted-foreground">Ingresa la contraseña para continuar.</p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••"
                    required
                  />
                </div>
                {loginError && (
                  <p className="text-sm text-red-500">{loginError}</p>
                )}
                <Button type="submit" className="w-full" disabled={loginLoading}>
                  {loginLoading ? "Verificando..." : "Entrar"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Panel de administración</h1>
            <p className="text-sm text-muted-foreground">Gestión interna de pedidos de carnets</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" /> Cerrar sesión
          </Button>
        </div>

        {/* Dashboard */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pedidos hoy</p>
                  <p className="text-2xl font-bold">{metrics.pedidosHoy}</p>
                </div>
                <Users className="w-8 h-8 text-primary/60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pendientes</p>
                  <p className="text-2xl font-bold">{metrics.pendientes}</p>
                </div>
                <Package className="w-8 h-8 text-yellow-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ingresos hoy</p>
                  <p className="text-2xl font-bold">{formatCOP(metrics.ingresosHoy)}</p>
                </div>
                <DollarSign className="w-8 h-8 text-green-500/60" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Ganancia hoy</p>
                  <p className="text-2xl font-bold">{formatCOP(metrics.gananciaHoy)}</p>
                </div>
                <TrendingUp className="w-8 h-8 text-blue-500/60" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col sm:flex-row gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre o teléfono..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={filtroEstado} onValueChange={(v) => v && setFiltroEstado(v)}>
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="Estado" />
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
              <Button onClick={openCreate}>
                <Plus className="w-4 h-4 mr-2" /> Nuevo pedido
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardContent className="pt-6">
            {loading ? (
              <div className="text-center py-12 text-muted-foreground">Cargando pedidos...</div>
            ) : pedidos.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No hay pedidos
                {(filtroEstado !== "todos" || searchQuery) && " con estos filtros"}
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
                      <TableHead>Precio</TableHead>
                      <TableHead className="text-center">Carnet</TableHead>
                      <TableHead className="text-center">Pago</TableHead>
                      <TableHead className="text-center">Diseño</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pedidos.map((pedido) => (
                      <TableRow key={pedido.id}>
                        <TableCell className="font-mono text-sm">#{pedido.id}</TableCell>
                        <TableCell className="font-medium">{pedido.nombre}</TableCell>
                        <TableCell>{pedido.telefono}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {pedido.tipo_servicio}
                          </Badge>
                        </TableCell>
                        <TableCell>{formatCOP(pedido.precio_venta)}</TableCell>
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={pedido.carnet_recibido}
                            onChange={() =>
                              updateField(pedido.id, {
                                carnet_recibido: !pedido.carnet_recibido,
                              })
                            }
                            disabled={updating === pedido.id}
                            className="w-4 h-4 accent-primary cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          <input
                            type="checkbox"
                            checked={pedido.pago_realizado}
                            onChange={() =>
                              updateField(pedido.id, {
                                pago_realizado: !pedido.pago_realizado,
                              })
                            }
                            disabled={updating === pedido.id}
                            className="w-4 h-4 accent-primary cursor-pointer"
                          />
                        </TableCell>
                        <TableCell className="text-center">
                          {pedido.tipo_servicio === "personalizado" ? (
                            <input
                              type="checkbox"
                              checked={pedido.diseno_listo}
                              onChange={() =>
                                updateField(pedido.id, {
                                  diseno_listo: !pedido.diseno_listo,
                                })
                              }
                              disabled={updating === pedido.id}
                              className="w-4 h-4 accent-primary cursor-pointer"
                            />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>{getEstadoBadge(pedido.estado)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => openEdit(pedido)}
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
                                  getWhatsAppMessage(pedido, "general")
                                )
                              }
                            >
                              <MessageCircle className="w-4 h-4 text-green-500" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-red-500 hover:text-red-600"
                              onClick={() => setDeleteConfirm(pedido)}
                            >
                              <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Create / Edit Dialog */}
      <Dialog
        open={isCreating || isEditing}
        onOpenChange={() => {
          setIsCreating(false);
          setIsEditing(false);
          setSelectedPedido(null);
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isCreating ? "Nuevo pedido" : `Editar pedido #${selectedPedido?.id}`}
            </DialogTitle>
            <DialogDescription>
              {isCreating
                ? "Registra un pedido que te llegó por WhatsApp."
                : "Modifica los datos del pedido."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input
                  value={formData.nombre || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Teléfono</Label>
                <Input
                  value={formData.telefono || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, telefono: e.target.value }))
                  }
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Sede / Facultad</Label>
              <Input
                value={formData.sede_facultad || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    sede_facultad: e.target.value,
                  }))
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Tipo de servicio</Label>
                <Select
                  value={formData.tipo_servicio}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      tipo_servicio: v as "basico" | "personalizado",
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basico">Básico</SelectItem>
                    <SelectItem value="personalizado">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Precio de venta</Label>
                <Input
                  type="number"
                  value={formData.precio_venta || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      precio_venta: Number(e.target.value),
                    }))
                  }
                />
              </div>
            </div>
            {!isCreating && (
              <div className="space-y-2">
                <Label>Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(v) =>
                    setFormData((prev) => ({
                      ...prev,
                      estado: v as Pedido["estado"],
                    }))
                  }
                >
                  <SelectTrigger>
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
              </div>
            )}
            <div className="grid grid-cols-3 gap-4">
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.carnet_recibido || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      carnet_recibido: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-primary"
                />
                Carnet recibido
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.pago_realizado || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pago_realizado: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-primary"
                />
                Pago realizado
              </Label>
              <Label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.diseno_listo || false}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      diseno_listo: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 accent-primary"
                />
                Diseño listo
              </Label>
            </div>
            <div className="space-y-2">
              <Label>Notas internas</Label>
              <Textarea
                value={formData.notas || ""}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, notas: e.target.value }))
                }
                placeholder="Anotaciones sobre el pedido..."
                rows={3}
              />
            </div>

            {!isCreating && selectedPedido && (
              <div className="space-y-2 pt-2">
                <Label>Acciones rápidas WhatsApp</Label>
                <div className="flex flex-wrap gap-2">
                  {!selectedPedido.carnet_recibido && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openWhatsApp(
                          selectedPedido.telefono,
                          getWhatsAppMessage(selectedPedido, "pedir_carnet")
                        )
                      }
                    >
                      <Phone className="w-3.5 h-3.5 mr-1" /> Pedir carnet
                    </Button>
                  )}
                  {!selectedPedido.pago_realizado && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openWhatsApp(
                          selectedPedido.telefono,
                          getWhatsAppMessage(selectedPedido, "recordar_pago")
                        )
                      }
                    >
                      <DollarSign className="w-3.5 h-3.5 mr-1" /> Recordar pago
                    </Button>
                  )}
                  {selectedPedido.tipo_servicio === "personalizado" &&
                    selectedPedido.diseno_listo && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() =>
                          openWhatsApp(
                            selectedPedido.telefono,
                            getWhatsAppMessage(selectedPedido, "mostrar_diseno")
                          )
                        }
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Mostrar diseño
                      </Button>
                    )}
                  {selectedPedido.estado === "listo" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openWhatsApp(
                          selectedPedido.telefono,
                          getWhatsAppMessage(selectedPedido, "avisar_listo")
                        )
                      }
                    >
                      <MessageCircle className="w-3.5 h-3.5 mr-1" /> Avisar listo
                    </Button>
                  )}
                </div>
              </div>
            )}

            <Button className="w-full" onClick={saveForm}>
              {isCreating ? "Crear pedido" : "Guardar cambios"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm */}
      <Dialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>¿Eliminar pedido?</DialogTitle>
            <DialogDescription>
              Esto eliminará el pedido #{deleteConfirm?.id} de {deleteConfirm?.nombre}.
              No se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 mt-4">
            <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleDelete}>
              Eliminar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
