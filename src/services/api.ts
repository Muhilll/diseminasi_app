/**
 * API Service
 * Centralized API calls and configurations
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export async function apiCall<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export const api = {
  get: <T,>(endpoint: string) => apiCall<T>(endpoint, { method: 'GET' }),
  post: <T,>(endpoint: string, body: unknown) =>
    apiCall<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
  put: <T,>(endpoint: string, body: unknown) =>
    apiCall<T>(endpoint, { method: 'PUT', body: JSON.stringify(body) }),
  delete: <T,>(endpoint: string) =>
    apiCall<T>(endpoint, { method: 'DELETE' }),
};
