import { createSignal, onMount } from "solid-js";
import { useAbsensiCrud } from "./useAbsensiCrud";
import type { Absensi } from "../type/absensi";

export const useAbsensiManagement = () => {
  const [absensis, setAbsensis] = createSignal<Absensi[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingAbsensi, setEditingAbsensi] = createSignal<Absensi | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingAbsensiId, setDeletingAbsensiId] = createSignal<string | null>(null);

  const { toast, clearToast, fetchAbsensis, submitAbsensi, deleteAbsensi } =
    useAbsensiCrud({
      editingAbsensi,
      deletingAbsensiId,
      setAbsensis,
      setIsLoading,
      setError,
      setEditingAbsensi,
      setShowForm,
      setDeletingAbsensiId,
    });

  const handleEdit = (absensi: Absensi) => {
    setEditingAbsensi(absensi);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingAbsensi(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingAbsensi(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingAbsensiId(id);
  };

  onMount(fetchAbsensis);

  return {
    absensis,
    isLoading,
    error,
    editingAbsensi,
    showForm,
    deletingAbsensiId,
    toast,
    clearToast,
    handleSubmit: submitAbsensi,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteAbsensi,
    setDeletingAbsensiId,
  };
};
