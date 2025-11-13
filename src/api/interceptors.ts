import type { AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

/**
 * Common headers for all API requests
 */
export const commonHeaders = {
  'Content-Type': 'application/json',
};

/**
 * Validate status function for Axios
 * Treats 200-299 and 400-599 as valid (won't throw)
 */
export const validateStatus = (status: number): boolean => {
  return status >= 200 && status < 600;
};

/**
 * Request interceptor - handles JSON stringification and common setup
 */
export const requestInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  // Stringify data if it's an object and not already a string
  if (config.data && typeof config.data === 'object' && !(config.data instanceof FormData)) {
    try {
      config.data = JSON.stringify(config.data);
    } catch (error) {
      console.error('Error stringifying request data:', error);
    }
  }
  return config;
};

/**
 * Language interceptor - adds language header
 * You can customize this based on your i18n setup
 */
export const languageInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  const language = localStorage.getItem('language') || 'en';
  config.headers['Accept-Language'] = language;
  return config;
};

/**
 * Datadog tracing interceptor - adds tracing headers
 * You can customize this based on your tracing setup
 */
export const datadogTracingInterceptor = (
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig => {
  // Add Datadog tracing headers if needed
  // Example:
  // const traceId = generateTraceId();
  // config.headers['x-datadog-trace-id'] = traceId;
  return config;
};

/**
 * Response interceptor - handles JSON parsing
 */
export const responseInterceptor = (response: AxiosResponse): AxiosResponse => {
  // Parse response data if it's a string
  if (typeof response.data === 'string') {
    try {
      response.data = JSON.parse(response.data);
    } catch (error) {
      // If parsing fails, keep the original string
    }
  }
  return response;
};

/**
 * Error handler for response interceptor
 * Handles 401 (unauthorized) by triggering logout
 */
export const handleResponseError = (error: any): Promise<never> => {
  if (error.response?.status === 401) {
    // Handle unauthorized - trigger logout
    // You can customize this based on your auth setup
    console.warn('Unauthorized request - should trigger logout');
    // Example: window.location.href = '/login';
  }

  // Re-throw the error so it can be handled by the caller
  return Promise.reject(error);
};

