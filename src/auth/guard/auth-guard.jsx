import { useSelector } from 'react-redux';
import { useState, useEffect, useCallback } from 'react';

import { paths } from 'src/routes/paths';
import { useRouter, usePathname, useSearchParams } from 'src/routes/hooks';

import { selectAuth } from 'src/state/auth/auth.slice';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

export function AuthGuard({ children }) {
  const router = useRouter();

  const pathname = usePathname();

  const searchParams = useSearchParams();

  const { user, loading } = useSelector(selectAuth);

  const [isChecking, setIsChecking] = useState(true);

  const createQueryString = useCallback(
    (name, value) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);

      return params.toString();
    },
    [searchParams],
  );

  const checkPermissions = async () => {
    if (loading) {
      return;
    }

    if (!user) {
      const href = `${paths.auth.signIn}?${createQueryString('returnTo', pathname)}`;

      router.replace(href);
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
