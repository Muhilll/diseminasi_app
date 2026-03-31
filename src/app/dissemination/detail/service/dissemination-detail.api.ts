import { api } from "../../../../services/api";
import type {
  DisseminationDetail,
} from "../type/dissemination-detail";

export const disseminationDetailAPI = {
  getByDisseminationId: (id: string) =>
    api.get<DisseminationDetail[]>(`/dissemination-details/dissemination/${id}`),
  create: (data: FormData) =>
    api.post<DisseminationDetail>("/dissemination-details", data),
  update: (id: string, data: FormData) =>
    api.put<DisseminationDetail>(`/dissemination-details/${id}`, data),
  delete: (id: string) => api.delete<void>(`/dissemination-details/${id}`),
};
