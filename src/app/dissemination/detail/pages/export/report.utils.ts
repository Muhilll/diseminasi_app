import type { Dissemination } from "../../../type/dissemination";
import type { DisseminationDetail } from "../../type/dissemination-detail";

export const REPORT_TITLE = "LAPORAN KEGIATAN DISEMINASI INFORMASI PERTANIAN";

export const formatMonthYear = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
};

export const formatYear = (value?: string) => {
  if (!value) return String(new Date().getFullYear());

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(new Date().getFullYear());

  return String(date.getFullYear());
};

export const formatFullDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export const formatShortDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "2-digit",
    year: "numeric",
  });
};

export const sanitizeFileName = (value: string) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "laporan-diseminasi";

export const createReportFileName = (
  dissemination: Dissemination,
  extension: "pdf" | "docx",
) => `${sanitizeFileName(dissemination.title || "laporan-diseminasi")}.${extension}`;

export const getImageDetails = (details: DisseminationDetail[]) =>
  details.filter((detail) => Boolean(detail.image));

export const chunkItems = <T,>(items: T[], size: number) => {
  const result: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
};
