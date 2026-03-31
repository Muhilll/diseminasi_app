import { Component } from "solid-js";
import logoImage from "../../../../../assets/dissemination/logo.png";
import type { Dissemination } from "../../../type/dissemination";
import {
  formatMonthYear,
  formatYear,
  getKabupatenLabel,
  toUpperSafe,
} from "./report.utils";

interface CoverProps {
  dissemination: Dissemination;
}

const Cover: Component<CoverProps> = (props) => {
  return (
    <section class="report-page report-cover">
      <div class="report-cover-inner">
        <div class="report-cover-head">
          <h1>{props.dissemination.title || "-"}</h1>

          <div class="report-cover-location">
            <p>WILAYAH BINAAN DESA {toUpperSafe(props.dissemination.village || "-")}</p>
            <p>KECAMATAN {toUpperSafe(props.dissemination.district || "-")}</p>
          </div>

          <p class="report-cover-month">
            BULAN: {formatMonthYear(props.dissemination.date)}
          </p>
        </div>

        <div class="report-cover-logo-wrap">
          <img class="report-cover-logo" src={logoImage} alt="Logo BPP" />
        </div>

        <div class="report-cover-author">
          <p>Disusun Oleh :</p>
          <strong>{(props.dissemination.user?.name || "-").toUpperCase()}</strong>
          <span>NIP. {props.dissemination.user?.employee_id || "-"}</span>
        </div>

        <div class="report-cover-footer">
          <p>BALAI PERTANIAN (BPP) {props.dissemination.district?.toUpperCase() || "-"}</p>
          <p>{getKabupatenLabel(props.dissemination.city)}</p>
          <p>{formatYear(props.dissemination.date)}</p>
        </div>
      </div>
    </section>
  );
};

export default Cover;
