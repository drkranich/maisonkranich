"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, Sparkles, Check, RotateCcw, Gift } from "lucide-react";
import { curate, type Answers, type Reco } from "@/lib/curadoria/engine";
import { useCart } from "@/lib/cart/CartContext";
import { brl } from "@/lib/format";

type Step = { key: keyof Answers; title: string; options?: { value: string; label: string }[]; free?: boolean };

const steps: Step[] = [
  {
    key: "paraQuem", title: "Para quem é o presente?",
    options: ["Homem", "Mulher", "Casal", "Criança", "Família", "Empresa", "Outro"].map((v) => ({ value: v.toLowerCase(), label: v })),
  },
  {
    key: "ocasiao", title: "Qual a ocasião?",
    options: ["Aniversário", "Casamento", "Noivado", "Dia das Mães", "Dia dos Pais", "Natal", "Corporativo", "Gratidão", "Boas-vindas", "Maternidade", "Outro"].map((v) => ({ value: v.toLowerCase(), label: v })),
  },
  {
    key: "orcamento", title: "Qual a faixa de orçamento?",
    options: [
      { value: "ate-100", label: "Até R$ 100" },
      { value: "100-200", label: "R$ 100 a R$ 200" },
      { value: "200-500", label: "R$ 200 a R$ 500" },
      { value: "500-1000", label: "R$ 500 a R$ 1.000" },
      { value: "1000+", label: "Acima de R$ 1.000" },
    ],
  },
  {
    key: "estilo", title: "Qual o estilo da pessoa?",
    options: ["Clássico", "Elegante", "Romântico", "Rústico", "Gourmet", "Sofisticado", "Minimalista", "Vintage", "Mineiro", "Europeu"].map((v) => ({ value: v.toLowerCase(), label: v })),
  },
  {
    key: "personalizar", title: "Deseja personalização?",
    options: [{ value: "sim", label: "Sim" }, { value: "nao", label: "Não" }],
  },
  { key: "mensagem", title: "Quer incluir uma mensagem? (opcional)", free: true },
];

export function CuradoriaWizard() {
  const router = useRouter();
  const { add } = useCart();
  const [i, setI] = useState(0);
  const [answers, setAnswers] = useState<Answers>({ paraQuem: "", ocasiao: "", orcamento: "", estilo: "", personalizar: "nao", mensagem: "" });
  const [loading, setLoading] = useState(false);
  const [reco, setReco] = useState<Reco | null>(null);
  const [added, setAdded] = useState(false);

  const step = steps[i];
  const isLast = i === steps.length - 1;

  function choose(value: string) {
    setAnswers((a) => ({ ...a, [step.key]: value }));
    if (!isLast) setTimeout(() => setI((x) => x + 1), 180);
  }

  async function finish() {
    setLoading(true);
    const r = await curate(answers);
    setReco(r);
    setLoading(false);
  }

  function addAll() {
    if (!reco) return;
    reco.items.forEach((it) =>
      add({ productId: it.productId, slug: it.slug, name: it.name, kind: it.kind, price_cents: it.price_cents })
    );
    setAdded(true);
    setTimeout(() => router.push("/composicao"), 700);
  }

  function restart() {
    setReco(null);
    setI(0);
    setAnswers({ paraQuem: "", ocasiao: "", orcamento: "", estilo: "", personalizar: "nao", mensagem: "" });
    setAdded(false);
  }

  // ---- RESULTADO ----
  if (reco) {
    return (
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mk-card mx-auto max-w-[680px] p-8">
        <div className="flex items-center gap-2 text-dourado">
          <Sparkles size={18} />
          <span className="mk-kicker">Sua história foi montada</span>
        </div>
        <p className="mt-4 font-serif text-lg leading-relaxed text-marfim/80">
          Que alegria ajudar a criar este presente. {reco.justification}
        </p>

        <ul className="mt-6 divide-y divide-dourado/8 border-y border-dourado/10">
          {reco.items.map((it) => (
            <li key={it.productId} className="flex items-center justify-between py-3">
              <span className="flex items-center gap-2 text-sm text-marfim/85"><Gift size={14} className="text-dourado/60" /> {it.name}</span>
              <span className="text-sm text-dourado">{brl(it.price_cents)}</span>
            </li>
          ))}
        </ul>

        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-marfim/50">Total estimado</span>
          <span className="font-serif text-2xl text-dourado">{brl(reco.total_cents)}</span>
        </div>

        <div className="mt-7 flex flex-wrap gap-3">
          <button onClick={addAll} className="flex items-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze px-7 py-3 text-[12px] uppercase tracking-brand text-carvao-deep shadow-glow">
            {added ? <Check size={15} /> : <Gift size={15} />}
            {added ? "Guardado na composição" : "Adicionar à Composição"}
          </button>
          <button onClick={restart} className="flex items-center gap-2 rounded-md border border-dourado/40 px-6 py-3 text-[12px] uppercase tracking-brand text-marfim hover:bg-dourado/10">
            <RotateCcw size={14} /> Recomeçar
          </button>
        </div>
      </motion.div>
    );
  }

  // ---- QUESTIONÁRIO ----
  return (
    <div className="mk-card mx-auto max-w-[680px] p-8">
      <div className="mb-6 flex items-center justify-between">
        <span className="mk-kicker">Passo {i + 1} de {steps.length}</span>
        <div className="flex gap-1">
          {steps.map((_, idx) => (
            <span key={idx} className={`h-1.5 w-6 rounded-full ${idx <= i ? "bg-dourado" : "bg-marfim/15"}`} />
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step.key} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.25 }}>
          <h2 className="font-serif text-2xl text-marfim">{step.title}</h2>

          {step.free ? (
            <div className="mt-5">
              <textarea
                value={answers.mensagem}
                onChange={(e) => setAnswers((a) => ({ ...a, mensagem: e.target.value }))}
                rows={3}
                placeholder="Escreva o sentimento que quer transmitir…"
                className="mk-input !pl-3"
                style={{ fontFamily: "inherit" }}
              />
              <button onClick={finish} disabled={loading} className="mt-5 flex w-full items-center justify-center gap-2 rounded-md bg-gradient-to-b from-dourado to-bronze py-3 text-[12px] uppercase tracking-brand text-carvao-deep shadow-glow disabled:opacity-50">
                {loading ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
                Montar minha história
              </button>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap gap-3">
              {step.options!.map((o) => {
                const sel = answers[step.key] === o.value;
                return (
                  <button
                    key={o.value}
                    onClick={() => choose(o.value)}
                    className={`rounded-md border px-5 py-2.5 text-sm transition-colors ${sel ? "border-dourado bg-dourado/10 text-dourado" : "border-dourado/20 text-marfim/75 hover:border-dourado/50"}`}
                  >
                    {o.label}
                  </button>
                );
              })}
            </div>
          )}

          {i > 0 && (
            <button onClick={() => setI((x) => x - 1)} className="mt-6 text-[11px] uppercase tracking-brand text-marfim/40 hover:text-dourado">
              ← Voltar
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
