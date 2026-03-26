/**
 * User Page Types
 * Type definitions for user-related data and forms
 */

export interface User {
  id: string;
  email: string;
  password: string;
  employee_id: string;
  name: string;
  grade_id: string;
  position_id: string;
  signature_image?: string | null;
  role_id: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserInput {
  email: string;
  password: string;
  employee_id: string;
  name: string;
  grade_id: string;
  position_id: string;
  signature_image?: string | null;
  role_id: string;
}

export interface UpdateUserInput {
  email?: string;
  password?: string;
  employee_id?: string;
  name?: string;
  grade_id?: string;
  position_id?: string;
  signature_image?: string | null;
  role_id?: string;
}

export interface UserFormData {
  email: string;
  password: string;
  employee_id: string;
  name: string;
  grade_id: string;
  position_id: string;
  signature_image?: string | null;
  role_id: string;
}
