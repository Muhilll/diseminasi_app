import type {
  RolePermission,
  RolePermissionFormData,
} from "./role-permission";

export interface RolePermissionTableProps {
  rolePermissions: RolePermission[];
  isLoading: boolean;
  onEdit: (rolePermission: RolePermission) => void;
  onDelete: (id: string) => void;
}

export interface RolePermissionFormProps {
  initialData?: RolePermission;
  onSubmit: (data: RolePermissionFormData) => void;
  isLoading?: boolean;
}
