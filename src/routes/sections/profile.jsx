import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';

import { _userAddressBook } from 'src/_mock';
import { DashboardLayout } from 'src/layouts/dashboard';
import { navData } from 'src/layouts/config-nav-profile';

import { LoadingScreen } from 'src/components/loading-screen';

import { AccountGeneral } from 'src/sections/account/account-general';
import { AccountBilling } from 'src/sections/account/account-billing';
import { AccountNotifications } from 'src/sections/account/account-notifications';
import { AccountChangePassword } from 'src/sections/account/account-change-password';

import { AuthGuard } from 'src/auth/guard';

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
    element: <AuthGuard>{layoutContent}</AuthGuard>,
    children: [
      {
        path: 'account',
        children: [
          {
            element: (
              <UserAccountPage title="Thông tin cá nhân">
                <AccountGeneral />
              </UserAccountPage>
            ),
            index: true,
          },
          {
            path: 'address',
            element: (
              <UserAccountPage title="Địa chỉ">
                <AccountBilling addressBook={_userAddressBook} />
              </UserAccountPage>
            ),
          },
          {
            path: 'notifications',
            element: (
              <UserAccountPage title="Thông báo">
                <AccountNotifications />
              </UserAccountPage>
            ),
          },
          {
            path: 'security',
            element: (
              <UserAccountPage title="Bảo mật">
                <AccountChangePassword />
              </UserAccountPage>
            ),
          },
        ],
      },
      { path: 'orders', element: <OrderListPage /> },
    ],
  },
];
