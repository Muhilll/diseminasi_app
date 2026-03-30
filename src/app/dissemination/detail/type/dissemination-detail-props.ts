import type { JSX } from "solid-js";
import type { Dissemination } from "../../type/dissemination";
import type {
  DisseminationDetail,
  DisseminationDetailFormData,
} from "./dissemination-detail";

export interface DisseminationDetailListProps {
  details: DisseminationDetail[];
  onEdit: (detail: DisseminationDetail) => void;
  onDelete: (id: string) => void;
}

export interface DisseminationDetailFormProps {
  initialData?: DisseminationDetail;
  onSubmit: (data: DisseminationDetailFormData) => void;
  isLoading?: boolean;
}

export interface DisseminationDetailHeaderProps {
  dissemination?: Dissemination | null;
  formattedDate: string;
  action?: JSX.Element;
}
