alter type public.dispute_status add value if not exists 'warning_needs_response';
alter type public.dispute_status add value if not exists 'warning_under_review';

alter table public.subscriptions
  add column if not exists stripe_customer_id text;

alter table public.disputes
  add column if not exists subscription_id uuid references public.subscriptions(id) on delete set null,
  add column if not exists kind text not null default 'order' check (kind in ('order', 'subscription', 'unknown')),
  add column if not exists stripe_charge_id text,
  add column if not exists stripe_payment_intent text,
  add column if not exists stripe_invoice_id text,
  add column if not exists stripe_customer_id text,
  add column if not exists livemode boolean not null default true,
  add column if not exists event_type text,
  add column if not exists payload jsonb not null default '{}'::jsonb,
  add column if not exists opened_at timestamptz,
  add column if not exists closed_at timestamptz;

create unique index if not exists disputes_stripe_dispute_id_uidx
  on public.disputes(stripe_dispute_id)
  where stripe_dispute_id is not null;

create index if not exists subscriptions_stripe_customer_id_idx on public.subscriptions(stripe_customer_id);
create index if not exists disputes_subscription_id_idx on public.disputes(subscription_id);
create index if not exists disputes_stripe_charge_id_idx on public.disputes(stripe_charge_id);
create index if not exists disputes_stripe_payment_intent_idx on public.disputes(stripe_payment_intent);
create index if not exists disputes_stripe_invoice_id_idx on public.disputes(stripe_invoice_id);
create index if not exists disputes_kind_status_idx on public.disputes(kind, status);

grant select, insert, update, delete on table public.disputes to authenticated;
