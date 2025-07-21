import type { APIRoute } from 'astro';
import { Hono } from 'hono';

export const prerender = false;

const app = new Hono<{ Bindings: CloudflareBindings }>().basePath('/api/');

app.get('/posts', (c) => {
  return c.json({
    posts: [
      { id: 1, title: 'Hello World' },
      { id: 2, title: 'Goodbye World' },
    ],
  });
});

export const ALL: APIRoute = (context) =>
  app.fetch(context.request, context.locals.runtime.env);
