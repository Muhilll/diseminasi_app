import { useToast } from "../../../../hooks/useToast";
import { rolePermissionAPI } from "../service/role-permission.api";
import type {
  RolePermission,
  RolePermissionFormData,
} from "../type/role-permission";

interface UseRolePermissionCrudParams {
  editingRolePermission: () => RolePermission | null;
  deletingRolePermissionId: () => string | null;
  setRolePermissions: (value: RolePermission[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingRolePermission: (value: RolePermission | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingRolePermissionId: (value: string | null) => void;
}

export const useRolePermissionCrud = (params: UseRolePermissionCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchRolePermissions = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await rolePermissionAPI.getAll();
      if (result.success && result.data) {
        params.setRolePermissions(result.data);
      } else {
        params.setError(result.error || "Failed to fetch role permissions");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitRolePermission = async (data: RolePermissionFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = {
        ...data,
        role_id: Number(data.role_id),
        menu_id: Number(data.menu_id),
      };

      const result = params.editingRolePermission()
        ? await rolePermissionAPI.update(
            String(params.editingRolePermission()!.id),
            payload,
          )
        : await rolePermissionAPI.create(payload);

      if (result.success) {
        params.setEditingRolePermission(null);
        params.setShowForm(false);
        await fetchRolePermissions();
        showToast("success", result.message || "Role permission saved successfully");
      } else {
        const message = result.error || "Operation failed";
        params.setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      params.setError(message);
      showToast("error", message);
    } finally {
      params.setIsLoading(false);
    }
  };

  const deleteRolePermission = async () => {
    const id = params.deletingRolePermissionId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await rolePermissionAPI.delete(id);
      if (result.success) {
        params.setDeletingRolePermissionId(null);
        await fetchRolePermissions();
        showToast(
          "success",
          result.message || "Role permission deleted successfully",
        );
      } else {
        const message = result.error || "Failed to delete role permission";
        params.setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      params.setError(message);
      showToast("error", message);
    } finally {
      params.setIsLoading(false);
    }
  };

  return {
    toast,
    clearToast,
    fetchRolePermissions,
    submitRolePermission,
    deleteRolePermission,
  };
};
