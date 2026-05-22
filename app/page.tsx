"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  MessageCircle,
  Palette,
  Upload,
  CheckCircle2,
  ArrowRight,
  Shield,
  Clock,
  Zap,
  CreditCard,
  Eye,
} from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "573146654681";
const WHATSAPP_DISPLAY = "3146654681";

const PREVIEW_DESIGN = [
  "Diseño_1.png",
  "Diseño_2.png",
  "Diseño_3.png",
  "Diseño_4.png",
];

export default function HomePage() {
  const mensajePropio = encodeURIComponent(
    "Hola! Ya tengo mi diseño/lista para el carnet estudiantil y quisiera hacer el pedido."
  );

  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Hero */}
        <section className="min-h-[60vh] flex flex-col items-center justify-center text-center pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6 max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium text-primary"
            >
              <Palette className="w-4 h-4" />
              <span>Diseños únicos para tu carnet</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Tu carnet{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                personalizado
              </span>{" "}
              por $10.000
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Elige un diseño de nuestra galería o envíanos el tuyo por WhatsApp.
              Te lo preparamos e imprimimos con calidad.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajePropio}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="text-lg px-8">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Escribir por WhatsApp
                </Button>
              </a>
              <Link href="/galeria">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <Palette className="w-5 h-5 mr-2" />
                  Ver diseños
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* Preview de diseños */}
        <section className="py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nuestros diseños</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Estos son algunos de los diseños disponibles. Explora la galería completa y elige el que más te guste.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
            {PREVIEW_DESIGN.map((diseno, index) => (
              <motion.div
                key={diseno}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
                className="overflow-hidden rounded-xl border border-border/50 aspect-[3/4]"
              >
                <img
                  src={`/disenos/${diseno}`}
                  alt={`Diseño ${diseno.replace(/\.[^/.]+$/, "").replace(/_/g, " ")}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/galeria">
              <Button size="lg" variant="outline" className="text-lg px-8">
                <Eye className="w-5 h-5 mr-2" />
                Ver todos los diseños
              </Button>
            </Link>
          </div>
        </section>

        {/* CTA: Ya tengo mi diseño */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-border/50 p-10 md:p-14 text-center"
          >
            <div className="flex flex-col items-center gap-4">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20">
                <Upload className="w-7 h-7 text-primary" />
              </div>
              <h2 className="text-2xl md:text-3xl font-bold">¿Ya tienes tu diseño?</h2>
              <p className="text-muted-foreground max-w-md">
                Si ya tienes tu propio diseño o el carnet listo, envíanoslo por WhatsApp y lo preparamos.
              </p>
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajePropio}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="text-lg px-8 mt-2">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Pedir por WhatsApp
                </Button>
              </a>
            </div>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Cómo funciona?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Tres pasos simples para tener tu carnet en las manos.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Palette,
                title: "1. Elige tu diseño",
                desc: "Explora la galería y selecciona el diseño que más te guste, o envíanos el tuyo por WhatsApp.",
              },
              {
                icon: MessageCircle,
                title: "2. Coordinamos por WhatsApp",
                desc: "Te contactamos para confirmar detalles, personalizar y coordinar el pago por Nequi.",
              },
              {
                icon: CheckCircle2,
                title: "3. Recibe tu carnet",
                desc: "Preparamos tu carnet con calidad y te avisamos cuando esté listo para entrega.",
              },
            ].map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
              >
                <Card className="h-full border-border/50 bg-card/50 backdrop-blur">
                  <CardContent className="pt-6 pb-6 text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary/10 mb-4">
                      <step.icon className="w-6 h-6 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Features / Trust */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Por qué elegirnos?</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Clock, title: "Rápido", desc: "Entrega entre 2 a 3 días hábiles" },
              { icon: Shield, title: "Seguro", desc: "Tus datos están protegidos" },
              { icon: Zap, title: "Fácil", desc: "Proceso 100% por WhatsApp" },
              { icon: CreditCard, title: "Precio único", desc: "$10.000 con personalización incluida" },
            ].map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="p-6 rounded-xl bg-muted/50 border border-border/50"
              >
                <feature.icon className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-semibold mb-1">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA Final */}
        <section className="py-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-border/50 p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para tu carnet?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Escríbenos por WhatsApp y en minutos coordinamos tu pedido. Solo $10.000 todo incluido.
            </p>
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajePropio}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button size="lg" className="text-lg px-8">
                <MessageCircle className="w-5 h-5 mr-2" />
                Escribir por WhatsApp
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </a>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© 2026 Karne. Hecho para estudiantes por estudiantes.</p>
          <p className="mt-2">
            Contacto: {WHATSAPP_DISPLAY} · Nequi
          </p>
        </footer>
      </div>
    </div>
  );
}
