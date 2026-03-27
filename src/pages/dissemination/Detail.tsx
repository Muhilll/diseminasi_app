import { A, useParams } from "@solidjs/router";
import { Component, Show, createMemo, createSignal, onMount } from "solid-js";
import PageHeader from "../../components/ui/PageHeader";
import { disseminationAPI } from "./services/api";
import type { Dissemination } from "./services/types";

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
  const [dissemination, setDissemination] = createSignal<Dissemination | null>(null);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);

  const location = createMemo(() => {
    const item = dissemination();
    if (!item) return "-";

    return [item.province, item.city, item.district, item.village].filter(Boolean).join(", ");
  });

  const fetchDissemination = async () => {
    if (!params.id) {
      setError("Dissemination ID not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await disseminationAPI.getById(params.id);

      if (result.success && result.data) {
        setDissemination(result.data);
      } else {
        setError(result.error || "Failed to fetch dissemination detail");
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
      <PageHeader
        title={dissemination()?.title || "Dissemination Detail"}
        description={`Tanggal: ${formatDate(dissemination()?.date)} | Lokasi: ${location()}`}
        action={
          <A href="/disseminations" class="btn-secondary">
            Back
          </A>
        }
      />

      <Show when={error()}>
        <div class="error-message">{error()}</div>
      </Show>

      <Show when={isLoading()}>
        <div class="form-section">Loading dissemination detail...</div>
      </Show>

      <Show when={!isLoading() && dissemination()}>
        {(item) => (
          <div class="form-section">
            <div class="form-section-header">
              <h2>Dissemination Information</h2>
            </div>

            <div class="user-form">
              <div class="form-group">
                <label>Title</label>
                <div class="form-static-value">{item().title || "-"}</div>
              </div>

              <div class="form-group">
                <label>Date</label>
                <div class="form-static-value">{formatDate(item().date)}</div>
              </div>

              <div class="form-group">
                <label>Province</label>
                <div class="form-static-value">{item().province || "-"}</div>
              </div>

              <div class="form-group">
                <label>City</label>
                <div class="form-static-value">{item().city || "-"}</div>
              </div>

              <div class="form-group">
                <label>District</label>
                <div class="form-static-value">{item().district || "-"}</div>
              </div>

              <div class="form-group">
                <label>Village</label>
                <div class="form-static-value">{item().village || "-"}</div>
              </div>
            </div>
          </div>
        )}
      </Show>
    </div>
  );
};

export default DisseminationDetailPage;
