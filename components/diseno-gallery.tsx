"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface DisenoGalleryProps {
  disenos: string[];
  seleccionado: string | null;
  onSelect: (diseno: string) => void;
}

export function DisenoGallery({ disenos, seleccionado, onSelect }: DisenoGalleryProps) {
  return (
    <div className="w-full">
      <p className="mb-3 text-sm font-medium text-foreground">Elige un diseño</p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {disenos.map((diseno) => {
          const isSelected = seleccionado === diseno;
          return (
            <button
              key={diseno}
              type="button"
              onClick={() => onSelect(diseno)}
              className={cn(
                "relative rounded-xl overflow-hidden border-2 transition-all cursor-pointer group",
                isSelected
                  ? "border-primary ring-2 ring-primary/30"
                  : "border-border hover:border-muted-foreground/40"
              )}
            >
              <img
                src={`/disenos/${diseno}`}
                alt={`Diseño ${diseno}`}
                className="w-full aspect-[3/4] object-cover"
              />
              {isSelected && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <div className="bg-primary text-primary-foreground rounded-full p-1.5">
                    <Check className="w-4 h-4" />
                  </div>
                </div>
              )}
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs py-1 px-2 text-center truncate">
                {diseno.replace(/\.[^/.]+$/, "").replace(/-/g, " ").replace(/_/g, " ")}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
