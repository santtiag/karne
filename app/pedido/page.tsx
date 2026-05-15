"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { UploadZone } from "@/components/upload-zone";
import { DisenoGallery } from "@/components/diseno-gallery";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowLeft, CheckCircle, Loader2, Sparkles, Palette } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567";
const DISENOS = [
  "Diseño_1.png",
  "Diseño_2.png",
  "Diseño_3.png",
  "Diseño_4.png",
  "Diseño_5.png",
  "Diseño_6.png",
  "Diseño_7.png",
];

function PedidoForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tipoInicial = searchParams.get("tipo") as "basico" | "personalizado" | null;

  const [tipoServicio, setTipoServicio] = useState<"basico" | "personalizado" | null>(tipoInicial);
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    nombre: "",
    telefono: "",
    sedeFacultad: "",
  });
  const [disenoElegido, setDisenoElegido] = useState<string | null>(null);
  const [archivoCarnet, setArchivoCarnet] = useState<File | null>(null);
  const [comprobante, setComprobante] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [pedidoId, setPedidoId] = useState<number | null>(null);

  const precio = tipoServicio === "personalizado" ? "$12.000" : "$8.000";

  useEffect(() => {
    if (tipoServicio) {
      setStep(1);
    }
  }, [tipoServicio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.nombre || !formData.telefono || !archivoCarnet || !comprobante || !tipoServicio) {
      alert("Por favor completa todos los campos y sube ambos archivos.");
      return;
    }

    if (tipoServicio === "personalizado" && !disenoElegido) {
      alert("Por favor elige un diseño para tu carnet personalizado.");
      return;
    }

    setLoading(true);

    const data = new FormData();
    data.append("nombre", formData.nombre);
    data.append("telefono", formData.telefono);
    if (formData.sedeFacultad) data.append("sede_facultad", formData.sedeFacultad);
    data.append("tipo_servicio", tipoServicio);
    if (disenoElegido) data.append("diseno_elegido", disenoElegido);
    data.append("archivo_carnet", archivoCarnet);
    data.append("comprobante_pago", comprobante);

    try {
      const res = await fetch("/api/pedidos", {
        method: "POST",
        body: data,
      });

      const result = await res.json();

      if (res.ok) {
        setPedidoId(result.id);
        setSuccess(true);
      } else {
        alert(result.error || "Hubo un error al enviar el pedido.");
      }
    } catch {
      alert("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full"
        >
          <Card className="text-center">
            <CardContent className="pt-10 pb-10">
              <CheckCircle className="w-16 h-16 mx-auto mb-6 text-green-500" />
              <h2 className="text-2xl font-bold mb-2">¡Pedido recibido!</h2>
              <p className="text-muted-foreground mb-4">
                Tu número de pedido es: <span className="font-bold text-foreground">#{pedidoId}</span>
              </p>
              <p className="text-sm text-muted-foreground mb-6">
                Te contactaremos por WhatsApp cuando tu carnet esté listo.
              </p>
              <Button onClick={() => router.push("/")} className="w-full">
                Volver al inicio
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  // Step 0: Elegir tipo de servicio
  if (!tipoServicio) {
    return (
      <div className="min-h-screen py-12 px-4">
        <div className="max-w-xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" /> Volver
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-2xl">Elige tu servicio</CardTitle>
                <CardDescription>
                  Selecciona el tipo de carnet que quieres solicitar
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <button
                  onClick={() => setTipoServicio("basico")}
                  className="w-full p-6 rounded-xl border border-border/50 bg-card/50 hover:border-primary/40 hover:bg-primary/5 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Servicio Básico</h3>
                        <span className="text-xl font-bold">$8.000</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Tu carnet actual impreso con calidad. Ideal si solo necesitas renovación.
                      </p>
                    </div>
                  </div>
                </button>

                <button
                  onClick={() => setTipoServicio("personalizado")}
                  className="w-full p-6 rounded-xl border border-primary/30 bg-primary/5 hover:border-primary/60 hover:bg-primary/10 transition-all text-left group"
                >
                  <div className="flex items-center gap-4">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/20 shrink-0">
                      <Palette className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Servicio Personalizado</h3>
                        <span className="text-xl font-bold">$12.000</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Elige un diseño exclusivo de nuestra galería y destaca tu estilo.
                      </p>
                    </div>
                  </div>
                </button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" /> Volver
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {tipoServicio === "personalizado" ? "Carnet Personalizado" : "Carnet Básico"}
                  </CardTitle>
                  <CardDescription>
                    Completa los datos, sube tu carnet actual y el comprobante de pago por Nequi.
                  </CardDescription>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{precio}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre completo</Label>
                  <Input
                    id="nombre"
                    placeholder="Juan Pérez"
                    value={formData.nombre}
                    onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono (WhatsApp)</Label>
                  <Input
                    id="telefono"
                    type="tel"
                    placeholder="300 123 4567"
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sede">
                    Sede / Facultad <span className="text-muted-foreground font-normal">(opcional)</span>
                  </Label>
                  <Input
                    id="sede"
                    placeholder="Ej: Ingeniería - Sede Norte"
                    value={formData.sedeFacultad}
                    onChange={(e) => setFormData({ ...formData, sedeFacultad: e.target.value })}
                  />
                </div>

                <div className="pt-2">
                  <UploadZone
                    label="Carnet actual (PDF o imagen)"
                    file={archivoCarnet}
                    onFileSelect={setArchivoCarnet}
                  />
                </div>

                {tipoServicio === "personalizado" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="pt-2"
                  >
                    <DisenoGallery
                      disenos={DISENOS}
                      seleccionado={disenoElegido}
                      onSelect={setDisenoElegido}
                    />
                  </motion.div>
                )}

                <div className="pt-2">
                  <UploadZone
                    label="Comprobante de pago Nequi"
                    file={comprobante}
                    onFileSelect={setComprobante}
                    accept="image/*"
                  />
                </div>

                <div className="p-4 rounded-lg bg-muted text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Pago por Nequi</p>
                  <p>Transfiere al número: <span className="font-bold">{WHATSAPP_NUMBER.replace("57", "")}</span></p>
                  <p>Valor: <span className="font-bold">{precio} COP</span></p>
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Enviando...
                    </>
                  ) : (
                    "Enviar pedido"
                  )}
                </Button>

                <button
                  type="button"
                  onClick={() => setTipoServicio(null)}
                  className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  Cambiar tipo de servicio
                </button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}

export default function PedidoPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    }>
      <PedidoForm />
    </Suspense>
  );
}
