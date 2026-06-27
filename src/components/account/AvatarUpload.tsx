"use client";

import { useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function AvatarUpload({
  uid,
  initialUrl,
  name,
}: {
  uid: string;
  initialUrl: string | null;
  name: string;
}) {
  const supabase = createClient();
  const [url, setUrl] = useState<string | null>(initialUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      setError("Imagem muito grande (máx. 4 MB).");
      return;
    }
    setError(null);
    setBusy(true);
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${uid}/avatar.${ext}`;

    const { error: upErr } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true, cacheControl: "3600" });

    if (upErr) {
      setError(upErr.message);
      setBusy(false);
      return;
    }

    const { data } = supabase.storage.from("avatars").getPublicUrl(path);
    const publicUrl = `${data.publicUrl}?v=${Date.now()}`;
    await supabase.from("profiles").update({ avatar_url: publicUrl }).eq("id", uid);
    setUrl(publicUrl);
    setBusy(false);
  }

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-dourado/25 bg-gradient-to-br from-dourado to-bronze text-2xl font-semibold text-carvao-deep">
          {url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={url} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            name.charAt(0).toUpperCase()
          )}
        </div>
        <label className="absolute -bottom-1 -right-1 flex h-7 w-7 cursor-pointer items-center justify-center rounded-full border border-dourado/30 bg-carvao-deep text-dourado hover:bg-dourado/15">
          {busy ? <Loader2 size={14} className="animate-spin" /> : <Camera size={14} />}
          <input type="file" accept="image/*" onChange={onFile} disabled={busy} className="hidden" />
        </label>
      </div>
      <div>
        <div className="text-sm text-marfim">Foto de perfil</div>
        <div className="text-xs text-marfim/45">JPG ou PNG, até 4 MB.</div>
        {error && <div className="mt-1 text-xs text-red-300">{error}</div>}
      </div>
    </div>
  );
}
