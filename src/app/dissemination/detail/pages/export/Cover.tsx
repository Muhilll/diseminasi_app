import { Component } from "solid-js";
import type { Dissemination } from "../../../type/dissemination";
import { formatMonthYear, formatYear, REPORT_TITLE } from "./report.utils";

interface CoverProps {
  dissemination: Dissemination;
}

const Cover: Component<CoverProps> = (props) => {
  return (
    <section class="report-page report-cover page-break">
      <div class="report-cover-inner">
        <div class="report-cover-head">
          <h1>{REPORT_TITLE}</h1>

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
          <span>NIP. {props.dissemination.user?.employee_id || "-"}</span>
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
