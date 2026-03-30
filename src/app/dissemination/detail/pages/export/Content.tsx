import { Component, For } from "solid-js";
import type { Dissemination } from "../../../type/dissemination";
import type { DisseminationDetail } from "../../type/dissemination-detail";
import { formatFullDate, REPORT_TITLE } from "./report.utils";

interface ContentProps {
  dissemination: Dissemination;
  details: DisseminationDetail[];
}

const Content: Component<ContentProps> = (props) => {
  return (
    <For each={props.details}>
      {(detail, index) => (
        <section class={`report-page report-content${index() < props.details.length - 1 ? " page-break" : ""}`}>
          <h2>{REPORT_TITLE}</h2>

          <div class="report-content-body">
            <div class="report-row">
              <span class="report-no">1.</span>
              <span class="report-label">Penyuluh Pertanian</span>
            </div>

            <div class="report-subrow">
              <span class="report-subno">a.</span>
              <span class="report-label">Nama / NIP</span>
              <span class="report-sep">:</span>
              <span class="report-value">
                {props.dissemination.user?.name || "-"}
                <br />
                NIP. {props.dissemination.user?.employee_id || "-"}
              </span>
            </div>

            <div class="report-subrow">
              <span class="report-subno">b.</span>
              <span class="report-label">Jabatan</span>
              <span class="report-sep">:</span>
              <span class="report-value">Penyuluh Pertanian</span>
            </div>

            <div class="report-row report-row-multi">
              <span class="report-no">2.</span>
              <span class="report-label">Dasar Pelaksanaan</span>
              <span class="report-sep">:</span>
              <span class="report-value">{detail.basis || "-"}</span>
            </div>

            <div class="report-row report-row-multi">
              <span class="report-no">3.</span>
              <span class="report-label">Materi Diseminasi</span>
              <span class="report-sep">:</span>
              <span class="report-value">{detail.material || "-"}</span>
            </div>

            <div class="report-row">
              <span class="report-no">4.</span>
              <span class="report-label">Pelaksanaan Kegiatan</span>
            </div>

            <div class="report-subrow">
              <span class="report-subno">a.</span>
              <span class="report-label">Waktu Pelaksanaan</span>
              <span class="report-sep">:</span>
              <span class="report-value">{formatFullDate(detail.date)}</span>
            </div>

            <div class="report-subrow">
              <span class="report-subno">b.</span>
              <span class="report-label">Tempat / Lokasi</span>
              <span class="report-sep">:</span>
              <span class="report-value">{detail.location || "-"}</span>
            </div>

            <div class="report-subrow">
              <span class="report-subno">c.</span>
              <span class="report-label">Metode</span>
              <span class="report-sep">:</span>
              <span class="report-value">{detail.methode || "-"}</span>
            </div>

            <div class="report-subrow">
              <span class="report-subno">d.</span>
              <span class="report-label">Peserta</span>
              <span class="report-sep">:</span>
              <span class="report-value">{detail.participants || "-"}</span>
            </div>

            <div class="report-row report-row-multi">
              <span class="report-no">5.</span>
              <span class="report-label">Hasil Kegiatan</span>
              <span class="report-sep">:</span>
              <span class="report-value">{detail.result || "-"}</span>
            </div>

            <div class="report-signatures">
              <div class="report-signature-card">
                <p>{`${props.dissemination.village || "-"}, ${formatFullDate(detail.date)}`}</p>
                <p>Penyuluh Pertanian</p>
                <div class="report-signature-space">
                  {props.dissemination.user?.signature_image ? (
                    <img
                      src={props.dissemination.user.signature_image}
                      alt={props.dissemination.user?.name || "Signature"}
                    />
                  ) : null}
                </div>
                <strong>{props.dissemination.user?.name || "-"}</strong>
                <span>NIP. {props.dissemination.user?.employee_id || "-"}</span>
              </div>
            </div>
          </div>
        </section>
      )}
    </For>
  );
};

export default Content;
