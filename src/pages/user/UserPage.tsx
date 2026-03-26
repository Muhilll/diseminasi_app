/**
 * User Page
 * Main page for user management
 */

import { Component, createSignal, onMount, For } from 'solid-js';
import type { User, UserFormData } from './types';
import { userAPI } from './api';
import UserForm from './UserForm';

const UserPage: Component = () => {
  const [users, setUsers] = createSignal<User[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userAPI.getAll();
      if (result.success && result.data) {
        setUsers(result.data);
      } else {
        setError(result.error || 'Failed to fetch users');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddUser = async (data: UserFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await userAPI.create(data);
      if (result.success) {
        await fetchUsers();
      } else {
        setError(result.error || 'Failed to create user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await userAPI.delete(id);
      if (result.success) {
        await fetchUsers();
      } else {
        setError(result.error || 'Failed to delete user');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
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
        <h2>Add New User</h2>
        <UserForm onSubmit={handleAddUser} isLoading={isLoading()} />
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
                      <button onClick={() => handleDeleteUser(user.id)}>
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
