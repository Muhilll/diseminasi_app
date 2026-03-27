/**
 * Menu Page Types
 * Type definitions for menu-related data and forms
 */

export interface Menu {
  id: number;
  name: string;
  path: string;
  icon: string;
  parent_id: number | null;
  created_at?: string;
  updated_at?: string;
}

export interface CreateMenuInput {
  name: string;
  path: string;
  icon?: string;
  parent_id?: string | number | null;
}

export interface UpdateMenuInput {
  name?: string;
  path?: string;
  icon?: string;
  parent_id?: string | number | null;
}

export interface MenuFormData {
  name: string;
  path: string;
  icon: string;
  parent_id: string;
}
