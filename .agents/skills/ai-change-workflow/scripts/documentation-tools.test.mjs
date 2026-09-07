import { EventEmitter } from 'node:events';
import { mkdirSync, writeFileSync } from 'node:fs';
import { mkdir, mkdtemp, readFile, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { prepareDocumentationDevelopment } from './documentation-dev.mjs';
import {
  classifyCommonEditorIssues,
  classifyDevelopmentEditorIssues,
  closeAnimatedItems,
  createSmokeTracker,
  runDocumentationSmoke,
} from './documentation-smoke.mjs';

class FakePage extends EventEmitter {}

test('smoke tracker records named phase timing and observable errors', async () => {
  const page = new FakePage();
  let clock = 0;
  const tracker = createSmokeTracker(page, { now: () => (clock += 25) });
  await tracker.step('basic', async () => {
    page.emit('console', { type: () => 'error', text: () => 'broken' });
  });
  assert.deepEqual(tracker.phases, [{ name: 'basic', durationMs: 25, status: 'passed' }]);
  assert.deepEqual(tracker.issues, [{ kind: 'console-error', phase: 'basic', text: 'broken' }]);
});

test('development editor classifier requires the exact worker failure and retains unrelated errors', () => {
  const issues = [
    {
      kind: 'requestfailed',
      phase: 'Basic-editor',
      text: 'http://127.0.0.1:4321/_nuxt/assets/editor.worker-a1.js net::ERR_FAILED',
    },
    { kind: 'pageerror', phase: 'Basic-editor', text: 'Event' },
    { kind: 'console-error', phase: 'Basic-editor', text: 'real application failure' },
  ];
  const classified = classifyDevelopmentEditorIssues(issues);
  assert.deepEqual(classified.known, issues.slice(0, 2));
  assert.deepEqual(classified.unexpected, issues.slice(2));
  assert.deepEqual(classifyDevelopmentEditorIssues(issues.slice(1)), {
    known: [],
    unexpected: issues.slice(1),
  });
});

test('common editor classifier accepts only the exact Volar browser warnings', () => {
  const issues = [
    {
      kind: 'console-warning',
      phase: 'Playground-editor',
      text: '[volar-service-emmet] this module is not yet supported for web.',
    },
    {
      kind: 'console-warning',
      phase: 'Playground-editor',
      text: '[volar-service-pug] this module is not yet supported for web.',
    },
    {
      kind: 'console-warning',
      phase: 'Playground-editor',
      text: '[volar-service-html] this module is not yet supported for web.',
    },
  ];
  const classified = classifyCommonEditorIssues(issues);
  assert.deepEqual(classified.known, issues.slice(0, 2));
  assert.deepEqual(classified.unexpected, issues.slice(2));
});

test('development preparation reuses resource proof and never builds site or checks', async (t) => {
  const root = await mkdtemp(resolve(tmpdir(), 'documentation-development-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  await mkdir(resolve(root, 'inputs/resources'), { recursive: true });
  await writeFile(resolve(root, 'inputs/resources/source.txt'), 'source');
  const calls = [];
  const definitions = [
    {
      id: 'resources',
      inputs: async () => ['inputs/resources'],
      outputs: ['outputs/resources.txt'],
      commands: [['build-resources']],
    },
    { id: 'site', inputs: async () => [], outputs: [], commands: [['build-site']] },
    { id: 'checks', inputs: async () => [], outputs: [], commands: [['run-checks']] },
  ];
  const run = (command) => {
    calls.push(command.join(' '));
    if (command[0] === 'build-resources') {
      mkdirSync(resolve(root, 'outputs'), { recursive: true });
      writeFileSync(resolve(root, 'outputs/resources.txt'), 'ready');
    }
  };
  const options = {
    root,
    definitions,
    context: async () => ({ fixture: true }),
    cache: resolve(root, 'cache'),
    output: resolve(root, 'timing.json'),
    log: () => {},
  };
  await prepareDocumentationDevelopment(run, options);
  await prepareDocumentationDevelopment(run, options);
  assert.deepEqual(calls, [
    'build-resources',
    'exec node scripts/prepare-content.mjs',
    'exec node scripts/prepare-coverage.mjs',
    'exec node scripts/prepare-content.mjs',
    'exec node scripts/prepare-coverage.mjs',
  ]);
  assert.equal(calls.includes('build-site'), false);
  assert.equal(calls.includes('run-checks'), false);
  assert.equal(JSON.parse(await readFile(resolve(root, 'timing.json'))).status, 'passed');
});

test('animated close waits for removal before trying the next item', async () => {
  let count = 1;
  let clicks = 0;
  const locator = {
    count: async () => count,
    first: () => ({
      click: async () => {
        clicks++;
        setTimeout(() => {
          count = 0;
        }, 20);
      },
    }),
  };
  await closeAnimatedItems({ waitForTimeout: async () => {} }, locator, {
    settleMs: 0,
    timeout: 1_000,
  });
  assert.equal(clicks, 1);
});

test('bilingual smoke runs locales concurrently and always writes timing summary', async (t) => {
  const outputDirectory = await mkdtemp(resolve(tmpdir(), 'documentation-smoke-'));
  t.after(() => rm(outputDirectory, { recursive: true, force: true }));
  let active = 0;
  let maximum = 0;
  let arrived = 0;
  let release;
  const contextConfigurations = [];
  const barrier = new Promise((resolveBarrier) => {
    release = resolveBarrier;
  });
  const browserType = {
    launch: async () => ({
      version: () => 'test-browser',
      newContext: async (configuration) => {
        contextConfigurations.push(configuration);
        return {
          newPage: async () => new FakePage(),
          close: async () => {},
        };
      },
      close: async () => {},
    }),
  };
  const summary = await runDocumentationSmoke({
    batch: 'example',
    locales: [
      { id: 'zh-cn', code: 'zh-CN' },
      { id: 'en-us', code: 'en-US' },
    ],
    outputDirectory,
    browserType,
    runLocale: async () => {
      active++;
      maximum = Math.max(maximum, active);
      if (++arrived === 2) release();
      await barrier;
      active--;
    },
  });
  assert.equal(maximum, 2);
  assert.equal(contextConfigurations.every(({ baseURL }) => baseURL === 'http://127.0.0.1:4321'), true);
  assert.deepEqual(
    summary.results.map(({ locale, status }) => ({ locale, status })),
    [
      { locale: 'zh-cn', status: 'passed' },
      { locale: 'en-us', status: 'passed' },
    ],
  );
  assert.equal(
    JSON.parse(await readFile(resolve(outputDirectory, 'summary.json'))).browserVersion,
    'test-browser',
  );
});
