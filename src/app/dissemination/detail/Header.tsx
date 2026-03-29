import { A } from "@solidjs/router";
import { Component, JSX, Show } from "solid-js";
import type { Dissemination } from "../services/types";

interface DisseminationDetailHeaderProps {
  dissemination?: Dissemination | null;
  formattedDate: string;
  action?: JSX.Element;
}

const IconCalendar = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
    <line x1="16" y1="2" x2="16" y2="6" />
    <line x1="8" y1="2" x2="8" y2="6" />
    <line x1="3" y1="10" x2="21" y2="10" />
  </svg>
);

const IconMapPin = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 1 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const Header: Component<DisseminationDetailHeaderProps> = (props) => {
  const locationSummary = () =>
    [props.dissemination?.province, props.dissemination?.city].filter(Boolean).join(", ") || "-";

  return (
    <div class="dissemination-detail-header-wrap">
      <A href="/disseminations" class="btn-secondary dissemination-detail-back">
        Back
      </A>

      <Show when={props.action}>
        <div class="dissemination-detail-top-action">{props.action}</div>
      </Show>

      <section class="dissemination-detail-header">
        <div class="dissemination-detail-main">
          <span class="dissemination-detail-badge">Core Program</span>

          <h1>{props.dissemination?.title || "Dissemination Detail"}</h1>

          <div class="dissemination-detail-meta">
            <div class="dissemination-detail-meta-item">
              <IconCalendar />
              <span>{props.formattedDate}</span>
            </div>

            <div class="dissemination-detail-meta-item">
              <IconMapPin />
              <span>{locationSummary()}</span>
            </div>
          </div>
        </div>

        <aside class="dissemination-detail-location-card">
          <p class="dissemination-detail-location-title">Specific Location</p>

          <div class="dissemination-detail-location-row">
            <span>District</span>
            <strong>{props.dissemination?.district || "-"}</strong>
          </div>

          <div class="dissemination-detail-location-row">
            <span>Village</span>
            <strong>{props.dissemination?.village || "-"}</strong>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default Header;
