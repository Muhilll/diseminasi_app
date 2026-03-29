import { Component, Show, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { useToast } from "../../../hooks/useToast";
import PositionTable from "./Data";
import PositionForm from "./Form";
import { positionAPI } from "./services/api";
import type { Position, PositionFormData } from "./services/types";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const PositionPage: Component = () => {
  const [positions, setPositions] = createSignal<Position[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingPosition, setEditingPosition] = createSignal<Position | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingPositionId, setDeletingPositionId] = createSignal<string | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const fetchPositions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await positionAPI.getAll();
      if (result.success && result.data) setPositions(result.data);
      else setError(result.error || "Failed to fetch positions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: PositionFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = editingPosition()
        ? await positionAPI.update(String(editingPosition()!.id), data)
        : await positionAPI.create(data);

      if (result.success) {
        setEditingPosition(null);
        setShowForm(false);
        await fetchPositions();
        showToast("success", result.message || "Position saved successfully");
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

  const handleEdit = (position: Position) => {
    setEditingPosition(position);
    setShowForm(true);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    const id = deletingPositionId();
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await positionAPI.delete(id);
      if (result.success) {
        setDeletingPositionId(null);
        await fetchPositions();
        showToast("success", result.message || "Position deleted successfully");
      } else {
        const message = result.error || "Failed to delete position";
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

  onMount(fetchPositions);

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Position Management"
        description="Manage positions used across the system."
        action={
          <button class="btn-create" onClick={() => { setShowForm(true); setEditingPosition(null); }}>
            <IconPlusCircle />
            Add New Position
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={() => { setEditingPosition(null); setShowForm(false); }}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingPosition() ? "Edit Position" : "Add New Position"}</h2>
            <button onClick={() => { setEditingPosition(null); setShowForm(false); }} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <PositionForm initialData={editingPosition() || undefined} onSubmit={handleSubmit} isLoading={isLoading()} />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingPositionId()}
        title="Delete Position"
        message="Are you sure you want to delete this position? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingPositionId(null)}
      />

      <PositionTable
        positions={positions()}
        isLoading={isLoading()}
        onEdit={handleEdit}
        onDelete={(id) => setDeletingPositionId(id)}
      />
    </div>
  );
};

export default PositionPage;
