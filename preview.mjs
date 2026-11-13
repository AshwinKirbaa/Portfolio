import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';

const root = join(process.cwd(), 'dist');
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };
http.createServer(async (request, response) => {
  if (request.url === '/favicon.ico') {
    response.writeHead(204);
    response.end();
    return;
  }
  const path = request.url === '/' ? '/index.html' : request.url;
  try {
    const data = await readFile(join(root, path));
    response.writeHead(200, { 'Content-Type': types[extname(path)] || 'application/octet-stream' });
    response.end(data);
  } catch {
    response.writeHead(404);
    response.end('Not found');
  }
}).listen(4173, '127.0.0.1', () => console.log('Local: http://127.0.0.1:4173'));
