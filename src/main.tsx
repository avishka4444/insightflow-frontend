import "@ant-design/v5-patch-for-react-19";
import "antd/dist/reset.css";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { UserProvider } from "./context/UserContext.tsx";
import { QueryProvider } from "./providers/QueryProvider.tsx";
import axios from "axios";
import {
  commonHeaders,
  validateStatus,
  requestInterceptor,
  languageInterceptor,
  datadogTracingInterceptor,
  responseInterceptor,
  handleResponseError,
} from "./api/interceptors";
import { AxiosApiManager } from "./api/axios-api-manager";
import { BrowserSender } from "./api/sender";
import { ObjectUtil } from "./api/utils";
import { initializeAntdMessage } from "./api/antd-integration";
import "./types/window.d.ts";

// Initialize Ant Design message integration
initializeAntdMessage();

// Initialize API instance for main backend
export const apiApi: any = axios.create({
  baseURL: import.meta.env.VITE_API_SERVER_URL as string || "http://localhost:8080/api",
  headers: commonHeaders,
  validateStatus: validateStatus,
});

// Set up interceptors
apiApi.interceptors.request.use(requestInterceptor);
apiApi.interceptors.request.use(languageInterceptor);
apiApi.interceptors.request.use(datadogTracingInterceptor);
apiApi.interceptors.response.use(responseInterceptor, handleResponseError);

// Create and expose sender
window.senderApi = ObjectUtil.wrapInProxy(
  new BrowserSender(new AxiosApiManager(apiApi)),
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <UserProvider>
        <App />
      </UserProvider>
    </QueryProvider>
  </StrictMode>
);
