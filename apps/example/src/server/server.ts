import { serve } from 'bun';
import { readFile } from 'fs/promises';
import staticFileMiddleware from './staticFileMiddleware';


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

serve({
  async fetch(req: Request) {
    const staticResponse = await staticFileMiddleware(req);
    if (staticResponse) {
      return staticResponse;
    }

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

