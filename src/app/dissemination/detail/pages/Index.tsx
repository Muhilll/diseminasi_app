import { Show, createSignal, type Component } from "solid-js";
import ConfirmModal from "../../../../components/ui/ConfirmModal";
import Modal from "../../../../components/ui/Modal";
import Toast from "../../../../components/ui/Toast";
import { usePagePermissions } from "../../../../hooks/usePagePermissions";
import { useDisseminationDetailManagement } from "../hook/useDisseminationDetailManagement";
import { exportReportDocx } from "./export/export-docx";
import { exportReportPdf } from "./export/export-pdf";
import ReportDocument from "./export/ReportDocument";
import { reportStyles } from "./export/report.styles";
import Data from "./Data";
import DisseminationDetailForm from "./Form";
import Header from "./Header";

const IconPlusCircle = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);

const IconPrinter = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.2"
    stroke-linecap="round"
    stroke-linejoin="round"
  >
    <polyline points="6 9 6 2 18 2 18 9" />
    <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2" />
    <rect x="6" y="14" width="12" height="8" />
  </svg>
);

const DisseminationDetailPage: Component = () => {
  const detailManagement = useDisseminationDetailManagement();
  const permissions = usePagePermissions();
  const [exportFormat, setExportFormat] = createSignal<"pdf" | "docx">("pdf");
  const [isExporting, setIsExporting] = createSignal(false);
  let reportContentRef: HTMLDivElement | undefined;

  const handleExport = async () => {
    const dissemination = detailManagement.dissemination();
    if (!dissemination) return;

    setIsExporting(true);

    try {
      if (exportFormat() === "pdf") {
        if (!reportContentRef) return;

        await exportReportPdf({
          dissemination,
          element: reportContentRef,
        });
      } else {
        await exportReportDocx(dissemination, detailManagement.details());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div class="user-page">
      <Toast toast={detailManagement.toast()} onClose={detailManagement.clearToast} />

      <Header
        dissemination={detailManagement.dissemination()}
        formattedDate={detailManagement.formattedDate()}
        action={
          <div class="dissemination-detail-header-actions">
            <select
              class="btn-secondary dissemination-detail-print-btn"
              value={exportFormat()}
              onChange={(e) => setExportFormat(e.currentTarget.value as "pdf" | "docx")}
              disabled={isExporting() || detailManagement.isLoading()}
            >
              <option value="pdf">PDF</option>
              <option value="docx">DOCX</option>
            </select>

            <button
              type="button"
              class="btn-secondary dissemination-detail-print-btn"
              onClick={handleExport}
              disabled={isExporting() || detailManagement.isLoading()}
            >
              <IconPrinter />
              {isExporting() ? "Exporting..." : "Export"}
            </button>

            {permissions.canCreate() && (
              <button class="btn-create" onClick={detailManagement.openCreateForm}>
                <IconPlusCircle />
                Add Detail
              </button>
            )}
          </div>
        }
      />

      <Show when={detailManagement.error()}>
        <div class="error-message">{detailManagement.error()}</div>
      </Show>

      <Modal open={detailManagement.showForm()} onClose={detailManagement.closeForm}>
        <div class="form-section">
          <div class="form-section-header">
            <h2>
              {detailManagement.editingDetail()
                ? "Edit Dissemination Detail"
                : "Add Dissemination Detail"}
            </h2>
            <button
              onClick={detailManagement.closeForm}
              class="btn-secondary"
              type="button"
            >
              Cancel
            </button>
          </div>

          <DisseminationDetailForm
            initialData={detailManagement.editingDetail() || undefined}
            onSubmit={detailManagement.handleSubmit}
            isLoading={detailManagement.isLoading()}
          />
        </div>
      </Modal>

      <ConfirmModal
        open={!!detailManagement.deletingDetailId()}
        title="Delete Dissemination Detail"
        message="Are you sure you want to delete this dissemination detail? This action cannot be undone."
        confirmLabel={detailManagement.isLoading() ? "Deleting..." : "Delete"}
        confirmLoading={detailManagement.isLoading()}
        onConfirm={detailManagement.handleDeleteConfirm}
        onCancel={() => detailManagement.setDeletingDetailId(null)}
      />

      <Show when={detailManagement.isLoading() && !detailManagement.showForm() && !detailManagement.deletingDetailId()}>
        <div class="form-section">Loading dissemination detail...</div>
      </Show>

      <Show when={!detailManagement.isLoading() && detailManagement.dissemination()}>
        <Show
          when={detailManagement.details().length > 0}
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
          <Data
            details={detailManagement.details()}
            canUpdate={permissions.canUpdate()}
            canDelete={permissions.canDelete()}
            onEdit={detailManagement.handleEdit}
            onDelete={detailManagement.requestDelete}
          />
        </Show>
      </Show>

      <Show when={detailManagement.dissemination()}>
        {(dissemination) => (
          <div
            ref={reportContentRef}
            style={{
              position: "fixed",
              left: "0",
              top: "0",
              width: "210mm",
              "pointer-events": "none",
              opacity: "0.01",
              "z-index": "-1",
              overflow: "hidden",
            }}
          >
            <style>{reportStyles}</style>
            <ReportDocument
              dissemination={dissemination()}
              details={detailManagement.details()}
            />
          </div>
        )}
      </Show>
    </div>
  );
};

export default DisseminationDetailPage;
