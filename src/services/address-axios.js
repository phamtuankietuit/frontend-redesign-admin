import axios from 'axios';

import { CONFIG } from 'src/config-global';

const AddressAxiosInstance = axios.create({
  baseURL: CONFIG.ghnUrl,
});

AddressAxiosInstance.interceptors.request.use(
  (config) => {
    const { ghnToken } = CONFIG;

    if (ghnToken && config.url) {
      config.headers = {
        ...config.headers,
        'Token': ghnToken,
      };
    }

    return config;
  },
  (error) => Promise.reject(new Error(error))
);

export const ADDRESS_GET = (url, config) => AddressAxiosInstance.get(url, config);

export default AddressAxiosInstance;