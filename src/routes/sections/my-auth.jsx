import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { AuthCenteredLayout } from 'src/layouts/auth-centered';

import { SplashScreen } from 'src/components/loading-screen';

import { GuestGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const CenteredLayout = {
  SignInPage: lazy(() => import('src/pages/my-auth/sign-in')),
  SignUpPage: lazy(() => import('src/pages/my-auth/sign-up')),
  VerifyPage: lazy(() => import('src/pages/my-auth/verify')),
  ResetPasswordPage: lazy(() => import('src/pages/my-auth/reset-password')),
  UpdatePasswordPage: lazy(() => import('src/pages/my-auth/update-password')),
};

const authCentered = {
  element: (
    <AuthCenteredLayout>
      <Outlet />
    </AuthCenteredLayout>
  ),
  children: [
    {
      path: 'sign-in',
      element: (
        <GuestGuard>
          <CenteredLayout.SignInPage />
        </GuestGuard>
      ),
    },
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
