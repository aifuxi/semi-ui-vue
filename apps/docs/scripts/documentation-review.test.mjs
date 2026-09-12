import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readFile, rm, writeFile, copyFile, access } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, dirname } from 'node:path';
import { spawnSync } from 'node:child_process';
import { documentReview, loadBatchReviews } from './documentation-evidence.mjs';

async function fixture(t) {
  const root = await mkdtemp(resolve(tmpdir(), 'documentation-review-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const doc = {
    category: 'show',
    slug: 'example',
    zhCN: { path: 'vendor/zh.md' },
    enUS: { path: 'vendor/en.md' },
  };
  const pages = ['en-us', 'zh-cn'].map((locale) => ({
    upstream: 'show/example',
    slug: 'example',
    path: `/${locale}/components/example/`,
  }));
  const files = [
    'vendor/zh.md',
    'vendor/en.md',
    'apps/docs/src/data/api/example.ts',
    ...pages.map((p) => `apps/docs/content${p.path.slice(0, -1)}.md`),
  ];
  async function write(file, value) {
    await mkdir(dirname(resolve(root, file)), { recursive: true });
    await writeFile(resolve(root, file), typeof value === 'string' ? value : JSON.stringify(value));
  }
  for (const file of files) await write(file, `source:${file}`);
  const mapping = {
    upstream: 'show/example',
    demos: [],
    review: { chapters: true, api: true, migration: true },
  };
  mapping.review.fingerprint = (await documentReview(doc, pages, mapping, root)).fingerprint;
  await write('docs/inventory/semi-v2.102.0.json', { documentation: [doc] });
  await write('apps/docs/src/data/pages.json', pages);
  await write('docs/documentation/mappings/example.json', mapping);
  const batch = { id: 'example-1', upstream: 'show/example', examples: [] };
  await write('docs/documentation/batches/example-1.json', batch);
  return { root, doc, pages, files, mapping, batch, write };
}

test('审阅独立于浏览器证据，拆批共用同一完整正文审阅', async (t) => {
  const f = await fixture(t);
  const reviews = await loadBatchReviews([f.batch, { ...f.batch, id: 'example-2' }], f.root);
  assert.equal(reviews.get('example-1').reviewed, true);
  assert.deepEqual(reviews.get('example-1'), reviews.get('example-2'));
});

for (let index = 0; index < 5; index++) {
  test(`审阅输入 ${index + 1} 改变时不能沿用旧指纹`, async (t) => {
    const f = await fixture(t);
    await f.write(f.files[index], 'changed');
    const result = await documentReview(f.doc, f.pages, f.mapping, f.root);
    assert.equal(result.reviewed, false);
    assert.notEqual(result.fingerprint, f.mapping.review.fingerprint);
  });
}

test('勾选项不完整、缺文件或缺语言不能通过审阅', async (t) => {
  const f = await fixture(t);
  for (const field of ['chapters', 'api', 'migration']) {
    const mapping = structuredClone(f.mapping);
    mapping.review[field] = false;
    assert.equal((await documentReview(f.doc, f.pages, mapping, f.root)).reviewed, false);
  }
  await rm(resolve(f.root, f.files[0]));
  // Even signing the missing-file marker must not certify a deleted review input.
  f.mapping.review.fingerprint = (
    await documentReview(f.doc, f.pages, f.mapping, f.root)
  ).fingerprint;
  assert.equal((await documentReview(f.doc, f.pages, f.mapping, f.root)).reviewed, false);
  assert.equal(
    (await documentReview(f.doc, f.pages.slice(0, 1), f.mapping, f.root)).reviewed,
    false,
  );
});

test('内联 API 页面可审阅，但删除原有 API 模块仍使旧审阅失效', async (t) => {
  const f = await fixture(t);
  await rm(resolve(f.root, f.files[2]));
  const changed = await documentReview(f.doc, f.pages, f.mapping, f.root);
  assert.equal(changed.reviewed, false);
  assert.notEqual(changed.fingerprint, f.mapping.review.fingerprint);
  f.mapping.review.fingerprint = changed.fingerprint;
  assert.equal((await documentReview(f.doc, f.pages, f.mapping, f.root)).reviewed, true);
});

async function cliFixture(t) {
  const f = await fixture(t);
  const directory = 'apps/docs/scripts';
  await mkdir(resolve(f.root, directory), { recursive: true });
  for (const name of ['accept-documentation-batch.mjs', 'documentation-evidence.mjs'])
    await copyFile(new URL(name, import.meta.url), resolve(f.root, directory, name));
  // Keep the real command and review implementation; make any expensive operation observable.
  await f.write(
    `${directory}/documentation-inputs.mjs`,
    `
    export async function preflightBatch() {}
    export async function batchInputs() { throw new Error('UNEXPECTED_FINGERPRINT'); }
  `,
  );
  await f.write(
    `${directory}/documentation-pipeline.mjs`,
    `
    import { writeFileSync } from 'node:fs';
    function unexpected() { writeFileSync(${JSON.stringify(resolve(f.root, 'expensive'))}, 'called'); throw new Error('UNEXPECTED_BUILD'); }
    export const prepareAcceptance = unexpected;
    export const assertPreparationCurrent = unexpected;
    export const runBrowserMatrices = unexpected;
    export const timedRunner = () => unexpected;
  `,
  );
  const run = (...args) =>
    spawnSync(
      process.execPath,
      [resolve(f.root, directory, 'accept-documentation-batch.mjs'), 'example-1', ...args],
      { cwd: f.root, encoding: 'utf8' },
    );
  return { ...f, run };
}

test('真实前置命令在没有浏览器证据时通过且不构建、不改文件', async (t) => {
  const f = await cliFixture(t);
  const mappingBefore = await readFile(
    resolve(f.root, 'docs/documentation/mappings/example.json'),
    'utf8',
  );
  const result = f.run('--preflight');
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /审阅有效/);
  await assert.rejects(access(resolve(f.root, 'expensive')));
  await assert.rejects(access(resolve(f.root, 'docs/documentation/evidence')));
  assert.equal(
    await readFile(resolve(f.root, 'docs/documentation/mappings/example.json'), 'utf8'),
    mappingBefore,
  );
});

