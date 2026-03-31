import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import AbsensiPage from "./pages/Index";

export const absensiRoutes = (
  <>
    <Route
      path="/absensis"
      component={() => (
        <ProtectedPage>
          <AbsensiPage />
        </ProtectedPage>
      )}
    />
  </>
);
