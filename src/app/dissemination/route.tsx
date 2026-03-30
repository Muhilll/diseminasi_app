import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import DisseminationDetailPage from "./detail/pages/Index";
import DisseminationExportPage from "./detail/pages/export/Index";
import DisseminationPage from "./pages/Index";

export const disseminationRoutes = (
  <>
    <Route
      path="/disseminations"
      component={() => (
        <ProtectedPage>
          <DisseminationPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/disseminations/details/:id"
      component={() => (
        <ProtectedPage>
          <DisseminationDetailPage />
        </ProtectedPage>
      )}
    />
  </>
);

export const disseminationStandaloneRoutes = (
  <>
    <Route
      path="/disseminations/details/:id/export"
      component={() => (
        <ProtectedPage>
          <DisseminationExportPage />
        </ProtectedPage>
      )}
    />
  </>
);
