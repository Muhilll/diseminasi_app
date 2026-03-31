/**
 * Router Configuration
 * Central routing configuration for the application
 */

import { Navigate, Route } from '@solidjs/router';
import { authRoutes } from '../app/auth/routes';
import { absensiRoutes } from '../app/absensi/route';
import { dashboardRoutes } from '../app/dashboard/routes';
import { disseminationRoutes, disseminationStandaloneRoutes } from '../app/dissemination/route';
import { gradeRoutes } from '../app/master-data/grade/route';
import { positionRoutes } from '../app/master-data/position/route';
import { roleRoutes } from '../app/master-data/role/route';
import { userRoutes } from '../app/master-data/user/route';
import { menuRoutes } from '../app/web-management/menu/route';
import { rolePermissionRoutes } from '../app/web-management/role-permission/route';
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
    <Route path="/" component={() => <Navigate href="/login" />} />
    {authRoutes}
    {disseminationStandaloneRoutes}

    {/* Protected Routes with Layout */}
    <Route component={LayoutedRoutes}>
      {dashboardRoutes}
      {absensiRoutes}
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
