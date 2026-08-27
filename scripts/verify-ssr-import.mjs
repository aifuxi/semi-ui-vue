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
    await import(pathToFileURL(path.join(distPath, 'auto-complete', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/auto-complete/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'button', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/button/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'checkbox', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/checkbox/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'config-provider', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/config-provider/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'divider', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/divider/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'float-button', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/float-button/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'grid', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/grid/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'icon', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/icon/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'input', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/input/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'input-number', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/input-number/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'pin-code', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/pin-code/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'layout', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/layout/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'resizable', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/resizable/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'select', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/select/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'space', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/space/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'switch', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/switch/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'tooltip', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/tooltip/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'typography', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/typography/index.js\n');
  }

  if (packageName === 'icons') {
    await import(pathToFileURL(path.join(distPath, 'components', 'Icon.js')).href);
    await import(pathToFileURL(path.join(distPath, 'icons', 'IconHome.js')).href);
    process.stdout.write('SSR import 通过：packages/icons 的 Icon 基座与代表图标\n');
  }

  if (packageName === 'icons-lab') {
    await import(pathToFileURL(path.join(distPath, 'components', 'Icon.js')).href);
    await import(pathToFileURL(path.join(distPath, 'icons', 'IconAvatar.js')).href);
    process.stdout.write('SSR import 通过：packages/icons-lab 的 Icon 基座与代表图标\n');
  }
}
