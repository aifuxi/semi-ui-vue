import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const publicPackages = ['ui', 'icons', 'icons-lab', 'illustrations'];
const forbiddenPatterns = [
  ['vendor 源码路径', /vendor\/semi-design/],
  ['私有 Foundation 包', /@workspace\/foundation-integration/],
  ['私有测试包', /@workspace\/test-infra/],
  [
    'React 运行时导入',
    /(?:from\s+['"]react(?:\/[^'"]*)?['"]|import\s*(?:\(\s*)?['"]react(?:\/[^'"]*)?['"])/,
  ],
];

async function collectArtifacts(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const artifacts = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);

    if (entry.isDirectory()) {
      artifacts.push(...(await collectArtifacts(entryPath)));
    } else if (/\.(?:css|d\.ts|js|map|mjs)$/.test(entry.name)) {
      artifacts.push(entryPath);
    }
  }

  return artifacts;
}

for (const packageName of publicPackages) {
  const distPath = path.join(workspaceRoot, 'packages', packageName, 'dist');
  const entryPath = path.join(distPath, 'index.js');

  for (const artifactPath of await collectArtifacts(distPath)) {
    const source = await readFile(artifactPath, 'utf8');

    for (const [label, pattern] of forbiddenPatterns) {
      if (pattern.test(source)) {
        const relativePath = path.relative(workspaceRoot, artifactPath);
        throw new Error(`${relativePath} 包含禁止依赖：${label}`);
      }
    }
  }

  await import(pathToFileURL(entryPath).href);
  process.stdout.write(`SSR import 通过：packages/${packageName}/dist/index.js\n`);

  if (packageName === 'ui') {
    await import(pathToFileURL(path.join(distPath, 'button', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/button/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'divider', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/divider/index.js\n');
  }
}
