export interface AttendanceSetting {
  id: number;
  location_name: string;
  latitude: number;
  longitude: number;
  radius_meters: number;
  check_in_deadline: string;
  check_out_deadline: string;
}

export interface ScheduleDay {
  day_of_week: number;
  is_active: boolean;
}

export interface UserSchedule {
  user_id: number;
  user_name: string;
  user_email: string;
  role_code: string;
  schedules: ScheduleDay[];
}

export interface AttendanceRecord {
  id: number;
  user_id: number;
  attendance_date: string;
  check_in_time: string;
  check_in_lat: number | null;
  check_in_lng: number | null;
  check_in_image: string;
  check_in_image_public_id: string;
  check_in_note: string | null;
  check_in_status: "on_time" | "late" | "legacy" | string;
  check_out_time: string | null;
  check_out_lat: number | null;
  check_out_lng: number | null;
  check_out_image: string | null;
  check_out_image_public_id: string | null;
  check_out_note: string | null;
  check_out_status: "on_time" | "late_checkout" | "missed_checkout" | string | null;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    employee_id: string | null;
  };
}

export interface TodayAttendanceStatus {
  server_time: string;
  today_date: string;
  day_of_week: number;
  settings: AttendanceSetting | null;
  schedule: {
    user_id: number;
    day_of_week: number;
    is_active: boolean;
  };
  attendance: AttendanceRecord | null;
}

export interface CheckInOutPayload {
  latitude: number;
  longitude: number;
  image: string;
  image_public_id: string;
  note?: string;
}
