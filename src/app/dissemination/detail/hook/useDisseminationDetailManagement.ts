import { createSignal, onMount } from "solid-js";
import { useParams } from "@solidjs/router";
import { useDisseminationDetailCrud } from "./useDisseminationDetailCrud";
import type { Dissemination } from "../../type/dissemination";
import type { DisseminationDetail } from "../type/dissemination-detail";

const formatDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

export const useDisseminationDetailManagement = () => {
  const params = useParams<{ id: string }>();
  const [dissemination, setDissemination] = createSignal<Dissemination | null>(null);
  const [details, setDetails] = createSignal<DisseminationDetail[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingDetail, setEditingDetail] = createSignal<DisseminationDetail | null>(null);
  const [deletingDetailId, setDeletingDetailId] = createSignal<string | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const { toast, clearToast, fetchDissemination, submitDetail, deleteDetail } =
    useDisseminationDetailCrud({
      disseminationId: () => params.id,
      editingDetail,
      deletingDetailId,
      setDissemination,
      setDetails,
      setIsLoading,
      setError,
      setEditingDetail,
      setShowForm,
      setDeletingDetailId,
    });

  const closeForm = () => {
    setEditingDetail(null);
    setShowForm(false);
  };

  const handleEdit = (detail: DisseminationDetail) => {
    setEditingDetail(detail);
    setShowForm(true);
    setError(null);
  };

  const openCreateForm = () => {
    setEditingDetail(null);
    setShowForm(true);
    setError(null);
  };

  const requestDelete = (id: string) => {
    setDeletingDetailId(id);
  };

  onMount(fetchDissemination);

  return {
    disseminationId: params.id,
    dissemination,
    details,
    isLoading,
    error,
    editingDetail,
    deletingDetailId,
    showForm,
    formattedDate: () => formatDate(dissemination()?.date),
    toast,
    clearToast,
    closeForm,
    handleEdit,
    openCreateForm,
    requestDelete,
    handleSubmit: submitDetail,
    handleDeleteConfirm: deleteDetail,
    setDeletingDetailId,
  };
};
