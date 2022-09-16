import axios from "axios";

function generateApiClient({baseUrl = "", authorizationHeader = "Authorization", authorizationPrefix = "Bearer"}) {
    const apiClient = axios.create({
        baseURL: baseUrl,
    }
    );

    apiClient.interceptors.request.use(
        function (config) {
            config.headers = config.headers || {};
            const token =
                localStorage.getItem("token") || sessionStorage.getItem("token");
            if (token) {
                config.headers[authorizationHeader] = `${authorizationPrefix} ${token}`;
            }
            config.headers["Content-Type"] = "application/json";
            config.headers["Accept"] = "application/json";
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