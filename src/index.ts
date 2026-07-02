// placar. — painel MIRA · Worker de borda: API + assets estáticos + cron de sync.
import { app } from './routes';
import type { Env } from './types';
import { demoSync } from './lib/demo';
import { fullSync } from './meta';
import { invalidateAgg } from './lib/agg';

export default {
  fetch: app.fetch,

  // A cada 30 min: publica agendados vencidos, sincroniza métricas da Graph API
  // (páginas conectadas) e simula o ciclo das páginas demo (não conectadas).
  async scheduled(_event: ScheduledController, env: Env, ctx: ExecutionContext): Promise<void> {
    ctx.waitUntil(
      (async () => {
        if (env.DEMO_MODE === '1') await demoSync(env);
        await fullSync(env);
        await invalidateAgg(env);
      })(),
    );
  },
} satisfies ExportedHandler<Env>;
