import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  mkdtemp,
  mkdir,
  readFile,
  readdir,
  rename,
  rm,
  symlink,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { gzipSync, gunzipSync } from 'node:zlib';
import {
  evidenceIsCurrent,
  validateReport,
  splitBatchReport,
  readEvidenceReport,
  writeEvidenceArchive,
  reportPartBytes,
  sha256,
} from './documentation-evidence.mjs';
const batch = {
  id: 'button',
  spec: 'button-matrix.spec.ts',
  title: 'Button 文档',
  upstream: 'basic/button',
  examples: [{ index: 1, name: 'Types' }],
  locales: ['zh-cn', 'en-us'],
  themes: ['light', 'dark'],
};
function fixture(current = batch) {
  return {
    errors: [],
    suites: [
      {
        specs: current.locales.flatMap((locale) =>
          current.themes.map((theme) => ({
            file: current.spec,
            title: `${current.title} Types ${locale} ${theme}`,
            tests: [
              {
                status: 'expected',
                results: [
                  {
                    status: 'passed',
                    duration: 25,
                    attachments: [
                      [
                        'environment',
                        {
                          baseline: 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21',
                          viewport: { width: 1440, height: 900 },
                          deviceScaleFactor: 1,
                          locale: locale === 'zh-cn' ? 'zh-CN' : 'en-US',
                          colorScheme: theme,
                          playwright: '1.62.1',
                        },
                      ],
                      [
                        'acceptance',
                        {
                          upstream: current.upstream,
                          index: 1,
                          name: 'Types',
                          locale,
                          theme,
                          checks: ['text', 'styles', 'geometry', 'screenshots', 'interaction'],
                        },
                      ],
                      ['default-styles', {}],
                      ['reference', {}],
                      ['vue', {}],
                    ].map(([name, body]) => ({
                      name,
                      body: Buffer.from(JSON.stringify(body)).toString('base64'),
                    })),
                  },
                ],
              },
            ],
          })),
        ),
      },
    ],
  };
}
test('完整双语/主题矩阵可通过报告校验', () => assert.equal(validateReport(fixture(), batch), true));
for (const [name, mutate] of [
  ['漏掉主题', (report) => report.suites[0].specs.pop()],
  ['重复用例', (report) => (report.suites[0].specs[1] = report.suites[0].specs[0])],
  ['失败', (report) => (report.suites[0].specs[0].tests[0].results[0].status = 'failed')],
  ['中断', (report) => (report.suites[0].specs[0].tests[0].results[0].status = 'interrupted')],
  ['跳过', (report) => (report.suites[0].specs[0].tests[0].status = 'skipped')],
  [
    '重试通过',
    (report) =>
      report.suites[0].specs[0].tests[0].results.push(
        report.suites[0].specs[0].tests[0].results[0],
      ),
  ],
  ['全局错误', (report) => report.errors.push({ message: 'server failed' })],
  ['缺少图片', (report) => report.suites[0].specs[0].tests[0].results[0].attachments.pop()],
  [
    '错误来源',
    (report) =>
      (report.suites[0].specs[0].tests[0].results[0].attachments[1].body =
        Buffer.from('{"upstream":"other"}').toString('base64')),
  ],
])
  test(`${name}不能计入验收`, () => {
    const report = fixture();
    mutate(report);
    assert.equal(validateReport(report, batch), false);
  });

test('修改源码或映射后旧验收失效，缺少构建检查也不能接受', () => {
  const evidence = {
    fingerprint: 'current',
    examples: batch.examples,
    checks: [
      'build:public-js',
      'build:theme',
      'build:nuxt',
      'typecheck:nuxt',
      'check:nuxt:content',
    ],
  };
  assert.equal(evidenceIsCurrent(evidence, batch, 'current'), true);
  assert.equal(evidenceIsCurrent(evidence, batch, 'changed'), false);
  assert.equal(
    evidenceIsCurrent(evidence, { ...batch, examples: [{ index: 1, name: 'Changed' }] }, 'current'),
    false,
  );
  assert.equal(evidenceIsCurrent({ ...evidence, checks: [] }, batch, 'current'), false);
});

