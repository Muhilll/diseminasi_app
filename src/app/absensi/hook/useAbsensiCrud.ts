import { useToast } from "../../../hooks/useToast";
import { uploadImageWithSignature } from "../../../services/uploads";
import { absensiAPI } from "../service/absensi.api";
import type {
  Absensi,
  AbsensiFormData,
  CreateAbsensiInput,
} from "../type/absensi";

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

  const createAbsensiPayload = async (
    data: AbsensiFormData,
    editingAbsensi: Absensi | null,
  ): Promise<CreateAbsensiInput> => {
    const payload: CreateAbsensiInput = {
      user_id: data.user_id,
      des: data.des,
    };

    if (data.gambar instanceof File) {
      const uploaded = await uploadImageWithSignature("absensi", data.gambar);
      payload.gambar = uploaded.secureUrl;
      payload.gambar_public_id = uploaded.publicId;
      return payload;
    }

    if (typeof data.gambar === "string" && data.gambar) {
      payload.gambar = data.gambar;

      if (editingAbsensi?.gambar_public_id) {
        payload.gambar_public_id = editingAbsensi.gambar_public_id;
      }
    }

    return payload;
  };

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
    const editingAbsensi = params.editingAbsensi();

    if (!editingAbsensi && !(data.gambar instanceof File) && !data.gambar) {
      const message = "Image is required";
      params.setError(message);
      showToast("error", message);
      return;
    }

    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = await createAbsensiPayload(data, editingAbsensi);

      const result = editingAbsensi
        ? await absensiAPI.update(String(editingAbsensi.id), payload)
        : await absensiAPI.create(payload);

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
