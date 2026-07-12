"use client";

import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

export interface Step {
  title: string;
  description?: string;
}

export interface StepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isActive = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <div key={step.title} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold transition-all",
                    isCompleted && "bg-[#2563EB] text-white",
                    isActive && "border-2 border-[#2563EB] bg-white text-[#2563EB]",
                    !isCompleted && !isActive && "border-2 border-[#E5E7EB] bg-white text-[#94A3B8]",
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <span>{index + 1}</span>
                  )}
                </div>
                <div className="mt-2 text-center">
                  <p
                    className={cn(
                      "text-xs font-semibold",
                      (isCompleted || isActive) ? "text-[#0F172A]" : "text-[#94A3B8]",
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="mt-0.5 text-[10px] text-[#94A3B8]">{step.description}</p>
                  )}
                </div>
              </div>

              {/* Connector line */}
              {!isLast && (
                <div className="mx-4 flex-1">
                  <div className="relative h-0.5 w-full">
                    <div className="absolute inset-0 bg-[#E5E7EB] rounded-full" />
                    <div
                      className={cn(
                        "absolute inset-y-0 left-0 rounded-full transition-all duration-300",
                        isCompleted ? "bg-[#2563EB] w-full" : "w-0",
                      )}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}