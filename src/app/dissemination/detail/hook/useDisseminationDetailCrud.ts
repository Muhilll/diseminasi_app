import { useToast } from "../../../../hooks/useToast";
import { uploadImageWithSignature } from "../../../../services/uploads";
import { disseminationAPI } from "../../service/dissemination.api";
import { disseminationDetailAPI } from "../service/dissemination-detail.api";
import type { Dissemination } from "../../type/dissemination";
import type {
  CreateDisseminationDetailInput,
  DisseminationDetail,
  DisseminationDetailFormData,
} from "../type/dissemination-detail";

const toIsoDateString = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const createDisseminationDetailPayload = async (
  disseminationId: string,
  data: DisseminationDetailFormData,
  editingDetail: DisseminationDetail | null,
) => {
  const payload: CreateDisseminationDetailInput = {
    disseminations_id: Number(disseminationId),
    basis: data.basis,
    material: data.material,
    date: toIsoDateString(data.date),
    location: data.location,
    methode: data.methode,
    participants: data.participants,
    result: data.result,
  };

  if (data.image instanceof File) {
    const uploaded = await uploadImageWithSignature(
      "dissemination_details",
      data.image,
    );

    payload.image = uploaded.secureUrl;
    payload.image_public_id = uploaded.publicId;
    return payload;
  }

  if (typeof data.image === "string" && data.image) {
    payload.image = data.image;

    if (editingDetail?.image_public_id) {
      payload.image_public_id = editingDetail.image_public_id;
    }
  }

  return payload;
};

interface UseDisseminationDetailCrudParams {
  disseminationId: () => string | undefined;
  editingDetail: () => DisseminationDetail | null;
  deletingDetailId: () => string | null;
  setDissemination: (value: Dissemination | null) => void;
  setDetails: (value: DisseminationDetail[]) => void;
  setIsLoading: (value: boolean) => void;
  setError: (value: string | null) => void;
  setEditingDetail: (value: DisseminationDetail | null) => void;
  setShowForm: (value: boolean) => void;
  setDeletingDetailId: (value: string | null) => void;
}

export const useDisseminationDetailCrud = (
  params: UseDisseminationDetailCrudParams,
) => {
  const { toast, showToast, clearToast } = useToast();

  const fetchDissemination = async (showLoading = true) => {
    const id = params.disseminationId();
    if (!id) {
      params.setError("Dissemination ID not found");
      return;
    }

    if (showLoading) {
      params.setIsLoading(true);
    }
    params.setError(null);

    try {
      const [disseminationResult, detailResult] = await Promise.all([
        disseminationAPI.getById(id),
        disseminationDetailAPI.getByDisseminationId(id),
      ]);

      if (disseminationResult.success && disseminationResult.data) {
        params.setDissemination(disseminationResult.data);
      } else {
        params.setError(
          disseminationResult.error || "Failed to fetch dissemination detail",
        );
      }

      if (detailResult.success && detailResult.data) {
        params.setDetails(detailResult.data);
      } else if (!disseminationResult.success || !disseminationResult.data) {
        params.setError(detailResult.error || "Failed to fetch dissemination details");
      }
    } catch (err) {
      params.setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      if (showLoading) {
        params.setIsLoading(false);
      }
    }
  };

  const submitDetail = async (data: DisseminationDetailFormData) => {
    const disseminationId = params.disseminationId();
    const editingDetail = params.editingDetail();
    if (!disseminationId) {
      const message = "Dissemination ID not found";
      params.setError(message);
      showToast("error", message);
      return;
    }

    if (!editingDetail && !(data.image instanceof File) && !data.image) {
      const message = "Image is required";
      params.setError(message);
      showToast("error", message);
      return;
    }

    params.setIsLoading(true);
    params.setError(null);

    try {
      const payload = await createDisseminationDetailPayload(
        disseminationId,
        data,
        editingDetail,
      );

      const result = editingDetail
        ? await disseminationDetailAPI.update(String(editingDetail.id), payload)
        : await disseminationDetailAPI.create(payload);

      if (result.success) {
        params.setEditingDetail(null);
        params.setShowForm(false);
        await fetchDissemination(false);
        showToast(
          "success",
          result.message || "Dissemination detail saved successfully",
        );
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

  const deleteDetail = async () => {
    const id = params.deletingDetailId();
    if (!id) return;

    params.setIsLoading(true);
    params.setError(null);

    try {
      const result = await disseminationDetailAPI.delete(id);

      if (result.success) {
        params.setDeletingDetailId(null);
        await fetchDissemination(false);
        showToast(
          "success",
          result.message || "Dissemination detail deleted successfully",
        );
      } else {
        const message = result.error || "Failed to delete dissemination detail";
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
    fetchDissemination,
    submitDetail,
    deleteDetail,
  };
};
