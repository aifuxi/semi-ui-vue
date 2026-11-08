import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { appendFile, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { publicPackages } from './public-packages.mjs';

// 只用于 Actions 的可丢弃 checkout，不允许在开发者工作区中运行升版演练。
assert.equal(
  process.env.GITHUB_ACTIONS,
  'true',
  '版本性能演练只能在可丢弃的 Actions checkout 中执行',
);
/** 记录精确 base，用于后续校验其成功 CI tree；不会推送此演练提交。 */
const base = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
/** 官方 CLI 仍读取真实六包和固定分组，仅关闭需要新 changeset Git 历史的远端 CHANGELOG 插件。 */
const originalConfig = await readFile('.changeset/config.json', 'utf8');
/** 使用官方默认 CHANGELOG 插件，避免未提交的演练 changeset 查询远端 PR；配置不会进入差异。 */
const config = { ...JSON.parse(originalConfig), changelog: ['@changesets/cli/changelog', {}] };
/** 非空 changeset 由官方 version 消费；基准演练不计算或手改包版本。 */
const changeset = '.changeset/performance-benchmark.md';
/** 记录实际安装规模，防止官方格式化子进程意外补装依赖而使轻量测量失真。 */
const installedBefore = await readdir('node_modules/.pnpm');
await writeFile(
  changeset,
  "---\n'@aifuxi/semi-ui-vue': patch\n---\n\n发布流程性能演练，不发布 npm。\n",
);
try {
  await writeFile('.changeset/config.json', JSON.stringify(config));
  execFileSync(process.execPath, ['node_modules/@changesets/cli/bin.js', 'version'], {
    stdio: 'inherit',
  });
} finally {
  await writeFile('.changeset/config.json', originalConfig);
  await rm(changeset, { force: true });
}
assert.deepEqual(await readdir('node_modules/.pnpm'), installedBefore, '升版过程不应补装依赖');
execFileSync('git', [
  'add',
  '--',
  '.changeset',
  ...publicPackages.flatMap(
    // 只暂存官方 version 命令产生的包版本和 CHANGELOG。
    ({ directory }) => [`packages/${directory}/package.json`, `packages/${directory}/CHANGELOG.md`],
  ),
]);
execFileSync(
  'git',
  [
    '-c',
    'user.name=Release benchmark',
    '-c',
    'user.email=benchmark@example.invalid',
    'commit',
    '-m',
    'chore(release): 演练纯版本变更（不推送）',
  ],
  { stdio: 'inherit' },
);
/** head 只存在于当前 runner，用于复用判定和两个方案的相同输入。 */
const head = execFileSync('git', ['rev-parse', 'HEAD'], { encoding: 'utf8' }).trim();
await appendFile(process.env.GITHUB_ENV, `BASE_SHA=${base}\nHEAD_SHA=${head}\n`);
