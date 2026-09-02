import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const guardedRoots = [
  'apps/parity-vue/src',
  'apps/docs/src',
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
      '@aifuxi/semi-icons-vue': 'workspace:*',
      '@aifuxi/semi-illustrations-vue': 'workspace:*',
      '@mdx-js/mdx': '3.0.1',
      '@tiptap/core': '3.10.7',
      '@tiptap/extension-document': '3.10.7',
      '@tiptap/extension-hard-break': '3.10.7',
      '@tiptap/extension-image': '3.10.7',
      '@tiptap/extension-paragraph': '3.10.7',
      '@tiptap/extension-text': '3.10.7',
      '@tiptap/extension-text-align': '3.10.7',
      '@tiptap/extension-text-style': '3.10.7',
      '@tiptap/extensions': '3.10.7',
      '@tiptap/pm': '3.10.7',
      '@tiptap/starter-kit': '3.10.7',
      '@tiptap/vue-3': '3.10.7',
      'async-validator': '3.5.2',
      'bezier-easing': '2.1.0',
      classnames: '2.5.1',
      'date-fns': '2.30.0',
      'date-fns-tz': '1.3.8',
      lodash: '4.18.1',
      'lottie-web': '5.13.0',
      'markdown-it': '14.3.1',
      prismjs: '1.30.0',
      'remark-gfm': '4.0.0',
      'scroll-into-view-if-needed': '2.2.31',
    },
    optionalDependencies: {},
    peerDependencies: { vue: '>=3.5.0' },
    devDependencies: {
      '@types/lodash': '4.17.20',
      '@types/markdown-it': '14.2.0',
    },
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
    '@tiptap/core': '3.10.7',
    '@tiptap/extension-document': '3.10.7',
    '@tiptap/extension-hard-break': '3.10.7',
    '@tiptap/extension-image': '3.10.7',
    '@tiptap/extension-paragraph': '3.10.7',
    '@tiptap/extension-text': '3.10.7',
    '@tiptap/extension-text-align': '3.10.7',
    '@tiptap/extension-text-style': '3.10.7',
    '@tiptap/extensions': '3.10.7',
    '@tiptap/pm': '3.10.7',
    '@tiptap/react': '3.10.7',
    '@tiptap/starter-kit': '3.10.7',
    'async-validator': '3.5.2',
    'bezier-easing': '2.1.0',
    classnames: '2.5.1',
    'copy-text-to-clipboard': '3.2.0',
    'date-fns': '2.30.0',
    'date-fns-tz': '1.3.8',
    lodash: '4.18.1',
    'lottie-web': '5.13.0',
    'normalize.css': 'catalog:',
    prismjs: '1.30.0',
    'prop-types': '15.8.1',
    'prosemirror-model': '1.25.4',
    'prosemirror-state': '1.4.3',
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
const publicSourcePathPolicies = {
  '@aifuxi/semi-icons-vue': ['packages/icons/src/index.ts'],
  '@aifuxi/semi-illustrations-vue': ['packages/illustrations/src/index.ts'],
};

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
  `源码边界通过：检查 ${files.length} 个运行时文件、${publicPackagePolicies.length} 个公开包清单、${Object.keys(publicSourcePathPolicies).length} 个公开源码映射与 React 参考应用清单\n`,
);
