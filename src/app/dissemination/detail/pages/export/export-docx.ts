import {
  AlignmentType,
  Document,
  Footer,
  Header,
  HeadingLevel,
  type IFloating,
  HorizontalPositionRelativeFrom,
  type IParagraphOptions,
  ImageRun,
  PageOrientation,
  Packer,
  PageBreak,
  Paragraph,
  Table,
  TableCell,
  TableLayoutType,
  TableRow,
  TextWrappingType,
  TextRun,
  VerticalPositionRelativeFrom,
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
  getCoordinatorTitle,
  getKabupatenLabel,
  getPreparedLocationDate,
  getImageDetails,
  REPORT_COORDINATOR_FALLBACK,
  REPORT_COORDINATOR_NIP_FALLBACK,
  toUpperSafe,
} from "./report.utils";
import logoImage from "../../../../../assets/dissemination/logo.png";
import signatureImage from "../../../../../assets/dissemination/signature.png";
import userSignatureImage from "../../../../../assets/dissemination/user_signature.png";

const pageMargins = {
  top: 1440,
  right: 1440,
  bottom: 1440,
  left: 1440,
  header: 1417,
  footer: 1134,
};

const noBorders = {
  top: { style: "none", size: 0, color: "FFFFFF" },
  bottom: { style: "none", size: 0, color: "FFFFFF" },
  left: { style: "none", size: 0, color: "FFFFFF" },
  right: { style: "none", size: 0, color: "FFFFFF" },
  insideHorizontal: { style: "none", size: 0, color: "FFFFFF" },
  insideVertical: { style: "none", size: 0, color: "FFFFFF" },
} as const;

const DOCX_FONT = "Times New Roman";
const DOCX_TEXT_COLOR = "000000";
const DOCX_SIZE_BODY = 24;
const DOCX_SIZE_HEADING = 28;
const DOCX_SIZE_HEADER_FOOTER = 28;
const DOCX_NO_COLUMN_WIDTH = 520;
const DOCX_LABEL_COLUMN_WIDTH = 2166;
const DOCX_SEPARATOR_COLUMN_WIDTH = 220;
const DOCX_VALUE_COLUMN_WIDTH = 5334;
type ParagraphOptions = IParagraphOptions;
type ImageRunExtras = {
  floating?: IFloating;
  paragraph?: ParagraphOptions;
};

const createTextRun = (
  text: string,
  options?: ConstructorParameters<typeof TextRun>[0],
) =>
  new TextRun({
    text,
    font: DOCX_FONT,
    color: DOCX_TEXT_COLOR,
    size: DOCX_SIZE_BODY,
    ...(options && typeof options === "object" ? options : {}),
  });

const paragraph = (text: string, options?: ParagraphOptions) => {
  const config = {
    children: [createTextRun(text)],
  } as ParagraphOptions;

  if (options && typeof options === "object") {
    Object.assign(config, options);
  }

  return new Paragraph(config);
};

const paragraphWithLineBreaks = (text: string, options?: ParagraphOptions) => {
  const lines = (text || "").split(/\r?\n/);
  const children = lines.flatMap((line, index) =>
    index === 0
      ? [createTextRun(line)]
      : [createTextRun("", { break: 1 }), createTextRun(line)],
  );

  const config = {
    children,
  } as ParagraphOptions;

  if (options && typeof options === "object") {
    Object.assign(config, options);
  }

  return new Paragraph(config);
};

const headingParagraph = (text: string, options?: ParagraphOptions) => {
  const config = {
    ...(options && typeof options === "object" ? options : {}),
    children: [
      createTextRun(text, {
        bold: true,
        size: DOCX_SIZE_HEADING,
      }),
    ],
  } as ParagraphOptions;

  return paragraph(text, config);
};

const boldParagraph = (text: string, options?: ParagraphOptions) => {
  const config = {
    ...(options && typeof options === "object" ? options : {}),
    children: [
      createTextRun(text, {
        bold: true,
      }),
    ],
  } as ParagraphOptions;

  return paragraph(text, config);
};

