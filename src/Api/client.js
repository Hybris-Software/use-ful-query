import axios from "axios";
import parseJwt from "../Utils/parseJwt";

export function generateApiClient({baseUrl = "", timeout = 5000, authorizationHeader = "Authorization", authorizationPrefix = "Bearer ", localStorageKey = "token"}) {
    const apiClient = axios.create({
        baseURL: baseUrl,
        timeout: timeout,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
    });

    apiClient.interceptors.request.use(
        function (config) {
            config.headers = config.headers || {};
            const token =
                localStorage.getItem(localStorageKey) || sessionStorage.getItem(localStorageKey);
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

export function generateJwtApiClient({baseUrl = "", timeout = 5000, authorizationHeader = "Authorization", authorizationPrefix = "Bearer ", accessTokenLocalStorageKey = "accessToken", refreshTokenLocalStorageKey = "refreshToken", refreshTokenFunction = undefined}) {
    const apiClient = axios.create({
        baseURL: baseUrl,
        timeout: timeout,
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
        }
    });

    apiClient.interceptors.request.use(
        async function (config) {
            config.headers = config.headers || {};

            let accessToken = localStorage.getItem(accessTokenLocalStorageKey) || sessionStorage.getItem(localStorageKey);
            let refreshToken = localStorage.getItem(refreshTokenLocalStorageKey) || sessionStorage.getItem(localStorageKey);
            let accessTokenStorage = localStorage.getItem(accessTokenLocalStorageKey) ? localStorage : sessionStorage;
            let refreshTokenStorage = localStorage.getItem(refreshTokenLocalStorageKey) ? localStorage : sessionStorage;

            if (accessToken) {
                // Check if the access token is expired
                const decoded = parseJwt(accessToken);
                if(decoded.exp && decoded.exp < Date.now() / 1000 && refreshToken && refreshTokenFunction && refreshTokenUrl) {
                    // If the access token is expired, try to refresh it
                    try {
                        const [newAccessToken, newRefreshToken] = await refreshTokenFunction({accessToken, refreshToken});
                        accessTokenStorage.setItem(accessTokenLocalStorageKey, newAccessToken);
                        refreshTokenStorage.setItem(refreshTokenLocalStorageKey, newRefreshToken);
                        accessToken = newAccessToken;
                        refreshToken = newRefreshToken;
                    } catch {}
                }

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
