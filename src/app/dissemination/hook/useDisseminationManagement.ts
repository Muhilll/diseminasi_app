import { createSignal, onMount } from "solid-js";
import { useAuth } from "../../../services/authStore";
import { useDisseminationCrud } from "./useDisseminationCrud";
import type { Dissemination } from "../type/dissemination";

export const useDisseminationManagement = () => {
  const auth = useAuth();
  const [disseminations, setDisseminations] = createSignal<Dissemination[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingDissemination, setEditingDissemination] =
    createSignal<Dissemination | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingDisseminationId, setDeletingDisseminationId] =
    createSignal<string | null>(null);
  const { toast, clearToast, fetchDisseminations, submitDissemination, deleteDissemination } =
    useDisseminationCrud({
      currentUser: auth.user,
      editingDissemination,
      deletingDisseminationId,
      setDisseminations,
      setIsLoading,
      setError,
      setEditingDissemination,
      setShowForm,
      setDeletingDisseminationId,
    });

  const handleEdit = (dissemination: Dissemination) => {
    setEditingDissemination(dissemination);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingDissemination(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingDissemination(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingDisseminationId(id);
  };

  onMount(fetchDisseminations);

  return {
    currentUserName: auth.user()?.name || "-",
    disseminations,
    isLoading,
    error,
    editingDissemination,
    showForm,
    deletingDisseminationId,
    toast,
    clearToast,
    handleSubmit: submitDissemination,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteDissemination,
    setDeletingDisseminationId,
  };
};
