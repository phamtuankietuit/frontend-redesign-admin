import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

// ----------------------------------------------------------------------

const CenteredLayout = {
  SignInPage: lazy(() => import('src/pages/my-auth/sign-in')),
  SignUpPage: lazy(() => import('src/pages/my-auth/sign-up')),
  VerifyPage: lazy(() => import('src/pages/auth-demo/centered/verify')),
  ResetPasswordPage: lazy(
    () => import('src/pages/auth-demo/centered/reset-password'),
  ),
  UpdatePasswordPage: lazy(
    () => import('src/pages/auth-demo/centered/update-password'),
  ),
};

const authCentered = {
  element: (
    <AuthCenteredLayout>
      <Outlet />
    </AuthCenteredLayout>
  ),
  children: [
    { path: 'sign-in', element: <CenteredLayout.SignInPage /> },
    { path: 'sign-up', element: <CenteredLayout.SignUpPage /> },
    { path: 'verify', element: <CenteredLayout.VerifyPage /> },
    { path: 'reset-password', element: <CenteredLayout.ResetPasswordPage /> },
    { path: 'update-password', element: <CenteredLayout.UpdatePasswordPage /> },
  ],
};

export const myAuthRoutes = [
  {
    element: (
      <Suspense fallback={<SplashScreen />}>
        <Outlet />
      </Suspense>
    ),
    children: [authCentered],
  },
];
