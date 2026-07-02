# placar. — painel MIRA

CRM de conteúdo e desempenho para uma marca de mídia que opera várias páginas de
Instagram. A equipe **cria posts num estúdio com layout travado** e publica
direto pela plataforma; o gestor acompanha **trabalho e estatísticas** de
colaboradores e páginas num placar por qualidade (IDP), não por volume.

100% edge: **Cloudflare Workers + D1 + KV** — sem servidor dedicado.

## Como funciona

| Papel | O que vê |
|---|---|
| **gestor** | visão geral (KPIs, placar da equipe, radar, em alta), equipe, posts de todos, estúdio, agenda, páginas, config (membros/convites/permissões/infra) |
| **equipe** | o próprio placar, os próprios posts, estúdio, agenda, páginas |

- **IDP** = engajamento do post ÷ mediana 90d da própria página × 100 (clamp 24–320).
  Páginas pequenas competem de igual pra igual. Tiers: S ≥115 · A ≥105 · B ≥92 · C.
- **Ciclo do post**: `rascunho → agendado → analisando (48h) → publicado` (+ `erro`).
- **Estúdio**: layout 1080×1350 travado no padrão da rede (fonte, margens, balão
  de comentário). Gera a arte final em canvas, exporta .zip ou publica via API.
- **Sync**: cron a cada 30 min publica agendados vencidos e puxa métricas da
  Instagram Graph API pro D1 (páginas conectadas). Páginas não conectadas rodam
  em **modo demo** com métricas simuladas determinísticas — o produto inteiro
  funciona de ponta a ponta antes do OAuth da Meta.

## Stack

- **Worker** ([src/](src/)): Hono + TypeScript. API em [`/api/*`](docs/API.md), assets estáticos, cron.
- **D1**: usuários, páginas, posts, métricas ([migrations/](migrations/)).
- **KV**: `SESSIONS` (sessões + magic links) e `CACHE` (agregados + artes em `/media/*`).
- **Front-end** ([public/](public/)): SPA vanilla-JS sem build, design system
  neobrutalista "diferentona" (tokens em [public/ds/](public/ds/)).
- **Auth**: magic link sem senha (sessões no KV). Pronto pra trocar por
  **Clerk** (`AUTH_MODE=clerk` + JWT via JWKS) sem mexer no resto.

## Rodar local

```bash
npm install
cp .dev.vars.example .dev.vars
npm run migrate:local
npm run gen:seed && npm run seed:local   # dados de demonstração
npm run dev                              # http://localhost:8787
```

Entre com `victorfreitasx@gmail.com` (vira gestor — `ADMIN_EMAIL` no
wrangler.jsonc) ou `marcos@mira.co` (gestor do seed). Em `AUTH_MODE=dev` o link
mágico aparece na própria tela de login.

## Implantar na Cloudflare

```bash
export CLOUDFLARE_API_TOKEN=<token>   # Workers Scripts + D1 + KV (Edit)
npm run provision                     # cria D1/KV, migra, gera SESSION_SECRET, deploya
SEED_DEMO=1 npm run provision         # idem, com dados de demonstração
```

Ou via GitHub Actions: adicione o secret `CLOUDFLARE_API_TOKEN` no repositório e
rode o workflow **deploy** (ou faça push na `main`). Depois do primeiro deploy,
ajuste `APP_URL` no [wrangler.jsonc](wrangler.jsonc) pra URL real do worker
(usada nos redirects do OAuth e nas URLs públicas das artes).

## Conectar o Instagram de verdade

1. Crie um app na [Meta for Developers](https://developers.facebook.com) com o
   produto *Instagram Graph API* (contas IG **business** vinculadas a páginas do
   Facebook).
2. Configure o redirect OAuth: `https://<seu-worker>/api/meta/oauth/callback`.
3. Secrets no worker:
   ```bash
   npx wrangler secret put META_APP_ID
   npx wrangler secret put META_APP_SECRET
   ```
4. No painel (como gestor): **páginas → conectar página**. As contas IG business
   entram com token criptografado (AES-GCM) no D1; o cron passa a puxar métricas
   reais e publicar agendados.
5. Quando quiser, limpe o demo: `POST /api/admin/wipe-demo` (gestor).

Limitações conhecidas da Graph API: publicar **reels** exige vídeo (o estúdio
gera imagens); comentário automático só funciona na própria página que publicou
— comentário "de outra página" fica registrado no audit log pra fazer manualmente.

## Trocar o auth pra Clerk

```bash
# wrangler.jsonc: "AUTH_MODE": "clerk"
npx wrangler secret put CLERK_SECRET_KEY
npx wrangler secret put CLERK_JWKS_URL   # https://<slug>.clerk.accounts.dev/.well-known/jwks.json
```

O backend valida o JWT de sessão do Clerk (RS256/JWKS, cache no KV) e mapeia o
usuário por email — convites continuam controlando quem entra.

## Permissões do papel "equipe" (config)

| chave | efeito |
|---|---|
| `criar` | pode montar artes e salvar rascunhos |
| `agendar` | agenda sem aprovação (desligado → só o gestor publica) |
| `metricas` | vê o placar dos colegas (senão, só o próprio) |
| `exportar` | download do CSV de métricas |

## Documentação

- [docs/API.md](docs/API.md) — contrato completo da API
- [migrations/0001_init.sql](migrations/0001_init.sql) — schema D1
- Seed de demonstração: [scripts/gen-seed.mjs](scripts/gen-seed.mjs) → [seeds/seed-demo.sql](seeds/seed-demo.sql) (determinístico)
