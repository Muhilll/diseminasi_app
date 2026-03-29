/**
 * Router Configuration
 * Central routing configuration for the application
 */

import { Route } from '@solidjs/router';
import { authRoutes } from '../app/auth/routes';
import { dashboardRoutes } from '../app/dashboard/routes';
import { disseminationRoutes, disseminationStandaloneRoutes } from '../app/dissemination/routes';
import { gradeRoutes } from '../app/master-data/grade/routes';
import { positionRoutes } from '../app/master-data/position/routes';
import { roleRoutes } from '../app/master-data/role/routes';
import { userRoutes } from '../app/master-data/user/routes';
import { menuRoutes } from '../app/web-management/menu/routes';
import { rolePermissionRoutes } from '../app/web-management/role-permission/routes';
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
    {disseminationStandaloneRoutes}

    {/* Protected Routes with Layout */}
    <Route component={LayoutedRoutes}>
      {dashboardRoutes}
      {disseminationRoutes}
      {gradeRoutes}
      {menuRoutes}
      {rolePermissionRoutes}
      {positionRoutes}
      {roleRoutes}
      {userRoutes}
    </Route>
  </>
);
