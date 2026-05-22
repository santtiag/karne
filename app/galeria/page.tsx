"use client";

import React from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { DisenoGallery } from "@/components/diseno-gallery";
import { Button } from "@/components/ui/button";

const WHATSAPP_NUMBER = "573146654681";

export default function GaleriaPage() {
  const mensajePropio = encodeURIComponent(
    "Hola! Ya tengo mi diseño/lista para el carnet estudiantil y quisiera hacer el pedido."
  );

  return (
    <div className="min-h-screen">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Galería de diseños</h1>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Explora todos nuestros diseños. Haz clic en el que más te guste y te llevamos directo a WhatsApp para coordinar tu pedido.
          </p>
        </motion.div>

        <DisenoGallery />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 text-center"
        >
          <p className="text-muted-foreground mb-4">
            ¿No encontraste lo que buscabas?
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensajePropio}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button size="lg" className="text-lg px-8">
              <MessageCircle className="w-5 h-5 mr-2" />
              Pedir por WhatsApp
            </Button>
          </a>
        </motion.div>
      </div>
    </div>
  );
}
