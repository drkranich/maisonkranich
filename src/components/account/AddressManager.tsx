"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Star, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Address = {
  id: string;
  label: string | null;
  recipient: string;
  line1: string;
  line2: string | null;
  district: string | null;
  city: string;
  state: string | null;
  zip: string | null;
  is_default: boolean;
};

export function AddressManager({ initial, userId }: { initial: Address[]; userId: string }) {
  const supabase = createClient();
  const [list, setList] = useState<Address[]>(initial);
  const [open, setOpen] = useState(initial.length === 0);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    label: "", recipient: "", line1: "", line2: "", district: "", city: "", state: "", zip: "",
  });

  async function add(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const { data, error } = await supabase
      .from("addresses")
      .insert({ ...form, user_id: userId, is_default: list.length === 0 })
      .select()
      .single();
    setSaving(false);
    if (!error && data) {
      setList((l) => [...l, data as Address]);
      setForm({ label: "", recipient: "", line1: "", line2: "", district: "", city: "", state: "", zip: "" });
      setOpen(false);
    }
  }

  async function remove(id: string) {
    await supabase.from("addresses").delete().eq("id", id);
    setList((l) => l.filter((a) => a.id !== id));
  }

  async function makeDefault(id: string) {
    await supabase.from("addresses").update({ is_default: false }).eq("user_id", userId);
    await supabase.from("addresses").update({ is_default: true }).eq("id", id);
    setList((l) => l.map((a) => ({ ...a, is_default: a.id === id })));
  }

  return (
    <div className="space-y-4">
      {list.map((a) => (
        <div key={a.id} className="mk-card flex items-start justify-between gap-4 p-5">
          <div className="flex gap-3">
            <MapPin size={18} className="mt-0.5 text-dourado/70" />
            <div className="text-sm">
              <div className="flex items-center gap-2 text-marfim">
                {a.label || a.recipient}
                {a.is_default && (
                  <span className="rounded-full bg-dourado/15 px-2 py-0.5 text-[9px] uppercase tracking-wide text-dourado">
                    Padrão
                  </span>
                )}
              </div>
              <div className="text-marfim/55">
                {a.recipient} · {a.line1}{a.line2 ? `, ${a.line2}` : ""}
                {a.district ? ` — ${a.district}` : ""}
              </div>
              <div className="text-marfim/45">
                {a.city}{a.state ? `/${a.state}` : ""} {a.zip ?? ""}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!a.is_default && (
              <button onClick={() => makeDefault(a.id)} title="Tornar padrão" className="text-marfim/40 hover:text-dourado">
                <Star size={16} />
              </button>
            )}
            <button onClick={() => remove(a.id)} title="Remover" className="text-marfim/40 hover:text-red-300">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      {open ? (
        <form onSubmit={add} className="mk-card grid gap-3 p-5 sm:grid-cols-2">
          <input required placeholder="Destinatário" className="mk-input !pl-3" value={form.recipient} onChange={(e) => setForm({ ...form, recipient: e.target.value })} />
          <input placeholder="Apelido (Casa, Trabalho...)" className="mk-input !pl-3" value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} />
          <input required placeholder="Endereço (rua, número)" className="mk-input !pl-3 sm:col-span-2" value={form.line1} onChange={(e) => setForm({ ...form, line1: e.target.value })} />
          <input placeholder="Complemento" className="mk-input !pl-3" value={form.line2} onChange={(e) => setForm({ ...form, line2: e.target.value })} />
          <input placeholder="Bairro" className="mk-input !pl-3" value={form.district} onChange={(e) => setForm({ ...form, district: e.target.value })} />
          <input required placeholder="Cidade" className="mk-input !pl-3" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          <input placeholder="UF" className="mk-input !pl-3" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          <input placeholder="CEP" className="mk-input !pl-3" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} />
          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-6 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep disabled:opacity-50">
              {saving && <Loader2 size={14} className="animate-spin" />} Salvar endereço
            </button>
            {list.length > 0 && (
              <button type="button" onClick={() => setOpen(false)} className="text-[11px] uppercase tracking-brand text-marfim/50 hover:text-marfim">
                Cancelar
              </button>
            )}
          </div>
        </form>
      ) : (
        <button onClick={() => setOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-dourado/30 py-4 text-[11px] uppercase tracking-brand text-dourado/80 hover:bg-dourado/5">
          <Plus size={16} /> Adicionar endereço
        </button>
      )}
    </div>
  );
}
