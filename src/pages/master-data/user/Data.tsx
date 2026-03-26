import { Component, For, Show, createSignal } from "solid-js";
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

const IconChevronLeft = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const ITEMS_PER_PAGE = 10;

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
  const [page, setPage] = createSignal(1);

  const totalPages = () =>
    Math.max(1, Math.ceil(props.users.length / ITEMS_PER_PAGE));

  const pagedUsers = () => {
    const start = (page() - 1) * ITEMS_PER_PAGE;
    return props.users.slice(start, start + ITEMS_PER_PAGE);
  };

  const pageNumbers = (): (number | "...")[] => {
    const total = totalPages();
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const current = page();
    const pages = new Set(
      [1, total, current - 1, current, current + 1].filter(
        (value) => value >= 1 && value <= total
      )
    );

    const sortedPages = [...pages].sort((a, b) => a - b);
    const result: (number | "...")[] = [];

    sortedPages.forEach((value, index) => {
      if (index > 0 && value - sortedPages[index - 1] > 1) {
        result.push("...");
      }
      result.push(value);
    });

    return result;
  };

  const startEntry = () =>
    props.users.length === 0 ? 0 : (page() - 1) * ITEMS_PER_PAGE + 1;
  const endEntry = () => Math.min(page() * ITEMS_PER_PAGE, props.users.length);

  return (
    <div class="app-table-card">
      <Show when={props.isLoading}>
        <div class="table-loading">Loading...</div>
      </Show>

      <Show when={!props.isLoading}>
        <Show
          when={props.users.length > 0}
          fallback={<div class="table-empty">No users found.</div>}
        >
          <div class="app-table-scroll">
            <table class="app-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Employee ID</th>
                  <th>Role</th>
                  <th>Grade</th>
                  <th>Position</th>
                  <th>Signature</th>
                  <th>Created At</th>
                  <th>Updated At</th>
                  <th style="text-align:right">Actions</th>
                </tr>
              </thead>
              <tbody>
                <For each={pagedUsers()}>
                  {(user) => (
                    <tr>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.employee_id}</td>
                      <td>{user.role?.name || user.role_id}</td>
                      <td>{user.grade?.grade || user.grade_id}</td>
                      <td>{user.position?.des || user.position_id}</td>
                      <td>{user.signature_image ? "Available" : "-"}</td>
                      <td>{formatDate(user.created_at)}</td>
                      <td>{formatDate(user.updated_at)}</td>
                      <td class="td-actions">
                        <div class="action-btns">
                          <button
                            class="btn-icon btn-edit"
                            title="Edit"
                            onClick={() => props.onEdit(user)}
                          >
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
                      </td>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <span class="pagination-info">
              Showing <strong>{startEntry()}</strong> to <strong>{endEntry()}</strong> of{" "}
              <strong>{props.users.length}</strong> entries
            </span>

            <nav class="pagination-nav">
              <button
                class="page-btn"
                disabled={page() === 1}
                onClick={() => setPage((current) => current - 1)}
              >
                <IconChevronLeft />
              </button>

              <For each={pageNumbers()}>
                {(item) =>
                  item === "..." ? (
                    <span class="page-dots">...</span>
                  ) : (
                    <button
                      class={`page-btn${page() === item ? " active" : ""}`}
                      onClick={() => setPage(item as number)}
                    >
                      {item}
                    </button>
                  )
                }
              </For>

              <button
                class="page-btn"
                disabled={page() === totalPages()}
                onClick={() => setPage((current) => current + 1)}
              >
                <IconChevronRight />
              </button>
            </nav>
          </div>
        </Show>
      </Show>
    </div>
  );
};

export default UserTable;
