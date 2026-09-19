import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { publicPackages } from './public-packages.mjs';

// 空 changeset 只有 frontmatter 分隔符、没有 release 条目。
function isEmptyChangeset(source) {
  const lines = source.split('\n');
  if (lines[0]?.trim() !== '---') return false;
  const end = lines.findIndex((line, index) => index > 0 && line.trim() === '---');
  if (end === -1) return false;
  return lines.slice(1, end).every((line) => line.trim() === '');
}

const base = process.env.BASE_SHA;
const head = process.env.HEAD_SHA ?? 'HEAD';
if (base && (!/^[a-f0-9]{40}$/.test(base) || (head !== 'HEAD' && !/^[a-f0-9]{40}$/.test(head))))
  throw new Error('Expected immutable PR commit IDs');
const versionPr =
  Boolean(base) &&
  process.env.PR_HEAD_REF === 'changeset-release/master' &&
  process.env.PR_HEAD_REPO === process.env.GITHUB_REPOSITORY &&
  Boolean(process.env.RELEASE_BOT_LOGIN) &&
  process.env.PR_AUTHOR === process.env.RELEASE_BOT_LOGIN;
// 版本 PR 消费掉全部 changeset 并改写版本，CLI 的“变更包必须有记录”意图检查必然不成立，
// 因此只在普通 PR 上执行；可信版本 PR 的例外在本文件后面的差异检查里单独核对。
if (versionPr) {
  console.log('可信版本 PR：跳过 changeset status 的发布意图检查');
} else {
  // `changeset status` 默认按 .changeset/config.json 的 baseBranch 解析本地 master 分支，
  // 而 CI 的 PR 检出是 detached HEAD 且没有本地分支，因此优先用工作流传入的不可变 base SHA。
  execFileSync(
    process.execPath,
    [path.resolve('node_modules/@changesets/cli/bin.js'), 'status', '--since', base ?? 'master'],
    { stdio: 'inherit' },
  );
}
if (base) {
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  const files = git('diff', '--name-only', '--diff-filter=A', base, head, '--', '.changeset').split(
    '\n',
  );
  const addedChangeset = files.some(
    (file) => /^\.changeset\/[^/]+\.md$/.test(file) && file !== '.changeset/README.md',
  );
  // 清理历史空记录的 PR 不承载发布意图，可以只删除不新增；删除非空 changeset、或改动
  // `.changeset` 之外的文件时仍必须显式声明意图，避免静默取消发布。
  const changes = git('diff', '--name-status', base, head)
    .split('\n')
    .filter(Boolean)
    .map((line) => {
      const [status, ...rest] = line.split('\t');
      return { status, file: rest.join('\t') };
    });
  const emptyChangesetCleanup =
    changes.length > 0 &&
    changes.every(
      ({ status, file }) => status === 'D' && isEmptyChangeset(git('show', `${base}:${file}`)),
    );
  if (emptyChangesetCleanup) console.log('仅删除空 changeset：跳过“必须新增 changeset”的要求');
  if (!versionPr && !addedChangeset && !emptyChangesetCleanup) {
    throw new Error(
      'PR must add a changeset; use pnpm changeset --empty for changes without a release',
    );
  }
  const bootstrap = !git('ls-tree', base, '.changeset/config.json');
  if (!versionPr && !bootstrap) {
    for (const { directory } of publicPackages) {
      const file = `packages/${directory}/package.json`;
      const previous = JSON.parse(git('show', `${base}:${file}`));
      const next = JSON.parse(git('show', `${head}:${file}`));
      if (previous.version !== next.version)
        throw new Error('Only the version PR may update public package versions');
    }
  }
}
