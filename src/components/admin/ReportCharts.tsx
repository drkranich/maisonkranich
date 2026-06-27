"use client";

import { FileText, FileSpreadsheet, FileDown } from "lucide-react";
import { exportCSV, exportXLS, exportPDF } from "@/lib/admin/export";

type Cat = { name: string; count: number; value: number };
type Rev = { name: string; value: number };
type Status = { status: string; count: number; total: number };

function brl(cents: number) {
  return (cents / 100).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function BarChart({ data, color = "var(--mk-dourado)", money }: { data: { label: string; value: number }[]; color?: string; money?: boolean }) {
  const max = Math.max(1, ...data.map((d) => d.value));
  if (data.length === 0) return <p className="py-6 text-center text-sm text-marfim/40">Sem dados ainda.</p>;
  return (
    <div className="space-y-2.5">
      {data.map((d) => (
        <div key={d.label} className="flex items-center gap-3">
          <span className="w-32 shrink-0 truncate text-right text-xs text-marfim/60" title={d.label}>{d.label}</span>
          <div className="relative h-6 flex-1 overflow-hidden rounded bg-carvao-deep/60">
            <div
              className="absolute inset-y-0 left-0 rounded"
              style={{ width: `${(d.value / max) * 100}%`, background: `linear-gradient(90deg, ${color}, #8a6a32)`, minWidth: d.value > 0 ? 4 : 0 }}
            />
          </div>
          <span className="w-24 shrink-0 text-xs text-marfim/75">{money ? brl(d.value) : d.value}</span>
        </div>
      ))}
    </div>
  );
}

export function ReportCharts({
  summary, categoryCatalog, revenueByCategory, statusRows, monthRevenue,
}: {
  summary: { revenue: number; orders: number; avg: number; subs: number; customers: number };
  categoryCatalog: Cat[];
  revenueByCategory: Rev[];
  statusRows: Status[];
  monthRevenue: { name: string; value: number }[];
}) {
  function doCSV() {
    exportCSV(
      categoryCatalog.map((c) => ({ Categoria: c.name, Produtos: c.count, "Valor de catálogo (R$)": (c.value / 100).toFixed(2) })),
      "relatorio-categorias"
    );
  }
  function doXLS() {
    exportXLS(
      categoryCatalog.map((c) => ({ Categoria: c.name, Produtos: c.count, "Valor catálogo (R$)": Number((c.value / 100).toFixed(2)) })),
      "relatorio-categorias"
    );
  }
  function doPDF() {
    exportPDF(
      "Maison Kranich — Relatório",
      [
        { title: "Resumo", rows: [
          { Indicador: "Receita total", Valor: brl(summary.revenue) },
          { Indicador: "Pedidos", Valor: summary.orders },
          { Indicador: "Ticket médio", Valor: brl(summary.avg) },
          { Indicador: "Assinaturas ativas", Valor: summary.subs },
          { Indicador: "Clientes", Valor: summary.customers },
        ] },
        { title: "Catálogo por categoria", rows: categoryCatalog.map((c) => ({ Categoria: c.name, Produtos: c.count, "Valor (R$)": brl(c.value) })) },
        { title: "Receita por categoria", rows: revenueByCategory.map((r) => ({ Categoria: r.name, Receita: brl(r.value) })) },
        { title: "Pedidos por status", rows: statusRows.map((s) => ({ Status: s.status, Quantidade: s.count, Valor: brl(s.total) })) },
      ],
      new Date().toLocaleDateString("pt-BR")
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        <button onClick={doCSV} className="inline-flex items-center gap-2 rounded-md border border-dourado/30 px-4 py-2 text-[11px] uppercase tracking-brand text-dourado hover:bg-dourado/10">
          <FileText size={14} /> CSV
        </button>
        <button onClick={doXLS} className="inline-flex items-center gap-2 rounded-md border border-dourado/30 px-4 py-2 text-[11px] uppercase tracking-brand text-dourado hover:bg-dourado/10">
          <FileSpreadsheet size={14} /> Excel
        </button>
        <button onClick={doPDF} className="inline-flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-4 py-2 text-[11px] uppercase tracking-brand text-carvao-deep">
          <FileDown size={14} /> PDF
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Produtos por categoria</h3>
          <BarChart data={categoryCatalog.map((c) => ({ label: c.name, value: c.count }))} />
        </div>
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Valor de catálogo por categoria</h3>
          <BarChart data={categoryCatalog.map((c) => ({ label: c.name, value: c.value }))} money />
        </div>
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Receita por categoria</h3>
          <BarChart data={revenueByCategory.map((r) => ({ label: r.name, value: r.value }))} money color="#7fae8a" />
        </div>
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Receita por mês</h3>
          <BarChart data={monthRevenue} money color="#c9a36a" />
        </div>
      </div>
    </div>
  );
}
