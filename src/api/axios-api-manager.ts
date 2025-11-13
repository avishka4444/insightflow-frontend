import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import type { ResponseType } from './utils';

/**
 * Manages Axios instance and provides send method
 */
export class AxiosApiManager {
  constructor(private axiosInstance: AxiosInstance) {}

  async send<T = any, D = any>(
    req: string | { method: string; url: string },
    data?: D,
    headers?: Record<string, string>,
    responseType?: ResponseType,
  ): Promise<T> {
    let config: AxiosRequestConfig;

    if (typeof req === 'string') {
      // If req is a string, treat it as a POST request
      config = {
        method: 'POST',
        url: req,
        data,
        headers,
        responseType: responseType || 'json',
      };
    } else {
      // If req is an object, use the specified method
      config = {
        method: req.method as any,
        url: req.url,
        data,
        headers,
        responseType: responseType || 'json',
      };
    }

    const response: AxiosResponse<T> = await this.axiosInstance.request(config);
    return response.data;
  }
}

