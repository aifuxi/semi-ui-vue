import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const guardedRoots = [
  'apps/parity-vue/src',
  'packages/ui/src',
  'packages/icons/src',
  'packages/icons-lab/src',
  'packages/illustrations/src',
  'packages/test-infra/src',
];
const sourceExtensions = new Set(['.css', '.js', '.mjs', '.scss', '.ts', '.tsx', '.vue']);
const importPatterns = [
  /\bfrom\s*['"]([^'"]+)['"]/g,
  /\bimport\s*['"]([^'"]+)['"]/g,
  /\bimport\s*\(\s*['"]([^'"]+)['"]/g,
  /\brequire\s*\(\s*['"]([^'"]+)['"]/g,
  /@import\s*['"]([^'"]+)['"]/g,
];
const publicPackagePolicies = ['ui', 'theme-default', 'icons', 'icons-lab', 'illustrations'];
// Dependency versions belong to package.json and the lockfile. Only architectural
// directions are duplicated here; normal dependency upgrades need no second edit.
const allowedInternalDependencies = new Set([
  '@aifuxi/semi-icons-vue',
  '@aifuxi/semi-illustrations-vue',
]);
const publicSourcePathPolicies = {
  '@aifuxi/semi-icons-vue': ['packages/icons/src/index.ts'],
  '@aifuxi/semi-illustrations-vue': ['packages/illustrations/src/index.ts'],
};

async function collectFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(entryPath)));
    } else if (sourceExtensions.has(path.extname(entry.name))) {
      files.push(entryPath);
    }
  }

  return files;
}

const files = (
  await Promise.all(guardedRoots.map((root) => collectFiles(path.join(workspaceRoot, root))))
)
  .flat()
  .sort();

for (const filePath of files) {
  const source = await readFile(filePath, 'utf8');
  const relativePath = path.relative(workspaceRoot, filePath);

  if (source.includes('@douyinfe/')) {
    throw new Error(`${relativePath} 直接依赖上游 React/Foundation 包`);
  }

  for (const pattern of importPatterns) {
    for (const match of source.matchAll(pattern)) {
      const specifier = match[1];
      if (
        relativePath.startsWith('apps/parity-vue/src/components/') &&
        specifier === '@aifuxi/semi-ui-vue'
      ) {
        throw new Error(
          `${relativePath} 从组件包根入口加载全部场景依赖；对照场景必须使用公开组件子路径`,
        );
      }
      if (specifier?.includes('vendor/semi-design')) {
        throw new Error(`${relativePath} 绕过允许边界读取 vendor/semi-design：${specifier}`);
      }
      if (
        specifier?.includes('foundation-integration') &&
        specifier !== '@workspace/foundation-integration'
      ) {
        throw new Error(`${relativePath} 使用 Foundation 私有层深层或相对导入：${specifier}`);
      }
    }
  }
}

for (const directory of publicPackagePolicies) {
  const manifestPath = `packages/${directory}/package.json`;
  const manifest = JSON.parse(await readFile(path.join(workspaceRoot, manifestPath), 'utf8'));
  for (const field of [
    'dependencies',
    'optionalDependencies',
    'peerDependencies',
    'devDependencies',
  ]) {
    for (const dependency of Object.keys(manifest[field] ?? {})) {
      if (
        dependency.startsWith('@workspace/') ||
        dependency.startsWith('@douyinfe/') ||
        /^(?:react|react-dom)(?:$|\/)/.test(dependency) ||
        (dependency.startsWith('@aifuxi/') &&
          !(directory === 'ui' && allowedInternalDependencies.has(dependency)))
      ) {
        throw new Error(`${manifestPath} 的 ${field} 包含禁止依赖：${dependency}`);
      }
    }
  }
  if (directory !== 'theme-default' && manifest.peerDependencies?.vue !== '>=3.5.0') {
    throw new Error(`${manifestPath} 必须声明 vue >=3.5.0 peer dependency`);
  }
}

const uiTsconfig = JSON.parse(
  await readFile(path.join(workspaceRoot, 'packages/ui/tsconfig.json'), 'utf8'),
);
const uiSourcePaths = uiTsconfig.compilerOptions?.paths ?? {};
for (const [specifier, expectedPaths] of Object.entries(publicSourcePathPolicies)) {
  if (JSON.stringify(uiSourcePaths[specifier]) !== JSON.stringify(expectedPaths)) {
    throw new Error(
      `packages/ui/tsconfig.json 缺少公开包干净源码映射：${specifier} -> ${expectedPaths.join(', ')}`,
    );
  }
}

process.stdout.write(
  `源码边界通过：检查 ${files.length} 个运行时文件、${publicPackagePolicies.length} 个公开包清单、${Object.keys(publicSourcePathPolicies).length} 个公开源码映射\n`,
);
