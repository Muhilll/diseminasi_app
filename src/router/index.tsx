/**
 * Router Configuration
 * Central routing configuration for the application
 */

import { Route } from '@solidjs/router';
import { authRoutes } from '../pages/auth/routes';
import { dashboardRoutes } from '../pages/dashboard/routes';
import { gradeRoutes } from '../pages/master-data/grade/routes';
import { positionRoutes } from '../pages/master-data/position/routes';
import { roleRoutes } from '../pages/master-data/role/routes';
import { userRoutes } from '../pages/master-data/user/routes';
import { menuRoutes } from '../pages/web-management/menu/routes';
import { rolePermissionRoutes } from '../pages/web-management/role-permission/routes';
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
      {gradeRoutes}
      {menuRoutes}
      {rolePermissionRoutes}
      {positionRoutes}
      {roleRoutes}
      {userRoutes}
    </Route>
  </>
);
