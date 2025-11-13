/**
 * Utility functions for API layer
 */

/**
 * Wraps an object in a Proxy to enable dynamic property access
 */
export class ObjectUtil {
  static wrapInProxy<T extends object>(obj: T): T {
    return new Proxy(obj, {
      get(target, prop) {
        if (prop in target) {
          return (target as any)[prop];
        }
        return undefined;
      },
    });
  }
}

/**
 * Response type for API calls
 */
export type ResponseType = 'json' | 'text' | 'blob' | 'arraybuffer' | 'document';

/**
 * Request or path type
 */
export type ReqOrPath = string | { method: string; url: string };

