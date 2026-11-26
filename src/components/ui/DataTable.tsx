import { For, JSX, Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";

export interface DataTableColumn<T> {
  header: string;
  cell: (row: T, index: number) => JSX.Element;
  headerStyle?: JSX.CSSProperties;
  cellClass?: string;
}

interface DataTableProps<T> {
  rows: T[];
  columns: DataTableColumn<T>[];
  isLoading?: boolean;
  emptyMessage?: string;
  itemsPerPage?: number;
  pageSizeOptions?: number[];
  searchPlaceholder?: string;
}

const DEFAULT_PAGE_SIZE_OPTIONS = [5, 10, 25, 50, 100];

function extractSearchableText(value: unknown, depth = 0): string {
  if (value === null || value === undefined || depth > 4) return "";
  if (typeof value === "string" || typeof value === "number") return String(value);
  if (Array.isArray(value)) {
    return value.map((item) => extractSearchableText(item, depth + 1)).join(" ");
  }
  if (typeof value === "object") {
    return Object.entries(value as Record<string, unknown>)
      .filter(([key]) => !key.endsWith("_public_id") && key !== "password")
      .map(([, val]) => extractSearchableText(val, depth + 1))
      .join(" ");
  }
  return "";
}

const IconSearch = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
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

function DataTable<T>(props: DataTableProps<T>) {
  const defaultSize = props.itemsPerPage ?? 10;
  const [page, setPage] = createSignal(1);
  const [pageSize, setPageSize] = createSignal(defaultSize);
  const [searchInput, setSearchInput] = createSignal("");
  const [debouncedQuery, setDebouncedQuery] = createSignal("");
  let searchTimer: ReturnType<typeof setTimeout> | undefined;

  onCleanup(() => {
    if (searchTimer) clearTimeout(searchTimer);
  });

  const sizeOptions = createMemo(() => {
    const base = props.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;
    return Array.from(new Set([...base, defaultSize])).sort((a, b) => a - b);
  });

  const filteredRows = createMemo(() => {
    const query = debouncedQuery().trim().toLowerCase();
    if (!query) return props.rows;

    return props.rows.filter((row) =>
      extractSearchableText(row).toLowerCase().includes(query),
    );
  });

  const totalPages = createMemo(() =>
    Math.max(1, Math.ceil(filteredRows().length / pageSize())),
  );

  createEffect(() => {
    if (page() > totalPages()) {
      setPage(totalPages());
    }
  });

  const pagedRows = createMemo(() => {
    const start = (page() - 1) * pageSize();
    return filteredRows().slice(start, start + pageSize());
  });

  const pageNumbers = createMemo<(number | "...")[]>(() => {
    const total = totalPages();
    if (total <= 5) return Array.from({ length: total }, (_, i) => i + 1);

    const current = page();
    const pages = new Set(
      [1, total, current - 1, current, current + 1].filter(
        (value) => value >= 1 && value <= total,
      ),
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
  });

  const startEntry = createMemo(() =>
    filteredRows().length === 0 ? 0 : (page() - 1) * pageSize() + 1,
  );
  const endEntry = createMemo(() =>
    Math.min(page() * pageSize(), filteredRows().length),
  );

  const handleSearchInput = (value: string) => {
    setSearchInput(value);
    if (searchTimer) clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      setDebouncedQuery(value);
      setPage(1);
    }, 300);
  };

  const handlePageSizeChange = (value: string) => {
    const parsed = Number(value);
    if (!Number.isNaN(parsed) && parsed > 0) {
      setPageSize(parsed);
      setPage(1);
    }
  };

  return (
    <div class="app-table-card">
      <Show when={props.isLoading}>
        <div class="table-loading">Loading...</div>
      </Show>

      <Show when={!props.isLoading}>
        <div class="table-toolbar">
          <label class="table-page-size">
            <span>Show</span>
            <select
              class="table-page-size-select"
              value={pageSize()}
              onChange={(e) => handlePageSizeChange(e.currentTarget.value)}
              aria-label="Rows per page"
            >
              <For each={sizeOptions()}>
                {(size) => <option value={size}>{size}</option>}
              </For>
            </select>
            <span>entries</span>
          </label>

          <div class="table-search">
            <span class="table-search-icon" aria-hidden="true">
              <IconSearch />
            </span>
            <input
              type="search"
              class="table-search-input"
              value={searchInput()}
              onInput={(e) => handleSearchInput(e.currentTarget.value)}
              placeholder={props.searchPlaceholder || "Search..."}
              aria-label="Search table"
            />
          </div>
        </div>

        <Show
          when={filteredRows().length > 0}
          fallback={
            <div class="table-empty">
              {debouncedQuery().trim()
                ? "No matching records found."
                : props.emptyMessage || "No data found."}
            </div>
          }
        >
          <div class="app-table-scroll">
            <table class="app-table">
              <thead>
                <tr>
                  <For each={props.columns}>
                    {(column) => <th style={column.headerStyle}>{column.header}</th>}
                  </For>
                </tr>
              </thead>
              <tbody>
                <For each={pagedRows()}>
                  {(row, index) => (
                    <tr>
                      <For each={props.columns}>
                        {(column) => (
                          <td class={column.cellClass}>
                            {column.cell(row, (page() - 1) * pageSize() + index())}
                          </td>
                        )}
                      </For>
                    </tr>
                  )}
                </For>
              </tbody>
            </table>
          </div>

          <div class="table-footer">
            <span class="pagination-info">
              Showing <strong>{startEntry()}</strong> to <strong>{endEntry()}</strong> of{" "}
              <strong>{filteredRows().length}</strong> entries
              <Show when={debouncedQuery().trim() && filteredRows().length !== props.rows.length}>
                {" "}
                (filtered from {props.rows.length} total)
              </Show>
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
}

export default DataTable;
