import packageJson from '../package.json';

// ----------------------------------------------------------------------

export const CONFIG = {
  appName: 'KKBooks',
  appVersion: packageJson.version,
  serverUrl: import.meta.env.VITE_SERVER_URL ?? '',
  myServerUrl: import.meta.env.VITE_MY_SERVER_URL ?? '',
  chatServerUrl: import.meta.env.CHAT_SERVER_URL ?? '',
  assetsDir: import.meta.env.VITE_ASSETS_DIR ?? '',
  ghnUrl: import.meta.env.VITE_GHN_URL ?? '',
  ghnToken: import.meta.env.VITE_GHN_TOKEN ??
    '',
  frontendUrl: import.meta.env.VITE_FRONTEND_URL ?? '',
  auth: {
    skip: false,
    redirectPath: '/',
  },
};
