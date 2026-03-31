import { Show, type Component } from "solid-js";
import ConfirmModal from "../../../components/ui/ConfirmModal";
import Modal from "../../../components/ui/Modal";
import PageHeader from "../../../components/ui/PageHeader";
import Toast from "../../../components/ui/Toast";
import { usePagePermissions } from "../../../hooks/usePagePermissions";
import { useDisseminationManagement } from "../hook/useDisseminationManagement";
import DisseminationForm from "./Form";
import DisseminationTable from "./Table";

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

const DisseminationPage: Component = () => {
  const disseminationManagement = useDisseminationManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast
        toast={disseminationManagement.toast()}
        onClose={disseminationManagement.clearToast}
      />

      <PageHeader
        title="Dissemination Management"
        description="Manage dissemination records and their distribution details."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={disseminationManagement.openCreateForm}>
            <IconPlusCircle />
            Add Dissemination
          </button>
        ) : undefined}
      />

      <Show when={disseminationManagement.error()}>
        <div class="error-message">{disseminationManagement.error()}</div>
      </Show>

      <Modal
        open={disseminationManagement.showForm()}
        onClose={disseminationManagement.closeForm}
      >
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {disseminationManagement.editingDissemination()
                ? "Edit Dissemination"
                : "Add Dissemination"}
            </h2>
            <button
              onClick={disseminationManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>

          <DisseminationForm
            initialData={disseminationManagement.editingDissemination() || undefined}
            currentUserName={disseminationManagement.currentUserName}
            onSubmit={disseminationManagement.handleSubmit}
            isLoading={disseminationManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!disseminationManagement.deletingDisseminationId()}
        title="Delete Dissemination"
        message="Are you sure you want to delete this dissemination? This action cannot be undone."
        confirmLabel={disseminationManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={disseminationManagement.isLoading()}
        onConfirm={disseminationManagement.handleDeleteConfirm}
        onCancel={() => disseminationManagement.setDeletingDisseminationId(null)}
      />

      <DisseminationTable
        disseminations={disseminationManagement.disseminations()}
        isLoading={disseminationManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={disseminationManagement.handleEdit}
        onDelete={disseminationManagement.requestDelete}
      />
    </div>
  );
};

export default DisseminationPage;
