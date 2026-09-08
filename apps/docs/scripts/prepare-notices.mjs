import { createHash } from 'node:crypto';
import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';

const require = createRequire(import.meta.url);
const app = resolve(import.meta.dirname, '..');
const output = resolve(app, '.output/public');
const notices = resolve(output, 'licenses');
await mkdir(notices, { recursive: true });
await cp(resolve(app, 'licenses'), notices, { recursive: true });
await cp(resolve(app, '../../vendor/semi-design/LICENSE'), resolve(notices, 'Semi-Design-MIT.txt'));
const manifest = JSON.parse(await readFile(resolve(app, 'package.json'), 'utf8'));
const packages = [];
for (const name of [
  ...Object.keys(manifest.dependencies),
  'typescript',
  'es-module-shims',
  '@douyinfe/semi-site-doc-style',
  'typeface-inconsolata',
  'prismjs',
]) {
  let packageFile;
  try {
    packageFile = require.resolve(`${name}/package.json`);
  } catch {
    let directory = dirname(require.resolve(name));
    while (directory !== dirname(directory)) {
      try {
        const candidate = resolve(directory, 'package.json');
        const data = JSON.parse(await readFile(candidate, 'utf8'));
        if (data.name === name) {
          packageFile = candidate;
          break;
        }
      } catch {
        /* Continue toward the package root. */
      }
      directory = dirname(directory);
    }
  }
  if (!packageFile) throw new Error(`Package attribution missing: ${name}`);
  const data = JSON.parse(await readFile(packageFile, 'utf8'));
  const directory = dirname(packageFile);
  const target = resolve(notices, name.replace(/^@/, '').replaceAll('/', '--'));
  await mkdir(target, { recursive: true });
  const files = await readdir(directory);
  for (const file of files)
    if (/^(license|notice|copying)(\.|$)/i.test(file))
      await cp(resolve(directory, file), resolve(target, file));
  if (name.startsWith('@aifuxi/')) {
    for (const file of await readdir(resolve(directory, 'dist')))
      if (/THIRD_PARTY|SBOM/.test(file))
        await cp(resolve(directory, 'dist', file), resolve(target, file), { recursive: true });
  }
  await writeFile(
    resolve(target, 'package.json'),
    JSON.stringify(
      { name, version: data.version, license: data.license, repository: data.repository },
      null,
      2,
    ) + '\n',
  );
  packages.push({
    name,
    version: data.version,
    license: data.license,
    notices: `/licenses/${name.replace(/^@/, '').replaceAll('/', '--')}/`,
  });
}
await writeFile(
  resolve(notices, 'sources.json'),
  JSON.stringify(
    {
      baseline: 'Semi Design v2.102.0 / cdfba6e520fc83ad871b30f51f36d8af3aaa5a21',
      packages,
      fonts: [
        { name: 'Inter', license: 'OFL-1.1', source: 'vendor/semi-design/src/styles' },
        {
          name: 'Inconsolata',
          license: 'OFL-1.1',
          source: 'typeface-inconsolata@1.1.13',
          licenseSource: 'https://github.com/google/fonts/blob/main/ofl/inconsolata/OFL.txt',
        },
      ],
      siteHeader: {
        source: '@douyinfe/semi-site-header@0.0.29/dist/index.css',
        license: 'MIT',
        author: 'yanqi.xu',
        adaptations:
          'Vue 页头布局、语言按钮样式；Logo 与图标来自现有图标包，搜索使用固定 Input 外观。',
        referenceOnly: '@douyinfe/semi-site-header@0.0.29/dist/index.es.js',
      },
      replAdaptations: [
        '本地 Worker URL',
        '移除 iframe 同源、弹窗和顶层跳转权限',
        '消息通道同步主题和隔离重载',
      ],
      limitations: [
        '公开包的 SBOM 随包复制；Nuxt 与 REPL 内部打包的第三方传递依赖仍需完成独立审计。',
      ],
    },
    null,
    2,
  ) + '\n',
);
const artifacts = [];
async function walk(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const file = resolve(directory, entry.name);
    if (entry.isDirectory()) {
      await walk(file);
      continue;
    }
    if (file === resolve(notices, 'artifacts.json')) continue;
    const bytes = await readFile(file);
    artifacts.push({
      path: file.slice(output.length),
      bytes: bytes.length,
      sha256: createHash('sha256').update(bytes).digest('hex'),
    });
  }
}
await walk(output);
await writeFile(resolve(notices, 'artifacts.json'), JSON.stringify(artifacts, null, 2) + '\n');
console.log(`静态产物归属与散列已记录：${packages.length} 个直接包、${artifacts.length} 个文件。`);
