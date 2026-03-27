import { useParams } from "@solidjs/router";
import { Component, Show, createMemo, createSignal, onMount } from "solid-js";
import DisseminationDetailHeader from "./DetailHeader";
import DisseminationDetailList from "./DetailList";
import { disseminationAPI } from "./services/api";
import type { Dissemination, DisseminationDetail } from "./services/types";

const formatDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
};

const DisseminationDetailPage: Component = () => {
  const params = useParams<{ id: string }>();
  const [dissemination, setDissemination] = createSignal<Dissemination | null>(
    null,
  );
  const [disseminationDetails, setDisseminationDetails] = createSignal<
    DisseminationDetail[]
  >([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const location = createMemo(() => {
    const item = dissemination();
    if (!item) return "-";

    return [item.province, item.city, item.district, item.village]
      .filter(Boolean)
      .join(", ");
  });

  const fetchDissemination = async () => {
    if (!params.id) {
      setError("Dissemination ID not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [disseminationResult, detailResult] = await Promise.all([
        disseminationAPI.getById(params.id),
        disseminationAPI.getDetailsByDisseminationId(params.id),
      ]);

      if (disseminationResult.success && disseminationResult.data) {
        setDissemination(disseminationResult.data);
      } else {
        setError(
          disseminationResult.error || "Failed to fetch dissemination detail",
        );
      }

      if (detailResult.success && detailResult.data) {
        setDisseminationDetails(detailResult.data);
      } else if (!disseminationResult.success || !disseminationResult.data) {
        setError(detailResult.error || "Failed to fetch dissemination details");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchDissemination);

  return (
    <div class="user-page">
      <DisseminationDetailHeader
        dissemination={dissemination()}
        formattedDate={formatDate(dissemination()?.date)}
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Show when={isLoading()}>
        <div class="form-section">Loading dissemination detail...</div>
      </Show>

      <Show when={!isLoading() && dissemination()}>
        <>
          <Show
            when={disseminationDetails().length > 0}
            fallback={
              <div class="form-section">
                <div class="form-section-header">
                  <h2>Dissemination Details</h2>
                </div>
                <div class="form-helper-text">
                  No dissemination details found for this record.
                </div>
              </div>
            }
          >
            <DisseminationDetailList details={disseminationDetails()} />
          </Show>
        </>
      </Show>
    </div>
  );
};

export default DisseminationDetailPage;
