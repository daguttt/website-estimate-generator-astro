import { createMiddleware } from 'hono/factory';
import type { RouterEnv } from './router-env.model';
import { fetchAsset } from './fetch-asset.util';

export const extractHtmlTemplateMw = createMiddleware<RouterEnv>(
  async (c, next) => {
    const fetchAssetRes = await fetchAsset(c, {
      path: '/estimate-website-template-for-ai.html',
    }).map((response) => response.text());

    if (fetchAssetRes.isErr()) {
      console.error(JSON.stringify(fetchAssetRes.error));
      return c.json(
        { message: 'Failed to load template', error: fetchAssetRes.error },
        500
      );
    }

    c.set('htmlTemplate', fetchAssetRes.value);
    await next();
  }
);
