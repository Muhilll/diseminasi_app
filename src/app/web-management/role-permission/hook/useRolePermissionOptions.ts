import { createSignal, onMount } from "solid-js";
import { lookupAPI } from "../../../../services/lookups";
import type { Role } from "../../../master-data/role/type/role";
import type { Menu } from "../../menu/type/menu";

export const useRolePermissionOptions = () => {
  const [roles, setRoles] = createSignal<Role[]>([]);
  const [menus, setMenus] = createSignal<Menu[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = createSignal(false);

  const loadOptions = async () => {
    setIsOptionsLoading(true);

    try {
      const [rolesResult, menusResult] = await Promise.all([
        lookupAPI.getRoles(),
        lookupAPI.getMenus(),
      ]);

      if (rolesResult.success && rolesResult.data) {
        setRoles(rolesResult.data);
      }

      if (menusResult.success && menusResult.data) {
        setMenus(menusResult.data);
      }
    } finally {
      setIsOptionsLoading(false);
    }
  };

  onMount(loadOptions);

  return {
    roles,
    menus,
    isOptionsLoading,
  };
};
