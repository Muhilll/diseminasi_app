/**
 * User API Service
 * API calls related to user management
 */

import { api } from '../../../services/api';
import type { User, CreateUserInput, UpdateUserInput } from './types';

export const userAPI = {
  /**
   * Get all users
   */
  getAll: () => api.get<User[]>('/users'),

  /**
   * Get user by ID
   */
  getById: (id: string) => api.get<User>(`/users/${id}`),

  /**
   * Create a new user
   */
  create: (data: CreateUserInput) => api.post<User>('/users', data),

  /**
   * Update user by ID
   */
  update: (id: string, data: UpdateUserInput) =>
    api.put<User>(`/users/${id}`, data),

  /**
   * Delete user by ID
   */
  delete: (id: string) => api.delete<void>(`/users/${id}`),
};
