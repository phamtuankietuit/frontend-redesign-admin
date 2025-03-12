import axios from 'axios';

import { redirectToSignIn } from 'src/utils/navigation';

import { CONFIG } from 'src/config-global';

import { setSession, deleteItem, sessionKey, getAccessToken, getRefreshToken } from './token.service';

const AxiosInstance = axios.create({
    baseURL: `${CONFIG.myServerUrl}/api`,
});

AxiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = getAccessToken();
        const unAuthorizeUrls = ['/auth/sign-in'];

        if (accessToken && config.url && !unAuthorizeUrls.includes(config.url)) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }

        return config;
    },
    (error) => Promise.reject(new Error(error))
);

AxiosInstance.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response?.status !== 401 || originalRequest._retry) {
            return Promise.reject(new Error(error.response?.data?.message || error.message || 'Unknown error'));
        }

        originalRequest._retry = true;

        const refreshToken = getRefreshToken();

        if (!refreshToken) {
            deleteItem(sessionKey);
            return Promise.reject(new Error(error.response?.data?.message || error.message || 'Unknown error'));
        }

        try {
            const { data } = await axios.post(`${CONFIG.myServerUrl}/auth/refresh`, { refreshToken });

            setSession(data);
            originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

            return AxiosInstance(originalRequest);
        } catch (refreshError) {
            deleteItem(sessionKey);
            redirectToSignIn();
            return Promise.reject(new Error(refreshError.response?.data?.message || refreshError.message || 'Unknown error'));
        }
    }
);

export const GET = (url, config) => AxiosInstance.get(url, config);

export const POST = (url, body, config) => AxiosInstance.post(url, body, config);

export const PATCH = (url, body) => AxiosInstance.patch(url, body);

export const PUT = (url, body, config) => AxiosInstance.put(url, body, config);

export const DELETE = (url, config) => AxiosInstance.delete(url, config);

export default AxiosInstance;
