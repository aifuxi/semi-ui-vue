import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const vendorPath = 'vendor/semi-design';
const expectedCommit = 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21';
const expectedTag = 'v2.102.0';

function git(args) {
  return execFileSync('git', args, {
    cwd: workspaceRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

try {
  const commit = git(['-C', vendorPath, 'rev-parse', 'HEAD']);
  const tag = git(['-C', vendorPath, 'describe', '--tags', '--exact-match']);
  const changes = git(['-C', vendorPath, 'status', '--porcelain', '--untracked-files=all']);

  if (commit !== expectedCommit || tag !== expectedTag) {
    throw new Error(
      `参考基线不匹配：当前 ${tag || '(无标签)'} / ${commit}，预期 ${expectedTag} / ${expectedCommit}`,
    );
  }

  if (changes) {
    throw new Error(`只读参考源码存在未提交改动：\n${changes}`);
  }

  process.stdout.write(`Semi Design 参考基线已锁定：${tag} / ${commit}\n`);
} catch (error) {
  const detail = error instanceof Error ? error.message : String(error);
  process.stderr.write(
    `无法验证 ${vendorPath}。请先运行 git submodule update --init --depth 1 ${vendorPath}。\n${detail}\n`,
  );
  process.exitCode = 1;
}
