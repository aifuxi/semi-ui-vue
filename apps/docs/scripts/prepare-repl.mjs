import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { createRequire } from 'node:module';
import { build } from 'esbuild';

const require = createRequire(import.meta.url);
const app = resolve(import.meta.dirname, '..');
const root = resolve(app, '../..');
const output = resolve(app, 'public/repl');
await mkdir(output, { recursive: true });
await mkdir(resolve(output, 'fonts'), { recursive: true });
for (const file of ['Inter-Regular.ttf', 'Inter-SemiBold.ttf'])
  await cp(resolve(app, 'public/upstream', file), resolve(output, 'fonts', file));
const imports = {};
const entryPoints = {};
const packages = [
  ['ui', '@aifuxi/semi-ui-vue'],
  ['icons', '@aifuxi/semi-icons-vue'],
  ['icons-lab', '@aifuxi/semi-icons-lab-vue'],
  ['illustrations', '@aifuxi/semi-illustrations-vue'],
];
for (const [directory, name] of packages) {
  const packageRoot = resolve(root, 'packages', directory);
  const manifest = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8'));
  for (const [subpath, exported] of Object.entries(manifest.exports)) {
    const entry = typeof exported === 'string' ? exported : exported.import;
    if (!entry?.endsWith('.js')) continue;
    if (entry.includes('*')) {
      for (const file of await readdir(resolve(packageRoot, dirname(entry)))) {
        if (!file.endsWith('.js')) continue;
        const namePart = file.replace(/\.js$/, '');
        const resolvedSubpath = subpath.replace('*', namePart);
        const key = `${directory}/${resolvedSubpath.slice(2)}`;
        entryPoints[key] = resolve(packageRoot, entry.replace('*', namePart));
        imports[`${name}${resolvedSubpath.slice(1)}`] = `/repl/modules/${key}.js`;
      }
      continue;
    }
    const key = `${directory}/${subpath === '.' ? 'index' : subpath.slice(2)}`;
    entryPoints[key] = resolve(packageRoot, entry);
    imports[`${name}${subpath === '.' ? '' : subpath.slice(1)}`] = `/repl/modules/${key}.js`;
  }
}
await build({
  entryPoints,
  outdir: resolve(output, 'modules'),
  bundle: true,
  splitting: true,
  format: 'esm',
  platform: 'browser',
  target: 'es2022',
  external: ['vue'],
  define: { 'process.env.NODE_ENV': '"production"' },
  minify: true,
  chunkNames: 'chunks/[name]-[hash]',
  logLevel: 'warning',
});
const vueRoot = dirname(require.resolve('vue/package.json'));
await cp(resolve(vueRoot, 'dist/vue.runtime.esm-browser.js'), resolve(output, 'vue.js'));
const vueRequire = createRequire(resolve(vueRoot, 'package.json'));
const compilerRoot = dirname(vueRequire.resolve('@vue/compiler-sfc/package.json'));
await cp(
  resolve(compilerRoot, 'dist/compiler-sfc.esm-browser.js'),
  resolve(output, 'compiler-sfc.js'),
);
await cp(require.resolve('typescript'), resolve(output, 'typescript.js'));
await cp(require.resolve('es-module-shims'), resolve(output, 'es-module-shims.js'));
imports.vue = '/repl/vue.js';
const themeRoot = resolve(root, 'packages/theme-default/dist');
await cp(resolve(themeRoot, 'index.css'), resolve(output, 'theme.css'));
for (const file of await readdir(themeRoot)) {
  if (!file.endsWith('.css')) continue;
  const key = `@aifuxi/semi-theme-default/${file}`;
  imports[key] = `/repl/styles/${file}.js`;
  await mkdir(resolve(output, 'styles'), { recursive: true });
  await cp(resolve(themeRoot, file), resolve(output, 'styles', file));
  await writeFile(
    resolve(output, 'styles', `${file}.js`),
    `const link = document.createElement('link'); link.rel = 'stylesheet'; link.href = new URL('./${file}', import.meta.url).href; document.head.append(link);\n`,
  );
}
const replRoot = dirname(require.resolve('@vue/repl'));
await cp(resolve(replRoot, 'assets'), resolve(output, 'workers'), { recursive: true });
await writeFile(resolve(output, 'import-map.json'), JSON.stringify({ imports }, null, 2) + '\n');

// Monaco's language worker fetches declarations through serialized callbacks, also served locally.
for (const [directory, name] of [...packages, ['vue', 'vue']]) {
  const packageRoot = name === 'vue' ? vueRoot : resolve(root, 'packages', directory);
  const manifest = JSON.parse(await readFile(resolve(packageRoot, 'package.json'), 'utf8'));
  const target = resolve(output, 'types', name);
  await mkdir(target, { recursive: true });
  const files = [];
  async function copyTypes(folder) {
    for (const entry of await readdir(folder, { withFileTypes: true })) {
      if (entry.name === 'node_modules' || entry.name.startsWith('.')) continue;
      const path = resolve(folder, entry.name);
      if (entry.isDirectory()) {
        if (entry.name === 'dist' || folder !== packageRoot) await copyTypes(path);
        continue;
      }
      if (!entry.name.endsWith('.d.ts') && entry.name !== 'package.json') continue;
      const relative = path.slice(packageRoot.length + 1);
      await mkdir(dirname(resolve(target, relative)), { recursive: true });
      await cp(path, resolve(target, relative));
      files.push({ name: `/${relative}` });
    }
  }
  await copyTypes(packageRoot);
  await writeFile(resolve(target, 'version.json'), JSON.stringify({ version: manifest.version }));
  await writeFile(resolve(target, 'files.json'), JSON.stringify({ files }));
}
console.log(`Playground 静态依赖已生成：${Object.keys(imports).length} 个公开入口。`);
