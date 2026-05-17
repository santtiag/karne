"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowRight,
  Shield,
  Zap,
  Clock,
  CreditCard,
  MessageCircle,
  Upload,
  CheckCircle2,
  Palette,
  Sparkles,
} from "lucide-react";

const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "573001234567";

export default function HomePage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/10 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/20 rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4" />

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Hero */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center pt-20 pb-16">
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
              <Zap className="w-4 h-4" />
              <span>Rápido, seguro y sin filas</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
              Tu carnet{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                estudiantil
              </span>{" "}
              en minutos
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Sube tu carnet actual, paga por Nequi y recibe tu nuevo carnet impreso con protector y escarapela.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-4"
            >
              <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  <MessageCircle className="w-5 h-5 mr-2" />
                  Escríbenos
                </Button>
              </a>
            </motion.div>
          </motion.div>

          {/* Servicios */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="grid md:grid-cols-2 gap-6 mt-16 max-w-3xl w-full"
          >
            {/* Básico */}
            <Link href="/pedido?tipo=basico">
              <Card className="h-full border-border/50 bg-card/50 backdrop-blur hover:border-primary/40 hover:bg-card/80 transition-all cursor-pointer group">
                <CardContent className="pt-8 pb-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10">
                    <Sparkles className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Servicio Básico</h3>
                    <p className="text-sm text-muted-foreground">Tu carnet actual, impreso con calidad</p>
                  </div>
                  <p className="text-3xl font-bold">$8.000</p>
                  <Button className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    Elegir básico
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>

            {/* Personalizado */}
            <Link href="/pedido?tipo=personalizado">
              <Card className="h-full border-primary/30 bg-primary/5 backdrop-blur hover:border-primary/60 hover:bg-primary/10 transition-all cursor-pointer group">
                <CardContent className="pt-8 pb-8 text-center space-y-4">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/20">
                    <Palette className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-1">Servicio Personalizado</h3>
                    <p className="text-sm text-muted-foreground">Elige un diseño exclusivo de nuestra galería</p>
                  </div>
                  <p className="text-3xl font-bold">$10.000</p>
                  <Button className="w-full">
                    Elegir personalizado
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        </section>

        {/* How it works */}
        <section className="py-20">
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
                icon: Upload,
                title: "1. Sube tu carnet",
                desc: "Toma una foto o escanea tu carnet actual y súbelo en formato PDF o imagen.",
              },
              {
                icon: CreditCard,
                title: "2. Paga por Nequi",
                desc: "Realiza la transferencia a nuestro número y sube el comprobante de pago.",
              },
              {
                icon: CheckCircle2,
                title: "3. Recibe tu carnet",
                desc: "Te avisamos por WhatsApp cuando esté listo.",
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
        <section className="py-20">
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
              { icon: Zap, title: "Fácil", desc: "Proceso 100% online" },
              { icon: CreditCard, title: "Económico", desc: "El mejor precio del campus" },
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

        {/* CTA */}
        <section className="py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-accent/20 border border-border/50 p-12 text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">¿Listo para tu carnet?</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              No esperes más. Solicítalo ahora y recíbelo lo más pronto.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/pedido?tipo=basico">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Básico $8k
                </Button>
              </Link>
              <Link href="/pedido?tipo=personalizado">
                <Button size="lg" className="text-lg px-8">
                  Personalizado $10k
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </section>

        {/* Footer */}
        <footer className="py-12 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© 2026 Karne. Hecho para estudiantes por estudiantes.</p>
          <p className="mt-2">Contacto: {WHATSAPP_NUMBER.replace("57", "")} · Nequi</p>
        </footer>
      </div>
    </div>
  );
}
