import { execFileSync } from 'node:child_process';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { build, preview } from 'vite';
import { parityBuildProvenance } from './parity-build-provenance.mjs';
import { parityPrismOrder, parityWorkerEntry } from './parity-build-runtime.mjs';

const app = process.argv[2];
if (!['reference-react', 'parity-vue'].includes(app)) throw new Error('Unknown parity app');
const root = fileURLToPath(new URL('../', import.meta.url));
const port = app === 'reference-react' ? 4173 : 4174;
execFileSync(process.execPath, [path.join(root, 'scripts/verify-vendor.mjs')], {
  stdio: 'inherit',
});
const output = await mkdtemp(path.join(tmpdir(), `semi-parity-${app}-`));
// Precompile the existing development test environment; production builds are
// still verified separately by pnpm check. Keep React diagnostics as part of parity.
process.env.NODE_ENV = 'development';
const started = performance.now();
const config = {
  root: path.join(root, 'apps', app),
  configFile: path.join(root, 'apps', app, 'vite.config.ts'),
  mode: 'development',
  logLevel: 'warn',
  cacheDir: path.join(output, 'cache'),
  build: { outDir: path.join(output, 'dist'), emptyOutDir: false, minify: false },
  plugins: [parityPrismOrder(), parityBuildProvenance(root)],
  worker: {
    plugins: () => [parityWorkerEntry()],
  },
};
await build(config);
const server = await preview({
  ...config,
  preview: { host: '127.0.0.1', port, strictPort: true },
});
console.log(
  `${app}: fresh build ready in ${Math.round(performance.now() - started)}ms (${output})`,
);
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.once(signal, async () => {
    await server.close();
    process.exit(0);
  });
}
