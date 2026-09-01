import { readdir, readFile } from 'node:fs/promises';
import { fileURLToPath, pathToFileURL } from 'node:url';
import path from 'node:path';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const publicPackages = ['ui', 'icons', 'icons-lab', 'illustrations'];
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
    await import(pathToFileURL(path.join(distPath, 'anchor', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/anchor/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'avatar', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/avatar/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'badge', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/badge/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'banner', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/banner/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'feedback', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/feedback/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'notification', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/notification/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'calendar', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/calendar/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'card', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/card/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'carousel', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/carousel/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'collapse', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/collapse/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'code-highlight', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/code-highlight/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'collapsible', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/collapsible/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'cropper', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/cropper/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'descriptions', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/descriptions/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'dropdown', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/dropdown/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'drag-move', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/drag-move/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'hot-keys', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/hot-keys/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'lottie', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/lottie/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'audio-player', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/audio-player/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'video-player', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/video-player/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'user-guide', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/user-guide/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'json-viewer', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/json-viewer/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'ai-chat-input', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/ai-chat-input/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'ai-chat-dialogue', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/ai-chat-dialogue/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'ai-chat-dialogue', 'data-adapter.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/ai-chat-dialogue/data-adapter.js\n');
    await import(pathToFileURL(path.join(distPath, 'sidebar', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/sidebar/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'chat', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/chat/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'markdown-render', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/markdown-render/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'locale', 'index.js')).href);
    const localeSourceRoot = path.join(distPath, 'locale', 'source');
    const localeSourceFiles = (await readdir(localeSourceRoot))
      .filter((fileName) => fileName.endsWith('.js'))
      .sort();
    if (localeSourceFiles.length !== 57) {
      throw new Error(`Locale SSR 入口数量错误：${localeSourceFiles.length}`);
    }
    await Promise.all(
      localeSourceFiles.map(
        (fileName) => import(pathToFileURL(path.join(localeSourceRoot, fileName)).href),
      ),
    );
    process.stdout.write('SSR import 通过：packages/ui/dist/locale 与 57 个语言源\n');
    await import(pathToFileURL(path.join(distPath, 'empty', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/empty/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'highlight', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/highlight/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'image', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/image/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'list', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/list/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'modal', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/modal/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'overflow-list', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/overflow-list/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'popover', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/popover/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'popconfirm', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/popconfirm/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'progress', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/progress/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'skeleton', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/skeleton/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'spin', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/spin/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'transfer', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/transfer/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'upload', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/upload/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'navigation', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/navigation/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'tree-select', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/tree-select/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'cascader', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/cascader/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'color-picker', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/color-picker/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'date-picker', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/date-picker/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'form', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/form/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'toast', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/toast/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'scroll-list', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/scroll-list/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'side-sheet', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/side-sheet/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'table', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/table/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'tag', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/tag/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'timeline', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/timeline/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'back-top', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/back-top/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'breadcrumb', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/breadcrumb/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'auto-complete', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/auto-complete/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'button', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/button/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'icon-button', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/icon-button/index.js\n');
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
    await import(pathToFileURL(path.join(distPath, 'pagination', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/pagination/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'radio', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/radio/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'rating', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/rating/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'layout', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/layout/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'resizable', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/resizable/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'select', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/select/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'slider', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/slider/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'space', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/space/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'steps', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/steps/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'tabs', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/tabs/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'tree', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/tree/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'switch', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/switch/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'tag-input', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/tag-input/index.js\n');
    await import(pathToFileURL(path.join(distPath, 'time-picker', 'index.js')).href);
    process.stdout.write('SSR import 通过：packages/ui/dist/time-picker/index.js\n');
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

  if (packageName === 'illustrations') {
    await import(pathToFileURL(path.join(distPath, 'components', 'Illustration.js')).href);
    await import(
      pathToFileURL(path.join(distPath, 'illustrations', 'IllustrationNoContent.js')).href
    );
    process.stdout.write('SSR import 通过：packages/illustrations 的工厂与代表插画\n');
  }
}
