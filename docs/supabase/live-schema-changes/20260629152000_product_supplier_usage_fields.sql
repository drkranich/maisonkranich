alter table public.products
  add column if not exists measurements text,
  add column if not exists package_use text,
  add column if not exists compatible_product_types text[] not null default '{}'::text[],
  add column if not exists special_occasions text[] not null default '{}'::text[];

alter table public.suppliers
  add column if not exists product_measurements text,
  add column if not exists packaging_use text,
  add column if not exists compatible_product_types text[] not null default '{}'::text[],
  add column if not exists special_occasions text[] not null default '{}'::text[];

create index if not exists products_compatible_product_types_idx on public.products using gin (compatible_product_types);
create index if not exists products_special_occasions_idx on public.products using gin (special_occasions);
create index if not exists suppliers_compatible_product_types_idx on public.suppliers using gin (compatible_product_types);
create index if not exists suppliers_special_occasions_idx on public.suppliers using gin (special_occasions);
