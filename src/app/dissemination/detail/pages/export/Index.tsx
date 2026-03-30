import { useParams } from "@solidjs/router";
import { Component, Show, createSignal, onMount } from "solid-js";
import { disseminationAPI } from "../../../service/dissemination.api";
import type { Dissemination } from "../../../type/dissemination";
import { disseminationDetailAPI } from "../../service/dissemination-detail.api";
import type { DisseminationDetail } from "../../type/dissemination-detail";
import { exportReportDocx } from "./export-docx";
import { exportReportPdf } from "./export-pdf";
import ReportDocument from "./ReportDocument";
import { reportStyles } from "./report.styles";

const ExportReportPage: Component = () => {
  const params = useParams<{ id: string }>();
  const [dissemination, setDissemination] = createSignal<Dissemination | null>(null);
  const [details, setDetails] = createSignal<DisseminationDetail[]>([]);
  const [isLoading, setIsLoading] = createSignal(false);
  const [error, setError] = createSignal<string | null>(null);
  const [isExportingPdf, setIsExportingPdf] = createSignal(false);
  const [isExportingDocx, setIsExportingDocx] = createSignal(false);
  let reportContentRef: HTMLDivElement | undefined;

  const fetchReport = async () => {
    if (!params.id) {
      setError("Dissemination ID not found");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const [disseminationResult, detailResult] = await Promise.all([
        disseminationAPI.getById(params.id),
        disseminationDetailAPI.getByDisseminationId(params.id),
      ]);

      if (disseminationResult.success && disseminationResult.data) {
        setDissemination(disseminationResult.data);
        document.title = `Laporan ${disseminationResult.data.title}`;
      } else {
        setError(disseminationResult.error || "Failed to fetch dissemination");
      }

      if (detailResult.success && detailResult.data) {
        setDetails(detailResult.data);
      } else if (!disseminationResult.success || !disseminationResult.data) {
        setError(detailResult.error || "Failed to fetch dissemination details");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  };

  onMount(fetchReport);

  const handleExportPdf = async () => {
    const item = dissemination();
    if (!item || !reportContentRef) return;

    setIsExportingPdf(true);
    try {
      await exportReportPdf({
        dissemination: item,
        element: reportContentRef,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export PDF");
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportDocx = async () => {
    const item = dissemination();
    if (!item) return;

    setIsExportingDocx(true);
    try {
      await exportReportDocx(item, details());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to export DOCX");
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div class="report-shell">
      <style>{reportStyles}</style>

      <div class="report-toolbar">
        <button
          type="button"
          class="report-btn"
          onClick={handleExportPdf}
          disabled={isLoading() || isExportingPdf() || isExportingDocx()}
        >
          {isExportingPdf() ? "Exporting PDF..." : "Export PDF"}
        </button>
        <button
          type="button"
          class="report-btn"
          onClick={handleExportDocx}
          disabled={isLoading() || isExportingPdf() || isExportingDocx()}
        >
          {isExportingDocx() ? "Exporting DOCX..." : "Export DOCX"}
        </button>
      </div>

      <Show when={error()}>
        <div class="user-page">
          <div class="error-message">{error()}</div>
        </div>
      </Show>

      <Show when={isLoading()}>
        <div class="user-page">
          <div class="form-section">Preparing report...</div>
        </div>
      </Show>

      <Show when={!isLoading() && dissemination()}>
        {(item) => (
          <div ref={reportContentRef}>
            <ReportDocument dissemination={item()} details={details()} />
          </div>
        )}
      </Show>
    </div>
  );
};

export default ExportReportPage;
