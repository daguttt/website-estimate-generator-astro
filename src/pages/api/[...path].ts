import type { APIRoute } from 'astro';
import { Hono } from 'hono';

import { estimatesRouter } from '@/server/features/estimates';
import { trimTrailingSlash } from 'hono/trailing-slash';

export const prerender = false;

const app = new Hono<{ Bindings: CloudflareBindings }>().basePath('/api');
app.use(trimTrailingSlash());

app.route('/estimate-generator', estimatesRouter);

// Map all request to the Hono app
export const ALL: APIRoute = (context) =>
  app.fetch(context.request, context.locals.runtime.env);
