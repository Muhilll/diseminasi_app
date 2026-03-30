import type { Role, RoleFormData } from "./role";

export interface RoleTableProps {
  roles: Role[];
  isLoading: boolean;
  onEdit: (role: Role) => void;
  onDelete: (id: string) => void;
}

export interface RoleFormProps {
  initialData?: Role;
  onSubmit: (data: RoleFormData) => void;
  isLoading?: boolean;
}
