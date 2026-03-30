import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { useGradeManagement } from "../hook/useGradeManagement";
import GradeForm from "./Form";
import GradeTable from "./Table";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const GradePage: Component = () => {
  const gradeManagement = useGradeManagement();

  return (
    <div class="user-page">
      <Toast toast={gradeManagement.toast()} onClose={gradeManagement.clearToast} />

      <PageHeader
        title="Grade Management"
        description="Manage grades used across the system."
        action={
          <button class="btn-create" onClick={gradeManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Grade
          </button>
        }
      />

      <Show when={gradeManagement.error()}>
        <div class="error-message">{gradeManagement.error()}</div>
      </Show>

      <Modal open={gradeManagement.showForm()} onClose={gradeManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{gradeManagement.editingGrade() ? "Edit Grade" : "Add New Grade"}</h2>
            <button onClick={gradeManagement.closeForm} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <GradeForm
            initialData={gradeManagement.editingGrade() || undefined}
            onSubmit={gradeManagement.handleSubmit}
            isLoading={gradeManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!gradeManagement.deletingGradeId()}
        title="Delete Grade"
        message="Are you sure you want to delete this grade? This action cannot be undone."
        confirmLabel={gradeManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={gradeManagement.isLoading()}
        onConfirm={gradeManagement.handleDeleteConfirm}
        onCancel={() => gradeManagement.setDeletingGradeId(null)}
      />

      <GradeTable
        grades={gradeManagement.grades()}
        isLoading={gradeManagement.isLoading()}
        onEdit={gradeManagement.handleEdit}
        onDelete={gradeManagement.requestDelete}
      />
    </div>
  );
};

export default GradePage;
