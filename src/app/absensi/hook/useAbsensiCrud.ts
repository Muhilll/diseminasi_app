import { useToast } from "../../../hooks/useToast";
import { absensiAPI } from "../service/absensi.api";
import type { Absensi, AbsensiFormData } from "../type/absensi";

interface UseAbsensiCrudParams {
  editingAbsensi: () => Absensi | null;
  deletingAbsensiId: () => string | null;
  setAbsensis: (value: Absensi[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingAbsensi: (value: Absensi | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingAbsensiId: (value: string | null) => void;
}

export const useAbsensiCrud = (params: UseAbsensiCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchAbsensis = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await absensiAPI.getAll();
      if (result.success && result.data) {
        params.setAbsensis(result.data);
      } else {
        params.setError(result.error || "Failed to fetch absensis");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitAbsensi = async (data: AbsensiFormData) => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = params.editingAbsensi()
        ? await absensiAPI.update(String(params.editingAbsensi()!.id), data)
        : await absensiAPI.create(data);

      if (result.success) {
        params.setEditingAbsensi(null);
        params.setShowForm(false);
        await fetchAbsensis();
        showToast("success", result.message || "Absensi saved successfully");
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

  const deleteAbsensi = async () => {
    const id = params.deletingAbsensiId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await absensiAPI.delete(id);

      if (result.success) {
        params.setDeletingAbsensiId(null);
        await fetchAbsensis();
        showToast("success", result.message || "Absensi deleted successfully");
      } else {
        const message = result.error || "Failed to delete absensi";
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
    fetchAbsensis,
    submitAbsensi,
    deleteAbsensi,
  };
};
