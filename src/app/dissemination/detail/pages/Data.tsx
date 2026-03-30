import { For, Show, createSignal, type Component } from "solid-js";
import type { DisseminationDetailListProps } from "../type/dissemination-detail-props";

const IconUsers = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const IconCalendar = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconEdit = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
  </svg>
);

const IconTrash = () => (
  <svg
    width="16"
    height="16"
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

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const DetailImage: Component<{ src?: string; alt: string }> = (props) => {
  const [failed, setFailed] = createSignal(false);

  return (
    <div class="dissemination-detail-card-media">
      <Show
        when={props.src && !failed()}
        fallback={<div class="dissemination-detail-card-placeholder">{props.alt}</div>}
      >
        <img src={props.src} alt={props.alt} onError={() => setFailed(true)} />
      </Show>
    </div>
  );
};

const DisseminationDetailList: Component<DisseminationDetailListProps> = (props) => {
  return (
    <div class="dissemination-detail-list">
      <For each={props.details}>
        {(detail) => (
          <article class="dissemination-detail-card">
            <DetailImage src={detail.image} alt={detail.material || "Dissemination"} />

            <div class="dissemination-detail-card-body">
              <div class="dissemination-detail-card-grid">
                <div class="dissemination-detail-card-field">
                  <span>Basis / Directive</span>
                  <strong>{detail.basis || "-"}</strong>
                </div>

                <div class="dissemination-detail-card-field">
                  <span>Methodology</span>
                  <strong>{detail.methode || "-"}</strong>
                </div>

                <div class="dissemination-detail-card-field dissemination-detail-card-field-full">
                  <span>Material Focus</span>
                  <strong class="is-accent">{detail.material || "-"}</strong>
                </div>

                <div class="dissemination-detail-card-field">
                  <div class="dissemination-detail-card-inline">
                    <span>Participants</span>
                    <IconUsers />
                    <strong>{detail.participants || "-"}</strong>
                  </div>
                </div>

                <div class="dissemination-detail-card-field">
                  <div class="dissemination-detail-card-inline">
                    <span>Schedule & Venue</span>
                    <IconCalendar />
                    <strong>{`${formatDate(detail.date)}${detail.location ? ` | ${detail.location}` : ""}`}</strong>
                  </div>
                </div>
              </div>

              <div class="dissemination-detail-result-box">
                <span>Key Results</span>
                <p>{detail.result || "-"}</p>
              </div>

              <div class="dissemination-detail-card-actions">
                <button
                  type="button"
                  class="dissemination-detail-action-btn"
                  onClick={() => props.onEdit(detail)}
                >
                  <IconEdit />
                  Edit
                </button>
                <button
                  type="button"
                  class="dissemination-detail-action-btn is-danger"
                  onClick={() => props.onDelete(String(detail.id))}
                >
                  <IconTrash />
                  Delete
                </button>
              </div>
            </div>
          </article>
        )}
      </For>
    </div>
  );
};

export default DisseminationDetailList;
