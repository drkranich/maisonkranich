export type FieldType =
  | "text" | "textarea" | "slug" | "number" | "money"
  | "bool" | "select" | "array" | "json" | "date" | "datetime";

export type Field = {
  key: string;
  label: string;
  type: FieldType;
  options?: { value: string; label: string }[];
  optionsFrom?: "categories";
  required?: boolean;
  help?: string;
  half?: boolean;
};

export type Entity = {
  table: string;
  singular: string;
  list: string;
  defaults?: Record<string, unknown>;
  fields: Field[];
};

const kindOptions = [
  { value: "box", label: "Caixa" },
  { value: "filling", label: "Enchimento" },
  { value: "ribbon", label: "Laço" },
  { value: "tag", label: "Tag" },
  { value: "card", label: "Cartão" },
  { value: "adornment", label: "Adorno" },
  { value: "gift", label: "Presente" },
];

const contentStatus = [
  { value: "draft", label: "Rascunho" },
  { value: "published", label: "Publicado" },
  { value: "archived", label: "Arquivado" },
];

const productFields = (includeKind: boolean): Field[] => [
  { key: "name", label: "Nome", type: "text", required: true, half: true },
  { key: "slug", label: "Slug", type: "slug", required: true, half: true, help: "URL única (ex.: caixa-kraft)" },
  ...(includeKind ? [{ key: "kind", label: "Tipo", type: "select", options: kindOptions, half: true } as Field] : []),
  { key: "sku", label: "SKU", type: "text", half: true },
  { key: "price_cents", label: "Preço (R$)", type: "money", required: true, half: true },
  { key: "stock", label: "Estoque", type: "number", half: true },
  { key: "category_id", label: "Categoria", type: "select", optionsFrom: "categories", half: true },
  { key: "short_desc", label: "Descrição curta", type: "text" },
  { key: "description", label: "Descrição completa", type: "textarea" },
  { key: "attributes", label: "Atributos (JSON)", type: "json", help: 'ex.: {"material":"kraft","cor":"natural"}' },
  { key: "active", label: "Ativo", type: "bool", half: true },
  { key: "featured", label: "Destaque", type: "bool", half: true },
];

export const entities: Record<string, Entity> = {
  produtos: {
    table: "products",
    singular: "Produto",
    list: "/admin/produtos",
    defaults: { kind: "gift", active: true, stock: 0 },
    fields: productFields(true),
  },
  caixas: {
    table: "products",
    singular: "Caixa",
    list: "/admin/caixas",
    defaults: { kind: "box", active: true, stock: 0 },
    fields: productFields(false),
  },
  colecoes: {
    table: "collections",
    singular: "Coleção",
    list: "/admin/colecoes",
    defaults: { active: true, featured: false, sort_order: 0 },
    fields: [
      { key: "name", label: "Nome", type: "text", required: true, half: true },
      { key: "slug", label: "Slug", type: "slug", required: true, half: true },
      { key: "theme", label: "Tema", type: "text", half: true },
      { key: "sort_order", label: "Ordem", type: "number", half: true },
      { key: "story", label: "Narrativa afetiva", type: "textarea" },
      { key: "description", label: "Descrição", type: "textarea" },
      { key: "cover_url", label: "URL da capa", type: "text" },
      { key: "featured", label: "Destaque", type: "bool", half: true },
      { key: "active", label: "Ativa", type: "bool", half: true },
    ],
  },
  categorias: {
    table: "categories",
    singular: "Categoria",
    list: "/admin/categorias",
    defaults: { active: true, sort_order: 0 },
    fields: [
      { key: "name", label: "Nome", type: "text", required: true, half: true },
      { key: "slug", label: "Slug", type: "slug", required: true, half: true },
      { key: "description", label: "Descrição", type: "textarea" },
      { key: "image_url", label: "URL da imagem", type: "text" },
      { key: "sort_order", label: "Ordem", type: "number", half: true },
      { key: "active", label: "Ativa", type: "bool", half: true },
    ],
  },
  cupons: {
    table: "coupons",
    singular: "Cupom",
    list: "/admin/cupons",
    defaults: { kind: "percent", active: true, used_count: 0, first_purchase_only: false },
    fields: [
      { key: "code", label: "Código", type: "text", required: true, half: true },
      { key: "kind", label: "Tipo", type: "select", half: true, options: [
        { value: "percent", label: "Percentual (%)" },
        { value: "fixed", label: "Valor fixo (R$)" },
        { value: "free_shipping", label: "Frete grátis" },
      ] },
      { key: "percent", label: "Percentual (%)", type: "number", half: true, help: "Se tipo = percentual" },
      { key: "value_cents", label: "Valor fixo (R$)", type: "money", half: true, help: "Se tipo = valor fixo" },
      { key: "description", label: "Descrição", type: "text" },
      { key: "min_order_cents", label: "Pedido mínimo (R$)", type: "money", half: true },
      { key: "max_uses", label: "Usos máximos", type: "number", half: true },
      { key: "starts_at", label: "Início", type: "datetime", half: true },
      { key: "ends_at", label: "Fim", type: "datetime", half: true },
      { key: "first_purchase_only", label: "Só primeira compra", type: "bool", half: true },
      { key: "active", label: "Ativo", type: "bool", half: true },
    ],
  },
  planos: {
    table: "subscription_plans",
    singular: "Plano",
    list: "/admin/planos",
    defaults: { active: true, highlight: false, sort_order: 0, currency: "BRL" },
    fields: [
      { key: "name", label: "Nome", type: "text", required: true, half: true },
      { key: "slug", label: "Slug", type: "slug", required: true, half: true },
      { key: "interval", label: "Intervalo", type: "select", half: true, options: [
        { value: "monthly", label: "Mensal" },
        { value: "quarterly", label: "Trimestral" },
        { value: "semiannual", label: "Semestral" },
        { value: "annual", label: "Anual" },
      ] },
      { key: "price_cents", label: "Preço (R$)", type: "money", required: true, half: true },
      { key: "description", label: "Descrição", type: "textarea" },
      { key: "features", label: "Benefícios (um por linha)", type: "array" },
      { key: "sort_order", label: "Ordem", type: "number", half: true },
      { key: "highlight", label: "Destaque", type: "bool", half: true },
      { key: "active", label: "Ativo", type: "bool", half: true },
    ],
  },
  blog: {
    table: "blog_posts",
    singular: "Artigo",
    list: "/admin/blog",
    defaults: { status: "draft" },
    fields: [
      { key: "title", label: "Título", type: "text", required: true },
      { key: "slug", label: "Slug", type: "slug", required: true, half: true },
      { key: "status", label: "Status", type: "select", options: contentStatus, half: true },
      { key: "excerpt", label: "Resumo", type: "textarea" },
      { key: "body", label: "Conteúdo", type: "textarea" },
      { key: "cover_url", label: "URL da capa", type: "text" },
      { key: "published_at", label: "Publicado em", type: "datetime" },
    ],
  },
  conteudo: {
    table: "pages",
    singular: "Página",
    list: "/admin/conteudo",
    defaults: { status: "draft", content: [], seo: {} },
    fields: [
      { key: "title", label: "Título", type: "text", required: true, half: true },
      { key: "slug", label: "Slug", type: "slug", required: true, half: true },
      { key: "status", label: "Status", type: "select", options: contentStatus, half: true },
      { key: "content", label: "Blocos (JSON)", type: "json", help: "Estrutura de blocos da página" },
      { key: "seo", label: "SEO (JSON)", type: "json", help: 'ex.: {"description":"..."}' },
    ],
  },
};

export function getEntity(name: string): Entity | null {
  return entities[name] ?? null;
}
