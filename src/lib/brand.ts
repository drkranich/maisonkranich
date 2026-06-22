/**
 * MAISON KRANICH — fonte de verdade da identidade.
 * Toda interface deve parecer uma extensão natural da logo.
 */
export const brand = {
  name: "Maison Kranich",
  monogram: "MK",
  tagline: "Empório das Caixas",
  slogan: "Onde toda história encontra seu abrigo.",
  promise: "Caixas que guardam mais que presentes. Guardam sentimentos.",
} as const;

export const palette = {
  deep: "#111111",
  carvao: "#1B1B1B",
  nogueira: "#4A3326",
  madeira: "#5A4030",
  musgo: "#344034",
  bronze: "#A77942",
  latao: "#B08A57",
  dourado: "#C9A36A",
  kraft: "#D6BE97",
  pergaminho: "#E9DCC6",
  marfim: "#F6F1E7",
} as const;

/** Passos do configurador "Monte Sua Caixa dos Sonhos" */
export const builderSteps = [
  { key: "box", label: "Caixa", n: 1 },
  { key: "filling", label: "Enchimento", n: 2 },
  { key: "gift", label: "Itens", n: 3 },
  { key: "ribbon", label: "Laço", n: 4 },
  { key: "tag", label: "Tags", n: 5 },
  { key: "card", label: "Cartão", n: 6 },
  { key: "adornment", label: "Adornos", n: 7 },
] as const;

/** Léxico da marca — nunca "adicionar ao carrinho" */
export const lexicon = {
  addToBox: "Adicionar à Composição",
  buildStory: "Montar Minha História",
  keep: "Guardar Nesta Caixa",
} as const;
