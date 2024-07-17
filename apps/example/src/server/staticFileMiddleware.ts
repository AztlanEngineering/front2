import { statSync, readFileSync } from 'fs';
import path from 'path';
import { serve } from 'bun';

const staticDir = path.resolve('dist/client');

// Function to check if a file exists
function fileExists(filePath: string): boolean {
  try {
    return statSync(filePath).isFile();
  } catch (err) {
    return false;
  }
}

// Function to get content type based on file extension
function getContentType(filePath: string): string {
  const ext = filePath.split('.').pop();
  switch (ext) {
    case 'html':
      return 'text/html';
    case 'js':
      return 'application/javascript';
    case 'css':
      return 'text/css';
    case 'svg':
      return 'image/svg+xml';
    default:
      return 'application/octet-stream';
  }
}

// Middleware to serve static files
async function staticFileMiddleware(req: Request): Promise<Response | null> {
  const url = new URL(req.url);
  const filePath = path.join(staticDir, url.pathname.slice(1));

  if (fileExists(filePath)) {
    const fileContent = readFileSync(filePath);
    const contentType = getContentType(filePath);
    return new Response(fileContent, {
      headers: {
        'Content-Type': contentType,
      },
    });
  }
  return null;
}

export default staticFileMiddleware;
