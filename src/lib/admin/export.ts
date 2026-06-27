/** Utilitários de exportação client-side — sem dependências externas. */

type Row = Record<string, string | number | null | undefined>;

function download(filename: string, content: string, mime: string) {
  const blob = new Blob(["﻿" + content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

const escCsv = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;

export function exportCSV(rows: Row[], filename: string) {
  if (rows.length === 0) return;
  const cols = Object.keys(rows[0]);
  const csv = [cols.join(","), ...rows.map((r) => cols.map((c) => escCsv(r[c])).join(","))].join("\r\n");
  download(filename.endsWith(".csv") ? filename : `${filename}.csv`, csv, "text/csv;charset=utf-8");
}

const escXml = (v: unknown) =>
  String(v ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Gera um .xls (SpreadsheetML 2003) que abre nativamente no Excel/LibreOffice. */
export function exportXLS(rows: Row[], filename: string, sheet = "Relatório") {
  if (rows.length === 0) return;
  const cols = Object.keys(rows[0]);
  const cell = (v: unknown) =>
    `<Cell><Data ss:Type="${typeof v === "number" ? "Number" : "String"}">${escXml(v)}</Data></Cell>`;
  const header = `<Row>${cols.map((c) => cell(c)).join("")}</Row>`;
  const body = rows.map((r) => `<Row>${cols.map((c) => cell(r[c])).join("")}</Row>`).join("");
  const xml =
    `<?xml version="1.0"?><?mso-application progid="Excel.Sheet"?>` +
    `<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">` +
    `<Worksheet ss:Name="${escXml(sheet)}"><Table>${header}${body}</Table></Worksheet></Workbook>`;
  download(filename.endsWith(".xls") ? filename : `${filename}.xls`, xml, "application/vnd.ms-excel");
}

export type PdfSection = { title: string; rows: Row[] };

/** Abre uma janela de impressão estilizada — o usuário salva como PDF. */
export function exportPDF(title: string, sections: PdfSection[], subtitle?: string) {
  const tableHtml = (s: PdfSection) => {
    if (s.rows.length === 0) return `<h2>${escXml(s.title)}</h2><p class="muted">Sem dados.</p>`;
    const cols = Object.keys(s.rows[0]);
    return (
      `<h2>${escXml(s.title)}</h2><table><thead><tr>${cols.map((c) => `<th>${escXml(c)}</th>`).join("")}</tr></thead>` +
      `<tbody>${s.rows.map((r) => `<tr>${cols.map((c) => `<td>${escXml(r[c])}</td>`).join("")}</tr>`).join("")}</tbody></table>`
    );
  };
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>${escXml(title)}</title>
    <style>
      *{font-family:Georgia,'Times New Roman',serif;color:#1b1b1b}
      body{padding:40px;max-width:900px;margin:0 auto}
      h1{font-size:26px;margin:0 0 4px;color:#8a6a32}
      .sub{color:#777;margin:0 0 24px;font-size:13px}
      h2{font-size:16px;margin:26px 0 8px;border-bottom:2px solid #c9a36a;padding-bottom:4px}
      table{width:100%;border-collapse:collapse;font-size:12px;font-family:Arial,sans-serif}
      th,td{border:1px solid #ddd;padding:7px 9px;text-align:left}
      th{background:#f6f1e7}
      .muted{color:#999;font-size:12px}
      @media print{body{padding:0}}
    </style></head><body>
    <h1>${escXml(title)}</h1>${subtitle ? `<p class="sub">${escXml(subtitle)}</p>` : ""}
    ${sections.map(tableHtml).join("")}
    <script>window.onload=function(){setTimeout(function(){window.print()},250)}<\/script>
    </body></html>`;
  const w = window.open("", "_blank");
  if (!w) return;
  w.document.open();
  w.document.write(html);
  w.document.close();
}
