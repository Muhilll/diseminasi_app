import { createSignal, onMount } from "solid-js";
import { usePositionCrud } from "./usePositionCrud";
import type { Position } from "../type/position";

export const usePositionManagement = () => {
  const [positions, setPositions] = createSignal<Position[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingPosition, setEditingPosition] = createSignal<Position | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingPositionId, setDeletingPositionId] = createSignal<string | null>(null);
  const { toast, clearToast, fetchPositions, submitPosition, deletePosition } =
    usePositionCrud({
      editingPosition,
      deletingPositionId,
      setPositions,
      setIsLoading,
      setError,
      setEditingPosition,
      setShowForm,
      setDeletingPositionId,
    });

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setShowForm(true);
    setEditingPosition(null);
    setError(null);
  };

  const closeForm = () => {
    setEditingPosition(null);
    setShowForm(false);
  };

  const requestDelete = (id: string) => {
    setDeletingPositionId(id);
  };

  onMount(fetchPositions);

  return {
    positions,
    isLoading,
    error,
    editingPosition,
    showForm,
    deletingPositionId,
    toast,
    clearToast,
    handleSubmit: submitPosition,
    handleEdit,
    openCreateForm,
    closeForm,
    requestDelete,
    handleDeleteConfirm: deletePosition,
    setDeletingPositionId,
  };
};
