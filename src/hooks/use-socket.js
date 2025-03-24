import { io } from 'socket.io-client';
import { useMemo, useState, useEffect } from 'react';

// ----------------------------------------------------------------------

// export const socket = io('http://localhost:5000', { withCredentials: true });

// ----------------------------------------------------------------------

// export function useSocket(eventName) {
//   const [data, setData] = useState(undefined);

//   useEffect(() => {
//     socket.on(eventName, (arg) => {
//       setData(arg);
//     });

//     return () => {
//       socket.off(eventName);
//     };
//   }, [eventName]);

//   const memoizedValue = useMemo(
//     () => ({
//       ...data,
//     }),
//     [data]
//   );

//   return memoizedValue;
// }
