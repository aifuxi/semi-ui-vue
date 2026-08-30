import { access, readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  distTagForVersion,
  NPM_REGISTRY,
  NPM_USERNAME,
  publicPackages,
  REPOSITORY,
} from './release-packages.mjs';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const expectedVersion = '0.1.0-alpha.0';
const forbiddenArtifactPatterns = [
  ['workspace 占位包名', /@workspace\//],
  ['vendor 源码路径', /vendor\/semi-design/],
  ['本机 macOS 绝对路径', /\/Users\/[^/\s]+\//],
  ['本机 Windows 绝对路径', /[A-Za-z]:\\Users\\/],
];

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, 'utf8'));
}

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else {
      files.push(entryPath);
    }
  }

  return files;
}

const versions = new Set();

for (const packageInfo of publicPackages) {
  const packageRoot = path.join(workspaceRoot, 'packages', packageInfo.directory);
  const manifestPath = path.join(packageRoot, 'package.json');
  const manifest = await readJson(manifestPath);
  const expectedTag = distTagForVersion(manifest.version);

  versions.add(manifest.version);
  assert(manifest.name === packageInfo.name, `${manifestPath} 的公开包名不正确`);
  assert(manifest.version === expectedVersion, `${manifest.name} 必须使用 ${expectedVersion}`);
  assert(!Object.hasOwn(manifest, 'private'), `${manifest.name} 不能保留 private 字段`);
  assert(manifest.license === 'MIT', `${manifest.name} 必须声明 MIT License`);
  assert(manifest.author === NPM_USERNAME, `${manifest.name} 的 author 必须是 ${NPM_USERNAME}`);
  assert(manifest.repository?.type === 'git', `${manifest.name} 缺少 git repository 类型`);
  assert(manifest.repository?.url === REPOSITORY.url, `${manifest.name} 的 repository.url 不正确`);
  assert(
    manifest.repository?.directory === `packages/${packageInfo.directory}`,
    `${manifest.name} 的 repository.directory 不正确`,
  );
  assert(
    manifest.homepage === `https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}#readme`,
    `${manifest.name} 的 homepage 不正确`,
  );
  assert(
    manifest.bugs?.url === `https://github.com/${REPOSITORY.owner}/${REPOSITORY.name}/issues`,
    `${manifest.name} 的 bugs.url 不正确`,
  );
  assert(manifest.publishConfig?.access === 'public', `${manifest.name} 必须公开发布`);
  assert(
    manifest.publishConfig?.registry === NPM_REGISTRY,
    `${manifest.name} 必须固定官方 npm registry`,
  );
  assert(manifest.publishConfig?.tag === expectedTag, `${manifest.name} 的 dist-tag 不正确`);

  for (const requiredFile of ['dist', 'LICENSE', 'README.md']) {
    assert(
      manifest.files?.includes(requiredFile),
      `${manifest.name} 的 files 缺少 ${requiredFile}`,
    );
    await access(path.join(packageRoot, requiredFile));
  }

  const readme = await readFile(path.join(packageRoot, 'README.md'), 'utf8');
  assert(readme.includes('不是 Semi Design 官方'), `${manifest.name} README 缺少非官方声明`);

  for (const dependencyField of ['dependencies', 'peerDependencies', 'optionalDependencies']) {
    for (const dependencyName of Object.keys(manifest[dependencyField] ?? {})) {
      assert(
        !dependencyName.startsWith('@workspace/'),
        `${manifest.name} 的 ${dependencyField} 泄漏私有 workspace 包 ${dependencyName}`,
      );
    }
  }

  for (const artifactPath of [
    manifestPath,
    path.join(packageRoot, 'README.md'),
    ...(await collectFiles(path.join(packageRoot, 'dist'))),
  ]) {
    const source = await readFile(artifactPath, 'utf8');
    for (const [label, pattern] of forbiddenArtifactPatterns) {
      assert(!pattern.test(source), `${path.relative(workspaceRoot, artifactPath)} 包含 ${label}`);
    }
    if (artifactPath.startsWith(path.join(packageRoot, 'dist'))) {
      assert(
        !source.includes('workspace:'),
        `${path.relative(workspaceRoot, artifactPath)} 泄漏 workspace 协议`,
      );
    }
  }
}

assert(versions.size === 1, '五个公开包必须使用完全相同的版本');

const uiManifest = await readJson(path.join(workspaceRoot, 'packages', 'ui', 'package.json'));
assert(
  uiManifest.dependencies?.['@aifuxi/semi-icons-vue'] === 'workspace:*',
  'UI 必须通过 workspace:* 精确关联公开图标包',
);
const rootManifest = await readJson(path.join(workspaceRoot, 'package.json'));
assert(
  rootManifest.private === true &&
    rootManifest.devDependencies?.['@workspace/foundation-integration'] === 'workspace:*',
  '私有 Foundation 构建依赖必须由根 workspace 持有，不能进入公开包 manifest',
);

for (const [directory, name] of [
  ['apps/docs-vue', '@workspace/docs-vue'],
  ['apps/reference-react', '@workspace/reference-react'],
  ['packages/foundation-integration', '@workspace/foundation-integration'],
  ['packages/test-infra', '@workspace/test-infra'],
]) {
  const manifest = await readJson(path.join(workspaceRoot, directory, 'package.json'));
  assert(manifest.name === name && manifest.private === true, `${name} 必须继续保持私有`);
}

process.stdout.write(
  `发布身份通过：${publicPackages.length} 个公开包统一为 ${expectedVersion}，dist-tag 为 ${distTagForVersion(expectedVersion)}\n`,
);
