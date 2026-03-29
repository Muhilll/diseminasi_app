import { Component, Show, createSignal, onMount } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { useToast } from "../../../hooks/useToast";
import GradeTable from "./Data";
import GradeForm from "./Form";
import { gradeAPI } from "./services/api";
import type { Grade, GradeFormData } from "./services/types";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const GradePage: Component = () => {
  const [grades, setGrades] = createSignal<Grade[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [editingGrade, setEditingGrade] = createSignal<Grade | null>(null);
  const [showForm, setShowForm] = createSignal(false);
  const [deletingGradeId, setDeletingGradeId] = createSignal<string | null>(null);
  const { toast, showToast, clearToast } = useToast();

  const fetchGrades = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await gradeAPI.getAll();
      if (result.success && result.data) setGrades(result.data);
      else setError(result.error || "Failed to fetch grades");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (data: GradeFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = editingGrade()
        ? await gradeAPI.update(String(editingGrade()!.id), data)
        : await gradeAPI.create(data);

      if (result.success) {
        setEditingGrade(null);
        setShowForm(false);
        await fetchGrades();
        showToast("success", result.message || "Grade saved successfully");
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

  const handleEdit = (grade: Grade) => {
    setEditingGrade(grade);
    setShowForm(true);
    setError(null);
  };

  const handleDeleteConfirm = async () => {
    const id = deletingGradeId();
    if (!id) return;

    setIsLoading(true);
    setError(null);
    try {
      const result = await gradeAPI.delete(id);
      if (result.success) {
        setDeletingGradeId(null);
        await fetchGrades();
        showToast("success", result.message || "Grade deleted successfully");
      } else {
        const message = result.error || "Failed to delete grade";
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

  onMount(fetchGrades);

  return (
    <div class="user-page">
      <Toast toast={toast()} onClose={clearToast} />

      <PageHeader
        title="Grade Management"
        description="Manage grades used across the system."
        action={
          <button class="btn-create" onClick={() => { setShowForm(true); setEditingGrade(null); }}>
            <IconPlusCircle />
            Add New Grade
          </button>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Modal open={showForm()} onClose={() => { setEditingGrade(null); setShowForm(false); }}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{editingGrade() ? "Edit Grade" : "Add New Grade"}</h2>
            <button onClick={() => { setEditingGrade(null); setShowForm(false); }} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <GradeForm initialData={editingGrade() || undefined} onSubmit={handleSubmit} isLoading={isLoading()} />
        </div>
      </Modal>

      <ConfirmModal
        open={!!deletingGradeId()}
        title="Delete Grade"
        message="Are you sure you want to delete this grade? This action cannot be undone."
        confirmLabel={isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={isLoading()}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingGradeId(null)}
      />

      <GradeTable
        grades={grades()}
        isLoading={isLoading()}
        onEdit={handleEdit}
        onDelete={(id) => setDeletingGradeId(id)}
      />
    </div>
  );
};

export default GradePage;
