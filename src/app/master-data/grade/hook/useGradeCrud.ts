import { useToast } from "../../../../hooks/useToast";
import { gradeAPI } from "../service/grade.api";
import type { Grade, GradeFormData } from "../type/grade";

interface UseGradeCrudParams {
  editingGrade: () => Grade | null;
  deletingGradeId: () => string | null;
  setGrades: (value: Grade[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingGrade: (value: Grade | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingGradeId: (value: string | null) => void;
}

export const useGradeCrud = (params: UseGradeCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchGrades = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await gradeAPI.getAll();
      if (result.success && result.data) {
        params.setGrades(result.data);
      } else {
        params.setError(result.error || "Failed to fetch grades");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitGrade = async (data: GradeFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = params.editingGrade()
        ? await gradeAPI.update(String(params.editingGrade()!.id), data)
        : await gradeAPI.create(data);

      if (result.success) {
        params.setEditingGrade(null);
        params.setShowForm(false);
        await fetchGrades();
        showToast("success", result.message || "Grade saved successfully");
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

  const deleteGrade = async () => {
    const id = params.deletingGradeId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await gradeAPI.delete(id);
      if (result.success) {
        params.setDeletingGradeId(null);
        await fetchGrades();
        showToast("success", result.message || "Grade deleted successfully");
      } else {
        const message = result.error || "Failed to delete grade";
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
    fetchGrades,
    submitGrade,
    deleteGrade,
  };
};
