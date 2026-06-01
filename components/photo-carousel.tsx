"use client";

import React, { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

const PHOTOS = [
  "20260525_112903.jpg",
  "20260525_112932.jpg",
  "20260525_113013.jpg",
  "20260525_113047.jpg",
  "20260525_113113.jpg",
  "20260525_113145.jpg",
  "20260525_113209.jpg",
  "20260601_130717.jpg",
  "20260601_130740.jpg",
  "20260601_130758.jpg",
];

const AUTOPLAY_DELAY = 4000;

export function PhotoCarousel() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrent((prev) => {
        let next = prev + newDirection;
        if (next < 0) next = PHOTOS.length - 1;
        if (next >= PHOTOS.length) next = 0;
        return next;
      });
    },
    []
  );

  useEffect(() => {
    const timer = setInterval(() => paginate(1), AUTOPLAY_DELAY);
    return () => clearInterval(timer);
  }, [paginate]);

  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.95,
    }),
  };

  return (
    <div className="relative w-full max-w-md mx-auto">
      {/* Carrusel */}
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden border border-border/50 bg-muted shadow-lg">
        <AnimatePresence initial={false} custom={direction} mode="popLayout">
          <motion.img
            key={PHOTOS[current]}
            src={`/photos/${PHOTOS[current]}`}
            alt={`Carnet impreso ${current + 1} de ${PHOTOS.length}`}
            className="absolute inset-0 w-full h-full object-cover"
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </AnimatePresence>

        {/* Flechas */}
        <button
          onClick={() => paginate(-1)}
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Anterior foto"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => paginate(1)}
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60 transition-colors backdrop-blur-sm"
          aria-label="Siguiente foto"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Contador */}
        <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full bg-black/40 text-white text-xs font-medium backdrop-blur-sm">
          {current + 1} / {PHOTOS.length}
        </div>
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-2 mt-4">
        {PHOTOS.map((_, i) => (
          <button
            key={i}
            onClick={() => {
              setDirection(i > current ? 1 : -1);
              setCurrent(i);
            }}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i === current
                ? "bg-primary w-6"
                : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
            }`}
            aria-label={`Ir a foto ${i + 1}`}
          />
        ))}
      </div>
    </div>
  );
}
