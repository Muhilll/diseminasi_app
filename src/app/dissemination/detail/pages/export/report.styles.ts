export const reportStyles = `
  @page {
    size: A4;
    margin: 18mm 16mm 18mm 16mm;
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
    margin: 0 auto 18px;
    background: #fff;
    color: #000;
    box-shadow: 0 14px 32px rgba(15, 23, 42, 0.12);
    box-sizing: border-box;
  }

  .report-cover {
    padding: 28mm 22mm 24mm;
  }

  .report-cover-inner {
    min-height: calc(297mm - 52mm);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    text-align: center;
  }

  .report-cover-head h1,
  .report-content h2 {
    font-size: 18px;
    font-weight: 700;
    line-height: 1.45;
    text-align: center;
  }

  .report-cover-location {
    margin-top: 34px;
    font-size: 15px;
    line-height: 1.8;
  }

  .report-cover-month {
    margin-top: 34px;
    font-size: 15px;
    font-weight: 700;
  }

  .report-cover-logo-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .report-cover-logo {
    width: 138px;
    height: 138px;
    border-radius: 999px;
    border: 6px solid #d4a100;
    background: radial-gradient(circle at center, #ffee37 0%, #ffd700 70%, #f4c400 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #0f766e;
    font-size: 28px;
    font-weight: 800;
    letter-spacing: 0.08em;
  }

  .report-cover-author {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 15px;
  }

  .report-cover-author strong,
  .report-cover-footer p {
    font-weight: 700;
  }

  .report-cover-footer {
    display: flex;
    flex-direction: column;
    gap: 8px;
    font-size: 15px;
  }

  .report-content {
    padding: 24mm 20mm 22mm;
  }

  .report-content-body {
    margin-top: 32px;
    font-size: 14px;
    line-height: 1.45;
  }

  .report-row,
  .report-subrow {
    display: grid;
    align-items: start;
    gap: 8px;
    margin-bottom: 8px;
  }

  .report-row {
    grid-template-columns: 28px 180px 12px minmax(0, 1fr);
  }

  .report-row .report-label {
    grid-column: 2;
  }

  .report-row .report-sep {
    grid-column: 3;
  }

  .report-row .report-value {
    grid-column: 4;
  }

  .report-row:not(.report-row-multi) .report-sep,
  .report-row:not(.report-row-multi) .report-value {
    display: none;
  }

  .report-subrow {
    grid-template-columns: 46px 160px 12px minmax(0, 1fr);
    margin-left: 18px;
  }

  .report-value {
    text-align: justify;
    white-space: pre-line;
  }

  .report-image-block {
    margin-top: 18px;
  }

  .report-image-block p {
    margin-bottom: 8px;
    font-weight: 700;
  }

  .report-image-block img {
    max-width: 100%;
    max-height: 280px;
    object-fit: contain;
    border: 1px solid #d1d5db;
  }

  .report-signatures {
    display: flex;
    justify-content: flex-end;
    margin-top: 36px;
  }

  .report-attachment {
    padding: 30mm 20mm 24mm;
  }

  .report-attachment h2 {
    font-size: 18px;
    font-weight: 700;
    text-align: center;
  }

  .report-attachment-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12mm 8mm;
    margin-top: 22mm;
  }

  .report-attachment-item {
    margin: 0;
  }

  .report-attachment-item img {
    width: 100%;
    height: 58mm;
    object-fit: cover;
    border: 1px solid #7a7a7a;
  }

  .report-attachment-item figcaption {
    margin-top: 6px;
    font-size: 14px;
  }

  .report-signature-card {
    width: 260px;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 4px;
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

  .page-break {
    page-break-after: always;
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
  }
`;
