"use client";

import React from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "573146654681";

const DISENOS = [
  "Diseño_1.png",
  "Diseño_2.png",
  "Diseño_3.png",
  "Diseño_4.png",
  "Diseño_5.png",
  "Diseño_6.png",
  "Diseño_7.png",
  "Diseño_8.png",
  "Diseño_9.png",
  "Diseño_10.png",
  "Diseño_11.png",
  "Diseño_12.png",
  "Diseño_13.png",
];

function cleanName(filename: string) {
  return filename
    .replace(/\.[^/.]+$/, "")
    .replace(/_/g, " ");
}

function getWhatsAppUrl(disenio: string) {
  const nombre = cleanName(disenio);
  const mensaje = `Hola! Estoy interesado en el diseño "${nombre}" para mi carnet estudiantil. Quisiera más información.`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(mensaje)}`;
}

export function DisenoGallery() {
  return (
    <div className="w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {DISENOS.map((diseno, index) => {
          const nombre = cleanName(diseno);
          const waUrl = getWhatsAppUrl(diseno);
          return (
            <motion.a
              key={diseno}
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.4 }}
              className="group relative block overflow-hidden rounded-xl border border-border/50 bg-card aspect-[3/4]"
            >
              <img
                src={`/disenos/${diseno}`}
                alt={`Diseño ${nombre}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-colors duration-300 flex flex-col items-center justify-center gap-3">
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white font-semibold text-sm text-center px-2">
                  {nombre}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 bg-green-500 text-white text-xs font-medium px-3 py-1.5 rounded-full">
                  <MessageCircle className="w-3.5 h-3.5" />
                  Elegir por WhatsApp
                </span>
              </div>
            </motion.a>
          );
        })}
      </div>
    </div>
  );
}
