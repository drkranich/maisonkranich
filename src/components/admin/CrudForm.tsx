"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { Field } from "@/lib/admin/schemas";
import { saveRecord } from "@/lib/admin/crud";
import { ImageUpload } from "@/components/admin/ImageUpload";

type Props = {
  fields: Field[];
  initial: Record<string, unknown>;
  table: string;
  listPath: string;
  id: string | null;
  title: string;
  dynamicOptions?: Record<string, { value: string; label: string }[]>;
};

function toInputValue(field: Field, v: unknown): string {
  if (v == null) return "";
  if (field.type === "money") return (Number(v) / 100).toString();
  if (field.type === "array") return Array.isArray(v) ? (v as string[]).join("\n") : String(v);
  if (field.type === "json") return JSON.stringify(v, null, 2);
  if (field.type === "date") return String(v).slice(0, 10);
  if (field.type === "datetime") return String(v).slice(0, 16);
  return String(v);
}

export function CrudForm({ fields, initial, table, listPath, id, title, dynamicOptions }: Props) {
  const router = useRouter();
  const [state, setState] = useState<Record<string, string | boolean | string[]>>(() => {
    const s: Record<string, string | boolean | string[]> = {};
    for (const f of fields) {
      if (f.type === "bool") s[f.key] = Boolean(initial[f.key]);
      else if (f.type === "gallery") s[f.key] = Array.isArray(initial[f.key]) ? (initial[f.key] as string[]) : [];
      else if (f.type === "image") s[f.key] = initial[f.key] ? String(initial[f.key]) : "";
      else s[f.key] = toInputValue(f, initial[f.key]);
    }
    return s;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(key: string, v: string | boolean | string[]) {
    setState((s) => ({ ...s, [key]: v }));
  }

  function coerce(): Record<string, unknown> | null {
    const out: Record<string, unknown> = {};
    for (const f of fields) {
      const raw = state[f.key];
      try {
        switch (f.type) {
          case "bool": out[f.key] = Boolean(raw); break;
          case "number": out[f.key] = raw === "" ? null : Number(raw); break;
          case "money": out[f.key] = raw === "" ? null : Math.round(parseFloat(String(raw).replace(",", ".")) * 100); break;
          case "array": out[f.key] = String(raw).split("\n").map((x) => x.trim()).filter(Boolean); break;
          case "json": out[f.key] = raw === "" ? {} : JSON.parse(String(raw)); break;
          case "date":
          case "datetime": out[f.key] = raw === "" ? null : new Date(String(raw)).toISOString(); break;
          case "image": out[f.key] = raw ? String(raw) : null; break;
          case "gallery": out[f.key] = Array.isArray(raw) ? raw : []; break;
          default: out[f.key] = raw === "" ? null : String(raw);
        }
      } catch {
        setError(`Campo "${f.label}" tem valor inválido (verifique o JSON).`);
        return null;
      }
    }
    return out;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const values = coerce();
    if (!values) return;
    setSaving(true);
    const res = await saveRecord(table, values, id, listPath);
    setSaving(false);
    if (res?.error) {
      setError(res.error);
      return;
    }
    router.push(listPath);
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <Link href={listPath} className="mb-1 inline-flex items-center gap-2 text-sm text-marfim/50 hover:text-dourado">
            <ArrowLeft size={15} /> Voltar
          </Link>
          <h2 className="font-serif text-3xl text-marfim">{id ? `Editar ${title}` : `Novo ${title}`}</h2>
        </div>
        <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-6 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep shadow-glow disabled:opacity-50">
          {saving ? <Loader2 size={15} className="animate-spin" /> : <Save size={15} />} Salvar
        </button>
      </div>

      {error && (
        <p className="mb-4 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>
      )}

      <div className="mk-card grid gap-5 p-6 sm:grid-cols-2">
        {fields.map((f) => {
          const opts = f.optionsFrom ? dynamicOptions?.[f.optionsFrom] ?? [] : f.options ?? [];
          const full = !f.half;
          return (
            <div key={f.key} className={`block ${full ? "sm:col-span-2" : ""}`}>
              <span className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-brand text-marfim/55">
                {f.label}{f.required && <span className="text-dourado">*</span>}
              </span>

              {f.type === "image" ? (
                <ImageUpload value={(state[f.key] as string) || null} onChange={(v) => set(f.key, v ?? "")} folder="catalog" />
              ) : f.type === "gallery" ? (
                <ImageUpload multiple value={(state[f.key] as string[]) ?? []} onChange={(v) => set(f.key, v)} folder="catalog" />
              ) : f.type === "bool" ? (
                <button
                  type="button"
                  onClick={() => set(f.key, !state[f.key])}
                  className={`flex h-7 w-12 items-center rounded-full p-1 transition-colors ${state[f.key] ? "bg-dourado/70" : "bg-marfim/15"}`}
                >
                  <span className={`h-5 w-5 rounded-full bg-marfim transition-transform ${state[f.key] ? "translate-x-5" : ""}`} />
                </button>
              ) : f.type === "select" ? (
                <select value={String(state[f.key] ?? "")} onChange={(e) => set(f.key, e.target.value)} className="mk-input !pl-3 appearance-none">
                  <option value="">—</option>
                  {opts.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : f.type === "textarea" || f.type === "json" || f.type === "array" ? (
                <textarea
                  value={String(state[f.key] ?? "")}
                  onChange={(e) => set(f.key, e.target.value)}
                  rows={f.type === "json" ? 5 : 3}
                  className="mk-input !pl-3 font-mono"
                  style={f.type === "textarea" ? { fontFamily: "inherit" } : undefined}
                />
              ) : (
                <input
                  value={String(state[f.key] ?? "")}
                  onChange={(e) => set(f.key, e.target.value)}
                  type={f.type === "number" || f.type === "money" ? "text" : f.type === "date" ? "date" : f.type === "datetime" ? "datetime-local" : "text"}
                  inputMode={f.type === "number" || f.type === "money" ? "decimal" : undefined}
                  className="mk-input !pl-3"
                  required={f.required}
                />
              )}

              {f.help && <span className="mt-1 block text-[11px] text-marfim/35">{f.help}</span>}
            </div>
          );
        })}
      </div>
    </form>
  );
}
