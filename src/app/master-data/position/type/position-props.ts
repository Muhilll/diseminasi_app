import type { Position, PositionFormData } from "./position";

export interface PositionTableProps {
  positions: Position[];
  isLoading: boolean;
  onEdit: (position: Position) => void;
  onDelete: (id: string) => void;
}

export interface PositionFormProps {
  initialData?: Position;
  onSubmit: (data: PositionFormData) => void;
  isLoading?: boolean;
}
