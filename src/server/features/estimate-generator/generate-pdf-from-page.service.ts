import type { Context } from 'hono';
import type { Browser, Page } from '@cloudflare/puppeteer';
import puppeteer from '@cloudflare/puppeteer';

import { ResultAsync } from 'neverthrow';

import type { RouterEnv } from './router-env.model';

type BrowserRenderingError =
  | {
      type: 'BROWSER_DID_NOT_LAUNCH';
    }
  | {
      type: 'COULD_NOT_CREATE_PAGE';
    }
  | {
      type: 'COULD_NOT_SET_PAGE_CONTENT';
    }
  | {
      type: 'COULD_NOT_GENERATE_PDF';
    };
function intoBrowserRenderingError(
  type: BrowserRenderingError['type']
): BrowserRenderingError {
  return {
    type,
  };
}

function createNewPage(browser: Browser) {
  return ResultAsync.fromPromise(browser.newPage(), () =>
    intoBrowserRenderingError('COULD_NOT_CREATE_PAGE')
  ).andTee(() =>
    console.debug(
      JSON.stringify({ debugMessage: '[DEBUG] Created page succesfully' })
    )
  );
}

function setPageContent(html: string) {
  return (page: Page) => {
    return ResultAsync.fromPromise(page.setContent(html), () =>
      intoBrowserRenderingError('COULD_NOT_SET_PAGE_CONTENT')
    ).andTee(() =>
      console.debug(
        JSON.stringify({ debugMessage: '[DEBUG] Page content set succesfully' })
      )
    );
  };
}

function generatePdfFromPage(page: Page) {
  return ResultAsync.fromPromise(
    page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '1cm',
        right: '1cm',
        bottom: '1cm',
        left: '1cm',
      },
    }),
    () => intoBrowserRenderingError('COULD_NOT_GENERATE_PDF')
  ).andTee(() =>
    console.debug(
      JSON.stringify({ debugMessage: '[DEBUG] PDF generated successfully' })
    )
  );
}

export function generatePdfFromHtml(
  c: Context<RouterEnv>,
  { html }: { html: string }
): ResultAsync<Buffer<ArrayBufferLike>, BrowserRenderingError> {
  const pdfAsyncRes = ResultAsync.fromPromise(
    puppeteer.launch(c.env.BROWSER),
    () => intoBrowserRenderingError('BROWSER_DID_NOT_LAUNCH')
  )
    .andThen(createNewPage)
    .andThrough(setPageContent(html))
    .andThen(generatePdfFromPage);

  return pdfAsyncRes;
}
