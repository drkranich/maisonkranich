"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Check } from "lucide-react";
import { countries, flagOf, countryName } from "@/lib/countries";

export function CountrySelect({ value, onChange }: { value: string; onChange: (code: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function onDoc(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q) || c.code.toLowerCase().includes(q));
  }, [query]);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between rounded-lg border border-dourado/18 bg-carvao-deep/60 px-3 py-[0.7rem] text-sm text-marfim outline-none transition focus:border-dourado/55"
      >
        <span className="flex items-center gap-2">
          <span className="text-lg leading-none">{flagOf(value)}</span>
          <span>{countryName(value)}</span>
        </span>
        <ChevronDown size={16} className={`text-dourado/60 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-white/10 bg-white/[0.06] shadow-2xl backdrop-blur-xl">
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2">
            <Search size={15} className="text-marfim/45" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar país…"
              className="w-full bg-transparent text-sm text-marfim placeholder:text-marfim/35 outline-none"
            />
          </div>
          <ul className="max-h-64 overflow-y-auto py-1">
            {filtered.length === 0 && <li className="px-3 py-3 text-sm text-marfim/40">Nenhum país encontrado.</li>}
            {filtered.map((c) => (
              <li key={c.code}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(c.code);
                    setOpen(false);
                    setQuery("");
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2 text-left text-sm transition hover:bg-white/[0.08] ${
                    c.code === value ? "text-dourado" : "text-marfim/85"
                  }`}
                >
                  <span className="text-lg leading-none">{flagOf(c.code)}</span>
                  <span className="flex-1">{c.name}</span>
                  {c.code === value && <Check size={15} className="text-dourado" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
