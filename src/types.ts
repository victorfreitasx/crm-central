export interface Env {
  DB: D1Database;
  SESSIONS: KVNamespace;
  CACHE: KVNamespace;
  ASSETS: Fetcher;
  AUTH_MODE: 'dev' | 'clerk' | string;
  ADMIN_EMAIL: string;
  APP_URL: string;
  DEMO_MODE?: string;
  SESSION_SECRET?: string;
  META_APP_ID?: string;
  META_APP_SECRET?: string;
  CLERK_SECRET_KEY?: string;
  CLERK_JWKS_URL?: string;
  CLERK_ISSUER?: string;
  CLERK_AUTHORIZED_PARTIES?: string;
}

export type Role = 'gestor' | 'equipe';
export type PostStatus = 'rascunho' | 'agendado' | 'analisando' | 'publicado' | 'erro';
export type Fmt = 'feed' | 'carrossel' | 'reels' | 'story';

export interface UserRow {
  id: string;
  email: string;
  nome: string;
  cargo: string;
  role: Role;
  cor: string;
  status: 'ativo' | 'convidado' | 'suspenso';
  clerk_user_id: string | null;
  last_seen_at: number | null;
  created_at: number;
}

export interface PageRow {
  id: string;
  handle: string;
  nome: string;
  color: string;
  fg: string;
  vert: string;
  seguidores: number;
  ig_user_id: string | null;
  ig_username: string | null;
  fb_page_id: string | null;
  access_token_enc: string | null;
  connected_at: number | null;
  token_invalid: number;
  med_eng: number | null;
  created_at: number;
}

export interface PostRow {
  id: string;
  page_id: string;
  author_id: string;
  cap: string;
  fmt: Fmt;
  status: PostStatus;
  ts: number;
  tile_bg: string;
  tile_fg: string;
  title: string;
  text: string;
  caption: string;
  comment_on: number;
  comment_page_id: string | null;
  comment_text: string;
  slides: string;
  ig_media_id: string | null;
  publish_error: string | null;
  er: number | null;
  idp: number | null;
  created_at: number;
  updated_at: number;
}

export interface MetricsRow {
  post_id: string;
  re: number;
  im: number;
  li: number;
  co: number;
  sh: number;
  sa: number;
  cl: number;
  nf: number;
  cities: string | null;
  curve: string | null;
  synced_at: number | null;
}

export interface Perms {
  criar: boolean;
  agendar: boolean;
  metricas: boolean;
  exportar: boolean;
}

export interface SessionUser extends UserRow {
  pages: string[]; // page ids the user can publish on (all, if gestor)
}

export const DAY = 864e5;
