/**
 * Auth provider interface
 */
interface AuthProvider {
  getIdToken(): Promise<string | null>;
}

/**
 * Extended Window interface with API senders
 */
declare global {
  interface Window {
    senderApi?: import('../api/sender').BrowserSender;
    authProvider?: AuthProvider;
  }
}

export {};

