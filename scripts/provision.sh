#!/usr/bin/env bash
# Provisiona a infra do placar. na Cloudflare e implanta o Worker.
# Idempotente: pode rodar de novo sem medo.
#
# Uso:
#   export CLOUDFLARE_API_TOKEN=<token com acesso a Workers, D1 e KV>
#   npm run provision            # cria D1 + KVs, migra, sobe o worker
#   SEED_DEMO=1 npm run provision  # idem + popula dados de demonstração
set -euo pipefail
cd "$(dirname "$0")/.."

if [ -z "${CLOUDFLARE_API_TOKEN:-}" ]; then
  echo "✗ defina CLOUDFLARE_API_TOKEN antes de rodar (perfil: Workers Scripts, D1, KV Storage — Edit)"
  exit 1
fi

WRANGLER="npx wrangler"
CONFIG="wrangler.jsonc"

echo "→ conta Cloudflare:"
$WRANGLER whoami || true

# ---------- D1 ----------
db_id=$($WRANGLER d1 list --json 2>/dev/null | node -e '
  let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
    try { const db = JSON.parse(s).find((x) => x.name === "placar-mira"); if (db) console.log(db.uuid); } catch {}
  });' || true)

if [ -z "$db_id" ]; then
  echo "→ criando banco D1 placar-mira…"
  out=$($WRANGLER d1 create placar-mira 2>&1) || { echo "$out"; exit 1; }
  db_id=$(echo "$out" | grep -oE '[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}' | head -1)
fi
echo "  D1 placar-mira: $db_id"

# ---------- KV ----------
kv_id() {
  local title="$1"
  $WRANGLER kv namespace list --json 2>/dev/null | node -e '
    let s = ""; process.stdin.on("data", (d) => (s += d)).on("end", () => {
      try {
        const want = process.argv[1];
        const ns = JSON.parse(s).find((x) => x.title.endsWith(want));
        if (ns) console.log(ns.id);
      } catch {}
    });' "$title" || true
}

sessions_id=$(kv_id "SESSIONS")
if [ -z "$sessions_id" ]; then
  echo "→ criando KV SESSIONS…"
  out=$($WRANGLER kv namespace create SESSIONS 2>&1) || { echo "$out"; exit 1; }
  sessions_id=$(echo "$out" | grep -oE '[0-9a-f]{32}' | head -1)
fi
echo "  KV SESSIONS: $sessions_id"

cache_id=$(kv_id "CACHE")
if [ -z "$cache_id" ]; then
  echo "→ criando KV CACHE…"
  out=$($WRANGLER kv namespace create CACHE 2>&1) || { echo "$out"; exit 1; }
  cache_id=$(echo "$out" | grep -oE '[0-9a-f]{32}' | head -1)
fi
echo "  KV CACHE: $cache_id"

# ---------- injeta os IDs no wrangler.jsonc ----------
node - "$db_id" "$sessions_id" "$cache_id" <<'EOF'
const fs = require('fs');
const [db, sess, cache] = process.argv.slice(2);
let cfg = fs.readFileSync('wrangler.jsonc', 'utf8');
cfg = cfg.replace(/"database_id":\s*"[^"]*"/, `"database_id": "${db}"`);
let first = true;
cfg = cfg.replace(/("binding":\s*"SESSIONS",\s*"id":\s*)"[^"]*"/, `$1"${sess}"`);
cfg = cfg.replace(/("binding":\s*"CACHE",\s*"id":\s*)"[^"]*"/, `$1"${cache}"`);
fs.writeFileSync('wrangler.jsonc', cfg);
console.log('  wrangler.jsonc atualizado com os IDs reais');
EOF

# ---------- migrações ----------
echo "→ aplicando migrações no D1 remoto…"
$WRANGLER d1 migrations apply placar-mira --remote

if [ "${SEED_DEMO:-0}" = "1" ]; then
  echo "→ populando dados de demonstração…"
  node scripts/gen-seed.mjs > seeds/seed-demo.sql
  $WRANGLER d1 execute placar-mira --remote --file=seeds/seed-demo.sql
fi

# ---------- secrets ----------
has_secret() { $WRANGLER secret list 2>/dev/null | grep -q "\"$1\""; }
if ! has_secret SESSION_SECRET; then
  echo "→ gerando SESSION_SECRET…"
  node -e 'console.log(require("crypto").randomBytes(32).toString("hex"))' | $WRANGLER secret put SESSION_SECRET
fi

# ---------- deploy ----------
echo "→ implantando o Worker…"
$WRANGLER deploy

echo ""
echo "✓ pronto. próximo passo opcional (Instagram real):"
echo "    npx wrangler secret put META_APP_ID"
echo "    npx wrangler secret put META_APP_SECRET"
echo "  e ajuste APP_URL no wrangler.jsonc pra URL final do worker."
