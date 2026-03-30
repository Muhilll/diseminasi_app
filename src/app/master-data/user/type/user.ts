import { Grade } from "../../grade/type/grade";
import { Position } from "../../position/type/position";
import { Role } from "../../role/type/role";

export interface User {
  id: number;
  email: string;
  employee_id: string;
  name: string;
  grade_id: number;
  position_id: number;
  signature_image?: string | null;
  role_id: number;
  created_at: string;
  updated_at: string;
  role?: Role | null;
  grade?: Grade | null;
  position?: Position | null;
}

export interface CreateUserInput {
  email: string;
  password: string;
  employee_id: string;
  name: string;
  grade_id: string | number;
  position_id: string | number;
  signature_image?: string | null;
  role_id: string | number;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  employee_id?: string;
  name?: string;
  grade_id?: string | number;
  position_id?: string | number;
  signature_image?: string | null;
  role_id?: string | number;
}

export interface UserFormData {
  email: string;
  password: string;
  employee_id: string;
  name: string;
  grade_id: string | number;
  position_id: string | number;
  signature_image?: string | null;
  role_id: string | number;
}
