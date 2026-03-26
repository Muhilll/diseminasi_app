/**
 * User Routes
 * Route definitions for user-related pages
 */

import { Route } from '@solidjs/router';
import UserPage from './UserPage';

export const userRoutes = (
  <>
    <Route path="/users" component={UserPage} />
  </>
);
