import { useToast } from "../../../hooks/useToast";
import { disseminationAPI } from "../service/dissemination.api";
import type { Accessor } from "solid-js";
import type { AuthUser } from "../../../services/authStore";
import type { Dissemination, DisseminationFormData } from "../type/dissemination";

const toIsoDateString = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

interface UseDisseminationCrudParams {
  currentUser: Accessor<AuthUser | null>;
  editingDissemination: () => Dissemination | null;
  deletingDisseminationId: () => string | null;
  setDisseminations: (value: Dissemination[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingDissemination: (value: Dissemination | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingDisseminationId: (value: string | null) => void;
}

export const useDisseminationCrud = (params: UseDisseminationCrudParams) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchDisseminations = async () => {
    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await disseminationAPI.getAll();
      if (result.success && result.data) {
        params.setDisseminations(result.data);
      } else {
        params.setError(result.error || "Failed to fetch disseminations");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      params.setIsLoading(false);
    }
  };

  const submitDissemination = async (data: DisseminationFormData) => {
    const currentUser = params.currentUser();
    if (!currentUser) {
      const message = "User session not found";
      params.setError(message);
      showToast("error", message);
      return;
    }

    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = {
        title: data.title,
        province: data.province,
        city: data.city,
        district: data.district,
        village: data.village,
        date: toIsoDateString(data.date),
        user_id: currentUser.id,
      };

      const result = params.editingDissemination()
        ? await disseminationAPI.update(
            String(params.editingDissemination()!.id),
            payload,
          )
        : await disseminationAPI.create(payload);

      if (result.success) {
        params.setEditingDissemination(null);
        params.setShowForm(false);
        await fetchDisseminations();
        showToast("success", result.message || "Dissemination saved successfully");
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

  const deleteDissemination = async () => {
    const id = params.deletingDisseminationId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await disseminationAPI.delete(id);
      if (result.success) {
        params.setDeletingDisseminationId(null);
        await fetchDisseminations();
        showToast("success", result.message || "Dissemination deleted successfully");
      } else {
        const message = result.error || "Failed to delete dissemination";
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
    fetchDisseminations,
    submitDissemination,
    deleteDissemination,
  };
};
