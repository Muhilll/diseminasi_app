import { api } from "./api";
import type { Grade } from "../pages/master-data/grade/services/types";
import type { Position } from "../pages/master-data/position/services/types";
import type { Role } from "../pages/master-data/role/services/types";

export const lookupAPI = {
  getGrades: () => api.get<Grade[]>("/grades"),
  getPositions: () => api.get<Position[]>("/positions"),
  getRoles: () => api.get<Role[]>("/roles"),
};
