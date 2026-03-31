import { Component, Show } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { usePositionManagement } from "../hook/usePositionManagement";
import PositionForm from "./Form";
import PositionTable from "./Table";

const IconPlusCircle = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const PositionPage: Component = () => {
  const positionManagement = usePositionManagement();
  const permissions = usePagePermissions();

  return (
    <div class="user-page">
      <Toast toast={positionManagement.toast()} onClose={positionManagement.clearToast} />

      <PageHeader
        title="Position Management"
        description="Manage positions used across the system."
        action={permissions.canCreate() ? (
          <button class="btn-create" onClick={positionManagement.openCreateForm}>
            <IconPlusCircle />
            Add New Position
          </button>
        ) : undefined}
      />

      <Show when={positionManagement.error()}>
        <div class="error-message">{positionManagement.error()}</div>
      </Show>

      <Modal open={positionManagement.showForm()} onClose={positionManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>{positionManagement.editingPosition() ? "Edit Position" : "Add New Position"}</h2>
            <button onClick={positionManagement.closeForm} class="btn-secondary" type="button">
              Cancel
            </button>
          </div>
          <PositionForm
            initialData={positionManagement.editingPosition() || undefined}
            onSubmit={positionManagement.handleSubmit}
            isLoading={positionManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!positionManagement.deletingPositionId()}
        title="Delete Position"
        message="Are you sure you want to delete this position? This action cannot be undone."
        confirmLabel={positionManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={positionManagement.isLoading()}
        onConfirm={positionManagement.handleDeleteConfirm}
        onCancel={() => positionManagement.setDeletingPositionId(null)}
      />

      <PositionTable
        positions={positionManagement.positions()}
        isLoading={positionManagement.isLoading()}
        canUpdate={permissions.canUpdate()}
        canDelete={permissions.canDelete()}
        onEdit={positionManagement.handleEdit}
        onDelete={positionManagement.requestDelete}
      />
    </div>
  );
};

export default PositionPage;
