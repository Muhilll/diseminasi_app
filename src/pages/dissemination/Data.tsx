import { useNavigate } from "@solidjs/router";
import { Component } from "solid-js";
import DataTable, { type DataTableColumn } from "../../components/ui/DataTable";
import type { Dissemination } from "./services/types";

interface DisseminationTableProps {
  disseminations: Dissemination[];
  isLoading: boolean;
  onEdit: (dissemination: Dissemination) => void;
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

const IconEye = () => (
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
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
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

const formatDate = (value?: string) => {
  if (!value) return "-";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const DisseminationTable: Component<DisseminationTableProps> = (props) => {
  const navigate = useNavigate();

  const columns: DataTableColumn<Dissemination>[] = [
    { header: "ID", cell: (item) => <>{item.id}</> },
    { header: "Title", cell: (item) => <>{item.title}</> },
    { header: "Province", cell: (item) => <>{item.province}</> },
    { header: "City", cell: (item) => <>{item.city}</> },
    { header: "District", cell: (item) => <>{item.district}</> },
    { header: "Village", cell: (item) => <>{item.village}</> },
    { header: "Date", cell: (item) => <>{formatDate(item.date)}</> },
    { header: "User", cell: (item) => <>{item.user?.name || item.user_id}</> },
    {
      header: "Actions",
      headerStyle: { "text-align": "right" },
      cellClass: "td-actions",
      cell: (item) => (
        <div class="action-btns">
          <button class="btn-icon btn-edit" title="Edit" onClick={() => props.onEdit(item)}>
            <IconEdit />
          </button>
          <button
            class="btn-icon btn-detail"
            title="Detail"
            onClick={() => navigate(`/disseminations/details/${item.id}`)}
          >
            <IconEye />
          </button>
          <button
            class="btn-icon btn-delete"
            title="Delete"
            onClick={() => props.onDelete(String(item.id))}
          >
            <IconTrash />
          </button>
        </div>
      ),
    },
  ];

  return (
    <DataTable
      rows={props.disseminations}
      columns={columns}
      isLoading={props.isLoading}
      emptyMessage="No disseminations found."
      itemsPerPage={10}
    />
  );
};

export default DisseminationTable;
