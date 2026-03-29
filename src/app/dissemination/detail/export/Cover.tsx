import { Component } from "solid-js";
import type { Dissemination } from "../../services/types";

interface CoverProps {
  dissemination: Dissemination;
}

const formatMonthYear = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("id-ID", {
    month: "long",
    year: "numeric",
  });
};

const formatYear = (value?: string) => {
  if (!value) return new Date().getFullYear();

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return new Date().getFullYear();
  return date.getFullYear();
};

const Cover: Component<CoverProps> = (props) => {
  return (
    <section class="report-page report-cover page-break">
      <div class="report-cover-inner">
        <div class="report-cover-head">
          <h1>LAPORAN KEGIATAN DISEMINASI INFORMASI PERTANIAN</h1>

          <div class="report-cover-location">
            <p>WILAYAH BINAAN DESA {props.dissemination.village || "-"}</p>
            <p>KECAMATAN {props.dissemination.district || "-"}</p>
          </div>

          <p class="report-cover-month">
            BULAN: {formatMonthYear(props.dissemination.date)}
          </p>
        </div>

        <div class="report-cover-logo-wrap">
          <div class="report-cover-logo">BPP</div>
        </div>

        <div class="report-cover-author">
          <p>Disusun Oleh :</p>
          <strong>{props.dissemination.user?.name || "-"}</strong>
          <span>
            NIP. {props.dissemination.user?.employee_id || "-"}
          </span>
        </div>

        <div class="report-cover-footer">
          <p>BALAI PENYULUHAN PERTANIAN (BPP)</p>
          <p>{(props.dissemination.city || "-").toUpperCase()}</p>
          <p>{formatYear(props.dissemination.date)}</p>
        </div>
      </div>
    </section>
  );
};

export default Cover;
