import { createSignal, onMount } from "solid-js";
import { api } from "../../../services/api";
import type { User } from "../../master-data/user/type/user";

export const useAbsensiOptions = () => {
  const [users, setUsers] = createSignal<User[]>([]);
  const [isOptionsLoading, setIsOptionsLoading] = createSignal(false);

  const fetchUsers = async () => {
    setIsOptionsLoading(true);

    try {
      const result = await api.get<User[]>("/users");
      if (result.success && result.data) {
        setUsers(result.data);
      }
    } finally {
      setIsOptionsLoading(false);
    }
  };

  onMount(fetchUsers);

  return {
    users,
    isOptionsLoading,
  };
};
