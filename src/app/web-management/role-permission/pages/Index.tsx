import { Show, type Component } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import PageHeader from "../../../../components/ui/PageHeader";
import Toast from "../../../../components/ui/Toast";
import { useRolePermissionManagement } from "../hook/useRolePermissionManagement";
import RolePermissionForm from "./Form";
import RolePermissionTable from "./Table";

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

const RolePermissionPage: Component = () => {
  const rolePermissionManagement = useRolePermissionManagement();

  return (
    <div class="user-page">
      <Toast
        toast={rolePermissionManagement.toast()}
        onClose={rolePermissionManagement.clearToast}
      />

      <PageHeader
        title="Role Permission Management"
        description="Manage access permissions between roles and menus."
        action={
          <button class="btn-create" onClick={rolePermissionManagement.openCreateForm}>
            <IconPlusCircle />
            Add Role Permission
          </button>
        }
      />

      <Show when={rolePermissionManagement.error()}>
        <div class="error-message">{rolePermissionManagement.error()}</div>
      </Show>

      <Modal
        open={rolePermissionManagement.showForm()}
        onClose={rolePermissionManagement.closeForm}
      >
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {rolePermissionManagement.editingRolePermission()
                ? "Edit Role Permission"
                : "Add Role Permission"}
            </h2>
            <button
              onClick={rolePermissionManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>
          <RolePermissionForm
            initialData={rolePermissionManagement.editingRolePermission() || undefined}
            onSubmit={rolePermissionManagement.handleSubmit}
            isLoading={rolePermissionManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!rolePermissionManagement.deletingRolePermissionId()}
        title="Delete Role Permission"
        message="Are you sure you want to delete this role permission? This action cannot be undone."
        confirmLabel={rolePermissionManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={rolePermissionManagement.isLoading()}
        onConfirm={rolePermissionManagement.handleDeleteConfirm}
        onCancel={() => rolePermissionManagement.setDeletingRolePermissionId(null)}
      />

      <RolePermissionTable
        rolePermissions={rolePermissionManagement.rolePermissions()}
        isLoading={rolePermissionManagement.isLoading()}
        onEdit={rolePermissionManagement.handleEdit}
        onDelete={rolePermissionManagement.requestDelete}
      />
    </div>
  );
};

export default RolePermissionPage;
