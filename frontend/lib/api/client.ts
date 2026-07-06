/**
 * Shared API client that DRYs the repeated baseUrl/token/parse/cache boilerplate.
 * Every frontend API module should route through this helper.
 *
 * Usage:
 *   apiClient("GET", "/api/v1/admin/users")
 *   apiClient("POST", "/api/v1/auth/login", { body: { email, password } })
 *   apiClient("PUT", "/api/v1/auth/update", { formData: true, body: formDataPayload })
 */

export interface ApiClientOptions {
  body?: unknown;
  formData?: boolean;
  params?: Record<string, string>;
  cache?: RequestCache;
}

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  }
  return "";
}

function getToken(): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )client-token=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

export async function apiClient<T>(
  method: string,
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { body, formData, params, cache = "no-store" } = options;

  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}${path}`, typeof window === "undefined" ? undefined : window.location.origin);

  // Append query params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const token = getToken();
  const headers: Record<string, string> = {};

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Only set Content-Type for non-FormData requests
  if (!formData) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    cache,
  };

  if (body && formData) {
    fetchOptions.body = body as BodyInit;
  } else if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), fetchOptions);
  return response.json();
}