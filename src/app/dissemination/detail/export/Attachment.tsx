import { Component, For } from "solid-js";
import type { DisseminationDetail } from "../services/types";

interface AttachmentProps {
  details: DisseminationDetail[];
}

const formatShortDate = (value?: string) => {
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

const chunkItems = <T,>(items: T[], size: number) => {
  const result: T[][] = [];

  for (let index = 0; index < items.length; index += size) {
    result.push(items.slice(index, index + size));
  }

  return result;
};

const Attachment: Component<AttachmentProps> = (props) => {
  const imageDetails = () => props.details.filter((detail) => detail.image);
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
