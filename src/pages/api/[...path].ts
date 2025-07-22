import type { APIRoute } from 'astro';
import { createServerApp } from '@/server';

export const prerender = false;

const app = createServerApp();

// Map all request to the server app
export const ALL: APIRoute = (context) =>
  app.fetch(
    context.request,
    context.locals.runtime.env,
    context.locals.runtime.ctx
  );
