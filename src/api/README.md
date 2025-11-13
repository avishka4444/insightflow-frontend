# API Call Architecture

This directory contains the API call architecture for the InsightFlow frontend application. The architecture provides a centralized, consistent API layer with automatic authentication, error handling, and user feedback.

## Architecture Overview

### 1. **Axios Instances** (`main.tsx`)
Multiple Axios instances can be created for different backend services:
- `apiApi` - Main backend API (default)
- You can add more instances like `apiAdmin`, `apiVendor`, etc.

### 2. **BrowserSender** (`sender.ts`)
Wraps Axios and handles authentication automatically:
- Gets auth token from `window.authProvider`
- Adds Bearer token to Authorization header
- Sets appropriate Content-Type headers

### 3. **AxiosApiManager** (`axios-api-manager.ts`)
Manages Axios instance and provides a unified send method that handles:
- String paths (defaults to POST)
- Object requests with method and URL
- Response type configuration

### 4. **CrudMessenger** (`crud-messenger.ts`)
Wraps API calls with toast notifications:
- Loading states
- Success messages
- Error handling
- Supports Ant Design message component

### 5. **Interceptors** (`interceptors.ts`)
Request interceptors:
- JSON stringification
- Language headers
- Datadog tracing (optional)
- Authentication tokens

Response interceptors:
- JSON parsing
- Error handling (401 triggers logout)

### 6. **React Query Integration**
Services use React Query for data fetching in components with:
- Automatic caching
- Refetching
- Loading/error states

## Usage

### Setting Up Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_SERVER_URL=http://localhost:8000/api
```

### Creating a Service

```typescript
import { CrudMessenger } from '../api/crud-messenger';

const prefix = '/users';

class UserService {
  async getOne(id: { id: string }): Promise<User> {
    return new CrudMessenger(
      { type: 'read', modelName: 'User' },
      () => window.senderApi!.send(`${prefix}/get-one`, id),
    ).run();
  }

  async getAll(body: PaginationProps): Promise<GetRequestReturn<User[]>> {
    return new CrudMessenger(
      { type: 'read', modelName: 'Users' },
      () => window.senderApi!.send(`${prefix}/get-all`, body),
    ).run();
  }
}

export const userService = new UserService();
```

### Using in Components with React Query

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '../services/user.service';

function UsersComponent() {
  const queryClient = useQueryClient();

  // Fetch data
  const { data, isLoading, error } = useQuery({
    queryKey: [userService.getAll.name, { page: 1, pageSize: 10 }],
    queryFn: () => userService.getAll({ page: 1, pageSize: 10 }),
  });

  // Mutations
  const createMutation = useMutation({
    mutationFn: (user: CreateUserDto) => userService.create(user),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [userService.getAll.name] });
    },
  });

  return (
    <div>
      {isLoading && <div>Loading...</div>}
      {error && <div>Error: {error.message}</div>}
      {data && <div>{/* Render data */}</div>}
    </div>
  );
}
```

### Setting Up Authentication Provider

You need to set up `window.authProvider` to provide authentication tokens:

```typescript
// In your auth setup file
window.authProvider = {
  getIdToken: async () => {
    // Get token from your auth system (e.g., Firebase, Auth0, etc.)
    return localStorage.getItem('authToken') || null;
  },
};
```

### Adding Multiple Backend Services

To add multiple backend services (like in the example), update `main.tsx`:

```typescript
// Admin backend
export const apiAdmin = axios.create({
  baseURL: import.meta.env.VITE_ADMIN_SERVER_URL,
  headers: commonHeaders,
  validateStatus: validateStatus,
});

apiAdmin.interceptors.request.use(requestInterceptor);
apiAdmin.interceptors.request.use(languageInterceptor);
apiAdmin.interceptors.response.use(responseInterceptor, handleResponseError);

window.senderAdmin = ObjectUtil.wrapInProxy(
  new BrowserSender(new AxiosApiManager(apiAdmin)),
);

// Vendor backend
export const apiVendor = axios.create({
  baseURL: import.meta.env.VITE_VENDOR_SERVER_URL,
  headers: commonHeaders,
  validateStatus: validateStatus,
});

// ... similar setup
```

## Features

- ✅ Automatic authentication token injection
- ✅ Centralized error handling
- ✅ Toast notifications (loading/success/error)
- ✅ Request/response interceptors
- ✅ Language header support
- ✅ TypeScript support
- ✅ React Query integration
- ✅ Multiple backend service support
- ✅ Ant Design message integration

## File Structure

```
src/
├── api/
│   ├── axios-api-manager.ts    # Axios instance manager
│   ├── sender.ts                # BrowserSender for auth
│   ├── crud-messenger.ts        # Toast notification wrapper
│   ├── interceptors.ts          # Request/response interceptors
│   ├── utils.ts                 # Utility functions
│   └── index.ts                 # Exports
├── services/
│   └── example.service.ts       # Example service implementation
├── providers/
│   └── QueryProvider.tsx        # React Query provider
└── main.tsx                     # API initialization
```