const second = {
  ...batch,
  id: 'second',
  spec: 'second.spec.ts',
  title: '第二批',
  upstream: 'second',
};
function combined() {
  return {
    errors: [],
    stats: { duration: 250 },
    suites: [{ title: 'nested', suites: fixture().suites }, ...fixture(second).suites],
  };
}
test('共享报告按 spec 分批，保留完整附件与共享耗时', () => {
  const parts = splitBatchReport(combined(), [batch, second]);
  assert.equal(parts.length, 2);
  for (const part of parts) {
    assert.equal(validateReport(part.report, part.batch), true);
    assert.equal(part.report.stats.expected, 4);
    assert.equal(part.report.stats.duration, 100);
    assert.equal(part.report.sharedRunStats.duration, 250);
  }
});
for (const [name, mutate] of [
  ['未知 spec', (r) => r.suites.push(...fixture({ ...second, spec: 'unknown.ts' }).suites)],
  ['缺失整批', (r) => r.suites.pop()],
  ['重复用例', (r) => r.suites.push(...fixture(second).suites)],
  ['全局错误', (r) => r.errors.push({ message: 'teardown failed' })],
  ['另一批失败', (r) => (r.suites[1].specs[0].tests[0].results[0].status = 'failed')],
  [
    '另一批重试',
    (r) => r.suites[1].specs[0].tests[0].results.push(r.suites[1].specs[0].tests[0].results[0]),
  ],
  ['另一批缺少附件', (r) => r.suites[1].specs[0].tests[0].results[0].attachments.pop()],
])
  test(`共享报告${name}时整轮拒绝`, () => {
    const report = combined();
    mutate(report);
    assert.throws(() => splitBatchReport(report, [batch, second]));
  });
test('不能用两个批次重复认领同一 spec', () => {
  assert.throws(() => splitBatchReport(combined(), [batch, { ...second, spec: batch.spec }]));
});

const evidenceDirectory = 'docs/documentation/evidence';
async function archiveFixture(t, report = fixture()) {
  const workspace = await mkdtemp(resolve(tmpdir(), 'semi-evidence-'));
  t.after(() => rm(workspace, { recursive: true, force: true }));
  const raw = Buffer.from(JSON.stringify(report, null, 2) + '\n');
  const compressed = gzipSync(raw);
  const metadata = { fingerprint: 'current', examples: batch.examples, checks: [] };
  const evidence = await writeEvidenceArchive(batch, compressed, metadata, {
    workspace,
    partBytes: 128,
  });
  return { workspace, raw, compressed, metadata, evidence };
}

test('分片往返保留原gzip字节、完整附件及明确有序路径', async (t) => {
  const { workspace, compressed, raw, evidence } = await archiveFixture(t);
  assert.ok(evidence.reportArchive.parts.length > 1);
  assert.equal(evidence.reportArchive.byteLength, compressed.length);
  assert.equal(evidence.reportSha256, sha256(compressed));
  for (const part of evidence.reportArchive.parts) assert.ok(part.byteLength <= 128);
  assert.deepEqual(
    JSON.parse(await readFile(resolve(workspace, evidenceDirectory, 'button.json'))),
    evidence,
  );
  const loaded = await readEvidenceReport(evidence, batch, workspace);
  assert.deepEqual(
    loaded.paths,
    evidence.reportArchive.parts.map((part) => part.path),
  );
  assert.deepEqual(loaded.bytes, compressed);
  assert.deepEqual(gunzipSync(loaded.bytes), raw);
  assert.equal(validateReport(JSON.parse(gunzipSync(loaded.bytes)), batch), true);
});

