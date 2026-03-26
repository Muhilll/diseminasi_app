/**
 * Dissemination / User Management Page
 * Styled to match the AgriIntel Dissemination List design
 */
import { Component, Show, createSignal, onMount } from "solid-js";
import UserTable from "./Data";
import UserForm from "./Form";
import { userAPI } from "./services/api";
import type { User, UserFormData } from "./services/types";

// Plus-circle icon for the Create button
const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
  </svg>
);

const UserPage: Component = () => {
  const [users, setUsers] = createSignal<User[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingUser, setEditingUser] = createSignal<User | null>(null);
  const [showForm, setShowForm] = createSignal(false);

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
      } else {
        setError(result.error || "Operation failed");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
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
    if (!confirm("Are you sure you want to delete this user?")) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await userAPI.delete(id);
      if (result.success) {
        await fetchUsers();
      } else {
        setError(result.error || "Failed to delete user");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchUsers);

  return (
    <div class="user-page">

      {/* ── Page Header ──────────────────────────────────── */}
      <div class="page-header">
        <div class="page-header-left">
          <h1>User Management</h1>
          <p>Managing the strategic distribution of users across the system.</p>
        </div>

        <button
          class="btn-create"
          onClick={() => { setShowForm(true); setEditingUser(null); }}
        >
          <IconPlusCircle />
          Add New User
        </button>
      </div>

      {/* ── Error ────────────────────────────────────────── */}
      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      {/* ── Add / Edit Form ──────────────────────────────── */}
      <Show when={showForm()}>
        <div class="modal-overlay" onClick={handleCancel}>
          <div class="modal-card" onClick={(e) => e.stopPropagation()}>
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
          </div>
        </div>
      </Show>

      {/* ── Table ────────────────────────────────────────── */}
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
