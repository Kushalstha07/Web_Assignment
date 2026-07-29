/**
 * Shared API client that DRYs repeated base URL, body, and cache boilerplate.
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
  signal?: AbortSignal;
}

type ErrorPayload = {
  message?: string;
  data?: unknown;
};

export class ApiError extends Error {
  readonly status: number;
  readonly data?: unknown;

  constructor(status: number, message: string, data?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

function getBaseUrl(): string {
  if (typeof window === "undefined") {
    return process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
  }
  return "";
}

export async function apiClient<T>(
  method: string,
  path: string,
  options: ApiClientOptions = {},
): Promise<T> {
  const { body, formData, params, cache = "no-store", signal } = options;

  const baseUrl = getBaseUrl();
  const url = new URL(`${baseUrl}${path}`, typeof window === "undefined" ? undefined : window.location.origin);

  // Append query params
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const headers: Record<string, string> = {};

  // Only set Content-Type for non-FormData requests
  if (!formData) {
    headers["Content-Type"] = "application/json";
  }

  const fetchOptions: RequestInit = {
    method,
    headers,
    cache,
    credentials: "include",
    signal,
  };

  if (body && formData) {
    fetchOptions.body = body as BodyInit;
  } else if (body) {
    fetchOptions.body = JSON.stringify(body);
  }

  const response = await fetch(url.toString(), fetchOptions);
  const contentType = response.headers.get("content-type") || "";
  let payload: unknown;

  if (response.status !== 204) {
    if (contentType.includes("application/json")) {
      payload = await response.json().catch(() => undefined);
    } else {
      const text = await response.text();
      payload = text || undefined;
    }
  }

  if (!response.ok) {
    const errorPayload =
      payload && typeof payload === "object" ? (payload as ErrorPayload) : undefined;
    const message =
      errorPayload?.message ||
      (typeof payload === "string" ? payload : undefined) ||
      `Request failed with status ${response.status}`;

    if (response.status === 401 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
    }
    throw new ApiError(response.status, message, errorPayload?.data);
  }

  return payload as T;
}
