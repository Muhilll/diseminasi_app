import type { Dissemination } from "../../../type/dissemination";
import { createReportFileName } from "./report.utils";

interface ExportPdfParams {
  dissemination: Dissemination;
  element: HTMLElement;
}

export const exportReportPdf = async (params: ExportPdfParams) => {
  const html2pdf = (await import("html2pdf.js")).default;
  const tempWrapper = document.createElement("div");
  const clonedElement = params.element.cloneNode(true) as HTMLElement;

  tempWrapper.style.position = "fixed";
  tempWrapper.style.left = "0";
  tempWrapper.style.top = "0";
  tempWrapper.style.zIndex = "-1";
  tempWrapper.style.background = "#f3f4f6";
  tempWrapper.style.padding = "0";
  tempWrapper.style.margin = "0";
  tempWrapper.style.opacity = "1";
  tempWrapper.style.pointerEvents = "none";
  tempWrapper.appendChild(clonedElement);
  document.body.appendChild(tempWrapper);

  try {
    await html2pdf()
      .set({
        margin: 0,
        filename: createReportFileName(params.dissemination, "pdf"),
        image: { type: "jpeg", quality: 0.98 },
        html2canvas: {
          scale: 2,
          useCORS: true,
          backgroundColor: "#f3f4f6",
        },
        jsPDF: {
          unit: "mm",
          format: "a4",
          orientation: "portrait",
        },
        pagebreak: {
          mode: ["css", "legacy"],
        },
      })
      .from(clonedElement)
      .save();
  } finally {
    tempWrapper.remove();
  }
};
