"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Box, Sparkles, Gift, Ribbon, Tag, Mail, Flower2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { builderSteps, lexicon } from "@/lib/brand";
import { brl } from "@/lib/format";
import { useCart } from "@/lib/cart/CartContext";

type Product = {
  id: string;
  slug?: string;
  name: string;
  price_cents: number;
  short_desc: string | null;
  attributes: Record<string, unknown> | null;
};

const stepIcons: Record<string, React.ElementType> = {
  box: Box,
  filling: Sparkles,
  gift: Gift,
  ribbon: Ribbon,
  tag: Tag,
  card: Mail,
  adornment: Flower2,
};

// Fallback caso o banco ainda não responda (mantém a vitrine viva)
const fallbackBoxes: Product[] = [
  { id: "1", name: "Caixa Kraft", price_cents: 1690, short_desc: "Acabamento natural", attributes: {} },
  { id: "2", name: "Caixa Preta Premium", price_cents: 2490, short_desc: "Rígida fosca", attributes: {} },
  { id: "3", name: "Caixa Floral", price_cents: 2290, short_desc: "Estampa botânica", attributes: {} },
  { id: "4", name: "Caixa de Madeira", price_cents: 3490, short_desc: "Baú envelhecido", attributes: {} },
  { id: "5", name: "Caixa Redonda", price_cents: 2990, short_desc: "Tampa com laço", attributes: {} },
];

export function BoxBuilder() {
  const router = useRouter();
  const { add } = useCart();
  const [step, setStep] = useState(0);
  const [boxes, setBoxes] = useState<Product[]>(fallbackBoxes);
  const [selected, setSelected] = useState<Product | null>(null);

  function addSelectedToCart() {
    if (!selected) return;
    add({
      productId: selected.id,
      slug: (selected as { slug?: string }).slug ?? selected.id,
      name: selected.name,
      kind: "box",
      price_cents: selected.price_cents,
    });
    router.push("/composicao");
  }

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("products")
      .select("id,slug,name,price_cents,short_desc,attributes")
      .eq("kind", "box")
      .eq("active", true)
      .order("featured", { ascending: false })
      .then(({ data }) => {
        if (data && data.length) setBoxes(data as Product[]);
      });
  }, []);

  const total = useMemo(() => selected?.price_cents ?? 0, [selected]);

  return (
    <div className="mk-card overflow-hidden">
      {/* Cabeçalho */}
      <div className="bg-kraft-paper px-6 py-5 text-carvao-deep">
        <span className="text-[10px] uppercase tracking-wide2 text-nogueira/70">
          Monte sua
        </span>
        <h3 className="font-serif text-2xl leading-tight">
          Caixa dos Sonhos <span className="text-bronze">♡</span>
        </h3>
        <p className="text-xs text-nogueira/70">
          Cada detalhe importa. Cada escolha, transforma.
        </p>
      </div>

      {/* Passos (provador) */}
      <div className="flex flex-wrap gap-1 border-b border-dourado/12 bg-carvao-deep/60 px-3 py-3">
        {builderSteps.map((s, i) => {
          const Icon = stepIcons[s.key];
          const active = i === step;
          return (
            <button
              key={s.key}
              onClick={() => setStep(i)}
              className={`flex flex-1 min-w-[64px] flex-col items-center gap-1.5 rounded-md px-2 py-2 text-[10px] uppercase tracking-wide transition-colors ${
                active
                  ? "bg-dourado/15 text-dourado"
                  : "text-marfim/45 hover:text-marfim/80"
              }`}
            >
              <Icon size={16} className="shrink-0" />
              <span className="flex h-6 items-start justify-center text-center leading-[1.15]">
                {s.n}. {s.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grade de seleção */}
      <div className="px-6 py-5">
        <div className="mb-3 flex items-center justify-between">
          <span className="mk-kicker">
            {builderSteps[step].n}. Escolha {builderSteps[step].label}
          </span>
          <span className="text-[11px] text-dourado/70">Ver todos →</span>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {boxes.map((b) => {
            const isSel = selected?.id === b.id;
            return (
              <motion.button
                key={b.id}
                whileHover={{ y: -3 }}
                onClick={() => setSelected(b)}
                className={`rounded-lg border p-3 text-left transition-colors ${
                  isSel
                    ? "border-dourado bg-dourado/10"
                    : "border-dourado/12 bg-carvao hover:border-dourado/40"
                }`}
              >
                <div className="mb-2 flex h-16 items-center justify-center rounded bg-gradient-to-br from-nogueira to-carvao-deep">
                  <Box className="text-dourado/70" size={26} />
                </div>
                <div className="text-xs text-marfim">{b.name}</div>
                <div className="text-[11px] text-dourado/80">
                  {brl(b.price_cents)}
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Visualizador */}
      <div className="border-t border-dourado/12 px-6 py-5">
        <span className="mk-kicker">Visualização da sua caixa</span>
        <div className="mt-3 flex items-center justify-center rounded-lg bg-gradient-to-br from-madeira/40 to-carvao-deep py-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={selected?.id ?? "empty"}
              initial={{ opacity: 0, scale: 0.92, rotateX: 12 }}
              animate={{ opacity: 1, scale: 1, rotateX: 0 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col items-center gap-3"
            >
              <Box className="animate-sway text-dourado" size={64} />
              <span className="font-serif text-lg text-marfim">
                {selected ? selected.name : "Escolha sua caixa"}
              </span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Rodapé */}
      <div className="flex items-center justify-between gap-4 border-t border-dourado/12 bg-carvao-deep/60 px-6 py-4">
        <div>
          <div className="text-[10px] uppercase tracking-brand text-marfim/50">
            Total parcial
          </div>
          <div className="font-serif text-xl text-dourado">{brl(total)}</div>
        </div>
        <button
          onClick={addSelectedToCart}
          disabled={!selected}
          className="rounded-md bg-gradient-to-b from-dourado to-bronze px-7 py-3 text-[12px] font-sans uppercase tracking-brand text-carvao-deep shadow-glow transition disabled:opacity-40"
        >
          {selected ? lexicon.addToBox : "Escolha uma caixa"}
        </button>
      </div>
    </div>
  );
}
