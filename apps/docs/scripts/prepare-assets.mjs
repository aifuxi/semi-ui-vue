import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import sass from 'sass-legacy';
import { appRoot, contentRoot, readBaseline, vendorRoot } from './upstream-config.mjs';

const require = createRequire(import.meta.url);
const publicRoot = resolve(contentRoot, 'public');
const assetRoot = resolve(contentRoot, 'public/upstream');

/** 上游站点样式表：与本项目自有样式分层，编译结果只作为产物存在，不进入 Git。 */
const styleSources = [
  'src/styles/layout.scss',
  'src/styles/index.scss',
  'src/styles/doc.scss',
  'src/styles/docDemo.scss',
  'src/components/PageAnchor/index.scss',
];

await rm(publicRoot, { recursive: true, force: true });
await mkdir(assetRoot, { recursive: true });

const sources = [];
let css = '';
for (const source of styleSources) {
  const file = resolve(vendorRoot, source);
  css += sass.renderSync({ file, outputStyle: 'expanded' }).css.toString();
  sources.push({
    source: `vendor/semi-design/${source}`,
    sha256: createHash('sha256')
      .update(await readFile(file))
      .digest('hex'),
  });
}

// 固定站点引用远程字体；编译产物改为本地文件，保证离线可用。
css = css
  .replaceAll(
    'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/slepweh7nupqpognuhbo/Inter-Regular.ttf',
    '/upstream/Inter-Regular.ttf',
  )
  .replaceAll(
    'https://sf6-cdn-tos.douyinstatic.com/obj/eden-cn/slepweh7nupqpognuhbo/Inter-Bold.ttf',
    '/upstream/Inter-SemiBold.ttf',
  );

const proseStylePath = require.resolve('@douyinfe/semi-site-doc-style');
const proseStyle = await readFile(proseStylePath, 'utf8');
await writeFile(resolve(assetRoot, 'site.css'), `${proseStyle}\n${css}`);

for (const name of ['Inter-Regular.ttf', 'Inter-SemiBold.ttf']) {
  await cp(resolve(vendorRoot, 'src/styles', name), resolve(assetRoot, name));
}
const inconsolataRoot = dirname(require.resolve('typeface-inconsolata/package.json'));
await cp(
  resolve(inconsolataRoot, 'files/inconsolata-latin-400.woff2'),
  resolve(assetRoot, 'Inconsolata-Regular.woff2'),
);

// 侧栏图标来自基线站点，逐一复制到生成目录；图标名与 frontmatter 的 icon 字段对应。
const iconRoot = resolve(vendorRoot, 'src/images/docIcons');
await mkdir(resolve(publicRoot, 'doc-icons'), { recursive: true });
for (const file of await readdir(iconRoot)) {
  if (file.endsWith('.svg')) {
    await cp(resolve(iconRoot, file), resolve(publicRoot, 'doc-icons', file));
  }
}
await cp(
  resolve(vendorRoot, 'packages/semi-icons-lab/src/svgs/heart.svg'),
  resolve(publicRoot, 'doc-icons/doc-heart.svg'),
);
await cp(resolve(vendorRoot, 'LICENSE'), resolve(assetRoot, 'SEMI-LICENSE'));
await cp(resolve(appRoot, 'assets/favicon.svg'), resolve(publicRoot, 'favicon.svg'));
await cp(resolve(appRoot, 'assets/favicon.svg'), resolve(publicRoot, 'favicon.ico'));
await mkdir(resolve(publicRoot, 'demos'), { recursive: true });
for (const file of ['lottie.json', 'one.svg', 'photo.svg', 'poster.svg', 'two.svg']) {
  await cp(resolve(appRoot, `assets/${file}`), resolve(publicRoot, `demos/${file}`));
}

await writeFile(
  resolve(assetRoot, 'sources.json'),
  `${JSON.stringify(
    {
      baseline: readBaseline(),
      packages: {
        '@douyinfe/semi-site-doc-style': '0.0.5',
        'typeface-inconsolata': '1.1.13',
        'sass-legacy': '1.54.9',
      },
      sources,
    },
    null,
    2,
  )}\n`,
);

console.log(`文档样式、字体与侧栏图标已从只读基线编译到 ${assetRoot}。`);
