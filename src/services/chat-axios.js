import axios from 'axios';

import { CONFIG } from 'src/config-global';

import { getAccessToken } from './token.service';

const ChatAxiosInstance = axios.create({
  baseURL: CONFIG.chatServerUrl,
});

ChatAxiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();

    if (accessToken && config.url) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(new Error(error))
);

ChatAxiosInstance.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(new Error(error))
);

export const CHAT_GET = (url, config) => ChatAxiosInstance.get(url, config);

export const CHAT_POST = (url, body, config) => ChatAxiosInstance.post(url, body, config);

export const CHAT_PUT = (url, body, config) => ChatAxiosInstance.put(url, body, config);

export default ChatAxiosInstance;
