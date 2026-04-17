import { api } from "../../../services/api";
import type {
  Absensi,
  CreateAbsensiInput,
  UpdateAbsensiInput,
} from "../type/absensi";

export const absensiAPI = {
  getAll: () => api.get<Absensi[]>("/absensis"),
  getById: (id: string) => api.get<Absensi>(`/absensis/${id}`),
  create: (data: CreateAbsensiInput) => api.post<Absensi>("/absensis", data),
  update: (id: string, data: UpdateAbsensiInput) =>
    api.put<Absensi>(`/absensis/${id}`, data),
  delete: (id: string) => api.delete<void>(`/absensis/${id}`),
};
