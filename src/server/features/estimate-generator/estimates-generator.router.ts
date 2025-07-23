import { Hono } from 'hono';
import { arktypeValidator } from '@hono/arktype-validator';

import { type } from 'arktype';

import type { RouterEnv } from './router-env.model';
import { generatePdfFromHtml } from './generate-pdf-from-page.service';
import { extractHtmlTemplateMw } from './extract-html-template.middleware';

const createEstimateSchema = type({
  brandName: 'string',
  brandPrimaryColor: 'string',
  description: 'string',
  numberOfPages: 'string',
  numberOfRevisions: 'string',
  deliveryTime: 'string',
});

export const router = new Hono<RouterEnv>()
  .basePath('/estimate-generator')
  .post(
    '/',
    arktypeValidator('json', createEstimateSchema),
    extractHtmlTemplateMw,
    async (c) => {
      // const createEstimateDto = c.req.valid('json');
      const htmlTemplate = c.var.htmlTemplate;

      // TODO: Process template with dynamic data and AI
      // const processedHtml = processTemplate(template, createEstimateDto);
      const processedHtml = htmlTemplate;

      const pdfBufferResult = await generatePdfFromHtml(c, {
        html: processedHtml,
      });

      if (pdfBufferResult.isErr()) {
        console.error(JSON.stringify(pdfBufferResult.error));
        return c.json(
          { error: 'Failed to generate PDF', err: pdfBufferResult.error },
          500
        );
      }

      return new Response(pdfBufferResult.value, {
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': 'attachment; filename=website-estimate.pdf',
        },
      });
    }
  );

// Helper function to process HTML template with dynamic data
function processTemplate(html: string, data: any): string {
  return html
    .replace(/\[Your Company Name\/Your Name\]/g, 'Website Estimate Generator')
    .replace(/\[Your Address\]/g, '123 Web St, Internet City')
    .replace(
      /\[Your Email\] \| \[Your Phone Number\]/g,
      'contact@example.com | +1 (555) 123-4567'
    )
    .replace(/\[Brand Name\]/g, data.brandName)
    .replace(/\[Project_Description\]/g, data.description)
    .replace(/\[Number_of_Pages\]/g, data.numberOfPages)
    .replace(/\[Number_of_Revisions\]/g, data.numberOfRevisions)
    .replace(/\[Delivery_Time_in_Weeks\]/g, data.deliveryTime)
    .replace(/--brand-primary-color/g, data.brandPrimaryColor);
}
