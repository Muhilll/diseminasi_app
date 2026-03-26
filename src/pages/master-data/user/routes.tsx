/**
 * User Routes
 * Route definitions for user-related pages
 */

import { Route } from '@solidjs/router';
import ProtectedPage from '../../../router/ProtectedRoute';
import UserPage from './Index';

export const userRoutes = (
  <>
    <Route path="/master-data/users" component={() => <ProtectedPage><UserPage /></ProtectedPage>} />
  </>
);