test('真实正式入口先拒绝过期审阅，不能被现有浏览器证据绕过', async (t) => {
  const f = await cliFixture(t);
  await f.write(f.files[4], 'late editorial change');
  await f.write('docs/documentation/evidence/example-1.json', {
    fingerprint: 'existing',
    examples: [],
  });
  for (const args of [[], ['--preflight']]) {
    const result = f.run(...args);
    assert.equal(result.status, 1);
    assert.match(result.stderr, /前置审阅未通过/);
    assert.doesNotMatch(result.stderr, /UNEXPECTED/);
  }
  await assert.rejects(access(resolve(f.root, 'expensive')));
});

test('前置命令发现另一批审阅未完成时整组停止', async (t) => {
  const f = await cliFixture(t);
  const otherDoc = { ...f.doc, slug: 'other' };
  const otherPages = f.pages.map((page) => ({ ...page, upstream: 'show/other' }));
  await f.write('docs/inventory/semi-v2.102.0.json', { documentation: [f.doc, otherDoc] });
  await f.write('apps/docs/src/data/pages.json', [...f.pages, ...otherPages]);
  await f.write('docs/documentation/mappings/other.json', {
    ...f.mapping,
    upstream: 'show/other',
    review: { ...f.mapping.review, migration: false },
  });
  await f.write('docs/documentation/batches/other-1.json', {
    ...f.batch,
    id: 'other-1',
    upstream: 'show/other',
  });
  const result = f.run('--preflight', '--affected');
  assert.equal(result.status, 1);
  assert.match(result.stdout, /example-1: 审阅有效/);
  assert.match(result.stdout, /migration 尚未审阅/);
  assert.match(result.stderr, /前置审阅未通过：other-1/);
  await assert.rejects(access(resolve(f.root, 'expensive')));
});
