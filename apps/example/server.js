// [REF 21.1]
// server.js
import fs from 'node:fs/promises';
import express from 'express';
// import { TextEncoderStream, TextDecoderStream } from './TextDecoderStreamPolyfill.js'
// globalThis.TextEncoderStream ||= TextEncoderStream
// globalThis.TextDecoderStream ||= TextDecoderStream
import { EdgeRuntime } from 'edge-runtime';
import { join } from 'path';
import { build } from 'esbuild';
import { fileURLToPath } from 'url';
import { createServer } from 'http';
import sirv from 'sirv';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// Cached production assets
const templateHtml = isProduction
  ? await fs.readFile('./dist/client/index.html', 'utf-8')
  : '';
const ssrManifest = isProduction
  ? JSON.parse(await fs.readFile('./dist/client/ssr-manifest.json', 'utf-8'))
  : undefined;

// Shim to append the `addEventListener` code
const WORK_DIR = process.cwd();
const OUT_DIR = join(WORK_DIR, '.out');
const __dirname = fileURLToPath(new URL('.', import.meta.url));
const START_FILE = join(__dirname, 'src/start-shim.js');
const START_FILE_OUT = join(OUT_DIR, 'start.js');

await build({
  bundle: true,
  target: ['es2022'],
  entryPoints: [START_FILE],
  outfile: START_FILE_OUT,
  format: 'esm',
});

// Read the generated code
const code = await fs.readFile(START_FILE_OUT, 'utf-8');
const edgeRuntime = new EdgeRuntime({ initialCode: code });

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
  const compression = (await import('compression')).default;
  const sirvMiddleware = sirv('./dist/client', { extensions: [] });
  app.use(compression());
  app.use(base, sirvMiddleware);
}

// Function to read the body from a readable stream
async function readBodyAsString(body) {
  const reader = body.getReader();
  let result = '';
  let done, value;

  while (({ done, value } = await reader.read()) && !done) {
    result += new TextDecoder().decode(value);
  }
  
  return result;
}

// Serve HTML
app.use('*', async (req, res) => {
  try {
    const url = req.originalUrl.replace(base, '');

    let template;
    let render;
    if (!isProduction) {
      // Always read fresh template in development
      template = await fs.readFile('./index.html', 'utf-8');
      template = await vite.transformIndexHtml(url, template);
      render = (await vite.ssrLoadModule('/src/entry-server.tsx')).default;
    } else {
      template = templateHtml;
      render = (await import('./dist/server/entry-server.js')).default;
    }

    // Dispatch the request through the Edge Runtime
    const fullUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const subReq = await edgeRuntime.dispatchFetch(fullUrl);
    console.log(subReq, subReq.body, subReq.status, subReq.headers);
    const bodyText = subReq.body ? await readBodyAsString(subReq.body) : '';

    const rendered = await render(url, ssrManifest);

    const html = template
      .replace(`<!--app-head-->`, rendered.head ?? '')
      .replace(`<!--app-html-->`, bodyText);

    // Set the response headers and status
    res.status(subReq.status).set({ 'Content-Type': 'text/html' }).send(html);
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

