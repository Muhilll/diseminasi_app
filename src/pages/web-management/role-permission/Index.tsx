import { Component, Show, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { useToast } from "../../../hooks/useToast";
import RolePermissionTable from "./Data";
import RolePermissionForm from "./Form";
import { rolePermissionAPI } from "./services/api";
import type { RolePermission, RolePermissionFormData } from "./services/types";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const RolePermissionPage: Component = () => {
  const [rolePermissions, setRolePermissions] = createSignal<RolePermission[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingItem, setEditingItem] = createSignal<RolePermission | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const fetchRolePermissions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await rolePermissionAPI.getAll();
      if (result.success && result.data) setRolePermissions(result.data);
      else setError(result.error || "Failed to fetch role permissions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: RolePermissionFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const payload = {
        ...data,
        role_id: Number(data.role_id),
        menu_id: Number(data.menu_id),
      };

      const result = editingItem()
        ? await rolePermissionAPI.update(String(editingItem()!.id), payload)
        : await rolePermissionAPI.create(payload);

      if (result.success) {
        setEditingItem(null);
        setShowForm(false);
        await fetchRolePermissions();
        showToast("success", result.message || "Role permission saved successfully");
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

  const handleEdit = (item: RolePermission) => {
    setEditingItem(item);
    setShowForm(true);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    const id = deletingId();
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await rolePermissionAPI.delete(id);
      if (result.success) {
        setDeletingId(null);
        await fetchRolePermissions();
        showToast("success", result.message || "Role permission deleted successfully");
      } else {
        const message = result.error || "Failed to delete role permission";
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

  onMount(fetchRolePermissions);

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Role Permission Management"
        description="Manage access permissions between roles and menus."
        action={
          <button class="btn-create" onClick={() => { setShowForm(true); setEditingItem(null); }}>
            <IconPlusCircle />
            Add Role Permission
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={() => { setEditingItem(null); setShowForm(false); }}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingItem() ? "Edit Role Permission" : "Add Role Permission"}</h2>
            <button onClick={() => { setEditingItem(null); setShowForm(false); }} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <RolePermissionForm
            initialData={editingItem() || undefined}
            onSubmit={handleSubmit}
            isLoading={isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingId()}
        title="Delete Role Permission"
        message="Are you sure you want to delete this role permission? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

      <RolePermissionTable
        rolePermissions={rolePermissions()}
        isLoading={isLoading()}
        onEdit={handleEdit}
        onDelete={(id) => setDeletingId(id)}
      />
    </div>
  );
};

export default RolePermissionPage;
