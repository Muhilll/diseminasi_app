/**
 * Router Configuration
 * Central routing configuration for the application
 */

import { Route } from '@solidjs/router';
import { authRoutes } from '../pages/auth/routes';
import { dashboardRoutes } from '../pages/dashboard/routes';
import { userRoutes } from '../pages/user/routes';
import Layout from '../components/layout/Index';
import { ParentComponent } from 'solid-js';
/**
 * Layout wrapper for protected routes
 */

const LayoutedRoutes: ParentComponent = (props) => {
  return (
    <Layout>
      {props.children}
    </Layout>
  );
};
/**
 * Configure all application routes
 */
export const routeConfig = (
  <>
    {/* Public Routes */}
    <Route path="/" component={() => <div>Home Page</div>} />
    {authRoutes}

    {/* Protected Routes with Layout */}
    <Route component={LayoutedRoutes}>
      {dashboardRoutes}
      {userRoutes}
    </Route>
  </>
);
