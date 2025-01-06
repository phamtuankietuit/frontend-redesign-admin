import axios from 'axios';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { CONFIG } from 'src/config-global';

import { setSession, getAccessToken, getRefreshToken } from './token.service';

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

        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();

            if (refreshToken) {
                try {
                    const { data } = await axios.post(`${CONFIG.myServerUrl}/auth/refresh`, {
                        refreshToken,
                    });

                    setSession(data);

                    originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;

                    return AxiosInstance(originalRequest);
                } catch (refreshError) {
                    const router = useRouter();
                    router.replace(paths.auth.signIn);
                }
            }
        }

        return Promise.reject(new Error(error));
    }
);

export const GET = (url, config) => AxiosInstance.get(url, config);

export const POST = (url, body, config) => AxiosInstance.post(url, body, config);

export const PATCH = (url, body) => AxiosInstance.patch(url, body);

export const PUT = (url, body, config) => AxiosInstance.put(url, body, config);

export const DELETE = (url, config) => AxiosInstance.delete(url, config);

export default AxiosInstance;
