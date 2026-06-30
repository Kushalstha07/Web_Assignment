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

/**
 * Read a cookie value by name from document.cookie
 */
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return match ? decodeURIComponent(match[2]) : null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SafeUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUser = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Read the client-token cookie and pass it as Authorization header
      const token = getCookie("client-token");

      if (!token) {
        setUser(null);
        setLoading(false);
        return;
      }

      // Use the Next.js proxy path (rewritten to backend by next.config.ts)
      const response = await fetch("/api/v1/auth/whoami", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      });

      const data = await response.json();

      if (data.success && data.data) {
        setUser(data.data);
      } else {
        // Invalid session - clear httpOnly cookie and redirect to login
        await fetch("/api/v1/auth/logout", { method: "POST" }).catch(() => {});
        document.cookie = "client-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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
      // Attempt to call backend logout endpoint
      const token = getCookie("client-token");
      if (token) {
        await fetch("/api/v1/auth/logout", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          cache: "no-store",
        }).catch(() => {});
      }
    } catch {
      // Ignore backend errors during logout
    }
    // Clear both cookies regardless of backend response
    document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
    document.cookie = "client-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
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