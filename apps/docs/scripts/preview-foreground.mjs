import { spawn } from 'node:child_process';
import { resolve } from 'node:path';

const astroCli = resolve(import.meta.dirname, '../node_modules/astro/bin/astro.mjs');
const child = spawn(
  process.execPath,
  [astroCli, 'preview', '--port', '4321', '--host', '127.0.0.1'],
  {
    env: { ...process.env, ASTRO_PREVIEW_BACKGROUND: '0' },
    stdio: 'inherit',
  },
);

for (const signal of ['SIGINT', 'SIGTERM']) {
  process.on(signal, () => child.kill(signal));
}

child.on('exit', (code, signal) => {
  if (signal) process.kill(process.pid, signal);
  else process.exitCode = code ?? 1;
});
