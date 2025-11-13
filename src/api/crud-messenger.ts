/**
 * Action type for CRUD operations
 */
export type CrudActionType = 'create' | 'read' | 'update' | 'delete';

/**
 * Configuration for CrudMessenger
 */
export interface CrudMessengerConfig {
  type: CrudActionType;
  modelName: string;
  showLoading?: boolean;
  showSuccess?: boolean;
  showError?: boolean;
}

/**
 * Toast notification interface
 * You should implement this based on your toast library (e.g., Ant Design message)
 */
export interface ToastService {
  loading: (message: string) => void | string | number;
  success: (message: string) => void | string | number;
  error: (message: string) => void | string | number;
  destroy: (messageId?: string | number) => void;
}

/**
 * Ant Design message service implementation
 */
class AntDesignToastService implements ToastService {
  private loadingMessageId: string | number | null = null;

  loading(message: string): string | number {
    // Try to use Ant Design message if available
    if (typeof window !== 'undefined' && (window as any).antd?.message) {
      this.loadingMessageId = (window as any).antd.message.loading(message, 0);
      return this.loadingMessageId;
    }
    // Fallback to console
    console.log(`[Loading] ${message}`);
    return '';
  }

  success(message: string): void {
    // Try to use Ant Design message if available
    if (typeof window !== 'undefined' && (window as any).antd?.message) {
      (window as any).antd.message.success(message);
      this.destroy();
      return;
    }
    // Fallback to console
    console.log(`[Success] ${message}`);
    this.destroy();
  }

  error(message: string): void {
    // Try to use Ant Design message if available
    if (typeof window !== 'undefined' && (window as any).antd?.message) {
      (window as any).antd.message.error(message);
      this.destroy();
      return;
    }
    // Fallback to console
    console.error(`[Error] ${message}`);
    this.destroy();
  }

  destroy(messageId?: string | number): void {
    const id = messageId || this.loadingMessageId;
    if (id && typeof window !== 'undefined' && (window as any).antd?.message) {
      (window as any).antd.message.destroy(id);
    }
    this.loadingMessageId = null;
  }
}

/**
 * Default toast service using console (can be replaced with actual toast library)
 */
class DefaultToastService implements ToastService {
  private loadingMessage: string | null = null;

  loading(message: string): void {
    this.loadingMessage = message;
    console.log(`[Loading] ${message}`);
  }

  success(message: string): void {
    console.log(`[Success] ${message}`);
    this.destroy();
  }

  error(message: string): void {
    console.error(`[Error] ${message}`);
    this.destroy();
  }

  destroy(): void {
    if (this.loadingMessage) {
      console.log(`[Destroy] ${this.loadingMessage}`);
      this.loadingMessage = null;
    }
  }
}

/**
 * CrudMessenger - Wraps API calls with toast notifications
 */
export class CrudMessenger<R = any> {
  private action?: () => Promise<R>;
  private config: CrudMessengerConfig;
  private toastService: ToastService;

  constructor(
    config: CrudMessengerConfig,
    action: () => Promise<R>,
    toastService?: ToastService,
  ) {
    this.config = {
      showLoading: true,
      showSuccess: true,
      showError: true,
      ...config,
    };
    this.action = action;
    // Try to use Ant Design message if available, otherwise use default
    this.toastService = toastService || 
      (typeof window !== 'undefined' && (window as any).antd?.message
        ? new AntDesignToastService()
        : new DefaultToastService());
  }

  /**
   * Get action type label
   */
  private getActionLabel(): string {
    const labels: Record<CrudActionType, string> = {
      create: 'Creating',
      read: 'Loading',
      update: 'Updating',
      delete: 'Deleting',
    };
    return labels[this.config.type] || 'Processing';
  }

  /**
   * Get success message
   */
  private getSuccessMessage(): string {
    const messages: Record<CrudActionType, string> = {
      create: 'Created successfully',
      read: 'Loaded successfully',
      update: 'Updated successfully',
      delete: 'Deleted successfully',
    };
    return `${this.config.modelName} ${messages[this.config.type]}`;
  }

  /**
   * Get error message
   */
  private getErrorMessage(error?: any): string {
    const messages: Record<CrudActionType, string> = {
      create: 'Failed to create',
      read: 'Failed to load',
      update: 'Failed to update',
      delete: 'Failed to delete',
    };
    const baseMessage = `${this.config.modelName} ${messages[this.config.type]}`;
    
    // Add error details if available
    if (error?.response?.data?.message) {
      return `${baseMessage}: ${error.response.data.message}`;
    }
    if (error?.message) {
      return `${baseMessage}: ${error.message}`;
    }
    return baseMessage;
  }

  /**
   * Show loading toast
   */
  private loading(): void {
    if (this.config.showLoading) {
      this.toastService.loading(`${this.getActionLabel()} ${this.config.modelName}...`);
    }
  }

  /**
   * Show success toast
   */
  private success(): void {
    if (this.config.showSuccess) {
      this.toastService.success(this.getSuccessMessage());
    }
  }

  /**
   * Show error toast and throw
   */
  private error(error: any): never {
    if (this.config.showError) {
      this.toastService.error(this.getErrorMessage(error));
    }
    throw error;
  }

  /**
   * Run the action with toast notifications
   */
  async run(
    onResult?: (
      rst?: R,
      error?: any,
    ) => { successKey?: string; errorKey?: string; loadingKey?: string },
  ): Promise<R> {
    if (!this.action) {
      throw new Error('The action is not found.');
    }

    try {
      this.loading();
      const result = await this.action();

      if (onResult) {
        const customMessages = onResult(result);
        if (customMessages.loadingKey) {
          this.config.modelName = customMessages.loadingKey;
        }
        if (customMessages.successKey) {
          this.toastService.success(customMessages.successKey);
          return result;
        }
      }

      this.success();
      return result;
    } catch (error) {
      if (onResult) {
        const customMessages = onResult(undefined, error);
        if (customMessages.errorKey) {
          this.toastService.error(customMessages.errorKey);
          throw error;
        }
      }

      throw this.error(error);
    }
  }
}

