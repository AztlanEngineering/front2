import express from 'express';
import { createServer as createViteServer } from 'vite'
import { readFile } from 'fs/promises';
import sirv from 'sirv';
import compression from 'compression';

// Constants
const isProduction = process.env.NODE_ENV === 'production';
const port = process.env.PORT || 5173;
const base = process.env.BASE || '/';

// const handler = await import('../../api/renderer.js').then((module) => module.default);

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
async function createServer() {
  const app = express()

  // Create Vite server in middleware mode and configure the app type as
  // 'custom', disabling Vite's own HTML serving logic so parent server
  // can take control
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'custom'
  })

  // Use vite's connect instance as middleware. If you use your own
  // express router (express.Router()), you should use router.use
  // When the server restarts (for example after the user modifies
  // vite.config.js), `vite.middlewares` is still going to be the same
  // reference (with a new internal stack of Vite and plugin-injected
  // middlewares). The following is valid even after restarts.
  app.use(vite.middlewares)

  app.use('*', async (req, res) => {
    // Serve HTML
      try {
        const handler = await import('../../api/renderer.js').then((module) => module.default);
        const url = req.originalUrl.replace(base, '');
    
        let template;
        if (!isProduction) {
          // Always read fresh template in development
          template = templateHtml;
          template = await vite.transformIndexHtml(url, template);
          console.log(template)
        } else {
          template = templateHtml;
        }
        //handler = (await vite.ssrLoadModule('/src/server/renderer.tsx')).default;
        
    
        // Call the handler to render the React component and stream it
        handler(req, res, template, ssrManifest);
      } catch (e) {
        vite?.ssrFixStacktrace(e);
        console.log(e.stack);
        res.status(500).end(e.stack);
      }
  })

  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`)
  })
}

createServer()