const headerFooterParagraph = (text: string, options?: ParagraphOptions) => {
  const config = {
    ...(options && typeof options === "object" ? options : {}),
    children: [
      createTextRun(text, {
        bold: true,
        size: DOCX_SIZE_HEADER_FOOTER,
      }),
    ],
  } as ParagraphOptions;

  return paragraph(text, config);
};

const createReportHeader = (title?: string) =>
  new Header({
    children: [
      headerFooterParagraph(title || "-", {
        alignment: AlignmentType.CENTER,
      }),
    ],
  });

const createCoverFooter = (dissemination: Dissemination) =>
  new Footer({
    children: [
      headerFooterParagraph(
        `BALAI PERTANIAN (BPP) ${dissemination.district?.toUpperCase() || "-"}`,
        {
          alignment: AlignmentType.CENTER,
        },
      ),
      headerFooterParagraph(getKabupatenLabel(dissemination.city), {
        alignment: AlignmentType.CENTER,
      }),
      headerFooterParagraph(formatYear(dissemination.date), {
        alignment: AlignmentType.CENTER,
      }),
    ],
  });

const createDefaultFooter = () =>
  new Footer({
    children: [paragraph("")],
  });

const reportTableRow = (
  no: string,
  label: string,
  value?: string,
  options?: { indent?: number; justify?: boolean },
) =>
  new TableRow({
    children: [
      new TableCell({
        borders: noBorders,
        width: { size: DOCX_NO_COLUMN_WIDTH, type: WidthType.DXA },
        margins: { top: 20, bottom: 20 },
        children: [paragraph(no, { indent: { left: options?.indent || 0 } })],
      }),
      new TableCell({
        borders: noBorders,
        width: { size: DOCX_LABEL_COLUMN_WIDTH, type: WidthType.DXA },
        margins: { top: 20, bottom: 20 },
        children: [paragraph(label)],
      }),
      new TableCell({
        borders: noBorders,
        width: { size: DOCX_SEPARATOR_COLUMN_WIDTH, type: WidthType.DXA },
        margins: { top: 20, bottom: 20 },
        children: [paragraph(value !== undefined ? ":" : "")],
      }),
      new TableCell({
        borders: noBorders,
        width: { size: DOCX_VALUE_COLUMN_WIDTH, type: WidthType.DXA },
        margins: { top: 20, bottom: 20 },
        children: [
          paragraphWithLineBreaks(value || "", {
            alignment: options?.justify
              ? AlignmentType.JUSTIFIED
              : AlignmentType.LEFT,
          }),
        ],
      }),
    ],
  });

const getImageType = (contentType?: string | null, url?: string) => {
  const normalizedType = (contentType || "").toLowerCase();
  const normalizedUrl = (url || "").toLowerCase();

  if (normalizedType.includes("png") || normalizedUrl.endsWith(".png")) {
    return "png" as const;
  }

  if (
    normalizedType.includes("jpg") ||
    normalizedType.includes("jpeg") ||
    normalizedUrl.endsWith(".jpg") ||
    normalizedUrl.endsWith(".jpeg")
  ) {
    return "jpg" as const;
  }

  if (normalizedType.includes("gif") || normalizedUrl.endsWith(".gif")) {
    return "gif" as const;
  }

  if (normalizedType.includes("bmp") || normalizedUrl.endsWith(".bmp")) {
    return "bmp" as const;
  }

  return "png" as const;
};

const fetchImageBuffer = async (url?: string) => {
  if (!url) return null;

  try {
    const response = await fetch(url);
    if (!response.ok) return null;
    return {
      data: await response.arrayBuffer(),
      type: getImageType(response.headers.get("content-type"), url),
    };
  } catch {
    return null;
  }
};

