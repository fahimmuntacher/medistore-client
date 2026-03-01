/**
 * Centralized API client using Next.js fetch with proper credential handling
 */

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

interface FetchOptions extends RequestInit {
  params?: Record<string, any>;
}

async function apiRequest<T>(
  endpoint: string,
  options: FetchOptions = {}
): Promise<T> {
  const { params, ...fetchOptions } = options;

  // Build URL with query parameters
  const url = new URL(`${BASE_URL}${endpoint}`);
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
  }

  // Default fetch options
  const defaultOptions: RequestInit = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Send cookies with cross-origin requests
    cache: "no-store", // Always fetch fresh data
  };

  const mergedOptions = {
    ...defaultOptions,
    ...fetchOptions,
    headers: {
      ...(defaultOptions.headers as Record<string, string>),
      ...(fetchOptions.headers as Record<string, string>),
    },
  };

  // Debug logging for POST/PUT requests
  if (fetchOptions.method === "POST" || fetchOptions.method === "PUT") {
    console.log(`API ${fetchOptions.method} ${endpoint}:`, {
      url: url.toString(),
      body: mergedOptions.body ? JSON.parse(mergedOptions.body as string) : undefined,
      headers: mergedOptions.headers,
    });
  }

  try {
    const response = await fetch(url.toString(), mergedOptions);

    // Handle non-OK responses
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const error = new Error(
        errorData?.message || `HTTP ${response.status}`
      ) as any;
      error.status = response.status;
      error.data = errorData;
      console.error(`🔍 API Error [${endpoint}] Status ${response.status}:`, errorData);
      throw error;
    }

    // Parse and return JSON response
    const data = await response.json();
    if (fetchOptions.method === "POST" || fetchOptions.method === "PUT") {
      console.log(`🔍 API ${fetchOptions.method} ${endpoint} success:`, data);
    }
    return data;
  } catch (error) {
    console.error(`API Error [${endpoint}]:`, error);
    throw error;
  }
}

// Convenience methods
export const api = {
  get: <T = any>(endpoint: string, options: FetchOptions = {}) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: any, options: FetchOptions = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, options: FetchOptions = {}) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),

  patch: <T = any>(
    endpoint: string,
    body?: any,
    options: FetchOptions = {}
  ) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, options: FetchOptions = {}) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};
