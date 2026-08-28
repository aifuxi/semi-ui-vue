import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const guardedRoots = [
  'apps/docs-vue/src',
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
const publicPackagePolicies = [
  {
    manifest: 'packages/ui/package.json',
    dependencies: {
      '@workspace/icons': 'workspace:*',
      'date-fns': '2.30.0',
      'date-fns-tz': '1.3.8',
      lodash: '4.17.21',
    },
    optionalDependencies: {},
    peerDependencies: { vue: '>=3.5.0' },
    devDependencies: { '@workspace/foundation-integration': 'workspace:*' },
  },
  {
    manifest: 'packages/theme-default/package.json',
    dependencies: {},
    optionalDependencies: {},
    peerDependencies: {},
    devDependencies: { sass: '1.54.9' },
  },
  ...['icons', 'icons-lab', 'illustrations'].map((packageDirectory) => ({
    manifest: `packages/${packageDirectory}/package.json`,
    dependencies: {},
    optionalDependencies: {},
    peerDependencies: { vue: '>=3.5.0' },
    devDependencies: {},
  })),
];
const referenceApplicationPolicy = {
  manifest: 'apps/reference-react/package.json',
  dependencies: {
    '@workspace/test-infra': 'workspace:*',
    'bezier-easing': '2.1.0',
    classnames: '2.5.1',
    'date-fns': '2.30.0',
    'date-fns-tz': '1.3.8',
    lodash: '4.17.21',
    'normalize.css': 'catalog:',
    'prop-types': '15.8.1',
    react: 'catalog:',
    'react-dom': 'catalog:',
    'typeface-inter': 'catalog:',
  },
  optionalDependencies: {},
  peerDependencies: {},
  devDependencies: {
    '@types/lodash': '4.17.20',
    '@types/react': '18.0.5',
    '@types/react-dom': '18.0.1',
    sass: '1.54.9',
  },
};
const manifestPolicies = [...publicPackagePolicies, referenceApplicationPolicy];

function normalizedDependencies(value = {}) {
  return Object.fromEntries(
    Object.entries(value).sort(([left], [right]) => left.localeCompare(right)),
  );
}

function assertDependencyPolicy(manifestPath, field, actual, expected) {
  const normalizedActual = normalizedDependencies(actual);
  const normalizedExpected = normalizedDependencies(expected);

  if (JSON.stringify(normalizedActual) !== JSON.stringify(normalizedExpected)) {
    throw new Error(
      `${manifestPath} 的 ${field} 越过公开包依赖边界：期望 ${JSON.stringify(normalizedExpected)}，实际 ${JSON.stringify(normalizedActual)}`,
    );
  }
}

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

for (const policy of manifestPolicies) {
  const manifest = JSON.parse(await readFile(path.join(workspaceRoot, policy.manifest), 'utf8'));

  for (const field of [
    'dependencies',
    'optionalDependencies',
    'peerDependencies',
    'devDependencies',
  ]) {
    assertDependencyPolicy(policy.manifest, field, manifest[field], policy[field]);
  }
}

process.stdout.write(
  `源码边界通过：检查 ${files.length} 个运行时文件、${publicPackagePolicies.length} 个公开包清单与 React 参考应用清单\n`,
);
