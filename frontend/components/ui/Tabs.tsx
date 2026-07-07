"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface TabsContextValue {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs() {
  const ctx = useContext(TabsContext);
  if (!ctx) throw new Error("Tabs components must be used within <Tabs>");
  return ctx;
}

export interface TabsProps {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  children: ReactNode;
  className?: string;
}

export function Tabs({ value, defaultValue, onValueChange, children, className }: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue || "");
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  const handleValueChange = (newValue: string) => {
    if (!isControlled) setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  return (
    <TabsContext.Provider value={{ value: currentValue, onValueChange: handleValueChange }}>
      <div className={cn("w-full", className)}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

export interface TabListProps {
  children: ReactNode;
  className?: string;
}

export function TabList({ children, className }: TabListProps) {
  return (
    <div
      className={cn(
        "flex gap-1 border-b border-[#E5E7EB]",
        className,
      )}
      role="tablist"
    >
      {children}
    </div>
  );
}

export interface TabProps {
  value: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
}

export function Tab({ value, children, className, disabled }: TabProps) {
  const { value: selectedValue, onValueChange } = useTabs();
  const isActive = selectedValue === value;

  return (
    <button
      role="tab"
      aria-selected={isActive}
      disabled={disabled}
      onClick={() => onValueChange(value)}
      className={cn(
        "relative px-4 py-2.5 text-sm font-medium transition-all outline-none",
        "text-[#64748B] hover:text-[#0F172A]",
        isActive && "text-[#2563EB]",
        "after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:rounded-full after:transition-all",
        isActive
          ? "after:bg-[#2563EB]"
          : "after:bg-transparent",
        disabled && "cursor-not-allowed opacity-50",
        className,
      )}
    >
      {children}
    </button>
  );
}

export interface TabPanelProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export function TabPanel({ value, children, className }: TabPanelProps) {
  const { value: selectedValue } = useTabs();

  if (selectedValue !== value) return null;

  return (
    <div
      role="tabpanel"
      className={cn("pt-4", className)}
    >
      {children}
    </div>
  );
}