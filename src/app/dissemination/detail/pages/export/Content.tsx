import { Component, For } from "solid-js";
import signatureImage from "../../../../../assets/dissemination/signature.png";
import userSignatureImage from "../../../../../assets/dissemination/user_signature.png";
import type { Dissemination } from "../../../type/dissemination";
import type { DisseminationDetail } from "../../type/dissemination-detail";
import {
  formatFullDate,
  getCoordinatorTitle,
  getPreparedLocationDate,
  REPORT_COORDINATOR_FALLBACK,
  REPORT_COORDINATOR_NIP_FALLBACK,
} from "./report.utils";

interface ContentProps {
  dissemination: Dissemination;
  details: DisseminationDetail[];
}

const Content: Component<ContentProps> = (props) => {
  return (
    <For each={props.details}>
      {(detail, index) => (
        <section class="report-page report-content">
          <h2>{props.dissemination.title || "-"}</h2>

          <div class="report-content-body">
            <div class="report-rows">
              <div class="report-row">
                <div class="report-col-no">1.</div>
                <div class="report-col-label">Penyuluh Pertanian</div>
                <div class="report-col-sep"></div>
                <div class="report-col-value"></div>
              </div>

              <div class="report-row report-row-sub">
                <div class="report-col-no">a.</div>
                <div class="report-col-label">Nama/ NIP</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value">
                  {(props.dissemination.user?.name || "-").toUpperCase()}
                  <br />
                  NIP. {props.dissemination.user?.employee_id || "-"}
                </div>
              </div>

              <div class="report-row report-row-sub">
                <div class="report-col-no">b.</div>
                <div class="report-col-label">Pangkat/ Golongan</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value">-</div>
              </div>

              <div class="report-row report-row-sub">
                <div class="report-col-no">c.</div>
                <div class="report-col-label">Jabatan</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value">Penyuluh Pertanian Mahir</div>
              </div>

              <div class="report-row">
                <div class="report-col-no">2.</div>
                <div class="report-col-label">Dasar Pelaksanaan</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value">{detail.basis || "-"}</div>
              </div>

              <div class="report-row">
                <div class="report-col-no">3.</div>
                <div class="report-col-label">Materi Diseminasi</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value">{detail.material || "-"}</div>
              </div>

              <div class="report-row">
                <div class="report-col-no">4.</div>
                <div class="report-col-label">Pelaksanaan Kegiatan</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value"></div>
              </div>

              <div class="report-row report-row-sub">
                <div class="report-col-no">a.</div>
                <div class="report-col-label">Waktu Pelaksanaan</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value">{formatFullDate(detail.date)}</div>
              </div>

              <div class="report-row report-row-sub">
                <div class="report-col-no">b.</div>
                <div class="report-col-label">Tempat/Lokasi</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value">{detail.location || "-"}</div>
              </div>

              <div class="report-row report-row-sub">
                <div class="report-col-no">c.</div>
                <div class="report-col-label">Metode</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value">{detail.methode || "-"}</div>
              </div>

              <div class="report-row report-row-sub">
                <div class="report-col-no">d.</div>
                <div class="report-col-label">Peserta</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value">{detail.participants || "-"}</div>
              </div>

              <div class="report-row">
                <div class="report-col-no">5.</div>
                <div class="report-col-label">Hasil Kegiatan</div>
                <div class="report-col-sep">:</div>
                <div class="report-col-value report-col-value-justify">{detail.result || "-"}</div>
              </div>
            </div>

            <div class="report-signature-grid">
              <div class="report-signature-block report-signature-block-left">
                <p>Mengetahui</p>
                <p>{getCoordinatorTitle(props.dissemination.district)}</p>
                <div class="report-signature-space report-signature-space-left">
                  <img src={signatureImage} alt="Coordinator Signature" />
                </div>
                <strong class="report-signature-name-left">{REPORT_COORDINATOR_FALLBACK}</strong>
                <span>NIP. {REPORT_COORDINATOR_NIP_FALLBACK}</span>
              </div>

              <div class="report-signature-block report-signature-block-right">
                <p>{getPreparedLocationDate(props.dissemination.village, detail.date)}</p>
                <p>Penyuluh Pertanian</p>
                <div class="report-signature-space">
                  <img
                    src={userSignatureImage}
                    alt={props.dissemination.user?.name || "Signature"}
                  />
                </div>
                <strong>{(props.dissemination.user?.name || "-").toUpperCase()}</strong>
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
