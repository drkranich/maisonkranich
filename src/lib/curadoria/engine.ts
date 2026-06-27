"use server";

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

export type Answers = {
  paraQuem: string;
  ocasiao: string;
  orcamento: string;
  estilo: string;
  personalizar: string;
  mensagem: string;
};

export type RecoItem = {
  productId: string;
  slug: string;
  name: string;
  kind: string;
  price_cents: number;
};

export type Reco = {
  items: RecoItem[];
  total_cents: number;
  justification: string;
};

const budgetMap: Record<string, number> = {
  "ate-100": 10000,
  "100-200": 20000,
  "200-500": 50000,
  "500-1000": 100000,
  "1000+": 300000,
};

const styleBoxHint: Record<string, string[]> = {
  rustico: ["kraft", "madeira"],
  mineiro: ["kraft", "madeira"],
  classico: ["preta", "madeira"],
  elegante: ["preta", "redonda"],
  sofisticado: ["preta", "premium"],
  romantico: ["floral", "redonda"],
  vintage: ["madeira", "kraft"],
  gourmet: ["madeira", "preta"],
  europeu: ["preta", "floral"],
  minimalista: ["kraft", "preta"],
};

type Prod = { id: string; slug: string | null; name: string; kind: string; price_cents: number; featured: boolean };

function pickBox(boxes: Prod[], estilo: string): Prod | undefined {
  const hints = styleBoxHint[estilo] ?? [];
  for (const h of hints) {
    const found = boxes.find((b) => b.name.toLowerCase().includes(h));
    if (found) return found;
  }
  return boxes[0];
}

const styleWords: Record<string, string> = {
  rustico: "rústico e acolhedor",
  mineiro: "afetivo e mineiro",
  classico: "clássico e atemporal",
  elegante: "elegante",
  sofisticado: "sofisticado",
  romantico: "romântico",
  vintage: "vintage",
  gourmet: "gourmet",
  europeu: "europeu e refinado",
  minimalista: "clean e minimalista",
};

function justify(a: Answers, box: Prod | undefined): string {
  const estilo = styleWords[a.estilo] ?? "especial";
  const base = box
    ? `Para um presente de ${a.ocasiao} com um toque ${estilo}, escolhemos a ${box.name} como abrigo perfeito desta história.`
    : `Montamos uma composição pensada para um presente de ${a.ocasiao} com um toque ${estilo}.`;
  const extra =
    a.personalizar === "sim"
      ? " Reservamos espaço para a personalização que você deseja incluir."
      : "";
  return `${base} Selecionamos cada item respeitando seu orçamento e o estilo de quem vai receber.${extra}`;
}

export async function curate(answers: Answers): Promise<Reco> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("products")
    .select("id, slug, name, kind, price_cents, featured")
    .eq("active", true);

  const products = (data ?? []) as Prod[];
  const byKind = (k: string) => products.filter((p) => p.kind === k);
  const budget = budgetMap[answers.orcamento] ?? 50000;

  const picks: Prod[] = [];
  let total = 0;
  const tryAdd = (p?: Prod, force = false) => {
    if (!p) return;
    if (force || total + p.price_cents <= budget) {
      picks.push(p);
      total += p.price_cents;
    }
  };

  const box = pickBox(byKind("box"), answers.estilo);
  tryAdd(box, true); // a caixa é a base, sempre entra
  tryAdd(byKind("filling")[0]);

  const gifts = byKind("gift").sort((a, b) => Number(b.featured) - Number(a.featured));
  let giftCount = 0;
  for (const g of gifts) {
    if (giftCount >= 3) break;
    if (total + g.price_cents <= budget) {
      tryAdd(g);
      giftCount++;
    }
  }

  tryAdd(byKind("ribbon")[0]);
  tryAdd(byKind("card")[0]);
  tryAdd(byKind("adornment")[0]);

  const items: RecoItem[] = picks.map((p) => ({
    productId: p.id,
    slug: p.slug ?? p.id,
    name: p.name,
    kind: p.kind,
    price_cents: p.price_cents,
  }));

  const reco: Reco = { items, total_cents: total, justification: justify(answers, box) };

  // salva a sessão (best-effort; guest pode não conseguir por RLS)
  try {
    const user = await getUser();
    await supabase.from("curation_sessions").insert({
      user_id: user?.id ?? null,
      answers: answers as never,
      recommendation: reco as never,
      status: "suggested",
    } as never);
  } catch {
    /* ignore */
  }

  return reco;
}
