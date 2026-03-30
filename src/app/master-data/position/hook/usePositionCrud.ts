import { useToast } from "../../../../hooks/useToast";
import { positionAPI } from "../service/position.api";
import type { Position, PositionFormData } from "../type/position";

interface UsePositionCrudParams {
  editingPosition: () => Position | null;
  deletingPositionId: () => string | null;
  setPositions: (value: Position[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingPosition: (value: Position | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingPositionId: (value: string | null) => void;
}

export const usePositionCrud = (params: UsePositionCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchPositions = async () => {
    params.setIsLoading(true);
    params.setError(null);
    try {
      const result = await positionAPI.getAll();
      if (result.success && result.data) {
        params.setPositions(result.data);
      } else {
        params.setError(result.error || "Failed to fetch positions");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitPosition = async (data: PositionFormData) => {
    params.setIsLoading(true);
    params.setError(null);
    try {
      const result = params.editingPosition()
        ? await positionAPI.update(String(params.editingPosition()!.id), data)
        : await positionAPI.create(data);

      if (result.success) {
        params.setEditingPosition(null);
        params.setShowForm(false);
        await fetchPositions();
        showToast("success", result.message || "Position saved successfully");
      } else {
        const message = result.error || "Operation failed";
        params.setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      params.setError(message);
      showToast("error", message);
    } finally {
      params.setIsLoading(false);
    }
  };

  const deletePosition = async () => {
    const id = params.deletingPositionId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);
    try {
      const result = await positionAPI.delete(id);
      if (result.success) {
        params.setDeletingPositionId(null);
        await fetchPositions();
        showToast("success", result.message || "Position deleted successfully");
      } else {
        const message = result.error || "Failed to delete position";
        params.setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      params.setError(message);
      showToast("error", message);
    } finally {
      params.setIsLoading(false);
    }
  };

  return {
    toast,
    clearToast,
    fetchPositions,
    submitPosition,
    deletePosition,
  };
};
