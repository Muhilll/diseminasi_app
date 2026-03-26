/**
 * User Routes
 * Route definitions for user-related pages
 */

import { Route } from '@solidjs/router';
import { lazy } from 'solid-js';
import ProtectedPage from '../../router/ProtectedRoute';
import UserPage from './UserPage';

export const userRoutes = (
  <>
    <Route path="/users" component={() => <ProtectedPage><UserPage /></ProtectedPage>} />
  </>
);
