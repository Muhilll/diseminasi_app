import { api } from "../../../services/api";
import type {
  AttendanceRecord,
  AttendanceSetting,
  CheckInOutPayload,
  ScheduleDay,
  TodayAttendanceStatus,
  UserSchedule,
} from "../type/attendance";

export const attendanceSettingsAPI = {
  get: () => api.get<AttendanceSetting>("/attendance-settings"),
  update: (data: Omit<AttendanceSetting, "id">) =>
    api.put<AttendanceSetting>("/attendance-settings", data),
};

export const attendanceSchedulesAPI = {
  getAll: () => api.get<UserSchedule[]>("/attendance-schedules"),
  updateByUserId: (userId: number, schedules: ScheduleDay[]) =>
    api.put<UserSchedule>(`/attendance-schedules/user/${userId}`, { schedules }),
};

export const attendanceAPI = {
  getAll: () => api.get<AttendanceRecord[]>("/attendances"),
  getToday: () => api.get<TodayAttendanceStatus>("/attendances/today"),
  checkIn: (data: CheckInOutPayload) =>
    api.post<unknown>("/attendances/check-in", data),
  checkOut: (data: CheckInOutPayload) =>
    api.post<unknown>("/attendances/check-out", data),
  delete: (id: string) => api.delete<unknown>(`/attendances/${id}`),
};