test('旧固定单gz元数据无需迁移，新小报告也只写一个真实gzip', async (t) => {
  const { workspace, compressed, metadata } = await archiveFixture(t);
  const legacyPath = `${evidenceDirectory}/button.report.json.gz`;
  await writeFile(resolve(workspace, legacyPath), compressed);
  const legacy = { ...metadata, reportSha256: sha256(compressed) };
  const loaded = await readEvidenceReport(legacy, batch, workspace);
  assert.deepEqual(loaded.paths, [legacyPath]);
  assert.deepEqual(loaded.bytes, compressed);
  const single = await writeEvidenceArchive(batch, compressed, metadata, { workspace });
  assert.equal(single.reportArchive.parts.length, 1);
  const path = single.reportArchive.parts[0].path;
  assert.ok(path.endsWith('.json.gz'));
  assert.deepEqual(gunzipSync(await readFile(resolve(workspace, path))), gunzipSync(compressed));
  assert.deepEqual((await readEvidenceReport(single, batch, workspace)).paths, [path]);
});

for (const [name, mutate] of [
  ['缺片', async (e, w) => rm(resolve(w, e.reportArchive.parts[0].path))],
  ['乱序', async (e) => e.reportArchive.parts.reverse()],
  [
    '重复片',
    async (e) => {
      e.reportArchive.parts[1] = e.reportArchive.parts[0];
    },
  ],
  ['截短片列表', async (e) => e.reportArchive.parts.pop()],
  [
    '篡改片字节',
    async (e, w) => {
      const path = resolve(w, e.reportArchive.parts[0].path);
      const bytes = await readFile(path);
      bytes[0] ^= 1;
      await writeFile(path, bytes);
    },
  ],
  [
    '片长错误',
    async (e) => {
      e.reportArchive.parts[0].byteLength++;
    },
  ],
  [
    '总长错误',
    async (e) => {
      e.reportArchive.byteLength++;
    },
  ],
  [
    '片摘要错误',
    async (e) => {
      e.reportArchive.parts[0].sha256 = 'f'.repeat(64);
    },
  ],
  [
    '越界相对路径',
    async (e) => {
      e.reportArchive.parts[0].path = '../outside.gz';
    },
  ],
  [
    '绝对路径',
    async (e, w) => {
      e.reportArchive.parts[0].path = resolve(w, e.reportArchive.parts[0].path);
    },
  ],
  [
    '其它批次路径',
    async (e) => {
      e.reportArchive.parts[0].path = e.reportArchive.parts[0].path.replace('/button.', '/second.');
    },
  ],
  [
    '非规范同文件路径',
    async (e) => {
      e.reportArchive.parts[0].path = e.reportArchive.parts[0].path.replace(
        '/button.',
        '/./button.',
      );
    },
  ],
  [
    '符号链接片',
    async (e, w) => {
      const path = resolve(w, e.reportArchive.parts[0].path);
      await rename(path, `${path}.source`);
      await symlink(`${path}.source`, path);
    },
  ],
  [
    '未知归档格式',
    async (e) => {
      e.reportArchive.format = 'unknown';
    },
  ],
  [
    '空片列表',
    async (e) => {
      e.reportArchive.parts = [];
    },
  ],
  [
    '空元数据',
    async (e) => {
      e.reportArchive = null;
    },
  ],
  [
    '空片记录',
    async (e) => {
      e.reportArchive.parts[0] = null;
    },
  ],
])
  test(`归档${name}不能通过原验收读取入口`, async (t) => {
    const { workspace, evidence } = await archiveFixture(t);
    await mutate(evidence, workspace);
    assert.equal(await readEvidenceReport(evidence, batch, workspace), null);
  });

test('逐片摘要均有效仍必须验证重组gzip的整流摘要', async (t) => {
  const { workspace, evidence } = await archiveFixture(t);
  const original = evidence.reportSha256;
  evidence.reportSha256 = 'f'.repeat(64);
  for (const part of evidence.reportArchive.parts) {
    const next = part.path.replace(original, evidence.reportSha256);
    await rename(resolve(workspace, part.path), resolve(workspace, next));
    part.path = next;
  }
  assert.equal(await readEvidenceReport(evidence, batch, workspace), null);
});

