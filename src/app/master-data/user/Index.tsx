/**
 * Dissemination / User Management Page
 * Styled to match the AgriIntel Dissemination List design
 */
import { Component, Show, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { useToast } from "../../../hooks/useToast";
import UserTable from "./Data";
import UserForm from "./Form";
import { userAPI } from "./services/api";
import type { User, UserFormData } from "./services/types";

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

const UserPage: Component = () => {
  const [users, setUsers] = createSignal<User[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingUser, setEditingUser] = createSignal<User | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingUserId, setDeletingUserId] = createSignal<string | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await userAPI.getAll();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        setError(result.error || "Failed to fetch users");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      let result;

      if (editingUser()) {
        const updatePayload = data.password
          ? data
          : { ...data, password: undefined };
        result = await userAPI.update(String(editingUser()!.id), updatePayload);
      } else {
        result = await userAPI.create(data);
      }

      if (result.success) {
        setEditingUser(null);
        setShowForm(false);
        await fetchUsers();
        showToast("success", result.message || "User saved successfully");
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

  const handleEdit = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const handleDelete = async (id: string) => {
    setDeletingUserId(id);
  };

  const handleDeleteConfirm = async () => {
    const id = deletingUserId();
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await userAPI.delete(id);

      if (result.success) {
        setDeletingUserId(null);
        await fetchUsers();
        showToast("success", result.message || "User deleted successfully");
      } else {
        const message = result.error || "Failed to delete user";
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

  onMount(fetchUsers);

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="User Management"
        description="Managing the strategic distribution of users across the system."
        action={
          <button
            class="btn-create"
            onClick={() => {
              setShowForm(true);
              setEditingUser(null);
            }}
          >
            <IconPlusCircle />
            Add New User
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={handleCancel}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingUser() ? "Edit User" : "Add New User"}</h2>
            <button onClick={handleCancel} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <UserForm
            initialData={editingUser() || undefined}
            onSubmit={handleSubmit}
            isLoading={isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingUserId()}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingUserId(null)}
      />

      <UserTable
        users={users()}
        isLoading={isLoading()}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
};

export default UserPage;
