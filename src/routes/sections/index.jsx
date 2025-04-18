import { lazy } from 'react';
import { Navigate, useRoutes } from 'react-router-dom';

import { myAuthRoutes } from './my-auth';
import { myMainRoutes } from './my-main';
import { profileRoutes } from './profile';
import { dashboardRoutes } from './dashboard';

// ----------------------------------------------------------------------

const HomePage = lazy(() => import('src/pages/home'));

export function Router() {
  return useRoutes([
    // Dashboard
    ...dashboardRoutes,

    // My Auth
    ...myAuthRoutes,

    // My Main
    ...myMainRoutes,

    // Profile
    ...profileRoutes,

    // No match
    { path: '*', element: <Navigate to="/404" replace /> },
  ]);
}
