/**
 * User Page Types
 * Type definitions for user-related data and forms
 */

export interface UserRole {
  id: number;
  code: string;
  name: string;
}

export interface UserGrade {
  id: number;
  level: number;
  grade: string;
  des: string;
}

export interface UserPosition {
  id: number;
  category: string;
  des: string;
}

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
  role?: UserRole | null;
  grade?: UserGrade | null;
  position?: UserPosition | null;
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
