import { Component, Show, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { useToast } from "../../../hooks/useToast";
import RoleTable from "./Data";
import RoleForm from "./Form";
import { roleAPI } from "./services/api";
import type { Role, RoleFormData } from "./services/types";

const IconPlusCircle = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const RolePage: Component = () => {
  const [roles, setRoles] = createSignal<Role[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingRole, setEditingRole] = createSignal<Role | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingRoleId, setDeletingRoleId] = createSignal<string | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const fetchRoles = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await roleAPI.getAll();
      if (result.success && result.data) {
        setRoles(result.data);
      } else {
        setError(result.error || "Failed to fetch roles");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: RoleFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = editingRole()
        ? await roleAPI.update(String(editingRole()!.id), data)
        : await roleAPI.create(data);

      if (result.success) {
        setEditingRole(null);
        setShowForm(false);
        await fetchRoles();
        showToast("success", result.message || "Role saved successfully");
      } else {
        const message = result.error || "Operation failed";
        setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (role: Role) => {
    setEditingRole(role);
    setShowForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditingRole(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingRoleId(id);
  };

  const handleDeleteConfirm = async () => {
    const id = deletingRoleId();
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await roleAPI.delete(id);

      if (result.success) {
        setDeletingRoleId(null);
        await fetchRoles();
        showToast("success", result.message || "Role deleted successfully");
      } else {
        const message = result.error || "Failed to delete role";
        setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchRoles);

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Role Management"
        description="Manage role codes and names used across the system."
        action={
          <button
            class="btn-create"
            onClick={() => {
              setShowForm(true);
              setEditingRole(null);
            }}
          >
            <IconPlusCircle />
            Add New Role
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={handleCancel}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingRole() ? "Edit Role" : "Add New Role"}</h2>
            <button onClick={handleCancel} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <RoleForm
            initialData={editingRole() || undefined}
            onSubmit={handleSubmit}
            isLoading={isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingRoleId()}
        title="Delete Role"
        message="Are you sure you want to delete this role? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingRoleId(null)}
      />

      <RoleTable
        roles={roles()}
        isLoading={isLoading()}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default RolePage;
