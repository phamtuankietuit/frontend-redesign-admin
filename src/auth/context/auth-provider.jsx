import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useEffect, useCallback } from 'react';

import { selectAuth } from 'src/state/auth/auth.slice';
import { getAccessToken } from 'src/services/token.service';
import { getMeAsync } from 'src/services/auth/auth.service';

import { isValidToken } from './utils';
import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const { loading, isAuthenticated } = useSelector(selectAuth);

  const dispatch = useDispatch();

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = getAccessToken();

      if (!isAuthenticated && accessToken && isValidToken(accessToken)) {
        await dispatch(getMeAsync).unwrap();
      }
    } catch (error) {
      console.error(error);
    }
  }, [dispatch, isAuthenticated]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const memoizedValue = useMemo(
    () => ({
      checkUserSession,
      isAuthenticated,
      loading,
    }),
    [checkUserSession, isAuthenticated, loading],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
