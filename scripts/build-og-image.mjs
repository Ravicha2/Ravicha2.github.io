#!/usr/bin/env node
// Renders the committed social assets from their real sources by driving the
// locally installed Chrome:
//
//   scripts/og-card.html  + src/styles/{fonts,tokens}.css -> public/og-image.png  1200x630
//   public/favicon.svg                                    -> public/apple-touch-icon.png 180x180
//
// Re-run this after any palette change (#22). The card reads the tokens at
// render time, so a stale hex cannot survive a re-run.
//
// ponytail: a 20-line static server instead of pulling in vite just for this.
// The card links /src/styles/*.css and /fonts/* by absolute path, which is how
// the site itself loads them; file:// cannot serve those absolute paths.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const chrome =
  process.env.CHROME ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.woff2': 'font/woff2',
};

const server = createServer(async (req, res) => {
  const rel = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  // vite serves public/ at the site root, so /fonts and /assets have to resolve
  // to public/fonts and public/assets here too — otherwise fonts.css 404s and the
  // card silently renders in the system fallback face.
  const candidates = [path.join(root, rel), path.join(root, 'public', rel)].filter((p) =>
    p.startsWith(root)
  );
  for (const file of candidates) {
    try {
      const body = await readFile(file);
      res.writeHead(200, {
        'content-type': TYPES[path.extname(file)] ?? 'application/octet-stream',
      });
      return void res.end(body);
    } catch {
      // try the next root
    }
  }
  res.writeHead(404).end('not found');
});

await new Promise((done) => server.listen(0, '127.0.0.1', done));
const origin = `http://127.0.0.1:${server.address().port}`;

const shots = [
  { source: '/scripts/og-card.html', out: 'public/og-image.png', size: '1200,630' },
  { source: '/scripts/og-icon.html', out: 'public/apple-touch-icon.png', size: '180,180' },
];

for (const { source, out, size } of shots) {
  await new Promise((done, fail) => {
    const child = spawn(
      chrome,
      [
        '--headless=new',
        '--disable-gpu',
        '--hide-scrollbars',
        `--window-size=${size}`,
        `--screenshot=${path.join(root, out)}`,
        '--virtual-time-budget=4000',
        origin + source,
      ],
      { stdio: ['ignore', 'ignore', 'inherit'] }
    );
    child.on('error', fail);
    child.on('exit', (code) => (code === 0 ? done() : fail(new Error(`${out}: chrome exited ${code}`))));
  });
  console.log(`wrote ${out} (${size})`);
}

server.close();
