# Maison Kranich · Empório das Caixas

> *Onde toda história encontra seu abrigo.*

Fundação ("o main") da plataforma de e-commerce premium da **Maison Kranich** — uma casa de memórias onde o cliente não compra produtos, **cria histórias**.

## Stack (Supabase-native)

| Camada | Tecnologia |
|---|---|
| Frontend | **Next.js 14** (App Router) · TypeScript · Tailwind · Framer Motion |
| Backend | **Supabase** — Postgres, Auth, Storage, Realtime, Edge Functions |
| Hospedagem | **Cloudflare** |
| Pagamentos | **Stripe** (via Edge Functions) — cartão, PIX, Apple/Google Pay |
| E-mail/SMS/WhatsApp | Edge Functions + provedor (a integrar) |

Projeto Supabase: `nsbxioehvydkazvvbhgq` (região us-east-1).

## Como rodar

```bash
npm install
npm run dev          # http://localhost:3000  (loja)
                     # http://localhost:3000/admin  (CMS / dashboard)
```

As credenciais públicas do Supabase já estão em `.env.local`. Para operações
administrativas (server-side) preencha `SUPABASE_SERVICE_ROLE_KEY`
(Supabase → Settings → API).

## O que já existe nesta fundação

**Banco de dados (aplicado no Supabase, com RLS):**
identidade/RBAC (`profiles`, roles), catálogo (`categories`, `collections`,
`products` por tipo: caixa, enchimento, laço, tag, cartão, adorno, presente),
**Monte Sua Caixa** (`compositions` + `composition_items`), pedidos com histórico
de status automático, assinaturas + planos, cupons + resgates, carteira digital,
**Ateliê de Conversas** (conversas/mensagens), arquivos, personalizações,
**Curadoria de Presentes** (sessões + regras de IA), disputas, reembolsos,
notificações, conteúdo/blog, configurações e auditoria (LGPD/GDPR). Já vem
**seedado** com categorias, 3 coleções (Mineira, Europeia, Báltica), 4 planos,
componentes do configurador e cupons.

**Frontend:**
- Design System Maison Kranich (paleta oficial, tipografia Cormorant/Playfair/Inter, tokens, microinterações).
- Brasão MK e identidade aplicada em loja e CMS.
- **Home** cinematográfica: hero + configurador "Caixa dos Sonhos" (ligado ao banco), diferenciais, ocasiões, inspirações, coleções e categorias.
- **CMS / Dashboard** escuro-dourado fiel ao mockup: sidebar completa, cards de métricas (receita real do banco), gráfico de receita, pedidos recentes, curadoria, assinaturas, atendimento, disputas e cupons.

## Estrutura

```
src/
  app/
    page.tsx               # Home (loja)
    layout.tsx             # fontes + metadata
    globals.css            # design system
    (admin)/admin/         # CMS · layout + dashboard
  components/
    ui/    Logo, Button    # brasão + componentes base
    site/  Header, Footer
    home/  Hero, BoxBuilder
    admin/ Sidebar, StatCard, RevenueChart
  lib/
    brand.ts               # fonte de verdade da marca
    supabase/              # clients (browser + server SSR)
    database.types.ts      # tipos gerados do schema
    format.ts, cn.ts
```

## Próximos passos sugeridos

1. Auth (login/registro) + middleware de sessão.
2. Páginas `/loja`, `/monte-sua-caixa` (configurador completo + visualizador 3D), `/curadoria` (chat concierge).
3. Edge Functions: checkout Stripe, webhooks, notificações.
4. Área do cliente "Meu Baú" e demais módulos do CMS.
```
