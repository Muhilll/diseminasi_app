export interface DisseminationUser {
  id: number;
  email: string;
  employee_id: string;
  name: string;
  grade_id: number;
  position_id: number;
  signature_image: string | null;
  role_id: number;
}

export interface Dissemination {
  id: number;
  title: string;
  province: string;
  city: string;
  district: string;
  village: string;
  date: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: DisseminationUser | null;
}

export interface CreateDisseminationInput {
  title: string;
  province: string;
  city: string;
  district: string;
  village: string;
  date: string;
  user_id: number;
}

export interface UpdateDisseminationInput {
  title?: string;
  province?: string;
  city?: string;
  district?: string;
  village?: string;
  date?: string;
  user_id?: number;
}

export interface DisseminationFormData {
  title: string;
  province: string;
  city: string;
  district: string;
  village: string;
  date: string;
}
