import { api } from "../../../../services/api";
import type { CreateGradeInput, Grade, UpdateGradeInput } from "../type/grade";

export const gradeAPI = {
  getAll: () => api.get<Grade[]>("/grades"),
  getById: (id: string) => api.get<Grade>(`/grades/${id}`),
  create: (data: CreateGradeInput) => api.post<Grade>("/grades", data),
  update: (id: string, data: UpdateGradeInput) =>
    api.put<Grade>(`/grades/${id}`, data),
  delete: (id: string) => api.delete<void>(`/grades/${id}`),
};
