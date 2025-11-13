import { message } from 'antd';

/**
 * Initialize Ant Design message integration
 * Call this in your app initialization to enable Ant Design toast notifications
 */
export function initializeAntdMessage() {
  if (typeof window !== 'undefined') {
    (window as any).antd = {
      message,
    };
  }
}

