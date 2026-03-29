/**
 * User Page Types
 * Type definitions for user-related data and forms
 */

export interface Grade {
  id: number;
  level: number;
  grade: string;
  des: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreateGradeInput {
  level: string | number;
  grade: string;
  des: string;
}

export interface UpdateGradeInput {
  level?: string | number;
  grade?: string;
  des?: string;
}

export interface GradeFormData {
  level: string | number;
  grade: string;
  des: string;
}
