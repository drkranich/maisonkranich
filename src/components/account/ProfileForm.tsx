"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Save, Check, Instagram } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { AvatarUpload } from "@/components/account/AvatarUpload";

type Profile = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  instagram: string | null;
  avatar_url: string | null;
};

export function ProfileForm({ initial }: { initial: Profile }) {
  const router = useRouter();
  const supabase = createClient();
  const [fullName, setFullName] = useState(initial.full_name ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [instagram, setInstagram] = useState(initial.instagram ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, instagram: instagram.replace(/^@/, "") || null })
      .eq("id", initial.id);
    setSaving(false);
    if (error) { setError(error.message); return; }
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
    router.refresh();
  }

  return (
    <div className="mk-card p-6">
      <AvatarUpload uid={initial.id} initialUrl={initial.avatar_url} name={fullName || initial.email || "U"} />

      <form onSubmit={save} className="mt-7 grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Nome completo</span>
          <input value={fullName} onChange={(e) => setFullName(e.target.value)} className="mk-input !pl-3" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">E-mail</span>
          <input value={initial.email ?? ""} disabled className="mk-input !pl-3 opacity-60" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Telefone</span>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="(00) 00000-0000" className="mk-input !pl-3" />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[11px] uppercase tracking-brand text-marfim/55">Instagram</span>
          <span className="relative flex items-center">
            <Instagram size={15} className="pointer-events-none absolute left-3 text-dourado/60" />
            <input value={instagram} onChange={(e) => setInstagram(e.target.value)} placeholder="@seuperfil" className="mk-input" />
          </span>
        </label>

        {error && <p className="sm:col-span-2 rounded-md border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}

        <div className="sm:col-span-2">
          <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-6 py-2.5 text-[11px] uppercase tracking-brand text-carvao-deep shadow-glow disabled:opacity-50">
            {saving ? <Loader2 size={15} className="animate-spin" /> : saved ? <Check size={15} /> : <Save size={15} />}
            {saved ? "Salvo" : "Salvar dados"}
          </button>
        </div>
      </form>
    </div>
  );
}
