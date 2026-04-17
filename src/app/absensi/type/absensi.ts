import type { User } from "../../master-data/user/type/user";

export interface Absensi {
  id: number;
  gambar: string;
  gambar_public_id?: string | null;
  des: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  user?: User | null;
}

export interface CreateAbsensiInput {
  gambar?: string;
  gambar_public_id?: string;
  des: string;
  user_id: string | number;
}

export interface UpdateAbsensiInput {
  gambar?: string;
  gambar_public_id?: string;
  des?: string;
  user_id?: string | number;
}

export interface AbsensiFormData {
  gambar: File | string | null;
  des: string;
  user_id: string | number;
}
