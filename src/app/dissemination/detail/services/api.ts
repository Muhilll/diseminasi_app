import { api } from "../../../../services/api";
import type {
  CreateDisseminationDetailInput,
  DisseminationDetail,
  UpdateDisseminationDetailInput,
} from "./types";

export const disseminationDetailAPI = {
  getByDisseminationId: (id: string) =>
    api.get<DisseminationDetail[]>(`/dissemination-details/dissemination/${id}`),
  create: (data: CreateDisseminationDetailInput) =>
    api.post<DisseminationDetail>("/dissemination-details", data),
  update: (id: string, data: UpdateDisseminationDetailInput) =>
    api.put<DisseminationDetail>(`/dissemination-details/${id}`, data),
  delete: (id: string) => api.delete<void>(`/dissemination-details/${id}`),
};