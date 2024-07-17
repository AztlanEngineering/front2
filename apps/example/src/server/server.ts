import { serve } from 'bun';
import { readFile } from 'fs/promises';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT) || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml: string = isProduction
  ? await readFile('dist/client/index.html', 'utf-8')
  : '';
const ssrManifest: Record<string, any> | undefined = isProduction
  ? JSON.parse(await readFile('dist/client/.vite/ssr-manifest.json', 'utf-8'))
  : undefined;

async function requestHandler(req: Request, res: Response) {
  try {
    const handler = await import('../../api/renderer.js').then(
      (module) => module.bunHandler
    );
    const url: string = req.url ? req.url.replace(base, '') : '';

    let template: string;
    if (!isProduction) {
      // Always read fresh template in development
      template = templateHtml;
      // Here you would normally transform the HTML with Vite
      console.log(template);
    } else {
      template = templateHtml;
    }

    // Call the handler to render the React component and stream it
    //handler(req, res, template, ssrManifest);
    handler(req, res);
  } catch (e: any) {
    console.error(e.stack);
    res.status(500).send(e.stack);
  }
}

serve({
  async fetch(req: Request) {
    const handler = await import('../../api/renderer.js').then(
      (module) => module.bunHandler
    );
    const stream = await handler(req, null);
    return new Response(stream, {
      headers: { "Content-Type": "text/html" },
    });
  },
  port,
});

console.log(`Server running at http://localhost:${port}`);

