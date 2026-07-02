-- seed de demonstração (gerado por scripts/gen-seed.mjs — não editar na mão)
-- Remove antes de conectar páginas reais: POST /api/admin/wipe-demo
DELETE FROM post_metrics; DELETE FROM posts; DELETE FROM page_members;
DELETE FROM page_metrics_daily; DELETE FROM pages; DELETE FROM users WHERE id LIKE 'u%';
INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  ('u0', 'marcos@mira.co', 'Marcos Vila', 'gestor', 'gestor', '#CBFB45', 'ativo', 1783000800000);
INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  ('u1', 'ana@mira.co', 'Ana Beatriz Souza', 'designer sr', 'equipe', '#FFC9DF', 'ativo', 1783000800000);
INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  ('u2', 'caio@mira.co', 'Caio Duarte', 'editor de vídeo', 'equipe', '#ECFFB8', 'ativo', 1783000800000);
INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  ('u3', 'duda@mira.co', 'Duda Ferraz', 'social designer', 'equipe', '#D9CCFF', 'ativo', 1782982800000);
INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  ('u4', 'felipe@mira.co', 'Felipe Rocha', 'redator', 'equipe', '#FFD7C2', 'ativo', 1782990000000);
INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  ('u5', 'iara@mira.co', 'Iara Mendes', 'designer', 'equipe', '#FFE6EF', 'ativo', 1782982800000);
INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  ('u6', 'leo@mira.co', 'Léo Martins', 'editor', 'equipe', '#F4E9D6', 'ativo', 1782993600000);
INSERT INTO users (id, email, nome, cargo, role, cor, status, last_seen_at) VALUES
  ('u7', 'sofia@mira.co', 'Sofia Prado', 'motion designer', 'equipe', '#D2F4E2', 'ativo', 1782982800000);
INSERT INTO pages (id, handle, nome, color, fg, vert, seguidores, med_eng) VALUES
  ('pg1', '@mira.noticias', 'MIRA Notícias', '#151210', '#FBF4E9', 'noticias', 1840000, 0.09141857259588798);
INSERT INTO pages (id, handle, nome, color, fg, vert, seguidores, med_eng) VALUES
  ('pg2', '@mira.pop', 'MIRA Pop', '#FF2E7E', '#FFFFFF', 'pop', 1120000, 0.1144969059208214);
INSERT INTO pages (id, handle, nome, color, fg, vert, seguidores, med_eng) VALUES
  ('pg3', '@mira.esportes', 'MIRA Esportes', '#CBFB45', '#151210', 'esportes', 894000, 0.08471350633887355);
INSERT INTO pages (id, handle, nome, color, fg, vert, seguidores, med_eng) VALUES
  ('pg4', '@mira.memes', 'MIRA Memes', '#FF6B2C', '#FFFFFF', 'memes', 2310000, 0.11674507930090236);
INSERT INTO pages (id, handle, nome, color, fg, vert, seguidores, med_eng) VALUES
  ('pg5', '@mira.grana', 'MIRA Grana', '#7A4DFF', '#FFFFFF', 'grana', 412000, 0.12161193684369839);
