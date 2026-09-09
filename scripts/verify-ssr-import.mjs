import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';
import { publicJavaScriptEntries } from './public-export-entries.mjs';
import { publicPackages } from './release-packages.mjs';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const forbiddenPatterns = [
  ['vendor 源码路径', /vendor\/semi-design/],
  ['workspace 占位包名', /@workspace\//],
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

for (const { directory: packageName } of publicPackages.filter(
  (entry) => entry.type === 'javascript',
)) {
  const distPath = path.join(workspaceRoot, 'packages', packageName, 'dist');
  const packageRoot = path.dirname(distPath);

  for (const artifactPath of await collectArtifacts(distPath)) {
    const source = await readFile(artifactPath, 'utf8');

    for (const [label, pattern] of forbiddenPatterns) {
      if (pattern.test(source)) {
        const relativePath = path.relative(workspaceRoot, artifactPath);
        throw new Error(`${relativePath} 包含禁止依赖：${label}`);
      }
    }
  }

  const entries = await publicJavaScriptEntries(packageRoot);
  for (const entry of entries) await import(pathToFileURL(path.join(packageRoot, entry)).href);
  process.stdout.write(`SSR import 通过：${packageName} 的 ${entries.length} 个公开入口\n`);
}
