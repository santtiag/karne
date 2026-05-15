"use client";

import React, { useCallback, useState } from "react";
import { cn } from "@/lib/utils";
import { Upload, File, X, ImageIcon } from "lucide-react";

interface UploadZoneProps {
  onFileSelect: (file: File | null) => void;
  accept?: string;
  label: string;
  file: File | null;
}

export function UploadZone({ onFileSelect, accept = "image/*,application/pdf", label, file }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const handleFile = useCallback(
    (selectedFile: File) => {
      onFileSelect(selectedFile);
      if (selectedFile.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => setPreview(e.target?.result as string);
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    },
    [onFileSelect]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile) handleFile(droppedFile);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selectedFile = e.target.files?.[0];
      if (selectedFile) handleFile(selectedFile);
    },
    [handleFile]
  );

  const clearFile = useCallback(() => {
    onFileSelect(null);
    setPreview(null);
  }, [onFileSelect]);

  return (
    <div className="w-full">
      <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
      {!file ? (
        <label
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={cn(
            "flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-xl cursor-pointer transition-colors",
            isDragOver
              ? "border-primary bg-primary/5"
              : "border-muted-foreground/25 hover:border-muted-foreground/50"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <Upload className="w-8 h-8 mb-3 text-muted-foreground" />
            <p className="mb-1 text-sm text-muted-foreground">
              <span className="font-semibold text-primary">Haz clic para subir</span> o arrastra aquí
            </p>
            <p className="text-xs text-muted-foreground">PDF, PNG o JPG (máx. 5MB)</p>
          </div>
          <input
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleInputChange}
          />
        </label>
      ) : (
        <div className="relative flex items-center gap-3 p-4 border rounded-xl bg-card">
          {preview ? (
            <img
              src={preview}
              alt="Preview"
              className="w-16 h-16 object-cover rounded-lg"
            />
          ) : (
            <div className="flex items-center justify-center w-16 h-16 rounded-lg bg-muted">
              {file.type === "application/pdf" ? (
                <File className="w-8 h-8 text-muted-foreground" />
              ) : (
                <ImageIcon className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{file.name}</p>
            <p className="text-xs text-muted-foreground">
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </p>
          </div>
          <button
            type="button"
            onClick={clearFile}
            className="p-1 rounded-md hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      )}
    </div>
  );
}
