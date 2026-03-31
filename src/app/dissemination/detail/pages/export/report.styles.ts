export const reportStyles = `
  @page {
    size: A4;
    margin: 12mm;
  }

  body {
    background: #f3f4f6;
  }

  .report-shell {
    min-height: 100vh;
    padding: 24px 0 48px;
    background: #f3f4f6;
  }

  .report-toolbar {
    width: min(210mm, calc(100vw - 32px));
    margin: 0 auto 16px;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }

  .report-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 10px 18px;
    border-radius: 10px;
    border: 1px solid #d1d5db;
    background: #fff;
    color: #111827;
    font: 600 14px var(--font, Arial, sans-serif);
    cursor: pointer;
    text-decoration: none;
  }

  .report-page {
    width: 210mm;
    min-height: 297mm;
    margin: 0 auto;
    background: #fff;
    color: #000;
    box-shadow: 0 14px 32px rgba(15, 23, 42, 0.12);
    box-sizing: border-box;
    font-family: "Times New Roman", Times, serif;
  }

  .report-page + .report-page {
    margin-top: 18px;
  }

  .report-cover {
    padding: 18mm 20mm 16mm;
  }

  .report-cover-inner {
    min-height: calc(297mm - 34mm);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }

  .report-cover-head h1,
  .report-content h2 {
    font-size: 16pt;
    font-weight: 700;
    line-height: 1.35;
    text-align: center;
    text-transform: uppercase;
  }

  .report-content h2 {
    margin: 0;
  }

  .report-cover-location {
    margin-top: 38px;
    font-size: 13pt;
    line-height: 1.9;
    text-transform: uppercase;
  }

  .report-cover-month {
    margin-top: 34px;
    font-size: 13pt;
    font-weight: 700;
  }

  .report-cover-logo-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 20px 0;
  }

  .report-cover-logo {
    width: 170px;
    height: 170px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .report-cover-logo-ring {
    width: 148px;
    height: 148px;
    border-radius: 999px;
    border: 6px solid #c99200;
    background: radial-gradient(circle at center, #fff26a 0%, #ffe033 62%, #ffb800 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 0 6px #d64b00, inset 0 0 0 18px #ffe933;
  }

  .report-cover-logo-center {
    width: 94px;
    height: 94px;
    border-radius: 999px;
    border: 3px solid #1ea64a;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #159947;
  }

  .report-cover-logo-leaf {
    font-size: 22pt;
    font-weight: 700;
    letter-spacing: 0.08em;
  }

  .report-cover-author {
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12pt;
  }

  .report-cover-author strong,
  .report-cover-footer p {
    font-weight: 700;
  }

  .report-cover-author strong {
    text-transform: uppercase;
    text-decoration: underline;
  }

  .report-cover-footer {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 14pt;
    text-transform: uppercase;
  }

  .report-content {
    padding: 16mm 20mm 16mm;
  }

  .report-content-body {
    margin-top: 56px;
    font-size: 12pt;
    line-height: 1.28;
  }

  .report-rows {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .report-row {
    display: grid;
    grid-template-columns: 22px 165px 12px minmax(0, 1fr);
    align-items: start;
    column-gap: 10px;
    margin-bottom: 1px;
  }

  .report-row-sub {
    margin-left: 0;
  }

  .report-row-sub .report-col-no {
    padding-left: 18px;
    box-sizing: border-box;
  }

  .report-col-no,
  .report-col-label,
  .report-col-sep,
  .report-col-value {
    font-size: 12pt;
  }

  .report-col-value {
    white-space: pre-line;
  }

  .report-col-value-justify {
    text-align: justify;
  }

  .report-signature-grid {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    gap: 30px;
    margin-top: 38px;
    align-items: end;
  }

  .report-signature-block {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    min-height: 170px;
    justify-content: flex-end;
  }

  .report-signature-block p,
  .report-signature-block strong,
  .report-signature-block span {
    font-size: 12pt;
  }

  .report-signature-block strong {
    font-weight: 700;
    text-transform: uppercase;
    text-decoration: underline;
  }

  .report-signature-block-left {
    align-items: flex-start;
    padding-left: 12px;
  }

  .report-signature-block-left p,
  .report-signature-block-left strong,
  .report-signature-block-left span {
    width: 100%;
    text-align: center;
  }

  .report-stamp-wrap {
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8px 0;
  }

  .report-stamp-circle {
    width: 96px;
    height: 96px;
    border-radius: 999px;
    border: 3px solid #4f46e5;
    color: #4f46e5;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16pt;
    font-weight: 700;
    opacity: 0.75;
    transform: rotate(-12deg);
  }

  .report-signature-space {
    height: 96px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 8px 0;
  }

  .report-signature-space img {
    max-height: 88px;
    max-width: 180px;
    object-fit: contain;
  }

  .report-signature-space-left {
    position: relative;
    width: 100%;
    height: 150px;
    justify-content: flex-start;
    margin: 0 0 -40px;
  }

  .report-signature-space-left img {
    max-width: 190px;
    max-height: 190px;
    margin-left: 5px;
    object-fit: contain;
    position: relative;
    z-index: 2;
  }

  .report-signature-name-left {
    position: relative;
    z-index: 1;
  }

  .report-signature-placeholder {
    width: 110px;
    height: 46px;
    border-bottom: 2px solid #111;
  }

  .report-attachment {
    padding: 8mm 20mm 18mm;
  }

  .report-attachment h2 {
    font-size: 16pt;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    margin: 0;
  }

  .report-attachment-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 8px;
    margin-top: 32px;
    align-items: start;
  }

  .report-attachment-item {
    margin: 0;
  }

  .report-attachment-image-frame {
    width: 100%;
    height: 132px;
    border: 1px solid #4b5563;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: #fff;
  }

  .report-attachment-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .report-attachment-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #f8f8f8;
    color: #6b7280;
    font-size: 11pt;
    text-align: center;
    padding: 12px;
    box-sizing: border-box;
  }

  .report-attachment-item figcaption {
    margin-top: 6px;
    font-size: 12pt;
  }

  @media print {
    body {
      background: #fff;
    }

    .report-shell {
      padding: 0;
      background: #fff;
    }

    .report-toolbar {
      display: none !important;
    }

    .report-page {
      margin: 0;
      width: auto;
      min-height: auto;
      box-shadow: none;
    }

    .report-page + .report-page {
      margin-top: 0;
    }
  }
`;
