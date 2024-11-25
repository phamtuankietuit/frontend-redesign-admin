import axios from 'axios';

const ChatAxiosInstance = axios.create({
  baseURL: `http://localhost:5000/api`,
});

export const CHAT_GET = (url, config) => ChatAxiosInstance.get(url, config);

export const CHAT_POST = (url, body, config) => ChatAxiosInstance.post(url, body, config);

export default ChatAxiosInstance;
