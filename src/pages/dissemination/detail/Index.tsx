import { useParams } from "@solidjs/router";
import { Component, Show, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import Toast from "../../../components/ui/Toast";
import { useToast } from "../../../hooks/useToast";
import { disseminationAPI } from "../services/api";
import type { Dissemination } from "../services/types";
import Data from "./Data";
import DisseminationDetailForm from "./Form";
import Header from "./Header";
import { disseminationDetailAPI } from "./services/api";
import type {
  DisseminationDetail,
  DisseminationDetailFormData,
} from "./services/types";

const IconPlusCircle = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

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

const toIsoDateString = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const DisseminationDetailPage: Component = () => {
  const params = useParams<{ id: string }>();
  const [dissemination, setDissemination] = createSignal<Dissemination | null>(
    null,
  );
  const [disseminationDetails, setDisseminationDetails] = createSignal<
    DisseminationDetail[]
  >([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingItem, setEditingItem] =
    createSignal<DisseminationDetail | null>(null);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const { toast, showToast, clearToast } = useToast();

  const fetchDissemination = async (showLoading = true) => {
    if (!params.id) {
      setError("Dissemination ID not found");
      return;
    }

    if (showLoading) {
      setIsLoading(true);
    }
    setError(null);

    try {
      const [disseminationResult, detailResult] = await Promise.all([
        disseminationAPI.getById(params.id),
        disseminationDetailAPI.getByDisseminationId(params.id),
      ]);

      if (disseminationResult.success && disseminationResult.data) {
        setDissemination(disseminationResult.data);
      } else {
        setError(
          disseminationResult.error || "Failed to fetch dissemination detail",
        );
      }

      if (detailResult.success && detailResult.data) {
        setDisseminationDetails(detailResult.data);
      } else if (!disseminationResult.success || !disseminationResult.data) {
        setError(detailResult.error || "Failed to fetch dissemination details");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      if (showLoading) {
        setIsLoading(false);
      }
    }
  };

  const closeForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleEdit = (detail: DisseminationDetail) => {
    setEditingItem(detail);
    setShowForm(true);
    setError(null);
  };

  const handleSubmit = async (data: DisseminationDetailFormData) => {
    if (!params.id) {
      const message = "Dissemination ID not found";
      setError(message);
      showToast("error", message);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        disseminations_id: Number(params.id),
        basis: data.basis,
        material: data.material,
        date: toIsoDateString(data.date),
        location: data.location,
        methode: data.methode,
        participants: data.participants,
        result: data.result,
        image: data.image,
      };

      const result = editingItem()
        ? await disseminationDetailAPI.update(String(editingItem()!.id), payload)
        : await disseminationDetailAPI.create(payload);

      if (result.success) {
        closeForm();
        await fetchDissemination(false);
        showToast(
          "success",
          result.message || "Dissemination detail saved successfully",
        );
      } else {
        const message = result.error || "Operation failed";
        setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteConfirm = async () => {
    const id = deletingId();
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await disseminationDetailAPI.delete(id);

      if (result.success) {
        setDeletingId(null);
        await fetchDissemination(false);
        showToast(
          "success",
          result.message || "Dissemination detail deleted successfully",
        );
      } else {
        const message = result.error || "Failed to delete dissemination detail";
        setError(message);
        showToast("error", message);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";
      setError(message);
      showToast("error", message);
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchDissemination);

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <Header
        dissemination={dissemination()}
        formattedDate={formatDate(dissemination()?.date)}
        action={
          <button
            class="btn-create"
            onClick={() => {
              setEditingItem(null);
              setShowForm(true);
            }}
          >
            <IconPlusCircle />
            Add Detail
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {editingItem()
                ? "Edit Dissemination Detail"
                : "Add Dissemination Detail"}
            </h2>
            <button onClick={closeForm} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>

          <DisseminationDetailForm
            initialData={editingItem() || undefined}
            onSubmit={handleSubmit}
            isLoading={isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingId()}
        title="Delete Dissemination Detail"
        message="Are you sure you want to delete this dissemination detail? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

      <Show when={isLoading() && !showForm() && !deletingId()}>
        <div class="form-section">Loading dissemination detail...</div>
      </Show>

      <Show when={!isLoading() && dissemination()}>
        <>
          <Show
            when={disseminationDetails().length > 0}
            fallback={
              <div class="form-section">
                <div class="form-section-header">
                  <h2>Dissemination Details</h2>
                </div>
                <div class="form-helper-text">
                  No dissemination details found for this record.
                </div>
              </div>
            }
          >
            <Data
              details={disseminationDetails()}
              onEdit={handleEdit}
              onDelete={(id) => setDeletingId(id)}
            />
          </Show>
        </>
      </Show>
    </div>
  );
};

export default DisseminationDetailPage;
