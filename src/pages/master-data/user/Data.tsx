import { Component } from "solid-js";
import DataTable, { type DataTableColumn } from "../../../components/ui/DataTable";
import type { User } from "./services/types";

interface UserTableProps {
  users: User[];
  isLoading: boolean;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const IconEdit = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
);

const IconTrash = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
    <path d="M10 11v6" />
    <path d="M14 11v6" />
    <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
  </svg>
);

const formatDate = (value: string) => {
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

const UserTable: Component<UserTableProps> = (props) => {
  const columns: DataTableColumn<User>[] = [
    { header: "ID", cell: (user) => <>{user.id}</> },
    { header: "Name", cell: (user) => <>{user.name}</> },
    { header: "Email", cell: (user) => <>{user.email}</> },
    { header: "Employee ID", cell: (user) => <>{user.employee_id}</> },
    { header: "Role", cell: (user) => <>{user.role?.name || user.role_id}</> },
    { header: "Grade", cell: (user) => <>{user.grade?.grade || user.grade_id}</> },
    { header: "Position", cell: (user) => <>{user.position?.des || user.position_id}</> },
    { header: "Signature", cell: (user) => <>{user.signature_image ? "Available" : "-"}</> },
    { header: "Created At", cell: (user) => <>{formatDate(user.created_at)}</> },
    { header: "Updated At", cell: (user) => <>{formatDate(user.updated_at)}</> },
    {
      header: "Actions",
      headerStyle: { "text-align": "right" },
      cellClass: "td-actions",
      cell: (user) => (
        <div class="action-btns">
          <button class="btn-icon btn-edit" title="Edit" onClick={() => props.onEdit(user)}>
            <IconEdit />
          </button>
          <button
            class="btn-icon btn-delete"
            title="Delete"
            onClick={() => props.onDelete(String(user.id))}
          >
            <IconTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      rows={props.users}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No users found."
      itemsPerPage={10}
    />
  );
};

export default UserTable;
