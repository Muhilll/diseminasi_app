/**
 * Router Configuration
 * Central routing configuration for the application
 */

import { Route } from '@solidjs/router';
import { dashboardRoutes } from '../pages/dashboard/routes';
import { userRoutes } from '../pages/user/routes';

/**
 * Configure all application routes
 */
export const routeConfig = (
  <>
    {/* Public Routes */}
    <Route path="/" component={() => <div>Home Page</div>} />

    {/* App Routes */}
    {dashboardRoutes}
    {userRoutes}
  </>
);
