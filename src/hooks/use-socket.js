import { io } from 'socket.io-client';
import { useMemo, useState, useEffect } from 'react';

import { CONFIG } from 'src/config-global';

// ----------------------------------------------------------------------

// Extract base URL without API path for socket connection
const getSocketUrl = () => {
  const url = CONFIG.chatServerUrl || '';
  // Remove any API paths to get the base server URL
  return url.replace(/\/api\/v1$/, '');
};

// Create socket with reconnection options and error handling
export const socket = io(getSocketUrl(), {
  withCredentials: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  timeout: 20000,
});

// Add socket event listeners for connection status
socket.on('connect', () => {
  console.log('Socket connected successfully, ID:', socket.id);
});

socket.on('connect_error', (error) => {
  console.error('Socket connection error:', error);
});

socket.on('reconnect', (attemptNumber) => {
  console.log(`Socket reconnected after ${attemptNumber} attempts`);
});

socket.on('reconnect_error', (error) => {
  console.error('Socket reconnection error:', error);
});

// ----------------------------------------------------------------------

export function useSocket(eventName) {
  const [data, setData] = useState(undefined);

  useEffect(() => {
    socket.on(eventName, (arg) => {
      setData(arg);
    });

    return () => {
      socket.off(eventName);
    };
  }, [eventName]);

  const memoizedValue = useMemo(
    () => ({
      ...data,
    }),
    [data]
  );

  return memoizedValue;
}
