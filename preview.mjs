import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { gzipSync } from 'node:zlib';

const root = join(process.cwd(), 'dist');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml'
};
http.createServer(async (request, response) => {
  if (request.url === '/favicon.ico') {
    response.writeHead(204);
    response.end();
    return;
  }
  const cleanUrl = request.url.split('?')[0];
  const path = cleanUrl === '/' ? '/index.html' : cleanUrl;
  try {
    const data = await readFile(join(root, path));
    const ext = extname(path);
    const acceptEncoding = request.headers['accept-encoding'] || '';
    const shouldGzip = /\bgzip\b/.test(acceptEncoding) && (ext === '.html' || ext === '.css' || ext === '.js' || ext === '.svg');

    const headers = {
      'Content-Type': types[ext] || 'application/octet-stream',
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=31536000, immutable'
    };

    if (shouldGzip) {
      headers['Content-Encoding'] = 'gzip';
      const compressed = gzipSync(data);
      headers['Content-Length'] = compressed.length;
      response.writeHead(200, headers);
      response.end(compressed);
    } else {
      headers['Content-Length'] = data.length;
      response.writeHead(200, headers);
      response.end(data);
    }
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
