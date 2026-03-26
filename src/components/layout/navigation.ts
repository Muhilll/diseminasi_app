import { api } from "../../services/api";

export interface NavigationPermissions {
  can_read: boolean;
  can_create: boolean;
  can_update: boolean;
  can_delete: boolean;
  can_report: boolean;
}

export interface NavigationItem {
  id: number;
  name: string;
  path: string;
  icon: string;
  parent_id: number | null;
  permissions: NavigationPermissions;
  children: NavigationItem[];
}

export const navigationAPI = {
  getMyNavigation: () => api.get<NavigationItem[]>("/users/me/navigation"),
};
