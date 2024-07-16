import express from 'express';
import { createServer } from 'http';
import { readFile } from 'fs/promises';
import sirv from 'sirv';
import compression from 'compression';
import handler from '../../api/renderer.js';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction
  ? await readFile('src/app/index.html', 'utf-8')
  : '';
const ssrManifest = isProduction
  ? JSON.parse(await readFile('dist/client/.vite/ssr-manifest.json', 'utf-8'))
  : undefined;

// Create HTTP server
const app = express();

// Add Vite or respective production middlewares
let vite;
if (!isProduction) {
  const { createServer } = await import('vite');
  vite = await createServer({
    server: { middlewareMode: true },
    appType: 'custom',
    base,
  });
  app.use(vite.middlewares);
} else {
  app.use(compression());
  app.use(base, sirv('./dist/client', { extensions: [] }));
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    let template;
    if (!isProduction) {
      // Always read fresh template in development
      template = templateHtml;
      template = await vite.transformIndexHtml(url, template);
    } else {
      template = templateHtml;
    }

    // Call the handler to render the React component and stream it
    handler(req, res, template, ssrManifest);
  } catch (e) {
    vite?.ssrFixStacktrace(e);
    console.log(e.stack);
    res.status(500).end(e.stack);
  }
});

// Start HTTP server
createServer(app).listen(port, (err) => {
  if (err) throw err;
  console.log(`Server started at http://localhost:${port}`);
});

