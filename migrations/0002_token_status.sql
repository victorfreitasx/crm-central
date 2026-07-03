-- Marca páginas cujo token da Graph API foi invalidado (senha trocada, permissão
-- revogada, app desautorizado — erro 190). A página continua "conectada" (ig_user_id),
-- mas o painel mostra "reconectar" e o sync para de tentar até o gestor refazer o OAuth.
ALTER TABLE pages ADD COLUMN token_invalid INTEGER NOT NULL DEFAULT 0;
