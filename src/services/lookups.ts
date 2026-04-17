import { api } from "./api";
import type { Grade } from "../app/master-data/grade/type/grade";
import type { Position } from "../app/master-data/position/type/position";
import type { Role } from "../app/master-data/role/type/role";
import type { Menu } from "../app/web-management/menu/type/menu";

export const lookupAPI = {
  getGrades: () => api.get<Grade[]>("/grades"),
  getMenus: () => api.get<Menu[]>("/menus"),
  getPositions: () => api.get<Position[]>("/positions"),
  getRoles: () => api.get<Role[]>("/roles"),
};
