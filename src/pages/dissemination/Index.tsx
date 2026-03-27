import { Component, Show, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../components/ui/ConfirmModal";
import Modal from "../../components/ui/Modal";
import PageHeader from "../../components/ui/PageHeader";
import Toast from "../../components/ui/Toast";
import { useToast } from "../../hooks/useToast";
import { useAuth } from "../../services/authStore";
import DisseminationTable from "./Data";
import DisseminationForm from "./Form";
import { disseminationAPI } from "./services/api";
import type { Dissemination, DisseminationFormData } from "./services/types";

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

const toIsoDateString = (value: string) => {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : date.toISOString();
};

const DisseminationPage: Component = () => {
  const auth = useAuth();
  const [disseminations, setDisseminations] = createSignal<Dissemination[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingItem, setEditingItem] = createSignal<Dissemination | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingId, setDeletingId] = createSignal<string | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const fetchDisseminations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await disseminationAPI.getAll();
      if (result.success && result.data) {
        setDisseminations(result.data);
      } else {
        setError(result.error || "Failed to fetch disseminations");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: DisseminationFormData) => {
    const currentUser = auth.user();
    if (!currentUser) {
      const message = "User session not found";
      setError(message);
      showToast("error", message);
      return;
    }

    setIsLoading(true);
    setError(null);

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

      const result = editingItem()
        ? await disseminationAPI.update(String(editingItem()!.id), payload)
        : await disseminationAPI.create(payload);

      if (result.success) {
        setEditingItem(null);
        setShowForm(false);
        await fetchDisseminations();
        showToast("success", result.message || "Dissemination saved successfully");
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

  const handleEdit = (item: Dissemination) => {
    setEditingItem(item);
    setShowForm(true);
    setError(null);
  };

  const closeForm = () => {
    setEditingItem(null);
    setShowForm(false);
  };

  const handleDeleteConfirm = async () => {
    const id = deletingId();
    if (!id) return;

    setIsLoading(true);
    setError(null);

    try {
      const result = await disseminationAPI.delete(id);
      if (result.success) {
        setDeletingId(null);
        await fetchDisseminations();
        showToast("success", result.message || "Dissemination deleted successfully");
      } else {
        const message = result.error || "Failed to delete dissemination";
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

  onMount(fetchDisseminations);

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Dissemination Management"
        description="Manage dissemination records and their distribution details."
        action={
          <button
            class="btn-create"
            onClick={() => {
              setShowForm(true);
              setEditingItem(null);
            }}
          >
            <IconPlusCircle />
            Add Dissemination
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingItem() ? "Edit Dissemination" : "Add Dissemination"}</h2>
            <button onClick={closeForm} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>

          <DisseminationForm
            initialData={editingItem() || undefined}
            currentUserName={auth.user()?.name || "-"}
            onSubmit={handleSubmit}
            isLoading={isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingId()}
        title="Delete Dissemination"
        message="Are you sure you want to delete this dissemination? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingId(null)}
      />

      <DisseminationTable
        disseminations={disseminations()}
        isLoading={isLoading()}
        onEdit={handleEdit}
        onDelete={(id) => setDeletingId(id)}
      />
    </div>
  );
};

export default DisseminationPage;
