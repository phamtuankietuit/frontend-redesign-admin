import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { paths } from 'src/routes/paths';
import { useRouter } from 'src/routes/hooks';

import { selectAuth } from 'src/state/auth/auth.slice';
import { getAccessToken } from 'src/services/token.service';
import { getMeAsync } from 'src/services/auth/auth.service';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export function AuthGuard({ children }) {
  const router = useRouter();

  const dispatch = useDispatch();

  const { user, loading } = useSelector(selectAuth);

  const [isChecking, setIsChecking] = useState(true);

  const checkPermissions = async () => {
    if (!user) {
      if (getAccessToken() === null) {
        router.replace(paths.auth.signIn);
      } else {
        dispatch(getMeAsync());
      }
      return;
    }

    setIsChecking(false);
  };

  useEffect(() => {
    checkPermissions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loading]);

  if (isChecking) {
    return <SplashScreen />;
  }

  return <>{children}</>;
}
