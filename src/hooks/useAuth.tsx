import { useMsal } from "@azure/msal-react";
import { msalInstance, loginRequest } from "../config/msalConfig";

export const useAuth = () => {
  const { accounts } = useMsal();
  const isAuthenticated = accounts.length > 0;

  const login = async () => {
    await msalInstance.loginRedirect(loginRequest);
  };

  const logout = async () => {
    await msalInstance.logoutRedirect();
  };

  const getToken = async () => {
    if (!isAuthenticated) return null;
    const response = await msalInstance.acquireTokenSilent({
      scopes: loginRequest.scopes,
      account: accounts[0],
    });
    return response.accessToken;
  };

  return { accounts, isAuthenticated, login, logout, getToken };
};