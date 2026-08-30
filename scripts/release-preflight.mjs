import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFile } from 'node:fs/promises';
import {
  distTagForVersion,
  NPM_REGISTRY,
  NPM_USERNAME,
  publicPackages,
} from './release-packages.mjs';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const minimumNpmVersion = [11, 5, 1];

function run(command, args) {
  return execFileSync(command, args, {
    cwd: workspaceRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function isVersionAtLeast(actual, minimum) {
  const actualParts = actual.split('.').slice(0, minimum.length).map(Number);
  for (let index = 0; index < minimum.length; index += 1) {
    if (actualParts[index] > minimum[index]) return true;
    if (actualParts[index] < minimum[index]) return false;
  }
  return true;
}

function isNpmNotFound(error) {
  const message = `${error?.stdout ?? ''}\n${error?.stderr ?? ''}\n${error?.message ?? ''}`;
  return message.includes('E404');
}

const manifests = await Promise.all(
  publicPackages.map(async ({ directory }) =>
    JSON.parse(
      await readFile(path.join(workspaceRoot, 'packages', directory, 'package.json'), 'utf8'),
    ),
  ),
);
const version = manifests[0].version;

if (manifests.some((manifest) => manifest.version !== version)) {
  throw new Error('五个公开包的版本不一致');
}

const npmVersion = run('npm', ['--version']);
if (!isVersionAtLeast(npmVersion, minimumNpmVersion)) {
  throw new Error(`npm ${npmVersion} 过旧，可信发布至少需要 npm 11.5.1`);
}

if (run('git', ['status', '--porcelain'])) {
  throw new Error('发布要求工作区和暂存区完全干净');
}

const expectedTag = `v${version}`;
const actualTag = run('git', ['describe', '--tags', '--exact-match', 'HEAD']);
if (actualTag !== expectedTag) {
  throw new Error(`当前提交必须带有精确标签 ${expectedTag}，实际为 ${actualTag}`);
}

const isGitHubOidc =
  process.env.GITHUB_ACTIONS === 'true' && Boolean(process.env.ACTIONS_ID_TOKEN_REQUEST_URL);
if (!isGitHubOidc) {
  const npmUser = run('npm', ['whoami', `--registry=${NPM_REGISTRY}`]);
  if (npmUser !== NPM_USERNAME) {
    throw new Error(`官方 npm 当前登录用户必须是 ${NPM_USERNAME}，实际为 ${npmUser}`);
  }
}

if (version === '0.1.0-alpha.0') {
  for (const packageInfo of publicPackages) {
    try {
      run('npm', ['view', packageInfo.name, 'name', `--registry=${NPM_REGISTRY}`]);
      throw new Error(`${packageInfo.name} 已存在，首次引导发布必须立即停止`);
    } catch (error) {
      if (!isNpmNotFound(error)) throw error;
    }
  }
}

for (const packageInfo of publicPackages) {
  const packageVersion = manifests.find((manifest) => manifest.name === packageInfo.name)?.version;
  try {
    run('npm', [
      'view',
      `${packageInfo.name}@${packageVersion}`,
      'version',
      `--registry=${NPM_REGISTRY}`,
    ]);
    throw new Error(`${packageInfo.name}@${packageVersion} 已存在，npm 版本不可覆盖`);
  } catch (error) {
    if (!isNpmNotFound(error)) throw error;
  }
}

process.stdout.write(
  `发布预检通过：${publicPackages.length} 个包将以 ${version} 发布到 ${distTagForVersion(version)}\n`,
);
