import { api } from "../../../../services/api";
import type {
  CreatePositionInput,
  Position,
  UpdatePositionInput,
} from "../type/position";

export const positionAPI = {
  getAll: () => api.get<Position[]>("/positions"),
  getById: (id: string) => api.get<Position>(`/positions/${id}`),
  create: (data: CreatePositionInput) => api.post<Position>("/positions", data),
  update: (id: string, data: UpdatePositionInput) =>
    api.put<Position>(`/positions/${id}`, data),
  delete: (id: string) => api.delete<void>(`/positions/${id}`),
};