test('摘要正确的损坏gzip和不完整矩阵仍不能计入验收', async (t) => {
  const { workspace, metadata } = await archiveFixture(t);
  for (const bytes of [
    Buffer.from('not a gzip'),
    gzipSync('{'),
    gzipSync(JSON.stringify({ errors: [], suites: [] })),
  ]) {
    await assert.rejects(
      writeEvidenceArchive(batch, bytes, metadata, { workspace, partBytes: 128 }),
    );
    // The legacy reader applies the identical gzip, JSON and complete-matrix gate.
    await writeFile(resolve(workspace, evidenceDirectory, 'button.report.json.gz'), bytes);
    const evidence = { ...metadata, reportSha256: sha256(bytes) };
    assert.equal(await readEvidenceReport(evidence, batch, workspace), null);
  }
});

test('成功提交后只清理本批旧单文件或分片，保留其它批次和无关文件', async (t) => {
  const { workspace, compressed, metadata, evidence: old } = await archiveFixture(t);
  const other = await writeEvidenceArchive(
    second,
    gzipSync(JSON.stringify(fixture(second))),
    metadata,
    { workspace, partBytes: 128 },
  );
  const legacyPath = resolve(workspace, evidenceDirectory, 'button.report.json.gz');
  const unrelated = resolve(workspace, evidenceDirectory, 'button.report.notes.json');
  await writeFile(legacyPath, compressed);
  await writeFile(unrelated, 'keep');
  const next = await writeEvidenceArchive(batch, gzipSync(JSON.stringify(fixture())), metadata, {
    workspace,
  });
  for (const path of [
    legacyPath,
    ...old.reportArchive.parts.map((part) => resolve(workspace, part.path)),
  ])
    await assert.rejects(readFile(path), { code: 'ENOENT' });
  for (const part of other.reportArchive.parts)
    assert.equal(sha256(await readFile(resolve(workspace, part.path))), part.sha256);
  assert.equal(await readFile(unrelated, 'utf8'), 'keep');
  assert.ok(await readEvidenceReport(next, batch, workspace));
  const files = await readdir(resolve(workspace, evidenceDirectory));
  assert.ok(!files.some((name) => name.startsWith('.button-archive-')));
});

test('新片写入失败时旧metadata与旧报告保留，临时目录清理', async (t) => {
  const { workspace, compressed, metadata, evidence: old } = await archiveFixture(t);
  // A real filesystem collision fails publishing before the metadata rename.
  const blocked = await archiveFixture(t, { ...fixture(), newGeneration: true });
  await mkdir(resolve(workspace, blocked.evidence.reportArchive.parts[0].path));
  await assert.rejects(
    writeEvidenceArchive(batch, blocked.compressed, metadata, { workspace, partBytes: 128 }),
  );
  assert.deepEqual(
    JSON.parse(await readFile(resolve(workspace, evidenceDirectory, 'button.json'))),
    old,
  );
  assert.deepEqual((await readEvidenceReport(old, batch, workspace)).bytes, compressed);
  assert.ok(
    !(await readdir(resolve(workspace, evidenceDirectory))).some((name) =>
      name.startsWith('.button-archive-'),
    ),
  );
});

test('归档阈值有界且拒绝跨目录batch id', async (t) => {
  const { workspace, compressed, metadata } = await archiveFixture(t);
  for (const partBytes of [0, -1, 1.5, Infinity, reportPartBytes + 1])
    await assert.rejects(
      writeEvidenceArchive(batch, compressed, metadata, { workspace, partBytes }),
    );
  await assert.rejects(
    writeEvidenceArchive({ ...batch, id: '../other' }, compressed, metadata, { workspace }),
  );
});
