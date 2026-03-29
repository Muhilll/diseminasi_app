import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import PositionPage from "./Index";

export const positionRoutes = (
  <>
    <Route
      path="/master-data/positions"
      component={() => (
        <ProtectedPage>
          <PositionPage />
        </ProtectedPage>
      )}
    />
  </>
);
