import { execFileSync } from 'node:child_process';
import { mkdtemp, writeFile } from 'node:fs/promises';
import { cpus, platform, arch, tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { build, createServer, preview } from 'vite';

// Loading experiment only: this does not replace visual/behavior parity gates.
const mode = process.argv[2] ?? 'dev';
if (!['dev', 'warm', 'build'].includes(mode)) {
  throw new Error('Usage: node scripts/benchmark-parity-loading.mjs [dev|warm|build]');
}
const root = fileURLToPath(new URL('../', import.meta.url));
const output = await mkdtemp(path.join(tmpdir(), 'semi-parity-loading-'));
const scenarios = ['avatar', 'select', 'tree', 'table', 'typography', 'pagination'];
const selectors = { tree: '.semi-tree-option', pagination: '.semi-page' };
const apps = ['reference-react', 'parity-vue'];
const servers = [];
const report = {
  mode,
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
  workingTree: execFileSync('git', ['status', '--short'], { cwd: root, encoding: 'utf8' }).trim(),
  platform: platform(),
  arch: arch(),
  cpus: cpus().length,
  node: process.version,
  concurrency: 3,
  scenarios,
  samples: [],
};
const started = performance.now();
let browser;
const elapsed = (since) => Math.round(performance.now() - since);

async function measure(app, scenario, phase) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 1,
    locale: 'zh-CN',
    timezoneId: 'Asia/Shanghai',
    colorScheme: 'light',
  });
  const page = await context.newPage();
  const sample = { app, scenario, phase, requests: 0, errors: [] };
  page.on('request', () => sample.requests++);
  page.on('pageerror', (error) => sample.errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') sample.errors.push(message.text());
  });
  page.on('requestfailed', (request) => sample.errors.push(`Request failed: ${request.url()}`));
  const begin = performance.now();
  try {
    const url = new URL(servers[apps.indexOf(app)].resolvedUrls.local[0]);
    url.search = new URLSearchParams({
      scenario,
      theme: 'light',
      direction: 'ltr',
      locale: 'zh-CN',
    });
    await page.goto(url.href, { waitUntil: 'domcontentloaded', timeout: 60000 });
    sample.domReadyMs = elapsed(begin);
    await page.locator('h1').waitFor({ state: 'visible', timeout: 60000 });
    sample.shellMs = elapsed(begin);
    // Wait for real component content too: an absent loading marker alone can be a false positive.
    await page
      .locator(`.scenario-panel ${selectors[scenario] ?? `.semi-${scenario}`}`)
      .first()
      .waitFor({ timeout: 60000 });
    await page
      .locator('[data-parity-scenario-loading]')
      .waitFor({ state: 'detached', timeout: 60000 });
    sample.componentMs = elapsed(begin);
    sample.loadingAfterShellMs = sample.componentMs - sample.shellMs;
    await page.evaluate(async () => {
      await globalThis.document.fonts.ready;
      await new Promise((resolve) =>
        globalThis.requestAnimationFrame(() => globalThis.requestAnimationFrame(resolve)),
      );
    });
    sample.stableMs = elapsed(begin);
  } catch (error) {
    sample.errors.push(error.message);
    sample.failedMs = elapsed(begin);
  } finally {
    report.samples.push(sample);
    console.log(JSON.stringify(sample));
    await context.close();
  }
}

async function runPhase(phase, concurrency) {
  // Each worker visits React and Vue concurrently, as openParityPages does.
  const queue = [...scenarios];
  const workers = await Promise.allSettled(
    Array.from({ length: concurrency }, async () => {
      for (let scenario = queue.shift(); scenario; scenario = queue.shift()) {
        await Promise.all(apps.map((app) => measure(app, scenario, phase)));
      }
    }),
  );
  const failedWorker = workers.find((result) => result.status === 'rejected');
  if (failedWorker) throw failedWorker.reason;
}

try {
  // Keep fresh caches/builds away from normal dev caches and package output.
  const preparations = await Promise.allSettled(
    apps.map(async (app, index) => {
      const appRoot = path.join(root, 'apps', app);
      const config = {
        root: appRoot,
        configFile: path.join(appRoot, 'vite.config.ts'),
        cacheDir: path.join(output, app, 'cache'),
        logLevel: 'error',
        build: { outDir: path.join(output, app, 'dist'), emptyOutDir: false },
      };
      if (mode === 'build') {
        await build(config);
        servers[index] = await preview({
          ...config,
          preview: { host: '127.0.0.1', port: 4273 + index, strictPort: true },
        });
      } else {
        const server = await createServer({
          ...config,
          server: { host: '127.0.0.1', port: 4273 + index, strictPort: true },
        });
        servers[index] = server;
        await server.listen();
      }
    }),
  );
  const failedPreparation = preparations.find((result) => result.status === 'rejected');
  if (failedPreparation) throw failedPreparation.reason;
  report.prepareMs = elapsed(started);
  browser = await chromium.launch();
  report.chromium = browser.version();
  const warmStarted = performance.now();
  if (mode === 'warm') await runPhase('warmup', 1);
  report.warmupMs = mode === 'warm' ? elapsed(warmStarted) : 0;
  const measured = performance.now();
  await runPhase('first', report.concurrency);
  await runPhase('repeat', report.concurrency);
  report.measureMs = elapsed(measured);
  report.totalMs = elapsed(started);
  if (report.samples.some((sample) => sample.errors.length)) process.exitCode = 1;
} catch (error) {
  report.error = error.stack;
  process.exitCode = 1;
} finally {
  await browser?.close();
  await Promise.all(servers.map((server) => server.close()));
  await writeFile(path.join(output, 'report.json'), JSON.stringify(report, null, 2));
  console.log(`Report: ${path.join(output, 'report.json')}`);
  console.log(JSON.stringify({ ...report, samples: undefined }));
}
