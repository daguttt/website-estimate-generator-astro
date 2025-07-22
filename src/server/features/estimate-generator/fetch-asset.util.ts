import type { Context } from 'hono';
import { ResultAsync } from 'neverthrow';

import type { ServerError } from '@server/features/shared-errors';

import type { RouterEnv } from './router-env.model';

type FetchAssetError = ServerError<'FETCH_ASSET_ERROR'>;

function intoFetchAssetError(meta?: Record<string, unknown>): FetchAssetError {
  return {
    type: 'FETCH_ASSET_ERROR',
    meta,
  };
}

export function fetchAsset(
  c: Context<RouterEnv>,
  { path }: { path: string }
): ResultAsync<Response, FetchAssetError> {
  console.debug('[DEBUG] Fetching asset from:', path);
  const url = new URL(path, c.req.url);
  if (import.meta.env.DEV)
    return ResultAsync.fromPromise(fetch(url), (err) =>
      intoFetchAssetError({ err })
    );

  return ResultAsync.fromPromise(c.env.ASSETS.fetch(url), (err) =>
    intoFetchAssetError({ err })
  );
}