INSERT INTO page_members (page_id, user_id) VALUES ('pg2', 'u1');
INSERT INTO page_members (page_id, user_id) VALUES ('pg4', 'u1');
INSERT INTO page_members (page_id, user_id) VALUES ('pg3', 'u2');
INSERT INTO page_members (page_id, user_id) VALUES ('pg1', 'u2');
INSERT INTO page_members (page_id, user_id) VALUES ('pg4', 'u3');
INSERT INTO page_members (page_id, user_id) VALUES ('pg2', 'u3');
INSERT INTO page_members (page_id, user_id) VALUES ('pg1', 'u4');
INSERT INTO page_members (page_id, user_id) VALUES ('pg5', 'u4');
INSERT INTO page_members (page_id, user_id) VALUES ('pg5', 'u5');
INSERT INTO page_members (page_id, user_id) VALUES ('pg2', 'u5');
INSERT INTO page_members (page_id, user_id) VALUES ('pg3', 'u6');
INSERT INTO page_members (page_id, user_id) VALUES ('pg4', 'u6');
INSERT INTO page_members (page_id, user_id) VALUES ('pg2', 'u7');
INSERT INTO page_members (page_id, user_id) VALUES ('pg1', 'u7');
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p0', 'pg2', 'u1', 'Quiz: qual diva você seria?', 'feed', 'publicado', 1780821240000, '#151210', '#FBF4E9', 'Quiz: qual diva você seria? — link na bio. #redemira', 0.12301747903368947, 107, 1780821240000, 1780821240000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p0', 551003, 620596, 52871, 5545, 3068, 6299, 12775, 1567, '[{"n":"São Paulo","p":39},{"n":"Rio de Janeiro","p":26},{"n":"Recife","p":20},{"n":"Curitiba","p":15}]', '[0.0818,0.1121,0.1519,0.2026,0.265,0.3383,0.4204,0.5071,0.5934,0.6743,0.746,0.8064,0.8552,0.8934,0.9224]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p1', 'pg2', 'u1', 'Bastidores do clipe mais caro do ano', 'carrossel', 'publicado', 1780589700000, '#151210', '#FBF4E9', 'Bastidores do clipe mais caro do ano — link na bio. #redemira', 0.1384308710696555, 121, 1780589700000, 1780589700000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p1', 132940, 157694, 11442, 927, 1133, 4901, 1727, 161, '[{"n":"São Paulo","p":58},{"n":"Belo Horizonte","p":17},{"n":"Rio de Janeiro","p":15},{"n":"Porto Alegre","p":10}]', '[0.154,0.2192,0.3021,0.4003,0.5072,0.6135,0.7099,0.7905,0.8534,0.8997,0.9326,0.9552,0.9705,0.9807,0.9874]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p2', 'pg2', 'u1', 'Red carpet: os looks que quebraram a internet', 'carrossel', 'publicado', 1780058280000, '#FF2E7E', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.1225304553849598, 107, 1780058280000, 1780058280000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p2', 160809, 182593, 11686, 1101, 1090, 5827, 2447, 422, '[{"n":"São Paulo","p":46},{"n":"Rio de Janeiro","p":30},{"n":"Belo Horizonte","p":15},{"n":"Curitiba","p":9}]', '[0.0478,0.0745,0.1142,0.1712,0.2486,0.3464,0.4592,0.5763,0.6854,0.7773,0.8482,0.8995,0.9348,0.9583,0.9735]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p3', 'pg2', 'u1', 'O retorno da banda que marcou os anos 2000', 'reels', 'publicado', 1781452920000, '#151210', '#FBF4E9', 'O retorno da banda que marcou os anos 2000 — link na bio. #redemira', 0.11152734541403152, 97, 1781452920000, 1781452920000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p3', 762925, 869999, 60611, 4379, 10195, 9902, 18944, 1387, '[{"n":"São Paulo","p":34},{"n":"Rio de Janeiro","p":33},{"n":"Curitiba","p":19},{"n":"Fortaleza","p":14}]', '[0.0449,0.0851,0.1555,0.2669,0.4187,0.5876,0.7381,0.8479,0.9169,0.9562,0.9774,0.9884,0.9941,0.997,0.9985]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p4', 'pg2', 'u1', 'Festival de inverno anuncia line-up', 'story', 'publicado', 1778872020000, '#FF2E7E', '#FBF4E9', 'Festival de inverno anuncia line-up — link na bio. #redemira', 0.12079818396296553, 106, 1778872020000, 1778872020000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p4', 100879, 113960, 9305, 857, 854, 1170, 524, 164, '[{"n":"São Paulo","p":48},{"n":"Rio de Janeiro","p":29},{"n":"Belo Horizonte","p":14},{"n":"Recife","p":10}]', '[0.1255,0.1715,0.2299,0.301,0.3831,0.4725,0.5637,0.6508,0.7288,0.7949,0.8483,0.8897,0.9208,0.9437,0.9603]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p5', 'pg4', 'u1', 'A planilha me olhando às 17h58', 'story', 'publicado', 1781118360000, '#FF6B2C', '#FBF4E9', 'A planilha me olhando às 17h58 — link na bio. #redemira', 0.10330680499506383, 88, 1781118360000, 1781118360000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p5', 461896, 532765, 31191, 2175, 7619, 6732, 8961, 395, '[{"n":"São Paulo","p":39},{"n":"Rio de Janeiro","p":36},{"n":"Belo Horizonte","p":12},{"n":"Salvador","p":12}]', '[0.1023,0.1506,0.2162,0.3003,0.4003,0.5095,0.6177,0.7154,0.7963,0.8588,0.9044,0.9364,0.9582,0.9727,0.9823]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p6', 'pg4', 'u1', 'POV: segunda-feira chegou de novo', 'carrossel', 'publicado', 1780842480000, '#7A4DFF', '#FBF4E9', 'POV: segunda-feira chegou de novo — link na bio. #redemira', 0.12525608549975778, 107, 1780842480000, 1780842480000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p6', 792704, 862087, 61637, 4054, 15723, 17877, 15448, 1453, '[{"n":"São Paulo","p":44},{"n":"Rio de Janeiro","p":26},{"n":"Belo Horizonte","p":17},{"n":"Salvador","p":13}]', '[0.1496,0.2092,0.2847,0.3744,0.4738,0.5752,0.6707,0.7539,0.8216,0.8739,0.9124,0.94,0.9593,0.9726,0.9816]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p7', 'pg2', 'u1', 'Top 10 hits do momento', 'feed', 'publicado', 1781964780000, '#FF2E7E', '#FBF4E9', 'Top 10 hits do momento — link na bio. #redemira', 0.12046690610569523, 105, 1781964780000, 1781964780000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p7', 194900, 254764, 17866, 1672, 1752, 2189, 1164, 483, '[{"n":"São Paulo","p":38},{"n":"Rio de Janeiro","p":27},{"n":"Recife","p":18},{"n":"Curitiba","p":17}]', '[0.1227,0.208,0.3304,0.481,0.6352,0.7659,0.86,0.9203,0.9559,0.976,0.9871,0.9931,0.9963,0.998,0.999]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p8', 'pg2', 'u1', 'Red carpet: os looks que quebraram a internet', 'reels', 'publicado', 1777984860000, '#7A4DFF', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.07404418948302278, 65, 1777984860000, 1777984860000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p8', 734926, 919830, 38629, 2427, 5076, 8285, 13163, 2332, '[{"n":"São Paulo","p":56},{"n":"Rio de Janeiro","p":28},{"n":"Belo Horizonte","p":8},{"n":"Fortaleza","p":8}]', '[0.0789,0.1091,0.1489,0.2001,0.2633,0.3381,0.4219,0.5105,0.5985,0.6805,0.7527,0.8131,0.8614,0.8988,0.927]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p9', 'pg4', 'u1', 'A planilha me olhando às 17h58', 'carrossel', 'publicado', 1781806380000, '#FF6B2C', '#FBF4E9', 'A planilha me olhando às 17h58 — link na bio. #redemira', 0.10367905174378847, 89, 1781806380000, 1781806380000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p9', 1096750, 1519322, 73752, 6328, 10683, 22947, 17435, 2574, '[{"n":"São Paulo","p":49},{"n":"Rio de Janeiro","p":28},{"n":"Curitiba","p":12},{"n":"Porto Alegre","p":12}]', '[0.2348,0.3215,0.4225,0.5304,0.6356,0.7292,0.8062,0.8653,0.9084,0.9387,0.9594,0.9733,0.9826,0.9886,0.9926]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p10', 'pg2', 'u1', 'Quiz: qual diva você seria?', 'carrossel', 'publicado', 1778013060000, '#FF2E7E', '#FBF4E9', 'Quiz: qual diva você seria? — link na bio. #redemira', 0.09966686072837828, 87, 1778013060000, 1778013060000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p10', 123672, 138282, 8352, 547, 944, 2483, 2634, 358, '[{"n":"Rio de Janeiro","p":39},{"n":"São Paulo","p":30},{"n":"Belo Horizonte","p":19},{"n":"Curitiba","p":12}]', '[0.0407,0.0674,0.1098,0.1738,0.264,0.3796,0.5106,0.6402,0.7522,0.8381,0.8982,0.9377,0.9625,0.9777,0.9868]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p11', 'pg2', 'u1', 'Red carpet: os looks que quebraram a internet', 'carrossel', 'publicado', 1780400700000, '#FF2E7E', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.13674823793815122, 119, 1780400700000, 1780400700000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p11', 179761, 225537, 16658, 1623, 1207, 5094, 4278, 575, '[{"n":"São Paulo","p":39},{"n":"Rio de Janeiro","p":33},{"n":"Curitiba","p":15},{"n":"Porto Alegre","p":13}]', '[0.076,0.1448,0.2586,0.4181,0.5967,0.753,0.8626,0.9282,0.9638,0.9821,0.9912,0.9957,0.9979,0.999,0.9995]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p12', 'pg4', 'u1', 'Expectativa vs realidade: academia', 'carrossel', 'publicado', 1779701820000, '#FF6B2C', '#FBF4E9', 'Expectativa vs realidade: academia — link na bio. #redemira', 0.1530330247340058, 131, 1779701820000, 1779701820000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p12', 1302660, 1727232, 111186, 8770, 32228, 47166, 31210, 4603, '[{"n":"São Paulo","p":44},{"n":"Rio de Janeiro","p":21},{"n":"Curitiba","p":19},{"n":"Fortaleza","p":16}]', '[0.1248,0.172,0.2324,0.3061,0.3912,0.4835,0.577,0.6653,0.7433,0.8084,0.8601,0.8996,0.9288,0.95,0.9652]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p13', 'pg2', 'u1', 'Turnê mundial 2027 confirmada', 'carrossel', 'publicado', 1780002600000, '#FF2E7E', '#FBF4E9', 'Turnê mundial 2027 confirmada — link na bio. #redemira', 0.1432061277839294, 125, 1780002600000, 1780002600000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p13', 175202, 193725, 17919, 1104, 1368, 4699, 1067, 304, '[{"n":"São Paulo","p":41},{"n":"Rio de Janeiro","p":25},{"n":"Porto Alegre","p":17},{"n":"Salvador","p":16}]', '[0.2498,0.3424,0.4488,0.56,0.6656,0.7568,0.8295,0.8838,0.9225,0.949,0.9668,0.9785,0.9861,0.9911,0.9943]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p14', 'pg2', 'u1', 'Red carpet: os looks que quebraram a internet', 'carrossel', 'publicado', 1778012640000, '#151210', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.09438373997767964, 82, 1778012640000, 1778012640000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p14', 904107, 986426, 53944, 5050, 4480, 21859, 9992, 3104, '[{"n":"São Paulo","p":43},{"n":"Rio de Janeiro","p":33},{"n":"Porto Alegre","p":14},{"n":"Fortaleza","p":11}]', '[0.0809,0.1411,0.2346,0.364,0.5165,0.666,0.7883,0.8742,0.9284,0.9603,0.9784,0.9883,0.9937,0.9966,0.9982]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p15', 'pg2', 'u1', 'Reality: o resumo da semana em 10 memes', 'carrossel', 'publicado', 1781109300000, '#FF2E7E', '#FBF4E9', 'Reality: o resumo da semana em 10 memes — link na bio. #redemira', 0.13536375174983034, 118, 1781109300000, 1781109300000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p15', 352177, 486922, 30435, 2969, 2875, 11393, 6342, 705, '[{"n":"São Paulo","p":53},{"n":"Rio de Janeiro","p":25},{"n":"Curitiba","p":11},{"n":"Fortaleza","p":10}]', '[0.0457,0.1001,0.2053,0.3752,0.5826,0.7644,0.8829,0.946,0.976,0.9895,0.9955,0.998,0.9992,0.9996,0.9998]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p16', 'pg2', 'u1', 'O retorno da banda que marcou os anos 2000', 'carrossel', 'publicado', 1780945980000, '#151210', '#FBF4E9', 'O retorno da banda que marcou os anos 2000 — link na bio. #redemira', 0.11752936285209438, 103, 1780945980000, 1780945980000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p16', 115452, 137434, 9799, 787, 580, 2403, 1929, 123, '[{"n":"São Paulo","p":41},{"n":"Rio de Janeiro","p":38},{"n":"Curitiba","p":11},{"n":"Brasília","p":11}]', '[0.035,0.067,0.1245,0.2199,0.3583,0.5252,0.6867,0.8128,0.8958,0.9446,0.9712,0.9853,0.9925,0.9962,0.9981]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p17', 'pg4', 'u1', 'Tradutor de reunião corporativa', 'carrossel', 'publicado', 1778769060000, '#FF6B2C', '#FBF4E9', 'Tradutor de reunião corporativa — link na bio. #redemira', 0.10923278104298093, 94, 1778769060000, 1778769060000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p17', 695890, 942289, 45768, 3734, 8445, 18067, 11336, 2885, '[{"n":"São Paulo","p":61},{"n":"Belo Horizonte","p":13},{"n":"Rio de Janeiro","p":13},{"n":"Salvador","p":12}]', '[0.0732,0.1304,0.2216,0.3508,0.5064,0.6607,0.7871,0.8753,0.9302,0.9619,0.9796,0.9891,0.9942,0.997,0.9984]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p18', 'pg4', 'u1', 'Eu fingindo que li o contrato', 'carrossel', 'publicado', 1778609160000, '#FF6B2C', '#FBF4E9', 'Eu fingindo que li o contrato — link na bio. #redemira', 0.15620724404811767, 134, 1778609160000, 1778609160000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p18', 787902, 843360, 74663, 8249, 19059, 21105, 11463, 841, '[{"n":"São Paulo","p":40},{"n":"Rio de Janeiro","p":34},{"n":"Belo Horizonte","p":15},{"n":"Fortaleza","p":11}]', '[0.2895,0.3715,0.4616,0.5544,0.6435,0.7236,0.7916,0.8464,0.8888,0.9206,0.9439,0.9606,0.9725,0.9809,0.9868]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p19', 'pg2', 'u1', 'O retorno da banda que marcou os anos 2000', 'feed', 'publicado', 1779288240000, '#FF2E7E', '#FBF4E9', 'O retorno da banda que marcou os anos 2000 — link na bio. #redemira', 0.10235726982446093, 89, 1779288240000, 1779288240000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p19', 740348, 812203, 59041, 2957, 4369, 9413, 12856, 1430, '[{"n":"São Paulo","p":45},{"n":"Rio de Janeiro","p":28},{"n":"Curitiba","p":15},{"n":"Brasília","p":12}]', '[0.0072,0.0147,0.0296,0.0588,0.1134,0.2076,0.3492,0.5236,0.6924,0.8218,0.9043,0.9508,0.9754,0.9878,0.994]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p20', 'pg2', 'u1', 'Top 10 hits do momento', 'feed', 'publicado', 1779899880000, '#FF2E7E', '#FBF4E9', 'Top 10 hits do momento — link na bio. #redemira', 0.12096328357806453, 106, 1779899880000, 1779899880000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p20', 74163, 99841, 6953, 568, 492, 958, 945, 310, '[{"n":"São Paulo","p":53},{"n":"Rio de Janeiro","p":27},{"n":"Fortaleza","p":11},{"n":"Belo Horizonte","p":9}]', '[0.1227,0.1709,0.2331,0.3094,0.3978,0.4934,0.5894,0.6791,0.7573,0.8214,0.8715,0.9091,0.9365,0.956,0.9697]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p21', 'pg2', 'u1', 'Bastidores do clipe mais caro do ano', 'carrossel', 'publicado', 1778596200000, '#FF2E7E', '#FBF4E9', 'Bastidores do clipe mais caro do ano — link na bio. #redemira', 0.16952606890602254, 148, 1778596200000, 1778596200000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p21', 92735, 106919, 8909, 1010, 1119, 4683, 1370, 295, '[{"n":"São Paulo","p":46},{"n":"Rio de Janeiro","p":32},{"n":"Belo Horizonte","p":11},{"n":"Recife","p":11}]', '[0.0632,0.1078,0.1778,0.2791,0.4093,0.5536,0.6894,0.7989,0.8767,0.9272,0.9579,0.9761,0.9865,0.9924,0.9957]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p22', 'pg2', 'u1', 'Quiz: qual diva você seria?', 'feed', 'publicado', 1778345280000, '#FF2E7E', '#FBF4E9', 'Quiz: qual diva você seria? — link na bio. #redemira', 0.13652133261158408, 119, 1778345280000, 1778345280000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p22', 81284, 85777, 8249, 679, 967, 1202, 1343, 189, '[{"n":"São Paulo","p":54},{"n":"Rio de Janeiro","p":26},{"n":"Porto Alegre","p":11},{"n":"Belo Horizonte","p":9}]', '[0.1097,0.1631,0.2357,0.3279,0.4356,0.5497,0.6588,0.7534,0.8285,0.8843,0.9236,0.9503,0.968,0.9795,0.987]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p23', 'pg2', 'u1', 'Bastidores do clipe mais caro do ano', 'carrossel', 'publicado', 1778963340000, '#FF2E7E', '#FBF4E9', 'Bastidores do clipe mais caro do ano — link na bio. #redemira', 0.16565073488681267, 145, 1778963340000, 1778963340000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p23', 866528, 1004320, 87983, 10065, 5610, 39883, 13529, 3155, '[{"n":"São Paulo","p":50},{"n":"Rio de Janeiro","p":31},{"n":"Salvador","p":10},{"n":"Fortaleza","p":9}]', '[0.0847,0.1163,0.1575,0.2099,0.274,0.3491,0.4325,0.5199,0.6061,0.6862,0.7565,0.8153,0.8625,0.8991,0.9268]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p24', 'pg2', 'u1', 'Quiz: qual diva você seria?', 'carrossel', 'publicado', 1779796140000, '#FF2E7E', '#FBF4E9', 'Quiz: qual diva você seria? — link na bio. #redemira', 0.09636427402384849, 84, 1779796140000, 1779796140000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p24', 85540, 97510, 5372, 552, 483, 1836, 1979, 103, '[{"n":"São Paulo","p":56},{"n":"Rio de Janeiro","p":18},{"n":"Curitiba","p":13},{"n":"Porto Alegre","p":13}]', '[0.1953,0.2964,0.4224,0.5594,0.6879,0.7928,0.8691,0.9202,0.9524,0.972,0.9837,0.9905,0.9945,0.9968,0.9982]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p25', 'pg3', 'u2', 'Rodada do Brasileirão: o que esperar', 'story', 'publicado', 1780862700000, '#CBFB45', '#151210', 'Rodada do Brasileirão: o que esperar — link na bio. #redemira', 0.09114115014186948, 108, 1780862700000, 1780862700000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p25', 200184, 256366, 14620, 1013, 1169, 1443, 3430, 752, '[{"n":"São Paulo","p":37},{"n":"Rio de Janeiro","p":28},{"n":"Belo Horizonte","p":19},{"n":"Curitiba","p":16}]', '[0.1477,0.2027,0.2717,0.3536,0.4452,0.5407,0.6333,0.717,0.7879,0.845,0.8888,0.9214,0.9451,0.9619,0.9737]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p26', 'pg3', 'u2', 'Vôlei: Brasil garante vaga na final', 'reels', 'publicado', 1778260440000, '#CBFB45', '#151210', 'Vôlei: Brasil garante vaga na final — link na bio. #redemira', 0.0679895398604859, 80, 1778260440000, 1778260440000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p26', 731539, 986986, 35473, 2883, 6284, 5097, 11193, 843, '[{"n":"São Paulo","p":54},{"n":"Rio de Janeiro","p":27},{"n":"Belo Horizonte","p":10},{"n":"Curitiba","p":9}]', '[0.0778,0.1219,0.1859,0.2732,0.3821,0.5044,0.6261,0.7337,0.8193,0.8818,0.9247,0.9528,0.9708,0.9821,0.989]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p27', 'pg3', 'u2', 'F1 em Interlagos: guia do GP', 'reels', 'publicado', 1779899100000, '#CBFB45', '#151210', 'F1 em Interlagos: guia do GP — link na bio. #redemira', 0.10793919095168039, 127, 1779899100000, 1779899100000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p27', 95841, 109952, 7517, 810, 795, 1223, 1834, 382, '[{"n":"São Paulo","p":39},{"n":"Rio de Janeiro","p":21},{"n":"Curitiba","p":20},{"n":"Belo Horizonte","p":20}]', '[0.0803,0.1103,0.1496,0.1998,0.2616,0.3346,0.4165,0.5033,0.5898,0.6711,0.7434,0.8044,0.8537,0.8923,0.9216]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p28', 'pg3', 'u2', 'Mercado da bola: 5 rumores quentes', 'story', 'publicado', 1778073180000, '#CBFB45', '#151210', 'Mercado da bola: 5 rumores quentes — link na bio. #redemira', 0.0606266318537859, 72, 1778073180000, 1778073180000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p28', 19150, 25883, 803, 95, 92, 171, 310, 78, '[{"n":"São Paulo","p":40},{"n":"Rio de Janeiro","p":33},{"n":"Belo Horizonte","p":15},{"n":"Salvador","p":12}]', '[0.0415,0.076,0.135,0.2287,0.3603,0.5168,0.6701,0.7941,0.8799,0.933,0.9635,0.9805,0.9896,0.9945,0.9971]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p29', 'pg3', 'u2', 'Craque da base assina com clube europeu', 'feed', 'publicado', 1781187000000, '#151210', '#FBF4E9', 'Craque da base assina com clube europeu — link na bio. #redemira', 0.10754660477652167, 127, 1781187000000, 1781187000000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p29', 53428, 73468, 4142, 436, 463, 705, 883, 209, '[{"n":"São Paulo","p":61},{"n":"Curitiba","p":14},{"n":"Rio de Janeiro","p":14},{"n":"Porto Alegre","p":11}]', '[0.0291,0.06,0.1198,0.2249,0.3822,0.5687,0.7376,0.857,0.9274,0.9646,0.9831,0.992,0.9962,0.9982,0.9992]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p30', 'pg3', 'u2', 'Basquete: NBB define os playoffs', 'reels', 'publicado', 1778751000000, '#151210', '#FBF4E9', 'Basquete: NBB define os playoffs — link na bio. #redemira', 0.1343921153038651, 159, 1778751000000, 1778751000000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p30', 550129, 583730, 49818, 4806, 8171, 11138, 13556, 458, '[{"n":"São Paulo","p":58},{"n":"Rio de Janeiro","p":22},{"n":"Recife","p":10},{"n":"Salvador","p":10}]', '[0.0264,0.0519,0.0993,0.1817,0.3091,0.4741,0.6449,0.7854,0.8806,0.9369,0.9677,0.9837,0.9918,0.9959,0.998]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p31', 'pg3', 'u2', 'Análise tática: o novo 4-3-3', 'reels', 'publicado', 1779799620000, '#7A4DFF', '#FBF4E9', 'Análise tática: o novo 4-3-3 — link na bio. #redemira', 0.10118840243099911, 119, 1779799620000, 1779799620000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p31', 671658, 708338, 49714, 5543, 5773, 6934, 6867, 1497, '[{"n":"São Paulo","p":40},{"n":"Rio de Janeiro","p":31},{"n":"Curitiba","p":15},{"n":"Recife","p":13}]', '[0.0867,0.1268,0.1817,0.2536,0.3419,0.4428,0.5486,0.6503,0.7399,0.8131,0.8693,0.9105,0.9396,0.9597,0.9733]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p32', 'pg1', 'u2', 'Vacina da dengue chega ao SUS', 'reels', 'publicado', 1780745640000, '#151210', '#FBF4E9', 'Vacina da dengue chega ao SUS — link na bio. #redemira', 0.0850109504236145, 93, 1780745640000, 1780745640000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p32', 218713, 284119, 13923, 1334, 1133, 2203, 2526, 866, '[{"n":"São Paulo","p":62},{"n":"Rio de Janeiro","p":13},{"n":"Belo Horizonte","p":12},{"n":"Recife","p":12}]', '[0.0241,0.0528,0.1117,0.2213,0.3908,0.5917,0.7659,0.8808,0.9435,0.9742,0.9884,0.9948,0.9977,0.999,0.9995]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p33', 'pg3', 'u2', 'Rodada do Brasileirão: o que esperar', 'reels', 'analisando', 1782853680000, '#151210', '#FBF4E9', 'Rodada do Brasileirão: o que esperar — link na bio. #redemira', 0.07649070501578394, 90, 1782853680000, 1782853680000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p33', 342120, 391708, 17461, 2085, 3038, 3585, 6408, 502, '[{"n":"São Paulo","p":47},{"n":"Rio de Janeiro","p":27},{"n":"Belo Horizonte","p":15},{"n":"Fortaleza","p":11}]', '[0.111,0.1523,0.2053,0.2709,0.3484,0.4347,0.5252,0.6141,0.696,0.7671,0.8257,0.872,0.9074,0.9338,0.953]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p34', 'pg3', 'u2', 'Vôlei: Brasil garante vaga na final', 'reels', 'publicado', 1779010980000, '#151210', '#FBF4E9', 'Vôlei: Brasil garante vaga na final — link na bio. #redemira', 0.06001830635772614, 71, 1779010980000, 1779010980000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p34', 723246, 866144, 30368, 2516, 5326, 5198, 13669, 1724, '[{"n":"São Paulo","p":43},{"n":"Rio de Janeiro","p":19},{"n":"Belo Horizonte","p":19},{"n":"Curitiba","p":18}]', '[0.1878,0.2538,0.3335,0.424,0.5198,0.6143,0.7008,0.7751,0.8352,0.8817,0.9164,0.9416,0.9596,0.9721,0.9809]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p35', 'pg3', 'u2', 'Basquete: NBB define os playoffs', 'story', 'publicado', 1780141140000, '#FF2E7E', '#FBF4E9', 'Basquete: NBB define os playoffs — link na bio. #redemira', 0.1269493454752419, 150, 1780141140000, 1780141140000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p35', 35140, 38676, 3193, 310, 375, 583, 477, 125, '[{"n":"São Paulo","p":50},{"n":"Rio de Janeiro","p":26},{"n":"Belo Horizonte","p":12},{"n":"Brasília","p":12}]', '[0.0609,0.105,0.1753,0.278,0.4109,0.5581,0.6958,0.8056,0.8824,0.9315,0.961,0.9781,0.9878,0.9932,0.9962]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p36', 'pg3', 'u2', 'Basquete: NBB define os playoffs', 'reels', 'publicado', 1778708580000, '#CBFB45', '#151210', 'Basquete: NBB define os playoffs — link na bio. #redemira', 0.12283362860173132, 145, 1778708580000, 1778708580000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p36', 506319, 583361, 44170, 4735, 5986, 7302, 6252, 1125, '[{"n":"São Paulo","p":57},{"n":"Rio de Janeiro","p":16},{"n":"Curitiba","p":14},{"n":"Salvador","p":13}]', '[0.2057,0.2973,0.4086,0.5302,0.6483,0.7507,0.831,0.8893,0.9292,0.9554,0.9722,0.9828,0.9894,0.9935,0.996]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p37', 'pg3', 'u2', 'Copa América: convocação completa', 'reels', 'analisando', 1782926400000, '#CBFB45', '#151210', 'Copa América: convocação completa — link na bio. #redemira', 0.07970550228583219, 94, 1782926400000, 1782926400000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p37', 92089, 124458, 5077, 372, 911, 980, 1116, 140, '[{"n":"São Paulo","p":38},{"n":"Rio de Janeiro","p":29},{"n":"Belo Horizonte","p":18},{"n":"Recife","p":15}]', '[0.0629,0.1116,0.1904,0.3057,0.4519,0.6068,0.7429,0.844,0.9101,0.9499,0.9726,0.9852,0.992,0.9957,0.9977]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p38', 'pg3', 'u2', 'Vôlei: Brasil garante vaga na final', 'story', 'publicado', 1782660960000, '#CBFB45', '#151210', 'Vôlei: Brasil garante vaga na final — link na bio. #redemira', 0.08471350633887355, 100, 1782660960000, 1782660960000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p38', 102463, 140012, 6446, 436, 628, 1170, 1950, 97, '[{"n":"São Paulo","p":46},{"n":"Rio de Janeiro","p":23},{"n":"Belo Horizonte","p":17},{"n":"Curitiba","p":14}]', '[0.1722,0.2398,0.3236,0.4205,0.5239,0.6254,0.7168,0.7934,0.8534,0.8983,0.9305,0.9531,0.9686,0.979,0.9861]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p39', 'pg3', 'u2', 'Skate BR domina o pódio', 'carrossel', 'publicado', 1782229500000, '#CBFB45', '#151210', 'Skate BR domina o pódio — link na bio. #redemira', 0.11585719787999284, 137, 1782229500000, 1782229500000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p39', 184339, 201267, 14895, 1738, 952, 3772, 3357, 386, '[{"n":"São Paulo","p":34},{"n":"Rio de Janeiro","p":34},{"n":"Belo Horizonte","p":16},{"n":"Curitiba","p":16}]', '[0.1076,0.1454,0.1936,0.253,0.3234,0.4028,0.4877,0.5732,0.6546,0.7279,0.7905,0.8419,0.8826,0.9138,0.9374]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p40', 'pg1', 'u2', 'Eleições 2026: o que muda no seu voto', 'story', 'publicado', 1778070840000, '#151210', '#FBF4E9', 'Eleições 2026: o que muda no seu voto — link na bio. #redemira', 0.0635064200920617, 69, 1778070840000, 1778070840000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p40', 61915, 74254, 2801, 174, 346, 611, 1472, 244, '[{"n":"São Paulo","p":39},{"n":"Rio de Janeiro","p":33},{"n":"Belo Horizonte","p":16},{"n":"Recife","p":12}]', '[0.2457,0.3257,0.4173,0.515,0.6115,0.7,0.7758,0.8369,0.8838,0.9185,0.9436,0.9612,0.9735,0.982,0.9878]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p41', 'pg3', 'u2', 'Mercado da bola: 5 rumores quentes', 'story', 'publicado', 1781098680000, '#7A4DFF', '#FBF4E9', 'Mercado da bola: 5 rumores quentes — link na bio. #redemira', 0.08108809635051653, 96, 1781098680000, 1781098680000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p41', 19263, 24534, 1212, 94, 104, 152, 271, 46, '[{"n":"São Paulo","p":51},{"n":"Rio de Janeiro","p":23},{"n":"Belo Horizonte","p":14},{"n":"Recife","p":11}]', '[0.1109,0.1546,0.2113,0.2819,0.3652,0.4574,0.5527,0.6442,0.7263,0.7954,0.8507,0.893,0.9244,0.9472,0.9633]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p42', 'pg3', 'u2', 'Análise tática: o novo 4-3-3', 'carrossel', 'publicado', 1782128760000, '#CBFB45', '#151210', 'Análise tática: o novo 4-3-3 — link na bio. #redemira', 0.07168739034251277, 85, 1782128760000, 1782128760000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p42', 52436, 58311, 2445, 280, 276, 758, 638, 146, '[{"n":"São Paulo","p":44},{"n":"Rio de Janeiro","p":25},{"n":"Belo Horizonte","p":16},{"n":"Salvador","p":15}]', '[0.0892,0.1272,0.1783,0.2441,0.3245,0.4169,0.5155,0.6129,0.702,0.778,0.8391,0.8859,0.9203,0.945,0.9624]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p43', 'pg1', 'u2', 'Reforma tributária: guia rápido', 'reels', 'publicado', 1778918520000, '#151210', '#FBF4E9', 'Reforma tributária: guia rápido — link na bio. #redemira', 0.07269412386734489, 80, 1778918520000, 1778918520000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p43', 548490, 759718, 29046, 2057, 5465, 3304, 10234, 1287, '[{"n":"São Paulo","p":47},{"n":"Rio de Janeiro","p":18},{"n":"Belo Horizonte","p":18},{"n":"Curitiba","p":17}]', '[0.114,0.1788,0.2692,0.3839,0.5132,0.6408,0.7511,0.8362,0.8962,0.936,0.9611,0.9767,0.9861,0.9917,0.9951]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p44', 'pg4', 'u3', 'Tradutor de reunião corporativa', 'feed', 'publicado', 1781080320000, '#FF6B2C', '#FBF4E9', 'Tradutor de reunião corporativa — link na bio. #redemira', 0.10901655550893843, 93, 1781080320000, 1781080320000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p44', 829452, 1027971, 61543, 6761, 13202, 8918, 17025, 1946, '[{"n":"São Paulo","p":62},{"n":"Curitiba","p":13},{"n":"Rio de Janeiro","p":12},{"n":"Porto Alegre","p":12}]', '[0.0696,0.1004,0.1427,0.199,0.2704,0.3561,0.4521,0.5518,0.6476,0.7327,0.8036,0.8592,0.9011,0.9315,0.953]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p45', 'pg4', 'u3', 'O grupo da família às 6h', 'feed', 'publicado', 1780414740000, '#151210', '#FBF4E9', 'O grupo da família às 6h — link na bio. #redemira', 0.1360091724132222, 117, 1780414740000, 1780414740000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p45', 966376, 1310817, 91941, 5737, 13576, 20182, 16466, 1497, '[{"n":"São Paulo","p":55},{"n":"Rio de Janeiro","p":18},{"n":"Belo Horizonte","p":15},{"n":"Recife","p":12}]', '[0.0302,0.0493,0.0796,0.1261,0.194,0.2865,0.4011,0.5276,0.6507,0.7565,0.8383,0.8963,0.9352,0.9601,0.9757]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p46', 'pg4', 'u3', 'Tradutor de reunião corporativa', 'carrossel', 'publicado', 1780051080000, '#FF6B2C', '#FBF4E9', 'Tradutor de reunião corporativa — link na bio. #redemira', 0.12836122565874744, 110, 1780051080000, 1780051080000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p46', 577877, 619311, 43796, 5037, 9248, 16096, 11493, 1439, '[{"n":"São Paulo","p":46},{"n":"Rio de Janeiro","p":33},{"n":"Salvador","p":11},{"n":"Belo Horizonte","p":11}]', '[0.005,0.0115,0.0263,0.0588,0.1263,0.2505,0.436,0.6414,0.8053,0.9054,0.9568,0.9808,0.9916,0.9964,0.9984]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p47', 'pg4', 'u3', 'O grupo da família às 6h', 'carrossel', 'publicado', 1779727380000, '#151210', '#FBF4E9', 'O grupo da família às 6h — link na bio. #redemira', 0.1780543837451854, 153, 1779727380000, 1779727380000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p47', 321677, 351169, 34065, 2798, 9544, 10869, 2118, 729, '[{"n":"São Paulo","p":39},{"n":"Rio de Janeiro","p":35},{"n":"Belo Horizonte","p":16},{"n":"Porto Alegre","p":10}]', '[0.1994,0.261,0.3338,0.4154,0.502,0.5884,0.6698,0.742,0.8032,0.8527,0.8914,0.9209,0.9429,0.9591,0.9708]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p48', 'pg2', 'u3', 'Reality: o resumo da semana em 10 memes', 'carrossel', 'publicado', 1779807720000, '#FF2E7E', '#FBF4E9', 'Reality: o resumo da semana em 10 memes — link na bio. #redemira', 0.15402620824619634, 135, 1779807720000, 1779807720000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p48', 104242, 127236, 11079, 593, 992, 3392, 2114, 103, '[{"n":"São Paulo","p":54},{"n":"Rio de Janeiro","p":20},{"n":"Fortaleza","p":13},{"n":"Salvador","p":13}]', '[0.0646,0.093,0.1322,0.1846,0.2516,0.3331,0.4259,0.5242,0.6207,0.7086,0.7831,0.8429,0.8885,0.9221,0.9462]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p49', 'pg2', 'u3', 'O documentário que todo mundo comenta', 'feed', 'publicado', 1778764200000, '#FF2E7E', '#FBF4E9', 'O documentário que todo mundo comenta — link na bio. #redemira', 0.09666131048027138, 84, 1778764200000, 1778764200000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p49', 84015, 100048, 6163, 587, 462, 909, 1219, 89, '[{"n":"São Paulo","p":57},{"n":"Rio de Janeiro","p":22},{"n":"Fortaleza","p":10},{"n":"Salvador","p":10}]', '[0.0161,0.031,0.0589,0.1091,0.1933,0.3192,0.4785,0.6423,0.7785,0.873,0.9308,0.9634,0.981,0.9902,0.995]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p50', 'pg2', 'u3', 'Reality: o resumo da semana em 10 memes', 'carrossel', 'publicado', 1782039780000, '#FF6B2C', '#FBF4E9', 'Reality: o resumo da semana em 10 memes — link na bio. #redemira', 0.14678330053896826, 128, 1782039780000, 1782039780000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p50', 93512, 112183, 8681, 752, 985, 3308, 833, 298, '[{"n":"São Paulo","p":34},{"n":"Rio de Janeiro","p":30},{"n":"Fortaleza","p":18},{"n":"Salvador","p":18}]', '[0.059,0.0903,0.1357,0.1989,0.2819,0.3831,0.4955,0.6084,0.7107,0.7953,0.8601,0.9067,0.9389,0.9605,0.9747]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p51', 'pg2', 'u3', 'O retorno da banda que marcou os anos 2000', 'feed', 'publicado', 1778236980000, '#7A4DFF', '#FBF4E9', 'O retorno da banda que marcou os anos 2000 — link na bio. #redemira', 0.09949381620831811, 87, 1778236980000, 1778236980000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p51', 383260, 437817, 28605, 2124, 2464, 4939, 4646, 1253, '[{"n":"São Paulo","p":59},{"n":"Belo Horizonte","p":17},{"n":"Rio de Janeiro","p":12},{"n":"Curitiba","p":12}]', '[0.0192,0.0433,0.0948,0.1951,0.3593,0.5647,0.75,0.8741,0.9414,0.9738,0.9885,0.995,0.9978,0.9991,0.9996]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p52', 'pg4', 'u3', 'Expectativa vs realidade: academia', 'carrossel', 'publicado', 1780250820000, '#151210', '#FBF4E9', 'Expectativa vs realidade: academia — link na bio. #redemira', 0.18106144154215703, 155, 1780250820000, 1780250820000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p52', 198579, 229791, 19645, 1136, 4762, 10412, 1242, 765, '[{"n":"São Paulo","p":43},{"n":"Rio de Janeiro","p":26},{"n":"Curitiba","p":17},{"n":"Fortaleza","p":13}]', '[0.0375,0.0692,0.1242,0.2129,0.3403,0.496,0.6524,0.7817,0.8723,0.9287,0.9613,0.9793,0.9891,0.9942,0.997]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p53', 'pg2', 'u3', 'O documentário que todo mundo comenta', 'feed', 'publicado', 1780593480000, '#151210', '#FBF4E9', 'O documentário que todo mundo comenta — link na bio. #redemira', 0.12210947041190186, 107, 1780593480000, 1780593480000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p53', 675525, 776456, 63807, 6532, 3914, 8235, 13091, 2010, '[{"n":"São Paulo","p":56},{"n":"Rio de Janeiro","p":23},{"n":"Curitiba","p":13},{"n":"Porto Alegre","p":9}]', '[0.0197,0.0353,0.0626,0.1086,0.1818,0.2885,0.4252,0.5744,0.7112,0.8179,0.8912,0.9373,0.9646,0.9803,0.9891]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p54', 'pg4', 'u3', 'O grupo da família às 6h', 'carrossel', 'publicado', 1781361300000, '#151210', '#FBF4E9', 'O grupo da família às 6h — link na bio. #redemira', 0.13477340728307668, 115, 1781361300000, 1781361300000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p54', 205545, 269971, 16028, 1141, 4924, 5609, 1805, 250, '[{"n":"São Paulo","p":49},{"n":"Rio de Janeiro","p":30},{"n":"Salvador","p":11},{"n":"Belo Horizonte","p":10}]', '[0.052,0.0778,0.1147,0.1661,0.2343,0.3198,0.4195,0.5262,0.6305,0.7239,0.8012,0.861,0.9049,0.936,0.9574]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p55', 'pg2', 'u3', 'Top 10 hits do momento', 'feed', 'publicado', 1778098440000, '#FF2E7E', '#FBF4E9', 'Top 10 hits do momento — link na bio. #redemira', 0.13432595166134698, 117, 1778098440000, 1778098440000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p55', 849672, 1076274, 85587, 4737, 8672, 15137, 13494, 3334, '[{"n":"São Paulo","p":50},{"n":"Rio de Janeiro","p":24},{"n":"Belo Horizonte","p":14},{"n":"Curitiba","p":12}]', '[0.0422,0.0717,0.1194,0.1922,0.2945,0.4228,0.5624,0.6928,0.7983,0.8741,0.9241,0.9553,0.974,0.985,0.9914]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p56', 'pg2', 'u3', 'Red carpet: os looks que quebraram a internet', 'carrossel', 'publicado', 1779552960000, '#FF2E7E', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.1144969059208214, 100, 1779552960000, 1779552960000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p56', 93889, 114688, 6812, 763, 703, 2472, 796, 129, '[{"n":"São Paulo","p":55},{"n":"Rio de Janeiro","p":20},{"n":"Curitiba","p":14},{"n":"Porto Alegre","p":12}]', '[0.2066,0.2781,0.3631,0.4576,0.5553,0.6488,0.7322,0.8018,0.8569,0.8986,0.9291,0.951,0.9663,0.977,0.9843]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p57', 'pg4', 'u3', 'Modo férias ativado (mentira)', 'story', 'publicado', 1781552340000, '#FF2E7E', '#FBF4E9', 'Modo férias ativado (mentira) — link na bio. #redemira', 0.138054930648842, 118, 1781552340000, 1781552340000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p57', 123574, 149525, 10979, 585, 3171, 2325, 2885, 457, '[{"n":"Rio de Janeiro","p":38},{"n":"São Paulo","p":35},{"n":"Belo Horizonte","p":14},{"n":"Recife","p":13}]', '[0.1423,0.1927,0.2557,0.3308,0.4156,0.5058,0.5955,0.6794,0.753,0.8143,0.8632,0.9008,0.9289,0.9495,0.9644]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p58', 'pg4', 'u3', 'O grupo da família às 6h', 'feed', 'publicado', 1780312140000, '#FF2E7E', '#FBF4E9', 'O grupo da família às 6h — link na bio. #redemira', 0.10286459919098778, 88, 1780312140000, 1780312140000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p58', 574775, 798013, 39191, 4011, 11490, 4432, 4933, 2127, '[{"n":"São Paulo","p":35},{"n":"Rio de Janeiro","p":26},{"n":"Belo Horizonte","p":24},{"n":"Curitiba","p":15}]', '[0.0709,0.1014,0.1429,0.1977,0.267,0.3499,0.4431,0.5404,0.6347,0.7197,0.7914,0.8487,0.8923,0.9245,0.9477]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p59', 'pg4', 'u3', 'Modo férias ativado (mentira)', 'carrossel', 'publicado', 1782324480000, '#FF6B2C', '#FBF4E9', 'Modo férias ativado (mentira) — link na bio. #redemira', 0.16492758538527752, 141, 1782324480000, 1782324480000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p59', 465859, 639539, 45550, 4408, 8007, 18868, 9783, 1199, '[{"n":"São Paulo","p":62},{"n":"Rio de Janeiro","p":17},{"n":"Curitiba","p":11},{"n":"Recife","p":9}]', '[0.1171,0.1644,0.2259,0.3021,0.3911,0.4879,0.5856,0.677,0.7566,0.8218,0.8725,0.9103,0.9377,0.9571,0.9707]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p60', 'pg4', 'u3', 'Quando o café acaba no escritório', 'story', 'publicado', 1780499940000, '#FF2E7E', '#FBF4E9', 'Quando o café acaba no escritório — link na bio. #redemira', 0.0862657052804283, 74, 1780499940000, 1780499940000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p60', 301093, 382396, 17410, 2087, 2689, 3788, 4399, 1175, '[{"n":"São Paulo","p":38},{"n":"Rio de Janeiro","p":28},{"n":"Fortaleza","p":17},{"n":"Recife","p":16}]', '[0.1638,0.22,0.2889,0.3691,0.4572,0.5481,0.636,0.7156,0.7837,0.8392,0.8825,0.9154,0.9397,0.9573,0.97]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p61', 'pg4', 'u3', 'Ninguém: … eu às 3h da manhã:', 'carrossel', 'publicado', 1780141680000, '#FF6B2C', '#FBF4E9', 'Ninguém: … eu às 3h da manhã: — link na bio. #redemira', 0.1336651749018175, 114, 1780141680000, 1780141680000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p61', 394164, 453414, 28193, 1467, 7801, 15225, 7159, 400, '[{"n":"São Paulo","p":51},{"n":"Rio de Janeiro","p":31},{"n":"Belo Horizonte","p":10},{"n":"Salvador","p":8}]', '[0.1386,0.2011,0.2825,0.3812,0.4908,0.6013,0.7024,0.7869,0.8524,0.9004,0.9339,0.9568,0.9719,0.9819,0.9883]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p62', 'pg2', 'u3', 'Turnê mundial 2027 confirmada', 'story', 'publicado', 1781791200000, '#FF2E7E', '#FBF4E9', 'Turnê mundial 2027 confirmada — link na bio. #redemira', 0.09115089351129232, 80, 1781791200000, 1781791200000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p62', 62786, 83929, 4360, 240, 467, 656, 1477, 88, '[{"n":"São Paulo","p":40},{"n":"Rio de Janeiro","p":34},{"n":"Belo Horizonte","p":14},{"n":"Salvador","p":11}]', '[0.1706,0.2398,0.3262,0.4262,0.5326,0.6361,0.7284,0.8045,0.8633,0.9064,0.9369,0.958,0.9722,0.9817,0.988]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p63', 'pg4', 'u3', 'Tradutor de reunião corporativa', 'carrossel', 'publicado', 1780235100000, '#FF6B2C', '#FBF4E9', 'Tradutor de reunião corporativa — link na bio. #redemira', 0.1916729178414564, 164, 1780235100000, 1780235100000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p63', 966485, 1187833, 100075, 8702, 25559, 50913, 23182, 1190, '[{"n":"São Paulo","p":53},{"n":"Rio de Janeiro","p":24},{"n":"Curitiba","p":12},{"n":"Fortaleza","p":11}]', '[0.0972,0.1366,0.1887,0.2548,0.3345,0.4249,0.5206,0.6149,0.7012,0.7753,0.8353,0.8817,0.9164,0.9415,0.9595]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p64', 'pg2', 'u3', 'Red carpet: os looks que quebraram a internet', 'story', 'publicado', 1781021040000, '#FF2E7E', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.1265559911033559, 111, 1781021040000, 1781021040000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p64', 244137, 273294, 23078, 1918, 2137, 3764, 4640, 917, '[{"n":"São Paulo","p":45},{"n":"Rio de Janeiro","p":22},{"n":"Belo Horizonte","p":18},{"n":"Recife","p":14}]', '[0.0242,0.05,0.1007,0.1924,0.3363,0.5187,0.6963,0.8299,0.9121,0.9567,0.9791,0.9901,0.9953,0.9978,0.999]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p65', 'pg4', 'u3', 'POV: segunda-feira chegou de novo', 'reels', 'publicado', 1778324460000, '#FF6B2C', '#FBF4E9', 'POV: segunda-feira chegou de novo — link na bio. #redemira', 0.11674507930090236, 100, 1778324460000, 1778324460000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p65', 1088260, 1273762, 86667, 5004, 23858, 11520, 11030, 3602, '[{"n":"Rio de Janeiro","p":41},{"n":"São Paulo","p":28},{"n":"Curitiba","p":16},{"n":"Salvador","p":15}]', '[0.1095,0.1556,0.2163,0.2926,0.3826,0.4815,0.5818,0.6758,0.7574,0.8239,0.8752,0.9131,0.9402,0.9593,0.9725]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p66', 'pg4', 'u3', 'Ninguém: … eu às 3h da manhã:', 'carrossel', 'publicado', 1781342760000, '#FF6B2C', '#FBF4E9', 'Ninguém: … eu às 3h da manhã: — link na bio. #redemira', 0.10295912450786004, 88, 1781342760000, 1781342760000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p66', 986508, 1317687, 62059, 4827, 12522, 22162, 6323, 2494, '[{"n":"São Paulo","p":50},{"n":"Rio de Janeiro","p":22},{"n":"Curitiba","p":15},{"n":"Belo Horizonte","p":13}]', '[0.1185,0.1688,0.235,0.3171,0.4125,0.5149,0.6161,0.7081,0.7858,0.8472,0.8934,0.9269,0.9504,0.9666,0.9777]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p67', 'pg1', 'u4', 'Enem 2026: inscrições abertas', 'carrossel', 'publicado', 1782507780000, '#151210', '#FBF4E9', 'Enem 2026: inscrições abertas — link na bio. #redemira', 0.1096469482515553, 120, 1782507780000, 1782507780000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p67', 927796, 1107045, 68070, 5168, 7776, 20716, 24155, 1999, '[{"n":"São Paulo","p":44},{"n":"Rio de Janeiro","p":25},{"n":"Salvador","p":16},{"n":"Recife","p":14}]', '[0.2381,0.3374,0.4535,0.5749,0.6879,0.7822,0.8541,0.9051,0.9396,0.962,0.9764,0.9854,0.991,0.9944,0.9966]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p68', 'pg1', 'u4', 'Eleições 2026: o que muda no seu voto', 'carrossel', 'publicado', 1779356520000, '#151210', '#FBF4E9', 'Eleições 2026: o que muda no seu voto — link na bio. #redemira', 0.11554513356260018, 126, 1779356520000, 1779356520000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p68', 261413, 360195, 19142, 1864, 1119, 8080, 8948, 319, '[{"n":"São Paulo","p":63},{"n":"Rio de Janeiro","p":14},{"n":"Belo Horizonte","p":13},{"n":"Curitiba","p":10}]', '[0.0575,0.0846,0.1228,0.1749,0.243,0.3272,0.4242,0.5274,0.6283,0.7191,0.795,0.8545,0.899,0.9309,0.9533]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p69', 'pg1', 'u4', 'Dólar fecha em queda pela 3ª semana', 'carrossel', 'publicado', 1781178000000, '#151210', '#FBF4E9', 'Dólar fecha em queda pela 3ª semana — link na bio. #redemira', 0.06681181693989072, 73, 1781178000000, 1781178000000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p69', 702720, 824690, 30293, 3009, 3151, 10497, 13920, 1434, '[{"n":"São Paulo","p":56},{"n":"Rio de Janeiro","p":21},{"n":"Curitiba","p":12},{"n":"Salvador","p":11}]', '[0.1495,0.2078,0.2814,0.369,0.466,0.5658,0.6604,0.7438,0.8125,0.8661,0.9062,0.9351,0.9556,0.9698,0.9796]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p70', 'pg5', 'u4', 'Fundos imobiliários pra iniciantes', 'story', 'publicado', 1779916140000, '#FBF4E9', '#151210', 'Fundos imobiliários pra iniciantes — link na bio. #redemira', 0.1456717609489051, 120, 1779916140000, 1779916140000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p70', 70144, 97370, 5885, 421, 355, 3557, 1360, 167, '[{"n":"São Paulo","p":52},{"n":"Rio de Janeiro","p":22},{"n":"Belo Horizonte","p":16},{"n":"Recife","p":9}]', '[0.0148,0.0272,0.0493,0.088,0.1522,0.2503,0.383,0.5358,0.6822,0.7997,0.8813,0.9324,0.9625,0.9795,0.9889]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p71', 'pg1', 'u4', 'Dólar fecha em queda pela 3ª semana', 'story', 'publicado', 1781809800000, '#151210', '#FBF4E9', 'Dólar fecha em queda pela 3ª semana — link na bio. #redemira', 0.06637480490379571, 73, 1781809800000, 1781809800000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p71', 154411, 176096, 7539, 596, 906, 1208, 1880, 476, '[{"n":"São Paulo","p":46},{"n":"Rio de Janeiro","p":25},{"n":"Salvador","p":15},{"n":"Brasília","p":14}]', '[0.0812,0.1123,0.1533,0.2057,0.2704,0.3465,0.4313,0.5204,0.6082,0.6896,0.7607,0.8197,0.8668,0.903,0.9302]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p72', 'pg1', 'u4', 'Urgente: nova linha de metrô aprovada em SP', 'carrossel', 'publicado', 1781525820000, '#151210', '#FBF4E9', 'Urgente: nova linha de metrô aprovada em SP — link na bio. #redemira', 0.08731432269618294, 96, 1781525820000, 1781525820000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p72', 451186, 600677, 24132, 2450, 2110, 10703, 13309, 578, '[{"n":"São Paulo","p":50},{"n":"Rio de Janeiro","p":25},{"n":"Belo Horizonte","p":13},{"n":"Curitiba","p":11}]', '[0.0892,0.134,0.1965,0.2787,0.3791,0.491,0.6039,0.7066,0.7919,0.8574,0.9048,0.9376,0.9596,0.974,0.9834]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p73', 'pg5', 'u4', 'Aposentadoria aos 40: utopia?', 'story', 'publicado', 1779715740000, '#7A4DFF', '#FBF4E9', 'Aposentadoria aos 40: utopia? — link na bio. #redemira', 0.1141094834232845, 94, 1779715740000, 1779715740000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p73', 9079, 11854, 638, 62, 44, 292, 134, 24, '[{"n":"São Paulo","p":58},{"n":"Rio de Janeiro","p":21},{"n":"Belo Horizonte","p":11},{"n":"Recife","p":10}]', '[0.1097,0.1536,0.2108,0.2823,0.3668,0.4603,0.5567,0.649,0.7314,0.8004,0.8552,0.8968,0.9275,0.9496,0.9652]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p74', 'pg1', 'u4', 'Reforma tributária: guia rápido', 'reels', 'publicado', 1781795640000, '#151210', '#FBF4E9', 'Reforma tributária: guia rápido — link na bio. #redemira', 0.056103338755020465, 61, 1781795640000, 1781795640000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p74', 1573311, 1702989, 61536, 6351, 9386, 10995, 34601, 4879, '[{"n":"Rio de Janeiro","p":40},{"n":"São Paulo","p":28},{"n":"Belo Horizonte","p":17},{"n":"Curitiba","p":15}]', '[0.228,0.3304,0.4519,0.5794,0.6971,0.7936,0.8653,0.9148,0.9472,0.9677,0.9804,0.9882,0.9929,0.9957,0.9974]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p75', 'pg1', 'u4', 'Alerta de chuva forte no Sudeste', 'reels', 'publicado', 1781007000000, '#7A4DFF', '#FBF4E9', 'Alerta de chuva forte no Sudeste — link na bio. #redemira', 0.0581041768924112, 64, 1781007000000, 1781007000000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p75', 167062, 196084, 7478, 595, 768, 866, 4056, 491, '[{"n":"São Paulo","p":48},{"n":"Rio de Janeiro","p":31},{"n":"Curitiba","p":14},{"n":"Brasília","p":7}]', '[0.0434,0.0772,0.1337,0.2215,0.3441,0.4917,0.6408,0.7669,0.8585,0.9179,0.9538,0.9744,0.9859,0.9923,0.9958]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p76', 'pg1', 'u4', 'Rodízio de água: veja seu bairro', 'feed', 'publicado', 1782584580000, '#151210', '#FBF4E9', 'Rodízio de água: veja seu bairro — link na bio. #redemira', 0.06215301770354309, 68, 1782584580000, 1782584580000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p76', 167876, 195213, 7714, 813, 844, 1063, 3291, 335, '[{"n":"São Paulo","p":38},{"n":"Rio de Janeiro","p":32},{"n":"Belo Horizonte","p":20},{"n":"Fortaleza","p":11}]', '[0.0217,0.0418,0.0791,0.1446,0.2495,0.3955,0.5628,0.7169,0.8329,0.9075,0.9507,0.9743,0.9868,0.9932,0.9966]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p77', 'pg1', 'u4', 'Reforma tributária: guia rápido', 'carrossel', 'publicado', 1779465840000, '#151210', '#FBF4E9', 'Reforma tributária: guia rápido — link na bio. #redemira', 0.11552941420053003, 126, 1779465840000, 1779465840000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p77', 579584, 776830, 47440, 3963, 3225, 12331, 8899, 1424, '[{"n":"São Paulo","p":38},{"n":"Rio de Janeiro","p":24},{"n":"Curitiba","p":20},{"n":"Belo Horizonte","p":17}]', '[0.0202,0.0402,0.0784,0.1474,0.26,0.4166,0.5919,0.7467,0.8569,0.9241,0.9611,0.9805,0.9903,0.9952,0.9976]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p78', 'pg1', 'u4', 'Eleições 2026: o que muda no seu voto', 'carrossel', 'publicado', 1781520540000, '#151210', '#FBF4E9', 'Eleições 2026: o que muda no seu voto — link na bio. #redemira', 0.12646550759938857, 138, 1781520540000, 1781520540000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p78', 804670, 910044, 62863, 4381, 4737, 29782, 14293, 1278, '[{"n":"São Paulo","p":59},{"n":"Belo Horizonte","p":16},{"n":"Rio de Janeiro","p":13},{"n":"Curitiba","p":12}]', '[0.1673,0.2618,0.385,0.5249,0.661,0.7749,0.8587,0.9147,0.9498,0.9709,0.9833,0.9905,0.9946,0.9969,0.9983]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p79', 'pg1', 'u4', 'Enem 2026: inscrições abertas', 'feed', 'publicado', 1780687860000, '#151210', '#FBF4E9', 'Enem 2026: inscrições abertas — link na bio. #redemira', 0.06685146128351913, 73, 1780687860000, 1780687860000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p79', 82975, 95208, 4270, 305, 374, 598, 2599, 71, '[{"n":"São Paulo","p":47},{"n":"Rio de Janeiro","p":26},{"n":"Belo Horizonte","p":16},{"n":"Porto Alegre","p":11}]', '[0.2023,0.2728,0.3569,0.4508,0.5483,0.6423,0.7265,0.7971,0.8532,0.8958,0.9271,0.9495,0.9653,0.9763,0.9838]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p80', 'pg1', 'u4', 'Eleições 2026: o que muda no seu voto', 'reels', 'publicado', 1779637200000, '#151210', '#FBF4E9', 'Eleições 2026: o que muda no seu voto — link na bio. #redemira', 0.10677899004924395, 117, 1779637200000, 1779637200000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p80', 1667210, 2076206, 123473, 14681, 17696, 22173, 21575, 1549, '[{"n":"São Paulo","p":49},{"n":"Rio de Janeiro","p":26},{"n":"Belo Horizonte","p":16},{"n":"Fortaleza","p":10}]', '[0.1584,0.2546,0.3826,0.5292,0.671,0.7872,0.8703,0.9241,0.9567,0.9757,0.9864,0.9925,0.9958,0.9977,0.9987]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p81', 'pg5', 'u4', 'Fundos imobiliários pra iniciantes', 'carrossel', 'publicado', 1779025380000, '#FF6B2C', '#FBF4E9', 'Fundos imobiliários pra iniciantes — link na bio. #redemira', 0.11969922341969101, 98, 1779025380000, 1779025380000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p81', 109583, 124514, 7082, 699, 779, 4557, 2289, 271, '[{"n":"São Paulo","p":42},{"n":"Rio de Janeiro","p":37},{"n":"Porto Alegre","p":10},{"n":"Curitiba","p":10}]', '[0.1001,0.14,0.1925,0.2586,0.338,0.4277,0.5224,0.6155,0.7008,0.7742,0.8338,0.8801,0.9149,0.9402,0.9584]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p82', 'pg5', 'u5', 'Tarifas de banco: o comparativo', 'carrossel', 'publicado', 1779397200000, '#FF2E7E', '#FBF4E9', 'Tarifas de banco: o comparativo — link na bio. #redemira', 0.1050801177089195, 86, 1779397200000, 1779397200000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p82', 108403, 133944, 6230, 637, 689, 3835, 3096, 246, '[{"n":"São Paulo","p":40},{"n":"Rio de Janeiro","p":28},{"n":"Belo Horizonte","p":18},{"n":"Curitiba","p":14}]', '[0.1243,0.1841,0.264,0.3633,0.4757,0.5906,0.6964,0.7848,0.853,0.9022,0.9362,0.9589,0.9737,0.9833,0.9894]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p83', 'pg2', 'u5', 'O retorno da banda que marcou os anos 2000', 'carrossel', 'publicado', 1781107680000, '#FF2E7E', '#FBF4E9', 'O retorno da banda que marcou os anos 2000 — link na bio. #redemira', 0.12446449271710096, 109, 1781107680000, 1781107680000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p83', 317456, 383237, 24817, 2733, 2179, 9783, 6744, 1306, '[{"n":"São Paulo","p":49},{"n":"Rio de Janeiro","p":25},{"n":"Recife","p":13},{"n":"Belo Horizonte","p":13}]', '[0.1445,0.2273,0.3389,0.4717,0.6087,0.7305,0.8252,0.8916,0.9348,0.9615,0.9775,0.987,0.9925,0.9957,0.9975]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p84', 'pg5', 'u5', 'Aposentadoria aos 40: utopia?', 'feed', 'publicado', 1782150120000, '#CBFB45', '#151210', 'Aposentadoria aos 40: utopia? — link na bio. #redemira', 0.16978264952449248, 140, 1782150120000, 1782150120000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p84', 58569, 70325, 5125, 525, 483, 3811, 2331, 177, '[{"n":"São Paulo","p":54},{"n":"Rio de Janeiro","p":21},{"n":"Belo Horizonte","p":14},{"n":"Fortaleza","p":12}]', '[0.089,0.1308,0.1883,0.2634,0.3554,0.4594,0.5671,0.6688,0.7569,0.8276,0.8809,0.9194,0.9462,0.9644,0.9766]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p85', 'pg2', 'u5', 'Turnê mundial 2027 confirmada', 'carrossel', 'publicado', 1780521060000, '#FF2E7E', '#FBF4E9', 'Turnê mundial 2027 confirmada — link na bio. #redemira', 0.08497392796885285, 74, 1780521060000, 1780521060000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p85', 445113, 492171, 24030, 1502, 1424, 10867, 7131, 647, '[{"n":"São Paulo","p":49},{"n":"Rio de Janeiro","p":30},{"n":"Curitiba","p":11},{"n":"Fortaleza","p":10}]', '[0.1366,0.2072,0.3014,0.416,0.5405,0.6601,0.7623,0.8411,0.8974,0.9352,0.9597,0.9752,0.9848,0.9908,0.9944]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p86', 'pg5', 'u5', 'Selic caiu: e agora, renda fixa?', 'carrossel', 'analisando', 1782907980000, '#7A4DFF', '#FBF4E9', 'Selic caiu: e agora, renda fixa? — link na bio. #redemira', 0.10632240505649161, 87, 1782907980000, 1782907980000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p86', 55849, 62536, 3441, 182, 390, 1925, 1844, 192, '[{"n":"São Paulo","p":43},{"n":"Rio de Janeiro","p":31},{"n":"Curitiba","p":13},{"n":"Porto Alegre","p":12}]', '[0.0734,0.1143,0.1738,0.2554,0.3587,0.477,0.5979,0.7079,0.7981,0.8656,0.9131,0.9448,0.9654,0.9785,0.9867]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p87', 'pg2', 'u5', 'Red carpet: os looks que quebraram a internet', 'feed', 'publicado', 1778419200000, '#FF2E7E', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.06770159056867829, 59, 1778419200000, 1778419200000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p87', 610222, 725661, 29078, 3182, 2706, 6347, 7420, 1074, '[{"n":"São Paulo","p":47},{"n":"Rio de Janeiro","p":25},{"n":"Belo Horizonte","p":17},{"n":"Curitiba","p":12}]', '[0.0895,0.128,0.1796,0.2463,0.3278,0.4212,0.5205,0.6183,0.7074,0.783,0.8433,0.8893,0.923,0.9471,0.9639]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p88', 'pg5', 'u5', 'Como sair do rotativo em 90 dias', 'carrossel', 'publicado', 1778942880000, '#7A4DFF', '#FBF4E9', 'Como sair do rotativo em 90 dias — link na bio. #redemira', 0.12161193684369839, 100, 1778942880000, 1778942880000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p88', 224649, 265091, 16256, 1681, 1607, 7776, 7714, 304, '[{"n":"São Paulo","p":57},{"n":"Rio de Janeiro","p":20},{"n":"Belo Horizonte","p":12},{"n":"Fortaleza","p":11}]', '[0.0335,0.0624,0.1134,0.1971,0.3204,0.4752,0.6349,0.7696,0.8651,0.9249,0.9594,0.9785,0.9887,0.9941,0.9969]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p89', 'pg5', 'u5', '13º antecipado: vale a pena?', 'story', 'publicado', 1779553260000, '#FF2E7E', '#FBF4E9', '13º antecipado: vale a pena? — link na bio. #redemira', 0.155765503875969, 128, 1779553260000, 1779553260000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p89', 24768, 31010, 2301, 256, 127, 1174, 887, 84, '[{"n":"São Paulo","p":38},{"n":"Rio de Janeiro","p":29},{"n":"Belo Horizonte","p":20},{"n":"Salvador","p":13}]', '[0.2788,0.3581,0.446,0.5374,0.6264,0.7075,0.7773,0.8344,0.8791,0.913,0.9381,0.9562,0.9693,0.9785,0.985]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p90', 'pg5', 'u5', 'CDB ou Tesouro? guia sem economês', 'carrossel', 'analisando', 1782937620000, '#7A4DFF', '#FBF4E9', 'CDB ou Tesouro? guia sem economês — link na bio. #redemira', 0.12174177831912301, 100, 1782937620000, 1782937620000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p90', 114940, 156759, 9381, 793, 563, 3256, 3784, 213, '[{"n":"São Paulo","p":43},{"n":"Rio de Janeiro","p":30},{"n":"Recife","p":14},{"n":"Salvador","p":12}]', '[0.1026,0.1478,0.2083,0.2853,0.3771,0.4787,0.5821,0.6787,0.7621,0.8293,0.8805,0.9179,0.9443,0.9626,0.975]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p91', 'pg5', 'u5', 'Aposentadoria aos 40: utopia?', 'reels', 'publicado', 1782562140000, '#7A4DFF', '#FBF4E9', 'Aposentadoria aos 40: utopia? — link na bio. #redemira', 0.1387673814858281, 114, 1782562140000, 1782562140000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p91', 56238, 75900, 4613, 296, 376, 2519, 2137, 136, '[{"n":"São Paulo","p":37},{"n":"Rio de Janeiro","p":22},{"n":"Curitiba","p":21},{"n":"Belo Horizonte","p":20}]', '[0.0075,0.0151,0.0303,0.0598,0.1147,0.2088,0.3495,0.5225,0.6902,0.8194,0.9023,0.9495,0.9746,0.9873,0.9937]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p92', 'pg5', 'u5', 'CDB ou Tesouro? guia sem economês', 'story', 'publicado', 1780932360000, '#7A4DFF', '#FBF4E9', 'CDB ou Tesouro? guia sem economês — link na bio. #redemira', 0.09619511238090567, 79, 1780932360000, 1780932360000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p92', 81553, 97937, 5136, 491, 517, 1701, 2857, 311, '[{"n":"Rio de Janeiro","p":36},{"n":"São Paulo","p":35},{"n":"Belo Horizonte","p":17},{"n":"Brasília","p":13}]', '[0.0247,0.0463,0.0852,0.1515,0.2551,0.3965,0.5575,0.7073,0.8226,0.8989,0.9446,0.9703,0.9843,0.9918,0.9957]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p93', 'pg5', 'u5', 'Selic caiu: e agora, renda fixa?', 'story', 'publicado', 1780078080000, '#7A4DFF', '#FBF4E9', 'Selic caiu: e agora, renda fixa? — link na bio. #redemira', 0.12244300508654445, 101, 1780078080000, 1780078080000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p93', 27327, 35633, 2011, 196, 145, 994, 914, 60, '[{"n":"São Paulo","p":52},{"n":"Rio de Janeiro","p":19},{"n":"Belo Horizonte","p":17},{"n":"Salvador","p":13}]', '[0.0455,0.082,0.1433,0.2385,0.3696,0.5233,0.6727,0.7937,0.8781,0.931,0.9619,0.9793,0.9888,0.994,0.9968]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p94', 'pg2', 'u5', 'Bastidores do clipe mais caro do ano', 'carrossel', 'publicado', 1779805560000, '#FF2E7E', '#FBF4E9', 'Bastidores do clipe mais caro do ano — link na bio. #redemira', 0.12922942280818148, 113, 1779805560000, 1779805560000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p94', 70843, 87687, 6427, 518, 607, 1603, 1001, 161, '[{"n":"São Paulo","p":44},{"n":"Rio de Janeiro","p":24},{"n":"Belo Horizonte","p":19},{"n":"Recife","p":14}]', '[0.014,0.031,0.0675,0.1406,0.27,0.4554,0.654,0.8103,0.9062,0.9562,0.9801,0.9911,0.9961,0.9982,0.9992]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p95', 'pg5', 'u5', 'Aposentadoria aos 40: utopia?', 'feed', 'publicado', 1781186940000, '#FF2E7E', '#FBF4E9', 'Aposentadoria aos 40: utopia? — link na bio. #redemira', 0.13050291545189505, 107, 1781186940000, 1781186940000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p95', 27440, 35373, 2128, 208, 180, 1065, 672, 54, '[{"n":"Rio de Janeiro","p":39},{"n":"São Paulo","p":27},{"n":"Belo Horizonte","p":20},{"n":"Recife","p":15}]', '[0.2253,0.3279,0.4501,0.5786,0.6973,0.7945,0.8664,0.9158,0.9481,0.9684,0.9809,0.9885,0.9931,0.9959,0.9975]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p96', 'pg5', 'u5', 'Pix parcelado: entenda a taxa', 'story', 'publicado', 1781019960000, '#FF2E7E', '#FBF4E9', 'Pix parcelado: entenda a taxa — link na bio. #redemira', 0.09453502317591002, 78, 1781019960000, 1781019960000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p96', 61702, 75403, 3317, 247, 216, 2053, 1573, 192, '[{"n":"São Paulo","p":51},{"n":"Rio de Janeiro","p":28},{"n":"Curitiba","p":11},{"n":"Porto Alegre","p":10}]', '[0.0628,0.09,0.1274,0.1773,0.2413,0.3195,0.4093,0.5056,0.6015,0.6902,0.7668,0.8291,0.8775,0.9136,0.9398]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p97', 'pg5', 'u5', 'Selic caiu: e agora, renda fixa?', 'feed', 'publicado', 1781440680000, '#151210', '#FBF4E9', 'Selic caiu: e agora, renda fixa? — link na bio. #redemira', 0.12414334977519752, 102, 1781440680000, 1781440680000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p97', 22909, 30803, 1966, 102, 116, 660, 309, 95, '[{"n":"São Paulo","p":50},{"n":"Rio de Janeiro","p":25},{"n":"Belo Horizonte","p":15},{"n":"Curitiba","p":10}]', '[0.1733,0.2346,0.3095,0.3959,0.4893,0.5835,0.6719,0.7497,0.8141,0.8649,0.9035,0.9319,0.9524,0.9669,0.9772]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p98', 'pg5', 'u5', 'CDB ou Tesouro? guia sem economês', 'carrossel', 'publicado', 1780426860000, '#7A4DFF', '#FBF4E9', 'CDB ou Tesouro? guia sem economês — link na bio. #redemira', 0.16280247752657698, 134, 1780426860000, 1780426860000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p98', 155962, 168999, 13018, 1381, 1296, 9696, 5217, 206, '[{"n":"São Paulo","p":48},{"n":"Rio de Janeiro","p":28},{"n":"Belo Horizonte","p":13},{"n":"Salvador","p":11}]', '[0.0103,0.0238,0.0544,0.1193,0.242,0.4292,0.6391,0.8066,0.9076,0.9586,0.982,0.9923,0.9967,0.9986,0.9994]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p99', 'pg2', 'u5', 'Red carpet: os looks que quebraram a internet', 'reels', 'publicado', 1779717960000, '#151210', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.08606943905073638, 75, 1779717960000, 1779717960000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p99', 306427, 389696, 18798, 2221, 2177, 3178, 4821, 1130, '[{"n":"São Paulo","p":46},{"n":"Rio de Janeiro","p":31},{"n":"Belo Horizonte","p":12},{"n":"Salvador","p":11}]', '[0.1111,0.1849,0.2916,0.4277,0.5756,0.7112,0.8172,0.8903,0.9364,0.9639,0.9798,0.9888,0.9938,0.9966,0.9981]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p100', 'pg5', 'u5', '5 gastos invisíveis que drenam seu salário', 'carrossel', 'publicado', 1780302120000, '#FF2E7E', '#FBF4E9', '5 gastos invisíveis que drenam seu salário — link na bio. #redemira', 0.10335246590867546, 85, 1780302120000, 1780302120000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p100', 27353, 33628, 1568, 125, 143, 991, 856, 92, '[{"n":"São Paulo","p":46},{"n":"Rio de Janeiro","p":30},{"n":"Recife","p":12},{"n":"Salvador","p":12}]', '[0.2001,0.2694,0.3521,0.4447,0.5413,0.6349,0.7193,0.7907,0.8477,0.8913,0.9236,0.9469,0.9633,0.9748,0.9828]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p101', 'pg5', 'u5', '5 gastos invisíveis que drenam seu salário', 'carrossel', 'publicado', 1777927080000, '#7A4DFF', '#FBF4E9', '5 gastos invisíveis que drenam seu salário — link na bio. #redemira', 0.10440736659845742, 86, 1777927080000, 1777927080000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p101', 254120, 326222, 16460, 877, 1489, 7706, 10077, 444, '[{"n":"São Paulo","p":54},{"n":"Rio de Janeiro","p":22},{"n":"Curitiba","p":13},{"n":"Recife","p":11}]', '[0.0409,0.0683,0.1118,0.1778,0.2708,0.3895,0.523,0.6532,0.7639,0.8475,0.9052,0.9425,0.9657,0.9798,0.9881]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p102', 'pg5', 'u5', 'CDB ou Tesouro? guia sem economês', 'reels', 'analisando', 1782927240000, '#7A4DFF', '#FBF4E9', 'CDB ou Tesouro? guia sem economês — link na bio. #redemira', 0.08940057407446207, 74, 1782927240000, 1782927240000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p102', 47729, 61310, 2174, 120, 386, 1587, 1349, 149, '[{"n":"São Paulo","p":42},{"n":"Rio de Janeiro","p":30},{"n":"Curitiba","p":15},{"n":"Fortaleza","p":13}]', '[0.1726,0.2337,0.3083,0.3944,0.4876,0.5817,0.6702,0.7481,0.8128,0.8638,0.9026,0.9313,0.9519,0.9666,0.9769]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p103', 'pg4', 'u6', 'Tradutor de reunião corporativa', 'story', 'publicado', 1781534460000, '#151210', '#FBF4E9', 'Tradutor de reunião corporativa — link na bio. #redemira', 0.05921278110252828, 51, 1781534460000, 1781534460000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p103', 37931, 43671, 1527, 152, 292, 275, 491, 42, '[{"n":"São Paulo","p":39},{"n":"Rio de Janeiro","p":30},{"n":"Curitiba","p":16},{"n":"Belo Horizonte","p":16}]', '[0.1263,0.2373,0.4011,0.5904,0.7562,0.8698,0.935,0.9687,0.9852,0.9931,0.9968,0.9985,0.9993,0.9997,0.9998]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p104', 'pg4', 'u6', 'Quando o café acaba no escritório', 'story', 'publicado', 1781552580000, '#FF6B2C', '#FBF4E9', 'Quando o café acaba no escritório — link na bio. #redemira', 0.08306598304949228, 71, 1781552580000, 1781552580000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p104', 400224, 489334, 20844, 2001, 5931, 4469, 3751, 1301, '[{"n":"São Paulo","p":42},{"n":"Rio de Janeiro","p":31},{"n":"Belo Horizonte","p":14},{"n":"Curitiba","p":13}]', '[0.1351,0.2273,0.3564,0.5104,0.6625,0.7871,0.8744,0.9291,0.9611,0.9789,0.9887,0.994,0.9968,0.9983,0.9991]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p105', 'pg3', 'u6', 'Análise tática: o novo 4-3-3', 'feed', 'publicado', 1778092860000, '#CBFB45', '#151210', 'Análise tática: o novo 4-3-3 — link na bio. #redemira', 0.0701953125, 83, 1778092860000, 1778092860000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p105', 153600, 210993, 7899, 492, 897, 1494, 2017, 514, '[{"n":"São Paulo","p":57},{"n":"Rio de Janeiro","p":16},{"n":"Curitiba","p":16},{"n":"Belo Horizonte","p":11}]', '[0.0357,0.0591,0.0963,0.1532,0.235,0.3427,0.4696,0.6005,0.7184,0.8124,0.8803,0.9258,0.9549,0.9729,0.9839]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p106', 'pg4', 'u6', 'Tradutor de reunião corporativa', 'feed', 'publicado', 1779539340000, '#FF6B2C', '#FBF4E9', 'Tradutor de reunião corporativa — link na bio. #redemira', 0.05484190788197513, 47, 1779539340000, 1779539340000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p106', 556764, 712689, 20160, 1837, 5600, 2937, 10201, 1724, '[{"n":"São Paulo","p":35},{"n":"Rio de Janeiro","p":35},{"n":"Belo Horizonte","p":17},{"n":"Curitiba","p":13}]', '[0.1054,0.1713,0.266,0.3885,0.5269,0.6613,0.774,0.8572,0.9132,0.9486,0.97,0.9827,0.99,0.9943,0.9967]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p107', 'pg3', 'u6', 'Basquete: NBB define os playoffs', 'story', 'publicado', 1778235600000, '#CBFB45', '#151210', 'Basquete: NBB define os playoffs — link na bio. #redemira', 0.05127114247172357, 61, 1778235600000, 1778235600000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p107', 96370, 132634, 3706, 421, 203, 611, 2209, 204, '[{"n":"São Paulo","p":49},{"n":"Rio de Janeiro","p":23},{"n":"Belo Horizonte","p":18},{"n":"Salvador","p":11}]', '[0.0688,0.133,0.2417,0.3984,0.5791,0.7408,0.8559,0.925,0.9624,0.9816,0.991,0.9957,0.9979,0.999,0.9995]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p108', 'pg3', 'u6', 'Recorde histórico na São Silvestre', 'story', 'publicado', 1780132620000, '#CBFB45', '#151210', 'Recorde histórico na São Silvestre — link na bio. #redemira', 0.07379485320768395, 87, 1780132620000, 1780132620000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p108', 27590, 30722, 1503, 113, 128, 292, 396, 25, '[{"n":"São Paulo","p":38},{"n":"Belo Horizonte","p":23},{"n":"Rio de Janeiro","p":20},{"n":"Salvador","p":18}]', '[0.0879,0.1528,0.2523,0.3871,0.5417,0.6886,0.8054,0.8857,0.9355,0.9644,0.9807,0.9896,0.9944,0.997,0.9984]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p109', 'pg3', 'u6', 'Recorde histórico na São Silvestre', 'carrossel', 'publicado', 1782742920000, '#FBF4E9', '#151210', 'Recorde histórico na São Silvestre — link na bio. #redemira', 0.08962107952126401, 106, 1782742920000, 1782742920000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p109', 211390, 258482, 12489, 1034, 1105, 4317, 4826, 786, '[{"n":"São Paulo","p":52},{"n":"Rio de Janeiro","p":22},{"n":"Curitiba","p":13},{"n":"Belo Horizonte","p":13}]', '[0.0136,0.0308,0.0684,0.1449,0.2813,0.4747,0.676,0.8281,0.9175,0.9625,0.9834,0.9928,0.9968,0.9986,0.9994]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p110', 'pg4', 'u6', 'POV: segunda-feira chegou de novo', 'carrossel', 'publicado', 1780410120000, '#FF2E7E', '#FBF4E9', 'POV: segunda-feira chegou de novo — link na bio. #redemira', 0.10236536257980029, 88, 1780410120000, 1780410120000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p110', 122180, 158951, 8341, 861, 1185, 2120, 1134, 246, '[{"n":"São Paulo","p":50},{"n":"Rio de Janeiro","p":29},{"n":"Belo Horizonte","p":12},{"n":"Recife","p":9}]', '[0.0247,0.0471,0.0881,0.1588,0.2694,0.4188,0.5847,0.7334,0.8431,0.9131,0.9535,0.9757,0.9874,0.9935,0.9967]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p111', 'pg3', 'u6', 'Craque da base assina com clube europeu', 'carrossel', 'analisando', 1782843480000, '#FF2E7E', '#FBF4E9', 'Craque da base assina com clube europeu — link na bio. #redemira', 0.10620680243712521, 125, 1782843480000, 1782843480000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p111', 249146, 292133, 18227, 1866, 1605, 4763, 1718, 566, '[{"n":"São Paulo","p":35},{"n":"Rio de Janeiro","p":33},{"n":"Curitiba","p":18},{"n":"Belo Horizonte","p":14}]', '[0.1097,0.1496,0.2008,0.2641,0.3388,0.4226,0.511,0.5988,0.6807,0.7527,0.813,0.8613,0.8986,0.9268,0.9476]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p112', 'pg4', 'u6', 'Eu fingindo que li o contrato', 'carrossel', 'publicado', 1782378720000, '#151210', '#FBF4E9', 'Eu fingindo que li o contrato — link na bio. #redemira', 0.08291599260010372, 71, 1782378720000, 1782378720000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p112', 129191, 150412, 6861, 770, 1011, 2070, 1128, 151, '[{"n":"Rio de Janeiro","p":42},{"n":"São Paulo","p":32},{"n":"Curitiba","p":14},{"n":"Fortaleza","p":13}]', '[0.2242,0.2962,0.3799,0.4715,0.565,0.6541,0.7336,0.8004,0.8538,0.8948,0.9253,0.9474,0.9633,0.9745,0.9823]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p113', 'pg4', 'u6', 'Modo férias ativado (mentira)', 'feed', 'analisando', 1782980760000, '#151210', '#FBF4E9', 'Modo férias ativado (mentira) — link na bio. #redemira', 0.059835762687983664, 51, 1782980760000, 1782980760000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p113', 376163, 449322, 15138, 983, 3024, 3363, 4925, 1539, '[{"n":"São Paulo","p":47},{"n":"Rio de Janeiro","p":20},{"n":"Curitiba","p":17},{"n":"Fortaleza","p":16}]', '[0.1979,0.2944,0.4137,0.544,0.6686,0.7734,0.8523,0.907,0.9429,0.9654,0.9793,0.9876,0.9926,0.9956,0.9974]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p114', 'pg3', 'u6', 'Análise tática: o novo 4-3-3', 'feed', 'publicado', 1779280500000, '#7A4DFF', '#FBF4E9', 'Análise tática: o novo 4-3-3 — link na bio. #redemira', 0.07691107122551588, 91, 1779280500000, 1779280500000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p114', 89701, 104435, 5074, 437, 525, 863, 996, 206, '[{"n":"São Paulo","p":43},{"n":"Rio de Janeiro","p":23},{"n":"Belo Horizonte","p":20},{"n":"Salvador","p":14}]', '[0.159,0.2219,0.3007,0.3934,0.4944,0.5959,0.6898,0.7703,0.8349,0.8841,0.92,0.9455,0.9632,0.9753,0.9835]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p115', 'pg3', 'u6', 'Skate BR domina o pódio', 'story', 'publicado', 1780688280000, '#CBFB45', '#151210', 'Skate BR domina o pódio — link na bio. #redemira', 0.10191154846736794, 120, 1780688280000, 1780688280000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p115', 79569, 105446, 6215, 491, 749, 654, 776, 284, '[{"n":"São Paulo","p":40},{"n":"Rio de Janeiro","p":37},{"n":"Recife","p":12},{"n":"Salvador","p":11}]', '[0.043,0.072,0.1182,0.188,0.2857,0.4085,0.544,0.6733,0.7807,0.8601,0.9139,0.9483,0.9694,0.9821,0.9895]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p116', 'pg2', 'u7', 'Top 10 hits do momento', 'story', 'publicado', 1781957400000, '#FF2E7E', '#FBF4E9', 'Top 10 hits do momento — link na bio. #redemira', 0.08556704066908148, 75, 1781957400000, 1781957400000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p116', 169785, 230531, 10210, 1210, 955, 2153, 2823, 201, '[{"n":"São Paulo","p":50},{"n":"Rio de Janeiro","p":21},{"n":"Belo Horizonte","p":17},{"n":"Curitiba","p":11}]', '[0.2329,0.3123,0.4045,0.5039,0.603,0.6943,0.7726,0.8355,0.8837,0.9191,0.9444,0.9621,0.9744,0.9827,0.9884]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p117', 'pg1', 'u7', 'Reforma tributária: guia rápido', 'reels', 'publicado', 1782596400000, '#FF6B2C', '#FBF4E9', 'Reforma tributária: guia rápido — link na bio. #redemira', 0.11565540567674107, 127, 1782596400000, 1782596400000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p117', 1543914, 1791396, 124189, 11146, 23088, 20139, 31726, 2398, '[{"n":"São Paulo","p":47},{"n":"Rio de Janeiro","p":20},{"n":"Belo Horizonte","p":20},{"n":"Salvador","p":12}]', '[0.0124,0.0233,0.0431,0.0786,0.1389,0.2338,0.3661,0.5221,0.674,0.7964,0.8809,0.9333,0.9636,0.9804,0.9896]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p118', 'pg2', 'u7', 'Festival de inverno anuncia line-up', 'reels', 'analisando', 1782933060000, '#151210', '#FBF4E9', 'Festival de inverno anuncia line-up — link na bio. #redemira', 0.08767741079718795, 77, 1782933060000, 1782933060000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p118', 196014, 216389, 12635, 1045, 2055, 1451, 4430, 331, '[{"n":"São Paulo","p":51},{"n":"Rio de Janeiro","p":30},{"n":"Salvador","p":10},{"n":"Porto Alegre","p":9}]', '[0.1874,0.2513,0.3281,0.4154,0.5083,0.6007,0.6864,0.761,0.8225,0.8709,0.9075,0.9345,0.9541,0.968,0.9778]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p119', 'pg2', 'u7', 'Quiz: qual diva você seria?', 'story', 'publicado', 1779874860000, '#FF2E7E', '#FBF4E9', 'Quiz: qual diva você seria? — link na bio. #redemira', 0.07497453756940566, 65, 1779874860000, 1779874860000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p119', 30437, 42316, 1766, 176, 151, 189, 466, 45, '[{"n":"São Paulo","p":58},{"n":"Rio de Janeiro","p":17},{"n":"Curitiba","p":13},{"n":"Salvador","p":12}]', '[0.1461,0.1974,0.2612,0.337,0.4222,0.5123,0.6016,0.6846,0.7573,0.8177,0.8658,0.9027,0.9302,0.9504,0.965]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p120', 'pg2', 'u7', 'Festival de inverno anuncia line-up', 'feed', 'publicado', 1780507320000, '#FF2E7E', '#FBF4E9', 'Festival de inverno anuncia line-up — link na bio. #redemira', 0.09878632279145758, 86, 1780507320000, 1780507320000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p120', 137104, 163185, 10439, 919, 1156, 1030, 2072, 551, '[{"n":"São Paulo","p":36},{"n":"Rio de Janeiro","p":30},{"n":"Belo Horizonte","p":20},{"n":"Porto Alegre","p":14}]', '[0.0496,0.0993,0.1889,0.3298,0.5097,0.6871,0.8227,0.9074,0.9539,0.9777,0.9893,0.9949,0.9976,0.9989,0.9995]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p121', 'pg2', 'u7', 'Quiz: qual diva você seria?', 'carrossel', 'publicado', 1782733140000, '#FF2E7E', '#FBF4E9', 'Quiz: qual diva você seria? — link na bio. #redemira', 0.08574759840823258, 75, 1782733140000, 1782733140000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p121', 78906, 86857, 4547, 236, 277, 1706, 1313, 115, '[{"n":"São Paulo","p":53},{"n":"Rio de Janeiro","p":22},{"n":"Curitiba","p":13},{"n":"Porto Alegre","p":12}]', '[0.1884,0.2569,0.3398,0.4338,0.5328,0.6293,0.7165,0.79,0.8485,0.8929,0.9254,0.9487,0.9649,0.9762,0.9839]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p122', 'pg2', 'u7', 'Red carpet: os looks que quebraram a internet', 'story', 'publicado', 1781878260000, '#151210', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.07692157399085615, 67, 1781878260000, 1781878260000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p122', 51182, 53761, 2733, 288, 310, 606, 920, 218, '[{"n":"São Paulo","p":44},{"n":"Rio de Janeiro","p":30},{"n":"Belo Horizonte","p":16},{"n":"Salvador","p":10}]', '[0.0754,0.1048,0.1439,0.1944,0.2573,0.3321,0.4166,0.5062,0.5954,0.6787,0.752,0.8132,0.8621,0.8997,0.928]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p123', 'pg2', 'u7', 'Red carpet: os looks que quebraram a internet', 'story', 'publicado', 1779445380000, '#7A4DFF', '#FBF4E9', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', 0.09035446928008599, 79, 1779445380000, 1779445380000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p123', 264226, 369791, 17899, 1527, 2222, 2226, 2933, 324, '[{"n":"São Paulo","p":47},{"n":"Rio de Janeiro","p":29},{"n":"Belo Horizonte","p":13},{"n":"Curitiba","p":11}]', '[0.2504,0.3257,0.4112,0.5024,0.5935,0.6785,0.7532,0.8152,0.8645,0.9022,0.9302,0.9507,0.9654,0.9758,0.9831]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p124', 'pg1', 'u7', 'Eleições 2026: o que muda no seu voto', 'carrossel', 'publicado', 1778156460000, '#FBF4E9', '#151210', 'Eleições 2026: o que muda no seu voto — link na bio. #redemira', 0.10118301006073606, 111, 1778156460000, 1778156460000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p124', 495093, 598566, 33201, 2208, 2216, 12470, 13757, 731, '[{"n":"São Paulo","p":47},{"n":"Rio de Janeiro","p":32},{"n":"Belo Horizonte","p":11},{"n":"Fortaleza","p":10}]', '[0.0221,0.0412,0.0755,0.1344,0.2279,0.3594,0.516,0.6696,0.7939,0.8798,0.9329,0.9636,0.9805,0.9896,0.9945]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p125', 'pg2', 'u7', 'Festival de inverno anuncia line-up', 'reels', 'publicado', 1781717640000, '#FF2E7E', '#FBF4E9', 'Festival de inverno anuncia line-up — link na bio. #redemira', 0.08918583707668817, 78, 1781717640000, 1781717640000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p125', 969941, 1321636, 65878, 4706, 8715, 7206, 12036, 4143, '[{"n":"São Paulo","p":53},{"n":"Rio de Janeiro","p":19},{"n":"Curitiba","p":14},{"n":"Fortaleza","p":13}]', '[0.066,0.1018,0.1536,0.2254,0.318,0.4276,0.5449,0.6574,0.7546,0.8313,0.8876,0.9268,0.953,0.9701,0.9812]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p126', 'pg2', 'u7', 'Quiz: qual diva você seria?', 'story', 'analisando', 1782903720000, '#FBF4E9', '#151210', 'Quiz: qual diva você seria? — link na bio. #redemira', 0.059265182213669075, 52, 1782903720000, 1782903720000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p126', 73787, 80936, 3245, 226, 301, 601, 1278, 298, '[{"n":"São Paulo","p":40},{"n":"Rio de Janeiro","p":37},{"n":"Curitiba","p":12},{"n":"Belo Horizonte","p":11}]', '[0.1015,0.139,0.1875,0.248,0.3204,0.4025,0.4906,0.5792,0.663,0.7377,0.8008,0.8518,0.8915,0.9215,0.9438]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p127', 'pg2', 'u7', 'Festival de inverno anuncia line-up', 'feed', 'publicado', 1777926600000, '#FBF4E9', '#151210', 'Festival de inverno anuncia line-up — link na bio. #redemira', 0.08766201642426041, 77, 1777926600000, 1777926600000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p127', 111177, 128144, 7364, 522, 415, 1445, 1525, 111, '[{"n":"São Paulo","p":39},{"n":"Rio de Janeiro","p":39},{"n":"Curitiba","p":12},{"n":"Brasília","p":10}]', '[0.2184,0.3117,0.4234,0.5435,0.6587,0.7578,0.8353,0.8916,0.9302,0.9558,0.9723,0.9827,0.9893,0.9933,0.9959]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p128', 'pg2', 'u7', 'O documentário que todo mundo comenta', 'carrossel', 'publicado', 1780220040000, '#FF2E7E', '#FBF4E9', 'O documentário que todo mundo comenta — link na bio. #redemira', 0.10332833641966237, 90, 1780220040000, 1780220040000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p128', 204126, 246862, 13171, 836, 1410, 5675, 4507, 211, '[{"n":"Rio de Janeiro","p":45},{"n":"São Paulo","p":31},{"n":"Recife","p":14},{"n":"Brasília","p":10}]', '[0.0312,0.0522,0.086,0.1385,0.2155,0.3194,0.4451,0.5781,0.7007,0.8,0.8724,0.9211,0.9523,0.9715,0.9831]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p129', 'pg2', 'u7', 'Novela das 9: teoria dos fãs viraliza', 'carrossel', 'publicado', 1781541060000, '#FF2E7E', '#FBF4E9', 'Novela das 9: teoria dos fãs viraliza — link na bio. #redemira', 0.11361859583213943, 99, 1781541060000, 1781541060000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p129', 565374, 709525, 42346, 3992, 4612, 13287, 10536, 818, '[{"n":"São Paulo","p":59},{"n":"Rio de Janeiro","p":22},{"n":"Porto Alegre","p":11},{"n":"Salvador","p":8}]', '[0.0116,0.0261,0.0576,0.1225,0.2419,0.4216,0.6248,0.7918,0.8968,0.952,0.9784,0.9904,0.9958,0.9982,0.9992]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p130', 'pg2', 'u7', 'Novela das 9: teoria dos fãs viraliza', 'reels', 'publicado', 1781623380000, '#151210', '#FBF4E9', 'Novela das 9: teoria dos fãs viraliza — link na bio. #redemira', 0.12678514866483964, 111, 1781623380000, 1781623380000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p130', 290452, 377023, 26212, 1823, 3965, 4825, 5958, 275, '[{"n":"São Paulo","p":59},{"n":"Rio de Janeiro","p":15},{"n":"Belo Horizonte","p":14},{"n":"Curitiba","p":13}]', '[0.0572,0.0941,0.1511,0.2336,0.343,0.472,0.6049,0.7239,0.8179,0.885,0.9294,0.9576,0.9748,0.9851,0.9913]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p131', 'pg2', 'u7', 'Festival de inverno anuncia line-up', 'story', 'publicado', 1780338780000, '#FF2E7E', '#FBF4E9', 'Festival de inverno anuncia line-up — link na bio. #redemira', 0.12365522813284008, 108, 1780338780000, 1780338780000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p131', 117585, 149263, 10562, 1262, 1324, 1392, 2282, 171, '[{"n":"São Paulo","p":49},{"n":"Rio de Janeiro","p":27},{"n":"Belo Horizonte","p":15},{"n":"Salvador","p":9}]', '[0.0879,0.1202,0.1623,0.2156,0.2805,0.3561,0.4395,0.5266,0.6121,0.6911,0.7604,0.8182,0.8646,0.9006,0.9278]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p132', 'pg1', 'u7', 'Vacina da dengue chega ao SUS', 'carrossel', 'publicado', 1778675160000, '#151210', '#FBF4E9', 'Vacina da dengue chega ao SUS — link na bio. #redemira', 0.10235523911536765, 112, 1778675160000, 1778675160000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p132', 396775, 420215, 27272, 2575, 3399, 7366, 9949, 1648, '[{"n":"São Paulo","p":45},{"n":"Rio de Janeiro","p":26},{"n":"Curitiba","p":16},{"n":"Belo Horizonte","p":12}]', '[0.0553,0.0881,0.1375,0.2083,0.3028,0.4175,0.5419,0.6613,0.7632,0.8418,0.8977,0.9354,0.9599,0.9753,0.9849]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p133', 'pg1', 'u7', 'Rodízio de água: veja seu bairro', 'feed', 'analisando', 1782982980000, '#151210', '#FBF4E9', 'Rodízio de água: veja seu bairro — link na bio. #redemira', 0.09141857259588798, 100, 1782982980000, 1782982980000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p133', 121157, 150178, 7857, 918, 895, 1406, 3227, 518, '[{"n":"São Paulo","p":53},{"n":"Rio de Janeiro","p":25},{"n":"Curitiba","p":11},{"n":"Fortaleza","p":11}]', '[0.1032,0.1441,0.1975,0.2647,0.3449,0.435,0.5296,0.6221,0.7065,0.7788,0.8374,0.8828,0.9167,0.9415,0.9593]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p134', 'pg1', 'u7', 'Vacina da dengue chega ao SUS', 'story', 'publicado', 1781814840000, '#151210', '#FBF4E9', 'Vacina da dengue chega ao SUS — link na bio. #redemira', 0.10787506958344684, 118, 1781814840000, 1781814840000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p134', 84431, 111306, 6860, 785, 390, 1073, 1087, 250, '[{"n":"São Paulo","p":40},{"n":"Rio de Janeiro","p":31},{"n":"Belo Horizonte","p":16},{"n":"Salvador","p":13}]', '[0.0919,0.1332,0.1894,0.262,0.3504,0.4505,0.5547,0.6544,0.7421,0.8139,0.8692,0.9099,0.9388,0.9589,0.9726]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p135', 'pg2', 'u7', 'Turnê mundial 2027 confirmada', 'reels', 'publicado', 1781252940000, '#FF2E7E', '#FBF4E9', 'Turnê mundial 2027 confirmada — link na bio. #redemira', 0.12400394774584685, 108, 1781252940000, 1781252940000);
INSERT INTO post_metrics (post_id, re, im, li, co, sh, sa, cl, nf, cities, curve, synced_at) VALUES
  ('p135', 617061, 742082, 54387, 6224, 7568, 8339, 13837, 1418, '[{"n":"Rio de Janeiro","p":36},{"n":"São Paulo","p":33},{"n":"Belo Horizonte","p":16},{"n":"Recife","p":15}]', '[0.1256,0.2271,0.3754,0.5515,0.7155,0.8373,0.9132,0.9556,0.9778,0.989,0.9946,0.9974,0.9987,0.9994,0.9997]', 1783000800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p136', 'pg2', 'u1', 'Bastidores do clipe mais caro do ano', 'carrossel', 'agendado', 1783195200000, '#FF2E7E', '#FFFFFF', 'Bastidores do clipe mais caro do ano — link na bio. #redemira', NULL, NULL, 1783195200000, 1783195200000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p137', 'pg1', 'u2', 'Censo 2026: Brasil passa de 215 mi', 'carrossel', 'agendado', 1783101600000, '#151210', '#FBF4E9', 'Censo 2026: Brasil passa de 215 mi — link na bio. #redemira', NULL, NULL, 1783101600000, 1783101600000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p138', 'pg4', 'u3', 'Ninguém: … eu às 3h da manhã:', 'feed', 'agendado', 1783951200000, '#FF6B2C', '#FFFFFF', 'Ninguém: … eu às 3h da manhã: — link na bio. #redemira', NULL, NULL, 1783951200000, 1783951200000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p139', 'pg5', 'u4', 'Selic caiu: e agora, renda fixa?', 'feed', 'agendado', 1783249200000, '#7A4DFF', '#FFFFFF', 'Selic caiu: e agora, renda fixa? — link na bio. #redemira', NULL, NULL, 1783249200000, 1783249200000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p140', 'pg5', 'u5', '5 gastos invisíveis que drenam seu salário', 'feed', 'agendado', 1783173600000, '#7A4DFF', '#FFFFFF', '5 gastos invisíveis que drenam seu salário — link na bio. #redemira', NULL, NULL, 1783173600000, 1783173600000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p141', 'pg4', 'u6', 'Expectativa vs realidade: academia', 'feed', 'agendado', 1783594800000, '#FF6B2C', '#FFFFFF', 'Expectativa vs realidade: academia — link na bio. #redemira', NULL, NULL, 1783594800000, 1783594800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p142', 'pg2', 'u7', 'Red carpet: os looks que quebraram a internet', 'reels', 'agendado', 1783454400000, '#FF2E7E', '#FFFFFF', 'Red carpet: os looks que quebraram a internet — link na bio. #redemira', NULL, NULL, 1783454400000, 1783454400000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p143', 'pg4', 'u1', 'Modo férias ativado (mentira)', 'carrossel', 'agendado', 1783767600000, '#FF6B2C', '#FFFFFF', 'Modo férias ativado (mentira) — link na bio. #redemira', NULL, NULL, 1783767600000, 1783767600000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p144', 'pg3', 'u2', 'Craque da base assina com clube europeu', 'feed', 'agendado', 1783260000000, '#CBFB45', '#151210', 'Craque da base assina com clube europeu — link na bio. #redemira', NULL, NULL, 1783260000000, 1783260000000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p145', 'pg2', 'u3', 'Quiz: qual diva você seria?', 'feed', 'agendado', 1783778400000, '#FF2E7E', '#FFFFFF', 'Quiz: qual diva você seria? — link na bio. #redemira', NULL, NULL, 1783778400000, 1783778400000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p146', 'pg1', 'u4', 'Vacina da dengue chega ao SUS', 'carrossel', 'agendado', 1783886400000, '#151210', '#FBF4E9', 'Vacina da dengue chega ao SUS — link na bio. #redemira', NULL, NULL, 1783886400000, 1783886400000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p147', 'pg2', 'u5', 'Turnê mundial 2027 confirmada', 'feed', 'agendado', 1783414800000, '#FF2E7E', '#FFFFFF', 'Turnê mundial 2027 confirmada — link na bio. #redemira', NULL, NULL, 1783414800000, 1783414800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p148', 'pg3', 'u6', 'Basquete: NBB define os playoffs', 'carrossel', 'agendado', 1783274400000, '#CBFB45', '#151210', 'Basquete: NBB define os playoffs — link na bio. #redemira', NULL, NULL, 1783274400000, 1783274400000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p149', 'pg1', 'u7', 'Congresso vota marco da IA nesta semana', 'reels', 'agendado', 1783328400000, '#151210', '#FBF4E9', 'Congresso vota marco da IA nesta semana — link na bio. #redemira', NULL, NULL, 1783328400000, 1783328400000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p150', 'pg2', 'u1', 'Bastidores do clipe mais caro do ano', 'carrossel', 'agendado', 1783274400000, '#FF2E7E', '#FFFFFF', 'Bastidores do clipe mais caro do ano — link na bio. #redemira', NULL, NULL, 1783274400000, 1783274400000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p151', 'pg1', 'u2', 'Urgente: nova linha de metrô aprovada em SP', 'feed', 'agendado', 1783414800000, '#151210', '#FBF4E9', 'Urgente: nova linha de metrô aprovada em SP — link na bio. #redemira', NULL, NULL, 1783414800000, 1783414800000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p152', 'pg4', 'u3', 'Quando o café acaba no escritório', 'carrossel', 'agendado', 1783951200000, '#FF6B2C', '#FFFFFF', 'Quando o café acaba no escritório — link na bio. #redemira', NULL, NULL, 1783951200000, 1783951200000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p153', 'pg3', 'u2', 'Rodada do Brasileirão: o que esperar', 'feed', 'rascunho', 1782655200000, '#F4E9D6', '#151210', 'Rodada do Brasileirão: o que esperar — link na bio. #redemira', NULL, NULL, 1782655200000, 1782655200000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p154', 'pg1', 'u4', 'Congresso vota marco da IA nesta semana', 'feed', 'rascunho', 1782223200000, '#F4E9D6', '#151210', 'Congresso vota marco da IA nesta semana — link na bio. #redemira', NULL, NULL, 1782223200000, 1782223200000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p155', 'pg3', 'u6', 'Vôlei: Brasil garante vaga na final', 'feed', 'rascunho', 1782396000000, '#F4E9D6', '#151210', 'Vôlei: Brasil garante vaga na final — link na bio. #redemira', NULL, NULL, 1782396000000, 1782396000000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p156', 'pg2', 'u1', 'Top 10 hits do momento', 'feed', 'rascunho', 1782828000000, '#F4E9D6', '#151210', 'Top 10 hits do momento — link na bio. #redemira', NULL, NULL, 1782828000000, 1782828000000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p157', 'pg4', 'u3', 'Quando o café acaba no escritório', 'feed', 'rascunho', 1782396000000, '#F4E9D6', '#151210', 'Quando o café acaba no escritório — link na bio. #redemira', NULL, NULL, 1782396000000, 1782396000000);
INSERT INTO posts (id, page_id, author_id, cap, fmt, status, ts, tile_bg, tile_fg, caption, er, idp, created_at, updated_at) VALUES
  ('p158', 'pg5', 'u5', 'Pix parcelado: entenda a taxa', 'feed', 'rascunho', 1782309600000, '#F4E9D6', '#151210', 'Pix parcelado: entenda a taxa — link na bio. #redemira', NULL, NULL, 1782309600000, 1782309600000);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-07-02', 1840000);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-07-01', 1838236);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-30', 1836734);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-29', 1834313);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-28', 1832504);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-27', 1831084);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-26', 1829283);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-25', 1826797);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-24', 1824795);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-23', 1823431);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-22', 1821835);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-21', 1819696);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-20', 1817598);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-19', 1815502);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-18', 1813269);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-17', 1811911);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-16', 1809525);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-15', 1807400);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-14', 1806107);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-13', 1803677);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-12', 1802468);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-11', 1800305);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-10', 1797996);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-09', 1795585);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-08', 1793791);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-07', 1791539);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-06', 1789668);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-05', 1788546);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-04', 1786240);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-03', 1785088);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-02', 1783683);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-06-01', 1781772);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-31', 1780113);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-30', 1778332);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-29', 1776522);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-28', 1774735);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-27', 1772739);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-26', 1770720);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-25', 1768440);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-24', 1767306);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-23', 1765407);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-22', 1763851);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-21', 1762550);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-20', 1760564);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-19', 1759410);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-18', 1757704);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-17', 1755544);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-16', 1753344);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-15', 1752263);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-14', 1751129);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-13', 1748849);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-12', 1746423);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-11', 1744839);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-10', 1742673);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-09', 1741512);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-08', 1739822);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-07', 1738560);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-06', 1737347);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-05', 1735769);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg1', '2026-05-04', 1733719);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-07-02', 1120000);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-07-01', 1119140);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-30', 1117825);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-29', 1116529);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-28', 1115125);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-27', 1113802);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-26', 1112373);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-25', 1110894);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-24', 1109536);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-23', 1108632);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-22', 1107471);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-21', 1106328);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-20', 1104799);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-19', 1103841);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-18', 1103169);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-17', 1101994);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-16', 1100625);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-15', 1099358);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-14', 1098070);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-13', 1096791);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-12', 1095707);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-11', 1094581);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-10', 1093586);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-09', 1092811);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-08', 1091901);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-07', 1090871);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-06', 1089906);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-05', 1088445);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-04', 1087214);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-03', 1085716);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-02', 1084858);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-06-01', 1083542);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-31', 1082596);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-30', 1081160);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-29', 1079722);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-28', 1078552);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-27', 1077305);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-26', 1076207);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-25', 1075539);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-24', 1074520);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-23', 1073830);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-22', 1072333);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-21', 1070861);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-20', 1069720);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-19', 1068887);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-18', 1067790);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-17', 1066528);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-16', 1065727);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-15', 1064723);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-14', 1063582);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-13', 1062736);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-12', 1061304);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-11', 1060566);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-10', 1059696);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-09', 1059030);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-08', 1057790);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-07', 1056543);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-06', 1055140);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-05', 1053880);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg2', '2026-05-04', 1052775);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-07-02', 894000);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-07-01', 893352);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-30', 892688);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-29', 891824);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-28', 891021);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-27', 889940);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-26', 888847);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-25', 887679);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-24', 886573);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-23', 885464);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-22', 884279);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-21', 883643);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-20', 883111);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-19', 882474);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-18', 881511);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-17', 880734);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-16', 879623);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-15', 878748);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-14', 878078);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-13', 877008);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-12', 876246);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-11', 875218);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-10', 874417);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-09', 873489);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-08', 872358);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-07', 871440);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-06', 870441);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-05', 869639);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-04', 868787);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-03', 868156);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-02', 867208);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-06-01', 866240);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-31', 865068);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-30', 863895);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-29', 862688);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-28', 861633);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-27', 860528);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-26', 859400);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-25', 858569);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-24', 857426);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-23', 856613);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-22', 855576);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-21', 854881);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-20', 854085);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-19', 853071);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-18', 852440);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-17', 851392);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-16', 850876);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-15', 849962);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-14', 848827);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-13', 848080);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-12', 847499);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-11', 846429);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-10', 845345);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-09', 844617);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-08', 843906);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-07', 842979);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-06', 841898);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-05', 840999);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg3', '2026-05-04', 840126);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-07-02', 2310000);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-07-01', 2306847);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-30', 2303990);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-29', 2301022);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-28', 2298949);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-27', 2297466);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-26', 2294612);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-25', 2292522);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-24', 2289970);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-23', 2286811);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-22', 2284667);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-21', 2282796);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-20', 2280798);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-19', 2278976);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-18', 2276356);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-17', 2274931);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-16', 2272817);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-15', 2270521);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-14', 2267708);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-13', 2264831);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-12', 2263207);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-11', 2260684);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-10', 2257877);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-09', 2256346);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-08', 2254929);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-07', 2252099);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-06', 2250064);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-05', 2247072);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-04', 2244191);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-03', 2241129);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-02', 2238620);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-06-01', 2235931);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-31', 2234452);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-30', 2232062);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-29', 2229561);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-28', 2228188);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-27', 2225959);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-26', 2223077);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-25', 2220929);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-24', 2219366);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-23', 2216365);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-22', 2213754);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-21', 2211718);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-20', 2208808);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-19', 2206247);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-18', 2203912);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-17', 2201217);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-16', 2199364);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-15', 2197173);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-14', 2195145);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-13', 2192631);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-12', 2189926);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-11', 2186918);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-10', 2184677);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-09', 2182609);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-08', 2180314);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-07', 2177923);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-06', 2175117);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-05', 2172378);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg4', '2026-05-04', 2170241);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-07-02', 412000);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-07-01', 411493);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-30', 411201);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-29', 410888);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-28', 410476);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-27', 410027);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-26', 409655);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-25', 409353);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-24', 408913);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-23', 408503);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-22', 408196);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-21', 407664);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-20', 407206);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-19', 406918);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-18', 406501);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-17', 405979);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-16', 405578);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-15', 405193);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-14', 404892);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-13', 404565);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-12', 404022);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-11', 403483);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-10', 403016);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-09', 402652);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-08', 402181);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-07', 401825);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-06', 401390);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-05', 400924);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-04', 400594);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-03', 400051);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-02', 399801);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-06-01', 399559);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-31', 399048);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-30', 398514);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-29', 398268);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-28', 397835);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-27', 397527);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-26', 397081);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-25', 396560);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-24', 396161);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-23', 395902);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-22', 395378);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-21', 394833);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-20', 394412);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-19', 393894);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-18', 393593);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-17', 393337);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-16', 393013);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-15', 392614);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-14', 392108);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-13', 391634);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-12', 391155);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-11', 390699);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-10', 390406);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-09', 389906);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-08', 389626);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-07', 389387);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-06', 388919);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-05', 388680);
INSERT INTO page_metrics_daily (page_id, day, seguidores) VALUES ('pg5', '2026-05-04', 388197);
