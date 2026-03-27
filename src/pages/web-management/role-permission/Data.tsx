import { Component } from "solid-js";
import DataTable, { type DataTableColumn } from "../../../components/ui/DataTable";
import type { RolePermission } from "./services/types";

interface RolePermissionTableProps {
  rolePermissions: RolePermission[];
  isLoading: boolean;
  onEdit: (rolePermission: RolePermission) => void;
  onDelete: (id: string) => void;
}

const IconEdit = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const PermissionBadge: Component<{ enabled: boolean; label: string }> = (props) => (
  <span class={`permission-badge${props.enabled ? " enabled" : ""}`}>{props.label}</span>
);

const RolePermissionTable: Component<RolePermissionTableProps> = (props) => {
  const columns: DataTableColumn<RolePermission>[] = [
    { header: "ID", cell: (item) => <>{item.id}</> },
    { header: "Role", cell: (item) => <>{item.role?.name || item.role_id}</> },
    { header: "Menu", cell: (item) => <>{item.menu?.name || item.menu_id}</> },
    {
      header: "Permissions",
      cell: (item) => (
        <div class="permission-badges">
          <PermissionBadge enabled={item.can_read} label="Read" />
          <PermissionBadge enabled={item.can_create} label="Create" />
          <PermissionBadge enabled={item.can_update} label="Update" />
          <PermissionBadge enabled={item.can_delete} label="Delete" />
          <PermissionBadge enabled={item.can_report} label="Report" />
        </div>
      ),
    },
    { header: "Created At", cell: (item) => <>{formatDate(item.created_at)}</> },
    { header: "Updated At", cell: (item) => <>{formatDate(item.updated_at)}</> },
    {
      header: "Actions",
      headerStyle: { "text-align": "right" },
      cellClass: "td-actions",
      cell: (item) => (
        <div class="action-btns">
          <button class="btn-icon btn-edit" title="Edit" onClick={() => props.onEdit(item)}>
            <IconEdit />
          </button>
          <button class="btn-icon btn-delete" title="Delete" onClick={() => props.onDelete(String(item.id))}>
            <IconTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      rows={props.rolePermissions}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No role permissions found."
      itemsPerPage={10}
    />
  );
};

export default RolePermissionTable;
