import type { Absensi, AbsensiFormData } from "./absensi";

export interface AbsensiTableProps {
  absensis: Absensi[];
  isLoading: boolean;
  canUpdate?: boolean;
  canDelete?: boolean;
  onEdit: (absensi: Absensi) => void;
  onDelete: (id: string) => void;
}

export interface AbsensiFormProps {
  initialData?: Absensi;
  onSubmit: (data: AbsensiFormData) => void;
  isLoading?: boolean;
}
