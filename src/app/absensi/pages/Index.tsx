import { Component, Show } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { useAbsensiManagement } from "../hook/useAbsensiManagement";
import AbsensiForm from "./Form";
import AbsensiTable from "./Table";

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

const AbsensiPage: Component = () => {
  const absensiManagement = useAbsensiManagement();

  return (
    <div class="user-page">
      <Toast toast={absensiManagement.toast()} onClose={absensiManagement.clearToast} />

      <PageHeader
        title="Absensi Management"
        description="Manage attendance records and supporting photos."
        action={
          <button class="btn-create" onClick={absensiManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Absensi
          </button>
        }
      />

      <Show when={absensiManagement.error()}>
        <div class="error-message">{absensiManagement.error()}</div>
      </Show>

      <Modal open={absensiManagement.showForm()} onClose={absensiManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{absensiManagement.editingAbsensi() ? "Edit Absensi" : "Add New Absensi"}</h2>
            <button
              onClick={absensiManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <AbsensiForm
            initialData={absensiManagement.editingAbsensi() || undefined}
            onSubmit={absensiManagement.handleSubmit}
            isLoading={absensiManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!absensiManagement.deletingAbsensiId()}
        title="Delete Absensi"
        message="Are you sure you want to delete this absensi? This action cannot be undone."
        confirmLabel={absensiManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={absensiManagement.isLoading()}
        onConfirm={absensiManagement.handleDeleteConfirm}
        onCancel={() => absensiManagement.setDeletingAbsensiId(null)}
      />

      <AbsensiTable
        absensis={absensiManagement.absensis()}
        isLoading={absensiManagement.isLoading()}
        onEdit={absensiManagement.handleEdit}
        onDelete={absensiManagement.requestDelete}
      />
    </div>
  );
};

export default AbsensiPage;
