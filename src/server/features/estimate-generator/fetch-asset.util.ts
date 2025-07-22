import type { Context } from 'hono';
import type { RouterEnv } from './router-env.model';
import { ResultAsync } from 'neverthrow';

interface FetchAssetError {
  type: 'FETCH_ASSET_ERROR';
  context?: Record<string, unknown>;
}

function intoFetchAssetError(
  context?: Record<string, unknown>
): FetchAssetError {
  return {
    type: 'FETCH_ASSET_ERROR',
    context,
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
