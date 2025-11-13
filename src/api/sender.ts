import { AxiosApiManager } from './axios-api-manager';
import type { ResponseType, ReqOrPath } from './utils';

/**
 * Auth provider interface
 * You should implement this based on your authentication setup
 */
export interface AuthProvider {
  getIdToken(): Promise<string | null>;
}

/**
 * BrowserSender - Wraps AxiosApiManager and handles authentication
 */
export class BrowserSender {
  constructor(private api: AxiosApiManager) {}

  /**
   * Send API request with automatic authentication
   */
  async send<R = any, T = any>(
    req: ReqOrPath,
    data?: T,
    responseType?: ResponseType,
  ): Promise<R> {
    let idToken: string | null = null;

    // Try to get auth token from auth provider
    try {
      const authProvider = (window as any).authProvider as AuthProvider | undefined;
      if (authProvider) {
        idToken = await authProvider.getIdToken();
      }
    } catch (err) {
      console.warn('Failed to get auth token:', err);
      idToken = null;
    }

    const headers: Record<string, string> = {
      Authorization: idToken ? `Bearer ${idToken}` : '',
    };

    // Set Content-Type based on data type
    if (data !== undefined) {
      headers['Content-Type'] =
        typeof data === 'object' && !(data instanceof FormData)
          ? 'application/json'
          : 'text/plain';
    }

    const result = await this.api.send<R, T>(req, data, headers, responseType);
    return result;
  }
}

