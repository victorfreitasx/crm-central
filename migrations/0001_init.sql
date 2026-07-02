-- placar. — painel MIRA · schema inicial
-- Todos os timestamps em epoch ms (INTEGER).

CREATE TABLE users (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL UNIQUE COLLATE NOCASE,
  nome TEXT NOT NULL,
  cargo TEXT NOT NULL DEFAULT 'editor',
  role TEXT NOT NULL DEFAULT 'equipe' CHECK (role IN ('gestor','equipe')),
  cor TEXT NOT NULL DEFAULT '#F4E9D6',
  status TEXT NOT NULL DEFAULT 'ativo' CHECK (status IN ('ativo','convidado','suspenso')),
  clerk_user_id TEXT,
  last_seen_at INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
CREATE INDEX idx_users_clerk ON users(clerk_user_id);

CREATE TABLE pages (
  id TEXT PRIMARY KEY,
  handle TEXT NOT NULL UNIQUE,
  nome TEXT NOT NULL,
  color TEXT NOT NULL DEFAULT '#151210',
  fg TEXT NOT NULL DEFAULT '#FBF4E9',
  vert TEXT NOT NULL DEFAULT 'geral',
  seguidores INTEGER NOT NULL DEFAULT 0,
  -- Conexão Instagram Graph API (preenchido pelo fluxo OAuth)
  ig_user_id TEXT,
  ig_username TEXT,
  fb_page_id TEXT,
  access_token_enc TEXT,
  connected_at INTEGER,
  -- mediana de engajamento 90d da própria página (recalculada no sync)
  med_eng REAL,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);

CREATE TABLE page_members (
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  PRIMARY KEY (page_id, user_id)
);
CREATE INDEX idx_page_members_user ON page_members(user_id);

CREATE TABLE posts (
  id TEXT PRIMARY KEY,
  page_id TEXT NOT NULL REFERENCES pages(id),
  author_id TEXT NOT NULL REFERENCES users(id),
  cap TEXT NOT NULL DEFAULT '',
  fmt TEXT NOT NULL DEFAULT 'feed' CHECK (fmt IN ('feed','carrossel','reels','story')),
  status TEXT NOT NULL DEFAULT 'rascunho'
    CHECK (status IN ('rascunho','agendado','analisando','publicado','erro')),
  -- data de publicação (real ou agendada)
  ts INTEGER NOT NULL,
  tile_bg TEXT NOT NULL DEFAULT '#FFFFFF',
  tile_fg TEXT NOT NULL DEFAULT '#151210',
  -- conteúdo do estúdio
  title TEXT NOT NULL DEFAULT '',
  text TEXT NOT NULL DEFAULT '',
  caption TEXT NOT NULL DEFAULT '',
  comment_on INTEGER NOT NULL DEFAULT 0,
  comment_page_id TEXT,
  comment_text TEXT NOT NULL DEFAULT '',
  -- [{frame:'1'|'2h'|'2v'|'3', media:['media/...png', ...]}]
  slides TEXT NOT NULL DEFAULT '[]',
  -- integração IG
  ig_media_id TEXT,
  publish_error TEXT,
  -- desempenho
  er REAL,
  idp INTEGER,
  created_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch() * 1000)
);
CREATE INDEX idx_posts_ts ON posts(ts DESC);
CREATE INDEX idx_posts_author ON posts(author_id, ts DESC);
CREATE INDEX idx_posts_page ON posts(page_id, ts DESC);
CREATE INDEX idx_posts_status ON posts(status, ts);

-- Snapshot mais recente de métricas por post (Graph API → sync a cada 30 min)
CREATE TABLE post_metrics (
  post_id TEXT PRIMARY KEY REFERENCES posts(id) ON DELETE CASCADE,
  re INTEGER NOT NULL DEFAULT 0,  -- alcance
  im INTEGER NOT NULL DEFAULT 0,  -- impressões/views
  li INTEGER NOT NULL DEFAULT 0,  -- likes
  co INTEGER NOT NULL DEFAULT 0,  -- comentários
  sh INTEGER NOT NULL DEFAULT 0,  -- compartilhamentos
  sa INTEGER NOT NULL DEFAULT 0,  -- salvos
  cl INTEGER NOT NULL DEFAULT 0,  -- cliques no link
  nf INTEGER NOT NULL DEFAULT 0,  -- seguidores atribuídos
  cities TEXT,                    -- JSON [{n:'São Paulo', p:31}, ...]
  curve TEXT,                     -- JSON: 15 pontos da curva acumulada 48h (0..1)
  synced_at INTEGER
);

CREATE TABLE page_metrics_daily (
  page_id TEXT NOT NULL REFERENCES pages(id) ON DELETE CASCADE,
  day TEXT NOT NULL, -- YYYY-MM-DD
  seguidores INTEGER,
  alcance INTEGER,
  PRIMARY KEY (page_id, day)
);

CREATE TABLE settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
INSERT INTO settings (key, value) VALUES
  ('perms', '{"criar":true,"agendar":true,"metricas":false,"exportar":false}'),
  ('meta_semanal', '6');

CREATE TABLE audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  ts INTEGER NOT NULL,
  user_id TEXT,
  action TEXT NOT NULL,
  detail TEXT
);
CREATE INDEX idx_audit_ts ON audit_log(ts DESC);
