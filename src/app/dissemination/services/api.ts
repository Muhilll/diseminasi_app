import { api } from "../../../services/api";
import type {
  CreateDisseminationInput,
  Dissemination,
  UpdateDisseminationInput,
} from "./types";

export const disseminationAPI = {
  getAll: () => api.get<Dissemination[]>("/disseminations"),
  getById: (id: string) => api.get<Dissemination>(`/disseminations/${id}`),
  create: (data: CreateDisseminationInput) =>
    api.post<Dissemination>("/disseminations", data),
  update: (id: string, data: UpdateDisseminationInput) =>
    api.put<Dissemination>(`/disseminations/${id}`, data),
  delete: (id: string) => api.delete<void>(`/disseminations/${id}`),
};
