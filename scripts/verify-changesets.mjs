import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { publicPackages } from './public-packages.mjs';

execFileSync(process.execPath, [path.resolve('node_modules/@changesets/cli/bin.js'), 'status'], {
  stdio: 'inherit',
});
const base = process.env.BASE_SHA;
const head = process.env.HEAD_SHA ?? 'HEAD';
if (base) {
  if (!/^[a-f0-9]{40}$/.test(base) || (head !== 'HEAD' && !/^[a-f0-9]{40}$/.test(head)))
    throw new Error('Expected immutable PR commit IDs');
  const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
  const versionPr =
    process.env.PR_HEAD_REF === 'changeset-release/master' &&
    process.env.PR_HEAD_REPO === process.env.GITHUB_REPOSITORY &&
    Boolean(process.env.RELEASE_BOT_LOGIN) &&
    process.env.PR_AUTHOR === process.env.RELEASE_BOT_LOGIN;
  const files = git('diff', '--name-only', '--diff-filter=A', base, head, '--', '.changeset').split(
    '\n',
  );
  if (
    !versionPr &&
    !files.some((file) => /^\.changeset\/[^/]+\.md$/.test(file) && file !== '.changeset/README.md')
  ) {
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
