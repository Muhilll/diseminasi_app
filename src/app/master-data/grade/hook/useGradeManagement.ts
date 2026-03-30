import { createSignal, onMount } from "solid-js";
import { useGradeCrud } from "./useGradeCrud";
import type { Grade } from "../type/grade";

export const useGradeManagement = () => {
  const [grades, setGrades] = createSignal<Grade[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingGrade, setEditingGrade] = createSignal<Grade | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingGradeId, setDeletingGradeId] = createSignal<string | null>(null);
  const { toast, clearToast, fetchGrades, submitGrade, deleteGrade } = useGradeCrud({
    editingGrade,
    deletingGradeId,
    setGrades,
    setIsLoading,
    setError,
    setEditingGrade,
    setShowForm,
    setDeletingGradeId,
  });

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingGrade(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingGrade(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingGradeId(id);
  };

  onMount(fetchGrades);

  return {
    grades,
    isLoading,
    error,
    editingGrade,
    showForm,
    deletingGradeId,
    toast,
    clearToast,
    handleSubmit: submitGrade,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deleteGrade,
    setDeletingGradeId,
  };
};
