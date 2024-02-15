import axios from "axios";
import { ApiClientProps } from "../types";

export function generateApiClient({
  baseUrl = "",
  timeout = 5000,
  authorizationHeader = "Authorization",
  authorizationPrefix = "Bearer ",
  localStorageKey = "token",
  acceptLanguage = "en-en",
}: ApiClientProps) {
  const apiClient = axios.create({
    baseURL: baseUrl,
    timeout: timeout,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Accept-Language": acceptLanguage,
    },
  });

  apiClient.interceptors.request.use(
    function (config) {
      config.headers = config.headers || {};
      const token =
        localStorage.getItem(localStorageKey) ||
        sessionStorage.getItem(localStorageKey);
      if (token) {
        config.headers[authorizationHeader] = `${authorizationPrefix}${token}`;
      }
      return config;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  apiClient.interceptors.response.use(
    function (response) {
      return response;
    },
    function (error) {
      return Promise.reject(error);
    }
  );

  return apiClient;
}
