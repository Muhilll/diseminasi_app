import type { Dissemination } from "../../../type/dissemination";
import type { DisseminationDetail } from "../../type/dissemination-detail";

export const REPORT_COORDINATOR_FALLBACK = "DEMMA LIMBO. SP";
export const REPORT_COORDINATOR_NIP_FALLBACK = "197108022007011019";

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

export const formatLongDateNoWeekday = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
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

export const toUpperSafe = (value?: string) => (value || "-").toUpperCase();

export const getKabupatenLabel = (value?: string) => {
  const city = (value || "-").trim();
  if (!city || city === "-") return "KABUPATEN -";

  const normalized = city.toLowerCase();
  if (normalized.startsWith("kabupaten ") || normalized.startsWith("kota ")) {
    return city.toUpperCase();
  }

  return `KABUPATEN ${city.toUpperCase()}`;
};

export const getCoordinatorTitle = (district?: string) =>
  `Koordinator BPP Kec. ${district || "-"}`;

export const getPreparedLocationDate = (
  village?: string,
  date?: string,
) => `${village || "-"}, ${formatLongDateNoWeekday(date)}`;

export const getImageDetails = (details: DisseminationDetail[]) => details;

export const chunkItems = <T,>(items: T[], size: number) => {
  const result: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
};