const createImageParagraph = async (
  url: string | undefined,
  width: number,
  height: number,
  fallbackText: string,
  imageOptions?: ImageRunExtras,
) => {
  const imageBuffer = await fetchImageBuffer(url);

  if (!imageBuffer) {
    return paragraph(fallbackText, {
      alignment: AlignmentType.CENTER,
      ...(imageOptions?.paragraph || {}),
    });
  }

  return new Paragraph({
    alignment: AlignmentType.CENTER,
    ...(imageOptions?.paragraph || {}),
    children: [
      new ImageRun({
        data: imageBuffer.data,
        type: imageBuffer.type,
        transformation: { width, height },
        ...(imageOptions?.floating
          ? {
              floating: imageOptions.floating,
            }
          : {}),
      }),
    ],
  });
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
                  data: imageBuffer.data,
                  type: imageBuffer.type,
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
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
        });
      }),
    );

    if (imageRuns.length === 1) {
      imageRuns.push(
        new TableCell({
          width: { size: 50, type: WidthType.PERCENTAGE },
          children: [new Paragraph("")],
          margins: { top: 80, bottom: 80, left: 80, right: 80 },
        }),
      );
    }

    sections.push(
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        borders: noBorders,
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
  const coverLogoParagraph = await createImageParagraph(
    logoImage,
    170,
    170,
    "BPP",
  );
  const coordinatorSignatureParagraph = await createImageParagraph(
    signatureImage,
    180,
    150,
    "Tanda tangan",
    {
      paragraph: {
        alignment: AlignmentType.LEFT,
      },
      floating: {
        allowOverlap: true,
        behindDocument: false,
        layoutInCell: true,
        horizontalPosition: {
          relative: HorizontalPositionRelativeFrom.COLUMN,
          offset: 300000,
        },
        verticalPosition: {
          relative: VerticalPositionRelativeFrom.PARAGRAPH,
          offset: 57200,
        },
        wrap: {
          type: TextWrappingType.NONE,
        },
      },
    },
  );
  const userSignatureParagraph = await createImageParagraph(
    userSignatureImage,
    65,
    95,
    "Tanda tangan",
    {
      paragraph: {
        alignment: AlignmentType.CENTER,
      },
      floating: {
        allowOverlap: true,
        behindDocument: false,
        layoutInCell: true,
        horizontalPosition: {
          relative: HorizontalPositionRelativeFrom.COLUMN,
          offset: 900000,
        },
        verticalPosition: {
          relative: VerticalPositionRelativeFrom.PARAGRAPH,
          offset: 57200,
        },
        wrap: {
          type: TextWrappingType.NONE,
        },
      },
    },
  );

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: pageMargins,
            size: {
              orientation: PageOrientation.PORTRAIT,
            },
          },
        },
        headers: {
          default: createReportHeader(dissemination.title),
        },
        footers: {
          default: createCoverFooter(dissemination),
        },
        children: [
          paragraph(
            `WILAYAH BINAAN DESA ${toUpperSafe(dissemination.village)}`,
            {
              alignment: AlignmentType.CENTER,
              spacing: { before: 1600, after: 120 },
            },
          ),
          paragraph(`KECAMATAN ${toUpperSafe(dissemination.district)}`, {
            alignment: AlignmentType.CENTER,
            spacing: { after: 620 },
          }),
          paragraph(`BULAN: ${formatMonthYear(dissemination.date)}`, {
            alignment: AlignmentType.CENTER,
            spacing: { after: 1800 },
          }),
          coverLogoParagraph,
          paragraph("", {
            spacing: { after: 900 },
          }),
          paragraph("Disusun Oleh :", {
            alignment: AlignmentType.CENTER,
            spacing: { after: 120 },
          }),
          boldParagraph((dissemination.user?.name || "-").toUpperCase(), {
            alignment: AlignmentType.CENTER,
          }),
          boldParagraph(`NIP. ${dissemination.user?.employee_id || "-"}`, {
            alignment: AlignmentType.CENTER,
            spacing: { after: 1600 },
          }),
        ],
      },
      ...details.map((detail) => ({
        properties: {
          page: {
            margin: pageMargins,
            size: {
              orientation: PageOrientation.PORTRAIT,
            },
          },
        },
        headers: {
          default: createReportHeader(dissemination.title),
        },
        footers: {
          default: createDefaultFooter(),
        },
        children: [
          paragraph(" ", {
            spacing: { after: 720 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            layout: TableLayoutType.FIXED,
            columnWidths: [
              DOCX_NO_COLUMN_WIDTH,
              DOCX_LABEL_COLUMN_WIDTH,
              DOCX_SEPARATOR_COLUMN_WIDTH,
              DOCX_VALUE_COLUMN_WIDTH,
            ],
            borders: noBorders,
            rows: [
              reportTableRow("1.", "Penyuluh Pertanian"),
              reportTableRow(
                "a.",
                "Nama/ NIP",
                `${(dissemination.user?.name || "-").toUpperCase()}\nNIP. ${dissemination.user?.employee_id || "-"}`,
                { indent: 220 },
              ),
              reportTableRow("b.", "Pangkat/ Golongan", "-", { indent: 220 }),
              reportTableRow("c.", "Jabatan", "Penyuluh Pertanian Mahir", {
                indent: 220,
              }),
              reportTableRow("2.", "Dasar Pelaksanaan", detail.basis || "-"),
              reportTableRow("3.", "Materi Diseminasi", detail.material || "-"),
              reportTableRow("4.", "Pelaksanaan Kegiatan"),
              reportTableRow(
                "a.",
                "Waktu Pelaksanaan",
                formatFullDate(detail.date),
                {
                  indent: 220,
                },
              ),
              reportTableRow("b.", "Tempat/Lokasi", detail.location || "-", {
                indent: 220,
              }),
              reportTableRow("c.", "Metode", detail.methode || "-", {
                indent: 220,
              }),
              reportTableRow("d.", "Peserta", detail.participants || "-", {
                indent: 220,
              }),
              reportTableRow("5.", "Hasil Kegiatan", detail.result || "-", {
                justify: true,
              }),
            ],
          }),
          paragraph("", { spacing: { after: 480 } }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            borders: noBorders,
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    borders: noBorders,
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      paragraph("Mengetahui", {
                        alignment: AlignmentType.CENTER,
                      }),
                      paragraph(getCoordinatorTitle(dissemination.district), {
                        alignment: AlignmentType.CENTER,
                      }),
                      coordinatorSignatureParagraph,
                      boldParagraph(REPORT_COORDINATOR_FALLBACK, {
                        alignment: AlignmentType.CENTER,
                        spacing: {
                          before: -180,
                        },
                      }),
                      boldParagraph(`NIP. ${REPORT_COORDINATOR_NIP_FALLBACK}`, {
                        alignment: AlignmentType.CENTER,
                        spacing: {
                          before: -60,
                        },
                      }),
                    ],
                  }),
                  new TableCell({
                    borders: noBorders,
                    width: { size: 50, type: WidthType.PERCENTAGE },
                    children: [
                      paragraph(
                        getPreparedLocationDate(
                          dissemination.village,
                          detail.date,
                        ),
                        {
                          alignment: AlignmentType.CENTER,
                        },
                      ),
                      paragraph("Penyuluh Pertanian", {
                        alignment: AlignmentType.CENTER,
                      }),
                      userSignatureParagraph,
                      boldParagraph(
                        (dissemination.user?.name || "-").toUpperCase(),
                        {
                          alignment: AlignmentType.CENTER,
                          spacing: {
                            before: -220,
                          },
                        },
                      ),
                      boldParagraph(
                        `NIP. ${dissemination.user?.employee_id || "-"}`,
                        {
                          alignment: AlignmentType.CENTER,
                          spacing: {
                            before: -60,
                          },
                        },
                      ),
                    ],
                  }),
                ],
              }),
            ],
          }),
        ],
      })),
      {
        properties: {
          page: {
            margin: pageMargins,
            size: {
              orientation: PageOrientation.PORTRAIT,
            },
          },
        },
        headers: {
          default: createReportHeader(dissemination.title),
        },
        footers: {
          default: createDefaultFooter(),
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
