"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { whoami } from "@/lib/api/auth.api";
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
      const response = await whoami();
      if (response.success && response.data) {
        setUser(response.data);
      } else {
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
    refreshUser();
  }, [refreshUser]);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
    } catch {
      // If no logout endpoint, just clear user
    }
    // Clear the token cookie by setting it to expire immediately
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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