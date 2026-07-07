"use client";

import { forwardRef, useEffect, useCallback, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { X } from "lucide-react";

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
};

const Modal = forwardRef<HTMLDivElement, ModalProps>(
  ({ isOpen, onClose, title, children, size = "md", className }, ref) => {
    const overlayRef = useRef<HTMLDivElement>(null);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      },
      [onClose],
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
      }
      return () => {
        document.removeEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "";
      };
    }, [isOpen, handleKeyDown]);

    if (!isOpen) return null;

    return (
      <div
        ref={overlayRef}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        onClick={(e) => {
          if (e.target === overlayRef.current) onClose();
        }}
      >
        <div
          ref={ref}
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className={cn(
            "relative w-full rounded-[20px] bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-200",
            sizeClasses[size],
            className,
          )}
        >
          {/* Header */}
          {title && (
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#0F172A]">{title}</h2>
              <button
                onClick={onClose}
                className="rounded-lg p-1.5 text-[#64748B] transition-all hover:bg-[#F1F5F9] hover:text-[#0F172A]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          {/* Close button when no title */}
          {!title && (
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-lg p-1.5 text-[#64748B] transition-all hover:bg-[#F1F5F9] hover:text-[#0F172A]"
            >
              <X className="h-5 w-5" />
            </button>
          )}

          {/* Body */}
          {children}
        </div>
      </div>
    );
  },
);

Modal.displayName = "Modal";

export { Modal };