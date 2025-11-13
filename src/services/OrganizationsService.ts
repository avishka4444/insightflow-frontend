import { CrudMessenger } from '../api/crud-messenger';

/**
 * Organizations service demonstrating the API call architecture
 */

// Organization model
export interface Organization {
  id: string;
  name: string;
  ownerId: string;
  stripeCustomerId: string;
  plan: string;
  createdAt: string;
}

const prefix = '/organizations';

/**
 * Organizations Service
 * This demonstrates how to use the API architecture
 */
class OrganizationService {
  /**
   * Get all organizations
   */
  async getAll(): Promise<Organization[]> {
    return new CrudMessenger(
      { 
        type: 'read', 
        modelName: 'Organizations',
        showLoading: false,
        showSuccess: false,
      },
      () => window.senderApi!.send(
        {
          method: 'GET',
          url: prefix,
        },
      ),
    ).run();
  }
}

// Export singleton instance
export const organizationService = new OrganizationService();

