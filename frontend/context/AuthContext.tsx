"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import type { SafeUser } from "@/lib/api/types";

interface AuthContextType {
  user: SafeUser | null;
  loading: boolean;
  error: string | null;
  refreshUser: () => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: SafeUser | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/v1/auth/whoami", {
        method: "GET",
        credentials: "include",
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data);
      } else {
        // Invalid session - clear httpOnly cookie and redirect to login
        await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => {});
        setUser(null);
      }
    } catch {
      setUser(null);
      setError("Failed to fetch user");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => void refreshUser(), 0);
    return () => window.clearTimeout(timer);
  }, [refreshUser]);

  useEffect(() => {
    const handleUnauthorized = () => {
      setUser(null);
      setError("Your session has expired. Please sign in again.");
    };
    window.addEventListener("auth:unauthorized", handleUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", handleUnauthorized);
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/v1/auth/logout", {
        method: "POST",
        credentials: "include",
        cache: "no-store",
      }).catch(() => {});
    } catch {
      // Ignore backend errors during logout
    }
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, error, refreshUser, logout, setUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
