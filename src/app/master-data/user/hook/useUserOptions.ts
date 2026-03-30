import { createSignal, onMount } from "solid-js";
import { lookupAPI } from "../../../../services/lookups";
import { Grade } from "../../grade/type/grade";
import { Position } from "../../position/type/position";
import { Role } from "../../role/type/role";

export const useUserOptions = () => {
  const [grades, setGrades] = createSignal<Grade[]>([]);
  const [positions, setPositions] = createSignal<Position[]>([]);
  const [roles, setRoles] = createSignal<Role[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = createSignal(false);

  const loadOptions = async () => {
    setIsOptionsLoading(true);

    try {
      const [gradesResult, positionsResult, rolesResult] = await Promise.all([
        lookupAPI.getGrades(),
        lookupAPI.getPositions(),
        lookupAPI.getRoles(),
      ]);

      if (gradesResult.success && gradesResult.data) {
        setGrades(gradesResult.data);
      }

      if (positionsResult.success && positionsResult.data) {
        setPositions(positionsResult.data);
      }

      if (rolesResult.success && rolesResult.data) {
        setRoles(rolesResult.data);
      }
    } finally {
      setIsOptionsLoading(false);
    }
  };

  onMount(loadOptions);

  return {
    grades,
    positions,
    roles,
    isOptionsLoading,
  };
};
