import axios from "axios";

function generateApiClient({baseUrl = "", authorizationHeader = "Authorization", authorizationPrefix = "Bearer ", localStorageKey = "token"}) {
    const apiClient = axios.create({
        baseURL: baseUrl,
        timeout: 5000,
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


export default generateApiClient;