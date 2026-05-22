"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageCircle, ArrowLeft, Home } from "lucide-react";
import Link from "next/link";

const WHATSAPP_NUMBER = "573146654681";

export default function PedidoPage() {
  const mensaje = encodeURIComponent(
    "Hola! Quisiera hacer un pedido de carnet estudiantil."
  );

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full"
      >
        <Card className="text-center">
          <CardContent className="pt-10 pb-10 space-y-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
              <MessageCircle className="w-8 h-8 text-primary" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-bold">Pedidos por WhatsApp</h2>
              <p className="text-muted-foreground">
                Hemos simplificado el proceso. Ahora todos los pedidos se hacen directamente por WhatsApp.
              </p>
            </div>

            <div className="p-4 rounded-lg bg-muted text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Precio único</p>
              <p><span className="text-2xl font-bold text-foreground">$10.000</span> COP</p>
              <p className="mt-1">Personalización incluida</p>
            </div>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=${mensaje}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Button size="lg" className="w-full text-lg">
                <MessageCircle className="w-5 h-5 mr-2" />
                Escribir por WhatsApp
              </Button>
            </a>

            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <Home className="w-4 h-4" />
              Volver al inicio
            </Link>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
