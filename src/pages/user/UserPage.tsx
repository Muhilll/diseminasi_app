/**
 * User Page
 * Main page for user management
 */

import { Component, createSignal, onMount, For, Show } from "solid-js";
import type { User, UserFormData } from "./types";
import { userAPI } from "./api";
import UserForm from "./UserForm";

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

  const handleAddUser = async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      if (editingUser()) {
        // Update existing user
        const result = await userAPI.update(String(editingUser()!.id), data);
        if (result.success) {
          setEditingUser(null);
          setShowForm(false);
          await fetchUsers();
        } else {
          setError(result.error || "Failed to update user");
        }
      } else {
        // Create new user
        const result = await userAPI.create(data);
        if (result.success) {
          setShowForm(false);
          await fetchUsers();
        } else {
          setError(result.error || "Failed to create user");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditUser = (user: User) => {
    setEditingUser(user);
    setShowForm(true);
    setError(null);
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
    setShowForm(false);
  };

  const handleDeleteUser = async (id: string) => {
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

  onMount(() => {
    fetchUsers();
  });

  return (
    <div class="user-page">
      <h1>User Management</h1>

      {error() && <div class="error-message">{error()}</div>}

      <section class="user-form-section">
        <div class="form-header">
          <h2>{editingUser() ? "Edit User" : "Add New User"}</h2>
          <Show when={editingUser()}>
            <button onClick={handleCancelEdit} class="btn-secondary">
              Cancel
            </button>
          </Show>
          <Show when={!showForm()}>
            <button onClick={() => setShowForm(true)} class="btn-primary">
              + Add New User
            </button>
          </Show>
        </div>

        <Show when={showForm()}>
          <UserForm
            initialData={editingUser() || undefined}
            onSubmit={handleAddUser}
            isLoading={isLoading()}
          />
        </Show>
      </section>  

      <section class="users-list-section">
        <h2>Users List</h2>
        {isLoading() ? (
          <p>Loading...</p>
        ) : users().length === 0 ? (
          <p>No users found</p>
        ) : (
          <table class="users-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Employee ID</th>
                <th>Position</th>
                <th>Grade</th>
                <th>Role ID</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <For each={users()}>
                {(user) => (
                  <tr>
                    <td>{user.id}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.employee_id}</td>
                    <td>{user.position_id}</td>
                    <td>{user.grade_id}</td>
                    <td>{user.role_id}</td>
                    <td>
                      <button
                        onClick={() => handleEditUser(user)}
                        class="btn-edit"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        class="btn-delete"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                )}
              </For>
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
};

export default UserPage;
