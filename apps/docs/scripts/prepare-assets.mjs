import { cp, mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import sass from 'sass-legacy';

const require = createRequire(import.meta.url);
const root = resolve(import.meta.dirname, '../../..');
const app = resolve(import.meta.dirname, '..');
const vendor = resolve(root, 'vendor/semi-design');
const output = resolve(app, 'public/upstream');
await mkdir(output, { recursive: true });
const sources = [
  'src/styles/layout.scss',
  'src/styles/index.scss',
  'src/styles/doc.scss',
  'src/styles/docDemo.scss',
  'src/components/PageAnchor/index.scss',
];
const evidence = [];
let css = '';
for (const source of sources) {
  const file = resolve(vendor, source);
  css += sass.renderSync({ file, outputStyle: 'expanded' }).css.toString();
  evidence.push({
    source: `vendor/semi-design/${source}`,
    sha256: createHash('sha256')
      .update(await readFile(file))
      .digest('hex'),
  });
}
// The fixed website references these remote URLs; resolve its fonts locally in the compiled artifact.
css = css
  .replace(
    /https:\/\/sf6-cdn-tos\.douyinstatic\.com\/obj\/eden-cn\/slepweh7nupqpognuhbo\/Inter-Regular.ttf/g,
    '/upstream/Inter-Regular.ttf',
  )
  .replace(
    /https:\/\/sf6-cdn-tos\.douyinstatic\.com\/obj\/eden-cn\/slepweh7nupqpognuhbo\/Inter-Bold.ttf/g,
    '/upstream/Inter-SemiBold.ttf',
  );
const prosePath = require.resolve('@douyinfe/semi-site-doc-style');
css = `${await readFile(prosePath, 'utf8')}\n${css}`;
await writeFile(resolve(output, 'site.css'), css);
for (const name of ['Inter-Regular.ttf', 'Inter-SemiBold.ttf'])
  await cp(resolve(vendor, 'src/styles', name), resolve(output, name));
const inconsolata = dirname(require.resolve('typeface-inconsolata/package.json'));
await cp(
  resolve(inconsolata, 'files/inconsolata-latin-400.woff2'),
  resolve(output, 'Inconsolata-Regular.woff2'),
);
await mkdir(resolve(output, 'doc-icons'), { recursive: true });
for (const file of await readdir(resolve(vendor, 'src/images/docIcons'))) {
  if (file.endsWith('.svg'))
    await cp(resolve(vendor, 'src/images/docIcons', file), resolve(output, 'doc-icons', file));
}
await cp(resolve(vendor, 'LICENSE'), resolve(output, 'SEMI-LICENSE'));
await writeFile(
  resolve(output, 'sources.json'),
  `${JSON.stringify({ version: 'v2.102.0', commit: 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21', sources: evidence, packages: { '@douyinfe/semi-site-doc-style': '0.0.5', 'typeface-inconsolata': '1.1.13' } }, null, 2)}\n`,
);
console.log('文档样式与字体已从只读固定基线编译到 public/upstream。');
