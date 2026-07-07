"use client";

import { useState, useEffect, useCallback, createContext, useContext, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

// ─── Toast Types ───
export type ToastVariant = "success" | "error" | "warning" | "info";

export interface ToastData {
  id: string;
  message: string;
  variant: ToastVariant;
  duration?: number; // ms, 0 = persistent
}

interface ToastContextValue {
  addToast: (message: string, variant?: ToastVariant, duration?: number) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}

// ─── Icons ───
const iconMap: Record<ToastVariant, React.ElementType> = {
  success: CheckCircle,
  error: AlertCircle,
  warning: AlertTriangle,
  info: Info,
};

const variantBorder: Record<ToastVariant, string> = {
  success: "border-l-[#22C55E]",
  error: "border-l-[#EF4444]",
  warning: "border-l-[#F59E0B]",
  info: "border-l-[#2563EB]",
};

const variantIconColor: Record<ToastVariant, string> = {
  success: "text-[#22C55E]",
  error: "text-[#EF4444]",
  warning: "text-[#F59E0B]",
  info: "text-[#2563EB]",
};

// ─── Toast Item ───
function ToastItem({ toast, onRemove }: { toast: ToastData; onRemove: (id: string) => void }) {
  const Icon = iconMap[toast.variant];

  useEffect(() => {
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => onRemove(toast.id), toast.duration);
      return () => clearTimeout(timer);
    }
  }, [toast, onRemove]);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-[16px] border border-[#E5E7EB] bg-white p-4 shadow-lg border-l-4",
        variantBorder[toast.variant],
        "animate-in slide-in-from-right-full duration-300",
      )}
    >
      <Icon className={cn("h-5 w-5 shrink-0 mt-0.5", variantIconColor[toast.variant])} />
      <p className="flex-1 text-sm font-medium text-[#0F172A]">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="rounded-lg p-0.5 text-[#94A3B8] transition-all hover:text-[#0F172A]"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}

// ─── Toast Provider ───
export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);

  const addToast = useCallback(
    (message: string, variant: ToastVariant = "info", duration: number = 4000) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      setToasts((prev) => [...prev, { id, message, variant, duration }]);
    },
    [],
  );

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      {/* Toast container */}
      {toasts.length > 0 && (
        <div className="fixed right-4 top-4 z-[100] flex flex-col gap-2 w-80 sm:w-96">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
          ))}
        </div>
      )}
    </ToastContext.Provider>
  );
}