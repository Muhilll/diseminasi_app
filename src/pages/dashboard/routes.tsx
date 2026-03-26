/**
 * Dashboard Routes
 * Route definitions for dashboard-related pages
 */

import { Route } from '@solidjs/router';
import DashboardPage from './DashboardPage';

export const dashboardRoutes = (
  <>
    <Route path="/dashboard" component={DashboardPage} />
  </>
);
