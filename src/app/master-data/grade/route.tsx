import { Route } from "@solidjs/router";
import ProtectedPage from "../../../router/ProtectedRoute";
import GradePage from "./pages/Index";

export const gradeRoutes = (
  <>
    <Route
      path="/master-data/grades"
      component={() => (
        <ProtectedPage>
          <GradePage />
        </ProtectedPage>
      )}
    />
  </>
);
