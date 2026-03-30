import {
  AlignmentType,
  Document,
  HeadingLevel,
  ImageRun,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
} from "docx";
import type { Dissemination } from "../../../type/dissemination";
import type { DisseminationDetail } from "../../type/dissemination-detail";
import {
  chunkItems,
  createReportFileName,
  formatFullDate,
  formatMonthYear,
  formatShortDate,
  formatYear,
  getImageDetails,
  REPORT_TITLE,
} from "./report.utils";

const pageMargins = {
  top: 900,
  right: 900,
  bottom: 900,
  left: 900,
};

const paragraph = (text: string, options?: ConstructorParameters<typeof Paragraph>[0]) =>
  new Paragraph({
    children: [new TextRun(text)],
    ...options,
  });

const labelValueRow = (label: string, value: string, prefix?: string) =>
  paragraph(`${prefix ? `${prefix} ` : ""}${label} : ${value}`);

const fetchImageBuffer = async (url?: string) => {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return await response.arrayBuffer();
  } catch {
    return null;
  }
};

const createAttachmentTable = async (details: DisseminationDetail[]) => {
  const imageChunks = chunkItems(getImageDetails(details), 2);
  const sections: Array<Paragraph | Table> = [];

  for (const [pageIndex, items] of imageChunks.entries()) {
    if (pageIndex > 0) {
      sections.push(new Paragraph({ children: [new PageBreak()] }));
    }

    sections.push(
      paragraph("DOKUMENTASI KEGIATAN", {
        heading: HeadingLevel.HEADING_1,
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      }),
    );

    const imageRuns = await Promise.all(
      items.map(async (detail) => {
        const imageBuffer = await fetchImageBuffer(detail.image);

        const imageParagraph = imageBuffer
          ? new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new ImageRun({
                  data: imageBuffer,
                  transformation: { width: 240, height: 160 },
                }),
              ],
            })
          : paragraph(detail.material || "Dokumentasi", {
              alignment: AlignmentType.CENTER,
            });

        return new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [
            imageParagraph,
            paragraph(formatShortDate(detail.date), {
              spacing: { before: 120 },
            }),
          ],
        });
      }),
    );

    if (imageRuns.length === 1) {
      imageRuns.push(
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [new Paragraph("")],
        }),
      );
    }

    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows: [new TableRow({ children: imageRuns })],
      }),
    );
  }

  return sections;
};

export const exportReportDocx = async (
  dissemination: Dissemination,
  details: DisseminationDetail[],
) => {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: { margin: pageMargins },
        },
        children: [
          paragraph(REPORT_TITLE, {
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 700 },
          }),
          paragraph(`WILAYAH BINAAN DESA ${dissemination.village || "-"}`, {
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          paragraph(`KECAMATAN ${dissemination.district || "-"}`, {
            alignment: AlignmentType.CENTER,
            spacing: { after: 500 },
          }),
          paragraph(`BULAN: ${formatMonthYear(dissemination.date)}`, {
            alignment: AlignmentType.CENTER,
            spacing: { after: 1600 },
          }),
          paragraph("BPP", {
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 1400 },
          }),
          paragraph("Disusun Oleh :", {
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          paragraph(dissemination.user?.name || "-", {
            alignment: AlignmentType.CENTER,
          }),
          paragraph(`NIP. ${dissemination.user?.employee_id || "-"}`, {
            alignment: AlignmentType.CENTER,
            spacing: { after: 1600 },
          }),
          paragraph("BALAI PENYULUHAN PERTANIAN (BPP)", {
            alignment: AlignmentType.CENTER,
          }),
          paragraph((dissemination.city || "-").toUpperCase(), {
            alignment: AlignmentType.CENTER,
          }),
          paragraph(formatYear(dissemination.date), {
            alignment: AlignmentType.CENTER,
          }),
        ],
      },
      ...details.map((detail) => ({
        properties: {
          page: { margin: pageMargins },
        },
        children: [
          paragraph(REPORT_TITLE, {
            alignment: AlignmentType.CENTER,
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 500 },
          }),
          paragraph("1. Penyuluh Pertanian", { spacing: { after: 160 } }),
          labelValueRow(
            "Nama / NIP",
            `${dissemination.user?.name || "-"} / ${dissemination.user?.employee_id || "-"}`,
            "a.",
          ),
          labelValueRow("Jabatan", "Penyuluh Pertanian", "b."),
          labelValueRow("Dasar Pelaksanaan", detail.basis || "-", "2."),
          labelValueRow("Materi Diseminasi", detail.material || "-", "3."),
          paragraph("4. Pelaksanaan Kegiatan", { spacing: { before: 140, after: 140 } }),
          labelValueRow("Waktu Pelaksanaan", formatFullDate(detail.date), "a."),
          labelValueRow("Tempat / Lokasi", detail.location || "-", "b."),
          labelValueRow("Metode", detail.methode || "-", "c."),
          labelValueRow("Peserta", detail.participants || "-", "d."),
          labelValueRow("Hasil Kegiatan", detail.result || "-", "5."),
          paragraph("", { spacing: { after: 480 } }),
          paragraph(
            `${dissemination.village || "-"}, ${formatFullDate(detail.date)}`,
            {
              alignment: AlignmentType.RIGHT,
            },
          ),
          paragraph("Penyuluh Pertanian", {
            alignment: AlignmentType.RIGHT,
            spacing: { after: 720 },
          }),
          paragraph(dissemination.user?.name || "-", {
            alignment: AlignmentType.RIGHT,
          }),
          paragraph(`NIP. ${dissemination.user?.employee_id || "-"}`, {
            alignment: AlignmentType.RIGHT,
          }),
        ],
      })),
      {
        properties: {
          page: { margin: pageMargins },
        },
        children: await createAttachmentTable(details),
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  const link = document.createElement("a");
  const objectUrl = URL.createObjectURL(blob);
  link.href = objectUrl;
  link.download = createReportFileName(dissemination, "docx");
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
};
