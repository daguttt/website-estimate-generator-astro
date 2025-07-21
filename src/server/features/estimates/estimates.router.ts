import { Hono } from 'hono';

export const router = new Hono<{ Variables: { id: string } }>();

router.post('/', async (c) => {
  return c.json({ message: 'Hello, World!' }, 201);
});
