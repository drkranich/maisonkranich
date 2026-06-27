"use client";

import { useState } from "react";
import { Loader2, Save, Check } from "lucide-react";
import { saveSetting } from "@/lib/admin/settings";

type Brand = { name?: string; tagline?: string; slogan?: string; favicon_url?: string; logo_url?: string };
type Contact = { email?: string; whatsapp?: string; instagram?: string };
type Shipping = { free_above_cents?: number };

export function SettingsForm({
  brand, contact, shipping,
}: {
  brand: Brand; contact: Contact; shipping: Shipping;
}) {
  const [b, setB] = useState<Brand>(brand);
  const [c, setC] = useState<Contact>(contact);
  const [freeAbove, setFreeAbove] = useState(((shipping.free_above_cents ?? 0) / 100).toString());
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    setSaving(true);
    setError(null);
    const r1 = await saveSetting("brand", b);
    const r2 = await saveSetting("contact", c);
    const r3 = await saveSetting("shipping", {
      free_above_cents: Math.round(parseFloat(freeAbove.replace(",", ".") || "0") * 100),
    });
    setSaving(false);
    const err = r1.error || r2.error || r3.error;
    if (err) { setError(err); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Identidade da marca</h3>
          <div className="space-y-3">
            <Field label="Nome" value={b.name ?? ""} onChange={(v) => setB({ ...b, name: v })} />
            <Field label="Tagline" value={b.tagline ?? ""} onChange={(v) => setB({ ...b, tagline: v })} />
            <Field label="Slogan" value={b.slogan ?? ""} onChange={(v) => setB({ ...b, slogan: v })} />
            <Field label="URL do logotipo" value={b.logo_url ?? ""} onChange={(v) => setB({ ...b, logo_url: v })} help="Imagem do logo (opcional)" />
            <Field label="URL do favicon (ícone da aba)" value={b.favicon_url ?? ""} onChange={(v) => setB({ ...b, favicon_url: v })} help="Ícone que aparece na aba do navegador. Deixe vazio para o brasão padrão." />
          </div>
        </div>

        <div className="mk-card p-6">
          <h3 className="mk-kicker mb-4">Contato & Frete</h3>
          <div className="space-y-3">
            <Field label="E-mail" value={c.email ?? ""} onChange={(v) => setC({ ...c, email: v })} />
            <Field label="WhatsApp" value={c.whatsapp ?? ""} onChange={(v) => setC({ ...c, whatsapp: v })} help="Só números, com DDD e país. Ex.: 5531999999999" />
            <Field label="Instagram" value={c.instagram ?? ""} onChange={(v) => setC({ ...c, instagram: v })} help="@perfil ou URL" />
            <Field label="Frete grátis acima de (R$)" value={freeAbove} onChange={setFreeAbove} />
          </div>
        </div>
      </div>

      {error && <p className="rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

      <button onClick={save} disabled={saving} className="flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-6 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep shadow-glow disabled:opacity-50">
        {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <Save size={15} />}
        {saved ? "Salvo" : "Salvar configurações"}
      </button>
    </div>
  );
}

function Field({ label, value, onChange, help }: { label: string; value: string; onChange: (v: string) => void; help?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">{label}</span>
      <input value={value} onChange={(e) => onChange(e.target.value)} className="mk-input !pl-3" />
      {help && <span className="mt-1 block text-[11px] text-marfim/35">{help}</span>}
    </label>
  );
}
