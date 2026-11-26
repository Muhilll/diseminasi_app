import { Route } from "@solidjs/router";
import ProtectedPage from "../../router/ProtectedRoute";
import AttendancePage from "./pages/AttendancePage";
import SchedulePage from "./pages/SchedulePage";
import SettingsPage from "./pages/SettingsPage";

export const attendanceRoutes = (
  <>
    <Route
      path="/attendance"
      component={() => (
        <ProtectedPage>
          <AttendancePage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/attendance/settings"
      component={() => (
        <ProtectedPage>
          <SettingsPage />
        </ProtectedPage>
      )}
    />
    <Route
      path="/attendance/schedules"
      component={() => (
        <ProtectedPage>
          <SchedulePage />
        </ProtectedPage>
      )}
    />
  </>
);
