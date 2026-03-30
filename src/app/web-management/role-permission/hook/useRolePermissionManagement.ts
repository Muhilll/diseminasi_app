import { createSignal, onMount } from "solid-js";
import { useRolePermissionCrud } from "./useRolePermissionCrud";
import type { RolePermission } from "../type/role-permission";

export const useRolePermissionManagement = () => {
  const [rolePermissions, setRolePermissions] = createSignal<RolePermission[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingRolePermission, setEditingRolePermission] =
    createSignal<RolePermission | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingRolePermissionId, setDeletingRolePermissionId] =
    createSignal<string | null>(null);
  const { toast, clearToast, fetchRolePermissions, submitRolePermission, deleteRolePermission } =
    useRolePermissionCrud({
      editingRolePermission,
      deletingRolePermissionId,
      setRolePermissions,
      setIsLoading,
      setError,
      setEditingRolePermission,
      setShowForm,
      setDeletingRolePermissionId,
    });

  const handleEdit = (rolePermission: RolePermission) => {
    setEditingRolePermission(rolePermission);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingRolePermission(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingRolePermission(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingRolePermissionId(id);
  };

  onMount(fetchRolePermissions);

  return {
    rolePermissions,
    isLoading,
    error,
    editingRolePermission,
    showForm,
    deletingRolePermissionId,
    toast,
    clearToast,
    handleSubmit: submitRolePermission,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteRolePermission,
    setDeletingRolePermissionId,
  };
};
