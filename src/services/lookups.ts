import { api } from "./api";
import type { Grade } from "../app/master-data/grade/services/types";
import type { Position } from "../app/master-data/position/services/types";
import type { Role } from "../app/master-data/role/services/types";
import type { Menu } from "../app/web-management/menu/services/types";

export const lookupAPI = {
  getGrades: () => api.get<Grade[]>("/grades"),
  getMenus: () => api.get<Menu[]>("/menus"),
  getPositions: () => api.get<Position[]>("/positions"),
  getRoles: () => api.get<Role[]>("/roles"),
};
