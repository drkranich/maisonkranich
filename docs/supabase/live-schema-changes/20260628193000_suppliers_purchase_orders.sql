create table if not exists public.suppliers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  product_type text not null,
  contact_name text,
  social_url text,
  website_url text,
  phone text,
  email text,
  notes text,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_purchase_orders (
  id uuid primary key default gen_random_uuid(),
  supplier_id uuid not null references public.suppliers(id) on delete restrict,
  status text not null default 'draft' check (status in ('draft', 'ordered', 'received', 'cancelled')),
  expected_at date,
  ordered_at timestamptz not null default now(),
  received_at timestamptz,
  total_cents integer not null default 0 check (total_cents >= 0),
  notes text,
  created_by uuid references public.profiles(id) on delete set null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.supplier_purchase_order_items (
  id uuid primary key default gen_random_uuid(),
  purchase_order_id uuid not null references public.supplier_purchase_orders(id) on delete cascade,
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  received_quantity integer not null default 0 check (received_quantity >= 0),
  unit_cost_cents integer not null default 0 check (unit_cost_cents >= 0),
  created_at timestamptz not null default now()
);

create index if not exists suppliers_product_type_idx on public.suppliers(product_type);
create index if not exists supplier_purchase_orders_supplier_id_idx on public.supplier_purchase_orders(supplier_id);
create index if not exists supplier_purchase_orders_status_idx on public.supplier_purchase_orders(status);
create index if not exists supplier_purchase_order_items_order_id_idx on public.supplier_purchase_order_items(purchase_order_id);
create index if not exists supplier_purchase_order_items_product_id_idx on public.supplier_purchase_order_items(product_id);

alter table public.suppliers enable row level security;
alter table public.supplier_purchase_orders enable row level security;
alter table public.supplier_purchase_order_items enable row level security;

drop policy if exists suppliers_staff_all on public.suppliers;
create policy suppliers_staff_all on public.suppliers
  for all to authenticated
  using (is_staff())
  with check (is_staff());

drop policy if exists supplier_purchase_orders_staff_all on public.supplier_purchase_orders;
create policy supplier_purchase_orders_staff_all on public.supplier_purchase_orders
  for all to authenticated
  using (is_staff())
  with check (is_staff());

drop policy if exists supplier_purchase_order_items_staff_all on public.supplier_purchase_order_items;
create policy supplier_purchase_order_items_staff_all on public.supplier_purchase_order_items
  for all to authenticated
  using (is_staff())
  with check (is_staff());

grant select, insert, update, delete on table public.suppliers to authenticated;
grant select, insert, update, delete on table public.supplier_purchase_orders to authenticated;
grant select, insert, update, delete on table public.supplier_purchase_order_items to authenticated;
