export interface Position {
  id: number;
  category: string;
  des: string;
  created_at?: string;
  updated_at?: string;
}

export interface CreatePositionInput {
  category: string;
  des: string;
}

export interface UpdatePositionInput {
  category?: string;
  des?: string;
}

export interface PositionFormData {
  category: string;
  des: string;
}
