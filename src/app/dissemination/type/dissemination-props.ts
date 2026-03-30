import type { Dissemination, DisseminationFormData } from "./dissemination";

export interface DisseminationTableProps {
  disseminations: Dissemination[];
  isLoading: boolean;
  onEdit: (dissemination: Dissemination) => void;
  onDelete: (id: string) => void;
}

export interface DisseminationFormProps {
  initialData?: Dissemination;
  currentUserName: string;
  onSubmit: (data: DisseminationFormData) => void;
  isLoading?: boolean;
}
