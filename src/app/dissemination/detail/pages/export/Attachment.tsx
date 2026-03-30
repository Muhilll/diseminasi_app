import { Component, For } from "solid-js";
import type { DisseminationDetail } from "../../type/dissemination-detail";
import { chunkItems, formatShortDate, getImageDetails } from "./report.utils";

interface AttachmentProps {
  details: DisseminationDetail[];
}

const Attachment: Component<AttachmentProps> = (props) => {
  const imageDetails = () => getImageDetails(props.details);
  const pages = () => chunkItems(imageDetails(), 2);

  return (
    <>
      <For each={pages()}>
        {(pageItems, index) => (
          <section
            class={`report-page report-attachment${
              index() < pages().length - 1 ? " page-break" : ""
            }`}
          >
            <h2>DOKUMENTASI KEGIATAN</h2>

            <div class="report-attachment-grid">
              <For each={pageItems}>
                {(detail) => (
                  <figure class="report-attachment-item">
                    <img src={detail.image} alt={detail.material || "Dokumentasi"} />
                    <figcaption>{formatShortDate(detail.date)}</figcaption>
                  </figure>
                )}
              </For>
            </div>
          </section>
        )}
      </For>
    </>
  );
};

export default Attachment;
