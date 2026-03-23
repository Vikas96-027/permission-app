import { environment } from "../../config/msalConfig";

export type ApiEnvironmentName = "localhost" | "development" | "production";

export interface ApiEnvironmentConfig {
  name: ApiEnvironmentName;
  apiBaseUrl: string;
  defaultTimeout: number;
  defaultCacheTTL: number;
  enableLogging: boolean;
}

const DEV_API_BASE_URL =
  (import.meta as any).env.VITE_POLICYGUARD_API_BASE_URL_DEV ||
  "https://swagger.dev.chargerapps.charger.com/policyguardsvc";

const LOCAL_API_BASE_URL =
  (import.meta as any).env.VITE_POLICYGUARD_API_BASE_URL_LOCAL ||
  DEV_API_BASE_URL;

// Replace this fallback if your actual prod URL is different.
const PROD_API_BASE_URL =
  (import.meta as any).env.VITE_POLICYGUARD_API_BASE_URL_PROD ||
  "https://swagger.chargerapps.charger.com/policyguardsvc";

const settings: Record<ApiEnvironmentName, ApiEnvironmentConfig> = {
  localhost: {
    name: "localhost",
    apiBaseUrl: LOCAL_API_BASE_URL,
    defaultTimeout: 30_000,
    defaultCacheTTL: 5 * 60 * 1000,
    enableLogging: true,
  },
  development: {
    name: "development",
    apiBaseUrl: DEV_API_BASE_URL,
    defaultTimeout: 30_000,
    defaultCacheTTL: 5 * 60 * 1000,
    enableLogging: true,
  },
  production: {
    name: "production",
    apiBaseUrl: PROD_API_BASE_URL,
    defaultTimeout: 30_000,
    defaultCacheTTL: 10 * 60 * 1000,
    enableLogging: false,
  },
};

export const getApiEnvironmentConfig = (): ApiEnvironmentConfig => {
  const current = environment as ApiEnvironmentName;
  return settings[current] ?? settings.development;
};

export const getApiBaseUrl = (): string => getApiEnvironmentConfig().apiBaseUrl;
