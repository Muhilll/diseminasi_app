import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import DisseminationDetailPage from "./Detail";
import DisseminationPage from "./Index";

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
