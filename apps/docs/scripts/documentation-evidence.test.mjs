import { test } from 'node:test';
import assert from 'node:assert/strict';
import { evidenceIsCurrent, validateReport } from './documentation-evidence.mjs';
const batch = {
  title: 'Button 文档',
  upstream: 'basic/button',
  examples: [{ index: 1, name: 'Types' }],
  locales: ['zh-cn', 'en-us'],
  themes: ['light', 'dark'],
};
function fixture() {
  return {
    errors: [],
    suites: [
      {
        specs: batch.locales.flatMap((locale) =>
          batch.themes.map((theme) => ({
            title: `Button 文档 Types ${locale} ${theme}`,
            tests: [
              {
                status: 'expected',
                results: [
                  {
                    status: 'passed',
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
                          upstream: 'basic/button',
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
