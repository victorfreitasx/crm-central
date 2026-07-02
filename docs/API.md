# placar. — contrato da API

Todas as rotas em `/api/*`. Autenticação por cookie de sessão `sid` (httpOnly).
Erros: `{ "error": "mensagem" }` com status 4xx/5xx. Timestamps em **epoch ms**.

## Objeto `post` (linhas de listas)

```json
{
  "id": "p12", "cap": "título do post", "page_id": "pg2", "author_id": "u1",
  "fmt": "feed|carrossel|reels|story",
  "status": "rascunho|agendado|analisando|publicado|erro",
  "ts": 1783000000000, "tile_bg": "#FF2E7E", "tile_fg": "#FFFFFF",
  "idp": 128, "er": 0.081,
  "m": { "re": 120000, "im": 145000, "li": 8000, "co": 420, "sh": 900, "sa": 1200, "cl": 640, "nf": 210 }
}
```
`m` é `null` para rascunho/agendado. `idp` idem.

## Auth
- `POST /api/auth/request-link` `{email}` → `{sent:true, link?}` (`link` só em AUTH_MODE=dev)
- `GET /api/auth/verify?token=` → redirect `/` com cookie de sessão
- `POST /api/auth/logout` → `{ok}`

## Sessão / bootstrap
- `GET /api/bootstrap` →
```json
{
  "me": {"id","nome","email","cargo","role":"gestor|equipe","cor","pages":["pg1"]},
  "pages": [{"id","handle","nome","color","fg","vert","seguidores",  "connected":false}],
  "users": [{"id","nome","cargo","cor","role","status","pages":["pg1"]}],
  "perms": {"criar":true,"agendar":true,"metricas":false,"exportar":false},
  "metaSemanal": 6, "authMode": "dev", "demoMode": true, "metaConfigured": false,
  "weekStart": 1782518400000
}
```

## Dashboard (gestor)
- `GET /api/dashboard` →
```json
{
  "G": {
    "posts30":137,"re":41000000,"inter":3400000,"ctr":0.011,"nf":88000,
    "sPosts":[14 números/dia],"sRe":[...],"sInter":[...],"sCtr":[...],"sNf":[...],
    "week":12,"heat":[[7 linhas × 5 faixas 0..1]],"bestDay":3,"bestSlot":3,
    "fmtCount":{"feed":40,"carrossel":51,"reels":28,"story":18},
    "fmtRe":{"feed":...}
  },
  "U": { "u1": {"posts30","re","inter","cl","ctr","nf","sa","idpAvg","delta","spark":[8×0..1],"fmtMix":{feed..},"week","bestId","rank"} },
  "order": ["u3","u1",...],
  "radar": {"agendados":9,"rascunhos":4,"analise":6},
  "viral": [post...], "pagePerf": [{"page_id","re"}],
  "recent": [post×8], "postsTotais": 137, "metaSemanal": 6, "lastSync": 1783000000000
}
```

## Equipe (gestor)
- `GET /api/team` → `{"rows":[{"user":{id,nome,cargo,cor},"stats":<U>}], "metaSemanal":6}` (ordenado por idpAvg)

## Perfil
- `GET /api/profile/:uid` (`me` = você; equipe só vê o próprio, salvo perm `metricas`) →
```json
{
  "user": {"id","nome","cargo","cor","role","pages":["pg2"]},
  "stats": <U>, "perPage": [{"page_id","posts","re"}],
  "best": post|null, "posts": [post×15], "postsTotal": 26,
  "teamCount": 7, "metaSemanal": 6
}
```

## Posts
- `GET /api/posts?q=&page=&fmt=&status=&author=&sort=recentes|alcance|idp&limit=30&offset=0`
  → `{total, rows:[post]}` (equipe: sempre filtrado pro próprio autor)
- `GET /api/posts/:id` → `{post:{...post, title, text, caption, comment_on, comment_page_id, comment_text, slides:[{frame,media:[keys]}], ig_media_id, publish_error, cities:[{n,p}], curve:[15×0..1], synced_at}, medEng: 0.062}`
- `POST /api/posts` `{page_id, fmt, title, text, caption, comment_on, comment_page_id, comment_text, slides, tile_bg, tile_fg}` → `{id}` (201)
- `PUT /api/posts/:id` (só rascunho/erro) mesmo body → `{ok}`
- `DELETE /api/posts/:id` (rascunho/agendado/erro) → `{ok}`
- `POST /api/posts/:id/media?slide=0&cell=0` body binário `image/png|jpeg|webp` → `{key, url}` (201)
- `POST /api/posts/:id/schedule` `{ts, page_id?, now?}` → `{ok, status, ts}`
  - `ts` ≤ agora+60s ⇒ publica na hora (Graph API se conectada; senão demo → `analisando`)
  - futuro ⇒ `agendado` (cron publica)

## Agenda
- `GET /api/agenda?y=2026&m=6` (m = 0-11) →
  `{month:[post], fila:[post×7], drafts:[post], heat, bestDay, bestSlot}`

## Páginas
- `GET /api/pages` → `{cards:[{id,handle,nome,color,fg,vert,seguidores,connected,stats:{posts30,re,eng,nf,spark:[8],topFmt},team:[userIds]}]}`

## Config (gestor)
- `GET /api/config` → `{members:[{id,nome,email,cargo,role,cor,status,last_seen_at,pages:[]}], perms, metaSemanal, infra:{posts,metrics,pages,lastSync,demoMode,metaConfigured,authMode}}`
- `POST /api/invites` `{email,cargo}` → `{ok,id,link?}` (201)
- `PATCH /api/members/:id` `{cargo?, role?}` → `{ok}`
- `POST /api/members/:id/suspend` → `{ok,status}`
- `PUT /api/members/:id/pages` `{page_ids:[]}` → `{ok}`
- `PUT /api/perms` `{criar?,agendar?,metricas?,exportar?}` → `{ok,perms}`
- `PUT /api/settings/meta-semanal` `{metaSemanal}` → `{ok,metaSemanal}`

## Exportação
- `GET /api/export/posts.csv` (gestor ou perm `exportar`) → CSV download

## Meta / Instagram
- `GET /api/meta/oauth/start` (gestor) → redirect pro dialog OAuth
- `GET /api/meta/oauth/callback` → importa páginas IG business, redirect `/#/paginas?conectadas=N`

## Admin
- `POST /api/admin/wipe-demo` (gestor) → remove dados do seed
- `POST /api/admin/sync-now` (gestor) → roda o ciclo de sync na hora

## Mídia
- `GET /media/<key>` → arte pública (PNG/JPEG/WebP, imutável)
