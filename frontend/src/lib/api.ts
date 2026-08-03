import type { ApiError } from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080/api";

class ApiRequestError extends Error {
  status: number;
  errors?: Record<string, string>;

  constructor(apiError: ApiError) {
    super(apiError.message);
    this.status = apiError.status;
    this.errors = apiError.errors;
  }
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
  } catch {
    throw new ApiRequestError({
      status: 0,
      error: "Network Error",
      message: "Could not reach the server. Is the backend running?",
    });
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new ApiRequestError(
      data ?? {
        status: response.status,
        error: response.statusText,
        message: "Something went wrong. Please try again.",
      }
    );
  }

  return data as T;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "POST", body: JSON.stringify(body) }),
  put: <T>(path: string, body: unknown) =>
    request<T>(path, { method: "PUT", body: JSON.stringify(body) }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};

export { ApiRequestError };
