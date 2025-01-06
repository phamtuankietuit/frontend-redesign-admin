import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { CONFIG } from 'src/config-global';
import { DashboardLayout } from 'src/layouts/dashboard';
import { navData } from 'src/layouts/config-nav-profile';

import { LoadingScreen } from 'src/components/loading-screen';

import { AuthGuard, RoleBasedGuard } from 'src/auth/guard';

// ----------------------------------------------------------------------

const UserAccountPage = lazy(() => import('src/pages/dashboard/user/account'));
const OrderListPage = lazy(() => import('src/pages/profile/order/list'));

// ----------------------------------------------------------------------

const layoutContent = (
  <DashboardLayout data={{ nav: navData }}>
    <Suspense fallback={<LoadingScreen />}>
      <Outlet />
    </Suspense>
  </DashboardLayout>
);

export const profileRoutes = [
  {
    path: 'customer',
    element: CONFIG.auth.skip ? (
      <>{layoutContent}</>
    ) : (
      <AuthGuard>
        <RoleBasedGuard acceptRoles={['Customer']} hasContent>
          {layoutContent}
        </RoleBasedGuard>
      </AuthGuard>
    ),
    children: [
      { element: <UserAccountPage />, index: true },
      { path: 'orders', element: <OrderListPage /> },
    ],
  },
];
