// import { type Configuration, LogLevel } from "@azure/msal-browser";
// import { PublicClientApplication } from "@azure/msal-browser";

// export const msalConfig: Configuration = {
//   auth: {
//     clientId: import.meta.env.VITE_AZURE_CLIENT_ID as string,
//     authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID as string}`,
//     redirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI as string,
//     postLogoutRedirectUri: import.meta.env.VITE_AZURE_REDIRECT_URI as string,
//     navigateToLoginRequestUrl: false,
//   },
//   cache: {
//     cacheLocation: "localStorage",
//     storeAuthStateInCookie: false,
//   },
//   system: {
//     loggerOptions: {
//       loggerCallback: (level, message, containsPii) => {
//         if (containsPii) return;
//         switch (level) {
//           case LogLevel.Error:
//             console.error(message);
//             return;
//           case LogLevel.Warning:
//             if (message.includes("There is already an instance of MSAL.js")) return;
//             console.warn(message);
//             return;
//           case LogLevel.Info:
//           case LogLevel.Verbose:
//             return;
//         }
//       },
//     },
//   },
// };

// export const loginRequest = {
//   scopes: ["openid", "profile", "User.Read"],
// };

// export const tokenRequest = {
//   scopes: [import.meta.env.VITE_AZURE_SCOPE as string],
// };

// export const graphTokenRequest = {
//   scopes: ["https://graph.microsoft.com/User.Read"],
// };

// export const msalInstance = new PublicClientApplication(msalConfig);


/**
 * MSAL Configuration
 * Configuration for Microsoft Authentication Library
 */

import { Configuration, LogLevel, PublicClientApplication } from "@azure/msal-browser";

/**
 * Determine environment based on hostname
 */
const determineEnvironment = (): 'localhost' | 'development' | 'production' => {
  const hostname = window.location.hostname;

  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'localhost';
  }

  if (
    hostname.includes('chargerfleet.com') ||
    hostname.includes('charger-fleet.com')
  ) {
    return 'production';
  }

  return 'development';
};

const baseUrl = window.location.origin;
const environment = determineEnvironment();

/**
 * Environment-specific MSAL settings
 */
const environmentSettings = {
  localhost: {
    clientId: 'bf653627-7f06-4d86-b3c5-adc92ea747cf',
    authority: 'https://login.microsoftonline.com/ff93404f-c1e7-43e5-ab53-a9b9d85c1f98',
    apiScope: 'api://ChargerFleet-Core-Gtw-Dev/User-Impersonation',
    apiBaseUrl: 'https://globalapi.chargerfleetdev.cloud',
  },
  development: {
    clientId: 'bf653627-7f06-4d86-b3c5-adc92ea747cf',
    authority: 'https://login.microsoftonline.com/ff93404f-c1e7-43e5-ab53-a9b9d85c1f98',
    apiScope: 'api://ChargerFleet-Core-Gtw-Dev/User-Impersonation',
    apiBaseUrl: 'https://globalapi.chargerfleetdev.cloud',
  },
  production: {
    clientId: 'd5c6fa4f-97bd-4052-86c7-e083b0a85cd1',
    authority: 'https://login.microsoftonline.com/ff93404f-c1e7-43e5-ab53-a9b9d85c1f98',
    apiScope: 'api://ChargerFleet-Core-Gtw-Prod/User-Impersonation',
    apiBaseUrl: 'https://globalapi.chargerfleet.com',
  },
};

const currentSettings = environmentSettings[environment];
const isDevelopment = environment === 'localhost' || environment === 'development';

/**
 * Validates that all required MSAL configuration is present
 */
export const validateMsalConfig = (): boolean => {
  const required = [currentSettings.clientId, currentSettings.authority, currentSettings.apiScope];
  return required.every(v => !!v && v !== 'your-azure-client-id-here');
};

/**
 * MSAL Configuration object
 */
export const msalConfig: Configuration = {
  auth: {
    clientId: currentSettings.clientId,
    authority: currentSettings.authority,
    redirectUri: baseUrl,
    postLogoutRedirectUri: `${baseUrl}/login`,
    navigateToLoginRequestUrl: false,
  },
  cache: {
    cacheLocation: "localStorage",
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
        if (containsPii) return;
        switch (level) {
          case LogLevel.Error:
            console.error(`[MSAL] ${message}`);
            break;
          case LogLevel.Warning:
            console.warn(`[MSAL] ${message}`);
            break;
          case LogLevel.Info:
            if (isDevelopment) console.info(`[MSAL] ${message}`);
            break;
          case LogLevel.Verbose:
            if (isDevelopment) console.debug(`[MSAL] ${message}`);
            break;
        }
      },
      logLevel: isDevelopment ? LogLevel.Verbose : LogLevel.Warning,
      piiLoggingEnabled: false,
    },
  },
};

/**
 * Token request configurations
 */
export type TokenType = "access" | "graph";

export const loginRequest = {
  scopes: ["openid", "profile", "User.Read"],
  prompt: "select_account" as const,
};

export const accessTokenRequest = {
  scopes: [currentSettings.apiScope],
  forceRefresh: false,
};

export const graphTokenRequest = {
  scopes: ["https://graph.microsoft.com/User.Read"],
  forceRefresh: false,
};

/**
 * API Base URL for the current environment
 */
export const apiBaseUrl = currentSettings.apiBaseUrl;

export { isDevelopment, environment };

export const msalInstance = new PublicClientApplication(msalConfig);


