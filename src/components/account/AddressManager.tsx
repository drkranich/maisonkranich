"use client";

import { useState } from "react";
import { MapPin, Plus, Trash2, Star, Loader2, Pencil, LocateFixed } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { CountrySelect } from "@/components/account/CountrySelect";
import { flagOf, countryName } from "@/lib/countries";

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
  country: string;
  is_default: boolean;
};

type FormState = {
  label: string; recipient: string; line1: string; line2: string;
  district: string; city: string; state: string; zip: string; country: string;
};

const EMPTY: FormState = {
  label: "", recipient: "", line1: "", line2: "", district: "", city: "", state: "", zip: "", country: "BR",
};

export function AddressManager({ initial, userId }: { initial: Address[]; userId: string }) {
  const supabase = createClient();
  const [list, setList] = useState<Address[]>(initial);
  const [open, setOpen] = useState(initial.length === 0);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [cepBusy, setCepBusy] = useState(false);
  const [gpsBusy, setGpsBusy] = useState(false);
  const [hint, setHint] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY);

  function setField<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  // --- CEP (Brasil) → preenche rua, bairro, cidade, UF
  async function onZipChange(raw: string) {
    const digits = raw.replace(/\D/g, "").slice(0, 8);
    const masked = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits;
    setField("zip", masked);
    if (form.country === "BR" && digits.length === 8) {
      setCepBusy(true);
      setHint(null);
      try {
        const res = await fetch(`https://viacep.com.br/ws/${digits}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setForm((f) => ({
            ...f,
            line1: f.line1 || (data.logradouro ?? ""),
            district: data.bairro ?? f.district,
            city: data.localidade ?? f.city,
            state: data.uf ?? f.state,
          }));
        } else {
          setHint("CEP não encontrado.");
        }
      } catch {
        setHint("Não foi possível consultar o CEP.");
      }
      setCepBusy(false);
    }
  }

  // --- GPS mundial → sugere país, UF, cidade, bairro, CEP
  function useMyLocation() {
    if (!navigator.geolocation) {
      setHint("Seu navegador não suporta geolocalização.");
      return;
    }
    setGpsBusy(true);
    setHint(null);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude, longitude } = pos.coords;
          const res = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
          );
          const d = await res.json();
          const uf = (d.principalSubdivisionCode ?? "").includes("-")
            ? d.principalSubdivisionCode.split("-")[1]
            : d.principalSubdivision ?? "";
          setForm((f) => ({
            ...f,
            country: d.countryCode || f.country,
            state: uf || f.state,
            city: d.city || d.locality || f.city,
            district: d.locality && d.locality !== d.city ? d.locality : f.district,
            zip: d.postcode ? String(d.postcode) : f.zip,
          }));
          setHint("Localização aplicada. Complete a rua e o número.");
        } catch {
          setHint("Não foi possível obter o endereço pela localização.");
        }
        setGpsBusy(false);
      },
      () => {
        setHint("Permissão de localização negada.");
        setGpsBusy(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  function startNew() {
    setForm(EMPTY);
    setEditingId(null);
    setHint(null);
    setOpen(true);
  }

  function startEdit(a: Address) {
    setForm({
      label: a.label ?? "", recipient: a.recipient, line1: a.line1, line2: a.line2 ?? "",
      district: a.district ?? "", city: a.city, state: a.state ?? "", zip: a.zip ?? "", country: a.country ?? "BR",
    });
    setEditingId(a.id);
    setHint(null);
    setOpen(true);
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    if (editingId) {
      const { data, error } = await supabase
        .from("addresses")
        .update({ ...form })
        .eq("id", editingId)
        .select()
        .single();
      setSaving(false);
      if (!error && data) {
        setList((l) => l.map((a) => (a.id === editingId ? (data as Address) : a)));
        setOpen(false);
        setEditingId(null);
        setForm(EMPTY);
      }
    } else {
      const { data, error } = await supabase
        .from("addresses")
        .insert({ ...form, user_id: userId, is_default: list.length === 0 })
        .select()
        .single();
      setSaving(false);
      if (!error && data) {
        setList((l) => [...l, data as Address]);
        setForm(EMPTY);
        setOpen(false);
      }
    }
  }

  async function remove(id: string) {
    await supabase.from("addresses").delete().eq("id", id);
    setList((l) => l.filter((a) => a.id !== id));
    if (editingId === id) { setOpen(false); setEditingId(null); }
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
                {a.city}{a.state ? `/${a.state}` : ""} {a.zip ?? ""} · {flagOf(a.country)} {countryName(a.country)}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {!a.is_default && (
              <button onClick={() => makeDefault(a.id)} title="Tornar padrão" className="text-marfim/40 hover:text-dourado">
                <Star size={16} />
              </button>
            )}
            <button onClick={() => startEdit(a)} title="Editar" className="text-marfim/40 hover:text-dourado">
              <Pencil size={16} />
            </button>
            <button onClick={() => remove(a.id)} title="Remover" className="text-marfim/40 hover:text-red-300">
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      ))}

      {open ? (
        <form onSubmit={save} className="mk-card grid gap-3 p-5 sm:grid-cols-2">
          <div className="sm:col-span-2 flex flex-wrap items-center justify-between gap-3">
            <span className="mk-kicker">{editingId ? "Editar endereço" : "Novo endereço"}</span>
            <button
              type="button"
              onClick={useMyLocation}
              disabled={gpsBusy}
              className="inline-flex items-center gap-2 rounded-md border border-dourado/30 px-3 py-1.5 text-[10px] uppercase tracking-brand text-dourado hover:bg-dourado/10 disabled:opacity-50"
            >
              {gpsBusy ? <Loader2 size={13} className="animate-spin" /> : <LocateFixed size={13} />}
              Usar minha localização
            </button>
          </div>

          <input required placeholder="Destinatário" className="mk-input !pl-3" value={form.recipient} onChange={(e) => setField("recipient", e.target.value)} />
          <input placeholder="Apelido (Casa, Trabalho...)" className="mk-input !pl-3" value={form.label} onChange={(e) => setField("label", e.target.value)} />

          <div className="sm:col-span-2">
            <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">País</span>
            <CountrySelect value={form.country} onChange={(code) => setField("country", code)} />
          </div>

          <div className="relative sm:col-span-1">
            <input
              placeholder={form.country === "BR" ? "CEP" : "Código postal / ZIP"}
              className="mk-input !pl-3"
              value={form.zip}
              onChange={(e) => onZipChange(e.target.value)}
              inputMode="numeric"
            />
            {cepBusy && <Loader2 size={14} className="absolute right-3 top-3.5 animate-spin text-dourado/70" />}
          </div>
          <input placeholder="UF / Estado" className="mk-input !pl-3" value={form.state} onChange={(e) => setField("state", e.target.value)} />

          <input required placeholder="Endereço (rua, número)" className="mk-input !pl-3 sm:col-span-2" value={form.line1} onChange={(e) => setField("line1", e.target.value)} />
          <input placeholder="Complemento" className="mk-input !pl-3" value={form.line2} onChange={(e) => setField("line2", e.target.value)} />
          <input placeholder="Bairro" className="mk-input !pl-3" value={form.district} onChange={(e) => setField("district", e.target.value)} />
          <input required placeholder="Cidade" className="mk-input !pl-3 sm:col-span-2" value={form.city} onChange={(e) => setField("city", e.target.value)} />

          {hint && <p className="sm:col-span-2 text-xs text-dourado/80">{hint}</p>}

          <div className="flex gap-3 sm:col-span-2">
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-6 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep disabled:opacity-50">
              {saving && <Loader2 size={14} className="animate-spin" />} Salvar endereço
            </button>
            {(list.length > 0 || editingId) && (
              <button type="button" onClick={() => { setOpen(false); setEditingId(null); setForm(EMPTY); }} className="text-[11px] uppercase tracking-brand text-marfim/50 hover:text-marfim">
                Cancelar
              </button>
            )}
          </div>
        </form>
      ) : (
        <button onClick={startNew} className="flex w-full items-center justify-center gap-2 rounded-md border border-dashed border-dourado/30 py-4 text-[11px] uppercase tracking-brand text-dourado/80 hover:bg-dourado/5">
          <Plus size={16} /> Adicionar endereço
        </button>
      )}
    </div>
  );
}
