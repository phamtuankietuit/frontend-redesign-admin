import { useDispatch, useSelector } from 'react-redux';
import { useMemo, useEffect, useCallback } from 'react';

import { useSetState } from 'src/hooks/use-set-state';

import { selectAuth } from 'src/state/auth/auth.slice';
import { getAccessToken } from 'src/services/token.service';
import { getMeAsync } from 'src/services/auth/auth.service';

import { isValidToken } from './utils';
import { AuthContext } from './auth-context';

// ----------------------------------------------------------------------

export function AuthProvider({ children }) {
  const dispatch = useDispatch();
  const { user } = useSelector(selectAuth);

  const { state, setState } = useSetState({
    user: null,
    loading: true,
  });

  const checkUserSession = useCallback(async () => {
    try {
      const accessToken = getAccessToken();

      if (accessToken && isValidToken(accessToken)) {
        dispatch(getMeAsync);

        setState({ user, loading: false });
      } else {
        setState({ user: null, loading: false });
      }
    } catch (error) {
      console.error(error);
      setState({ auth: null, loading: false });
    }
  }, [dispatch, setState, user]);

  useEffect(() => {
    checkUserSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ----------------------------------------------------------------------

  const checkAuthenticated = state.user ? 'authenticated' : 'unauthenticated';

  const status = state.loading ? 'loading' : checkAuthenticated;

  const memoizedValue = useMemo(
    () => ({
      user: state.user
        ? {
            ...state.user,
            role: state.user?.role ?? 'admin',
          }
        : null,
      checkUserSession,
      loading: status === 'loading',
      authenticated: status === 'authenticated',
      unauthenticated: status === 'unauthenticated',
    }),
    [checkUserSession, state.user, status],
  );

  return (
    <AuthContext.Provider value={memoizedValue}>
      {children}
    </AuthContext.Provider>
  );
}
