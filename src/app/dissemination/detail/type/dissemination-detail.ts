export interface DisseminationDetail {
  id: number;
  disseminations_id: number;
  basis: string;
  material: string;
  date: string;
  location: string;
  methode: string;
  participants: string;
  result: string;
  image: string;
  image_public_id?: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateDisseminationDetailInput {
  disseminations_id: number;
  basis: string;
  material: string;
  date: string;
  location: string;
  methode: string;
  participants: string;
  result: string;
  image?: string;
  image_public_id?: string;
}

export interface UpdateDisseminationDetailInput {
  disseminations_id?: number;
  basis?: string;
  material?: string;
  date?: string;
  location?: string;
  methode?: string;
  participants?: string;
  result?: string;
  image?: string;
  image_public_id?: string;
}

export interface DisseminationDetailFormData {
  basis: string;
  material: string;
  date: string;
  location: string;
  methode: string;
  participants: string;
  result: string;
  image: File | string | null;
}
