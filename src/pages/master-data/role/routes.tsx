/**
 * Role Routes
 * Route definitions for role-related pages
 */

import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import RolePage from "./Index";

export const roleRoutes = (
  <>
    <Route
      path="/master-data/roles"
      component={() => (
        <ProtectedPage>
          <RolePage />
        </ProtectedPage>
      )}
    />
  </>
);
