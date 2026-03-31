import type { Grade, GradeFormData } from "./grade";

export interface GradeTableProps {
  grades: Grade[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (grade: Grade) => void;
  onDelete: (id: string) => void;
}

export interface GradeFormProps {
  initialData?: Grade;
  onSubmit: (data: GradeFormData) => void;
  isLoading?: boolean;
}
