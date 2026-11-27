import { api } from "../../../services/api";
import type {
  AttendanceLeave,
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

export const attendanceLeavesAPI = {
  getAll: () => api.get<AttendanceLeave[]>("/attendances/leaves"),
  submit: (data: {
    leave_date: string;
    reason: string;
    attachment?: string;
    attachment_public_id?: string;
  }) => api.post<unknown>("/attendances/leaves", data),
  review: (id: number, data: { action: "approve" | "reject"; review_note?: string }) =>
    api.patch<unknown>(`/attendances/leaves/${id}/review`, data),
};
