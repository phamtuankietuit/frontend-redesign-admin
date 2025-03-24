import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useState, useEffect, useCallback } from 'react';

import { selectAuth } from 'src/state/auth/auth.slice';
import { getAccessToken } from 'src/services/token.service';
import { getMeAsync } from 'src/services/auth/auth.service';

import { isValidToken } from './utils';
import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const [loading, setLoading] = useState(true);

  const { user } = useSelector(selectAuth);

  const dispatch = useDispatch();

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = getAccessToken();

      if (!user && accessToken && isValidToken(accessToken)) {
        await dispatch(getMeAsync()).unwrap();
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, [dispatch, user]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      checkUserSession,
      user,
      loading,
    }),
    [checkUserSession, user, loading],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
