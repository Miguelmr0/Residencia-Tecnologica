"use client";

import type { ReactNode } from "react";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

export function Dialog({
  open,
  onClose,
  title,
  children,
  className,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    if (open) document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      role="presentation"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "w-full max-w-lg rounded-lg bg-white p-6 shadow-lg",
          className
        )}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 id="dialog-title" className="text-lg font-bold">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="text-muted-foreground hover:text-black"
          >
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}