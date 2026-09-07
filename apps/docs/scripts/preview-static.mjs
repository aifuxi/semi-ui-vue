import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { staticFileResponse } from './static-file-response.mjs';

const root = resolve(import.meta.dirname, '../.output/public');
const types = {
  '.wav': 'audio/wav',
  '.webm': 'video/webm',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ttf': 'font/ttf',
  '.woff2': 'font/woff2',
  '.wasm': 'application/wasm',
  '.xml': 'application/xml',
};
const port = Number(process.env.PORT ?? 4321);
const server = createServer(async (request, response) => {
  try {
    const pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
    const rules = await readFile(resolve(root, '_redirects'), 'utf8').catch(() => '');
    const redirect = rules
      .split('\n')
      .map((line) => line.split(' '))
      .find(([from]) => from === pathname);
    if (redirect) {
      response
        .writeHead(301, { location: redirect[1] + new URL(request.url, 'http://localhost').search })
        .end();
      return;
    }
    let file = resolve(root, `.${pathname}`);
    if (file !== root && !file.startsWith(`${root}${sep}`)) {
      response.writeHead(403).end();
      return;
    }
    if ((await stat(file)).isDirectory()) file = resolve(file, 'index.html');
    const content = await readFile(file);
    const result = staticFileResponse(content, {
      contentType: types[extname(file)] ?? 'application/octet-stream',
      method: request.method,
      range: request.headers.range,
    });
    response.writeHead(result.status, result.headers);
    response.end(result.body);
  } catch {
    response.writeHead(404, { 'content-type': 'text/html; charset=utf-8' });
    response.end(await readFile(resolve(root, '404.html')).catch(() => 'Not found'));
  }
});
server.listen(port, '127.0.0.1', () =>
  console.log(`Static documentation: http://127.0.0.1:${port}`),
);
for (const signal of ['SIGTERM', 'SIGINT'])
  process.on(signal, () => server.close(() => process.exit(0)));
