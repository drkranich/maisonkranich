/** Helpers de formatação (BRL por padrão). */
export function brl(cents: number, currency = "BRL") {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency,
  }).format((cents ?? 0) / 100);
}

export function compactBRL(cents: number) {
  return new Intl.NumberFormat("pt-BR", {
    notation: "compact",
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 1,
  }).format((cents ?? 0) / 100);
}

export function dateBR(d: string | Date) {
  return new Intl.DateTimeFormat("pt-BR", { dateStyle: "medium" }).format(
    new Date(d)
  );
}
