"use client";

import { useState } from "react";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type SingleProps = {
  multiple?: false;
  value: string | null;
  onChange: (v: string | null) => void;
  folder?: string;
};
type MultiProps = {
  multiple: true;
  value: string[];
  onChange: (v: string[]) => void;
  folder?: string;
};

export function ImageUpload(props: SingleProps | MultiProps) {
  const supabase = createClient();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const list = props.multiple ? (props.value ?? []) : props.value ? [props.value] : [];

  async function uploadOne(file: File): Promise<string | null> {
    if (file.size > 6 * 1024 * 1024) {
      setError("Imagem acima de 6 MB.");
      return null;
    }
    const ext = file.name.split(".").pop() || "jpg";
    const path = `${props.folder ?? "catalog"}/${crypto.randomUUID()}.${ext}`;
    const { error: upErr } = await supabase.storage.from("catalog").upload(path, file, { cacheControl: "3600", upsert: false });
    if (upErr) {
      setError(upErr.message);
      return null;
    }
    const { data } = supabase.storage.from("catalog").getPublicUrl(path);
    return data.publicUrl;
  }

  async function onFiles(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;
    setError(null);
    setBusy(true);
    if (props.multiple) {
      const urls: string[] = [];
      for (const f of files) {
        const u = await uploadOne(f);
        if (u) urls.push(u);
      }
      props.onChange([...(props.value ?? []), ...urls]);
    } else {
      const u = await uploadOne(files[0]);
      if (u) props.onChange(u);
    }
    setBusy(false);
    e.target.value = "";
  }

  function removeAt(idx: number) {
    if (props.multiple) {
      props.onChange((props.value ?? []).filter((_, i) => i !== idx));
    } else {
      props.onChange(null);
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {list.map((url, i) => (
          <div key={url + i} className="group relative h-24 w-24 overflow-hidden rounded-lg border border-dourado/20">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => removeAt(i)}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-carvao-deep/80 text-marfim opacity-0 transition group-hover:opacity-100 hover:text-red-300"
            >
              <X size={12} />
            </button>
          </div>
        ))}

        {(props.multiple || list.length === 0) && (
          <label className="flex h-24 w-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg border border-dashed border-dourado/30 text-dourado/70 hover:bg-dourado/5">
            {busy ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
            <span className="text-[9px] uppercase tracking-wide">Imagem</span>
            <input type="file" accept="image/*" multiple={props.multiple} onChange={onFiles} disabled={busy} className="hidden" />
          </label>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-300">{error}</p>}
    </div>
  );
}
