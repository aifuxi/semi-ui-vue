import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evidenceIsCurrent, validateReport, splitBatchReport } from './documentation-evidence.mjs';
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
