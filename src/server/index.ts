import { Hono } from 'hono';
import { trimTrailingSlash } from 'hono/trailing-slash';

import { estimatesRouter } from './features/estimates';

export function createServerApp() {
  const app = new Hono<{ Bindings: CloudflareBindings }>().basePath('/api');
  app.use(trimTrailingSlash());

  app.route('/estimate-generator', estimatesRouter);

  return app;
}
