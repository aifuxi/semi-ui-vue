import { execFileSync } from 'node:child_process';
import {
  access,
  mkdir,
  mkdtemp,
  readFile,
  readdir,
  realpath,
  rm,
  writeFile,
} from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicPackages as packages } from './release-packages.mjs';
import { verifyThemeCss } from './theme-contracts.mjs';
import { verifyJsonViewerPackedWorker } from './verify-json-viewer-pack.mjs';
import ts from 'typescript';
import { verifyUiTreeshaking } from './verify-ui-treeshaking.mjs';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const pnpmExecPath = process.env.npm_execpath;
const isolated = process.env.PACK_ISOLATED === '1';

const sourceVersions = new Set(
  await Promise.all(
    packages.map(async ({ directory }) => {
      const manifest = JSON.parse(
        await readFile(path.join(workspaceRoot, 'packages', directory, 'package.json'), 'utf8'),
      );
      return manifest.version;
    }),
  ),
);
if (sourceVersions.size !== 1) {
  throw new Error('五个公开包的源码版本不一致');
}
const [expectedVersion] = sourceVersions;
const localeSourceNames = (
  await readdir(path.join(workspaceRoot, 'packages', 'ui', 'src', 'locale', 'source'))
)
  .filter((fileName) => fileName.endsWith('.ts'))
  .map((fileName) => fileName.slice(0, -3))
  .sort();
if (localeSourceNames.length !== 57) {
  throw new Error(`公开 Locale 源码数量错误：${localeSourceNames.length}`);
}

function run(command, args, cwd) {
  return execFileSync(command, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

function runPnpm(args, cwd) {
  if (!pnpmExecPath) {
    throw new Error('verify-pack 必须通过 pnpm script 运行，以固定包管理器版本');
  }
  return run(pnpmExecPath, args, cwd);
}

async function assertExportTargets(packageRoot, value) {
  if (typeof value === 'string') {
    if (value.startsWith('./')) {
      const target = value.slice(2);
      if (target.includes('*')) {
        const wildcardIndex = target.indexOf('*');
        const directory = path.join(packageRoot, path.dirname(target.slice(0, wildcardIndex)));
        const suffix = target.slice(wildcardIndex + 1);
        const candidates = await readdir(directory);
        if (!candidates.some((candidate) => candidate.endsWith(suffix))) {
          throw new Error(`通配导出没有匹配产物：${value}`);
        }
      } else {
        await access(path.join(packageRoot, target));
      }
    }
    return;
  }

  if (!value || typeof value !== 'object') return;
  await Promise.all(Object.values(value).map((entry) => assertExportTargets(packageRoot, entry)));
}

const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'semi-ui-vue-pack-'));

try {
  const artifactsRoot = path.join(temporaryRoot, 'artifacts');
  const consumerRoot = path.join(temporaryRoot, 'consumer');
  const consumerStoreRoot = path.join(temporaryRoot, 'pnpm-store');
  await Promise.all([mkdir(artifactsRoot), mkdir(consumerRoot)]);

  const tarballs = new Map();
  const upstreamLicense = await readFile(
    path.join(workspaceRoot, 'vendor', 'semi-design', 'LICENSE'),
    'utf8',
  );

  for (const packageInfo of packages) {
    const packageRoot = path.join(workspaceRoot, 'packages', packageInfo.directory);
    const packOutput = runPnpm(
      ['pack', '--json', `--pack-destination=${artifactsRoot}`],
      packageRoot,
    );
    const parsedPackOutput = JSON.parse(packOutput);
    const packResult = Array.isArray(parsedPackOutput) ? parsedPackOutput[0] : parsedPackOutput;

    if (!packResult?.filename || !Array.isArray(packResult.files)) {
      throw new Error(`${packageInfo.name} 的 pnpm pack 输出无效`);
    }

    const leakedSource = packResult.files.find(({ path: filePath }) =>
      /^(?:src|vendor)\//.test(filePath),
    );
    if (leakedSource) {
      throw new Error(`${packageInfo.name} 的 tarball 泄漏源码：${leakedSource.path}`);
    }

    const packedFiles = new Set(packResult.files.map(({ path: filePath }) => filePath));
    for (const publicMetadataPath of ['package.json', 'README.md', 'LICENSE']) {
      if (!packedFiles.has(publicMetadataPath)) {
        throw new Error(`${packageInfo.name} 的 tarball 缺少 ${publicMetadataPath}`);
      }
    }
    for (const compliancePath of [
      'dist/SBOM.spdx.json',
      'dist/THIRD_PARTY_LICENSES/Semi-Design.txt',
      'dist/THIRD_PARTY_NOTICES.md',
    ]) {
      if (!packedFiles.has(compliancePath)) {
        throw new Error(`${packageInfo.name} 的 tarball 缺少合规文件：${compliancePath}`);
      }
    }

    if (
      packageInfo.name === '@aifuxi/semi-ui-vue' &&
      [
        'async-validator.txt',
        'mdx-js--mdx.txt',
        'bezier-easing.txt',
        'classnames.txt',
        'date-fns.txt',
        'date-fns-tz.txt',
        'lodash.txt',
        'lottie-web.txt',
        'markdown-it.txt',
        'jsonc-parser.txt',
        'prismjs.txt',
        'remark-gfm.txt',
        'scroll-into-view-if-needed.txt',
        'tiptap--core.txt',
        'tiptap--extension-document.txt',
        'tiptap--extension-hard-break.txt',
        'tiptap--extension-image.txt',
        'tiptap--extension-paragraph.txt',
        'tiptap--extension-text.txt',
        'tiptap--extension-text-align.txt',
        'tiptap--extension-text-style.txt',
        'tiptap--extensions.txt',
        'tiptap--pm.txt',
        'tiptap--starter-kit.txt',
        'tiptap--vue-3.txt',
      ].some((license) => !packedFiles.has(`dist/THIRD_PARTY_LICENSES/${license}`))
    ) {
      throw new Error('@aifuxi/semi-ui-vue 的 tarball 缺少运行时依赖许可证');
    }
    if (packageInfo.name === '@aifuxi/semi-ui-vue') {
      for (const infrastructureEntry of [
        'dist/_base/index.js',
        'dist/_base/base.js',
        'dist/_base/base-foundation.js',
        'dist/_base/base-component.js',
        'dist/_base/component-utils.js',
        'dist/_utils/index.js',
        'dist/_utils/use-prev-focus.js',
        'dist/_utils/vue-render.js',
        'dist/_utils/semi-global.js',
      ]) {
        if (!packedFiles.has(infrastructureEntry)) {
          throw new Error(
            `@aifuxi/semi-ui-vue 的 tarball 缺少基础设施产物：${infrastructureEntry}`,
          );
        }
      }
      if (!packedFiles.has('dist/json-viewer/index.js')) {
        throw new Error('@aifuxi/semi-ui-vue 的 tarball 缺少 JsonViewer 子路径产物');
      }
      if (!packedFiles.has('dist/ai-chat-input/index.js')) {
        throw new Error('@aifuxi/semi-ui-vue 的 tarball 缺少 AIChatInput 子路径产物');
      }
      if (!packedFiles.has('dist/ai-chat-dialogue/index.js')) {
        throw new Error('@aifuxi/semi-ui-vue 的 tarball 缺少 AIChatDialogue 子路径产物');
      }
      if (!packedFiles.has('dist/ai-chat-dialogue/data-adapter.js')) {
        throw new Error(
          '@aifuxi/semi-ui-vue 的 tarball 缺少 AIChatDialogue data-adapter 子路径产物',
        );
      }
      if (!packedFiles.has('dist/sidebar/index.js')) {
        throw new Error('@aifuxi/semi-ui-vue 的 tarball 缺少 Sidebar 子路径产物');
      }
      if (!packedFiles.has('dist/chat/index.js')) {
        throw new Error('@aifuxi/semi-ui-vue 的 tarball 缺少 Chat 子路径产物');
      }
      if (!packedFiles.has('dist/markdown-render/index.js')) {
        throw new Error('@aifuxi/semi-ui-vue 的 tarball 缺少 MarkdownRender 子路径产物');
      }
      const externalWorker = [...packedFiles].find((filePath) =>
        /dist\/.*json[-.]?viewer.*worker.*\.js$/i.test(filePath),
      );
      if (externalWorker) {
        throw new Error(`JsonViewer Worker 未内联到组件产物：${externalWorker}`);
      }
    }

    tarballs.set(packageInfo.name, path.resolve(artifactsRoot, packResult.filename));
  }

  const linkedRuntimeDependencies = isolated
    ? {}
    : Object.fromEntries(
        await Promise.all(
          [
            'async-validator',
            '@mdx-js/mdx',
            'bezier-easing',
            'classnames',
            'date-fns',
            'date-fns-tz',
            'lodash',
            'lottie-web',
            'markdown-it',
            'prismjs',
            'remark-gfm',
            'scroll-into-view-if-needed',
            '@tiptap/core',
            '@tiptap/extension-document',
            '@tiptap/extension-hard-break',
            '@tiptap/extension-image',
            '@tiptap/extension-paragraph',
            '@tiptap/extension-text',
            '@tiptap/extension-text-align',
            '@tiptap/extension-text-style',
            '@tiptap/extensions',
            '@tiptap/pm',
            '@tiptap/starter-kit',
            '@tiptap/vue-3',
          ].map(async (dependency) => [
            dependency,
            `link:${await realpath(
              path.join(
                workspaceRoot,
                dependency.startsWith('@tiptap/') ||
                  dependency === 'markdown-it' ||
                  dependency === '@mdx-js/mdx' ||
                  dependency === 'remark-gfm'
                  ? 'packages/ui/node_modules'
                  : 'node_modules',
                dependency,
              ),
            )}`,
          ]),
        ),
      );
  const dependencies = {
    ...Object.fromEntries(
      [...tarballs].map(([packageName, tarballPath]) => [packageName, `file:${tarballPath}`]),
    ),
    vue: isolated
      ? JSON.parse(await readFile(path.join(workspaceRoot, 'package.json'), 'utf8')).devDependencies
          .vue
      : `link:${await realpath(path.join(workspaceRoot, 'node_modules', 'vue'))}`,
    ...linkedRuntimeDependencies,
  };
  await writeFile(
    path.join(consumerRoot, 'package.json'),
    `${JSON.stringify(
      {
        name: 'pack-consumer',
        private: true,
        type: 'module',
        dependencies,
      },
      null,
      2,
    )}\n`,
  );
  await writeFile(
    path.join(consumerRoot, 'pnpm-workspace.yaml'),
    `packages:\n  - .\noverrides:\n${[
      ...[...tarballs].map(
        ([packageName, tarballPath]) =>
          `  ${JSON.stringify(packageName)}: ${JSON.stringify(`file:${tarballPath}`)}`,
      ),
      ...Object.entries(linkedRuntimeDependencies).map(
        ([dependency, link]) => `  ${JSON.stringify(dependency)}: ${JSON.stringify(link)}`,
      ),
    ].join('\n')}\n`,
  );

  runPnpm(
    [
      'install',
      '--ignore-scripts',
      // pnpm 12 deliberately does not infer peer versions from link: dependencies.
      // The installed Vue manifest and every public package peer range are checked below.
      ...(isolated
        ? [
            '--registry=https://registry.npmjs.org/',
            '--strict-peer-dependencies',
            '--config.auto-install-peers=false',
          ]
        : ['--offline', '--strict-peer-dependencies=false', '--config.auto-install-peers=false']),
      `--store-dir=${consumerStoreRoot}`,
    ],
    consumerRoot,
  );

  const installedVueManifest = JSON.parse(
    await readFile(path.join(consumerRoot, 'node_modules', 'vue', 'package.json'), 'utf8'),
  );
  const vueVersionMatch = /^(\d+)\.(\d+)\.(\d+)/.exec(installedVueManifest.version);
  if (
    !vueVersionMatch ||
    Number(vueVersionMatch[1]) < 3 ||
    (Number(vueVersionMatch[1]) === 3 && Number(vueVersionMatch[2]) < 5)
  ) {
    throw new Error(`真实消费者安装的 Vue 版本不满足 >=3.5.0：${installedVueManifest.version}`);
  }

  for (const packageInfo of packages) {
    const installedRoot = path.join(consumerRoot, 'node_modules', ...packageInfo.name.split('/'));
    const manifest = JSON.parse(await readFile(path.join(installedRoot, 'package.json'), 'utf8'));
    await assertExportTargets(installedRoot, manifest.exports);

    if (
      manifest.name !== packageInfo.name ||
      manifest.version !== expectedVersion ||
      Object.hasOwn(manifest, 'private') ||
      manifest.license !== 'MIT' ||
      JSON.stringify(manifest).includes('@workspace/') ||
      JSON.stringify(manifest).includes('workspace:')
    ) {
      throw new Error(`${packageInfo.name} 的已安装 manifest 仍不是最终公开发布契约`);
    }
    if (packageInfo.name === '@aifuxi/semi-ui-vue') {
      for (const dependency of ['@aifuxi/semi-icons-vue', '@aifuxi/semi-illustrations-vue']) {
        if (manifest.dependencies?.[dependency] !== manifest.version) {
          throw new Error(`@aifuxi/semi-ui-vue 未精确依赖同版本公开包：${dependency}`);
        }
      }
    }

    if (packageInfo.type === 'javascript' && manifest.peerDependencies?.vue !== '>=3.5.0') {
      throw new Error(`${packageInfo.name} 未声明预期的 Vue peer dependency`);
    }

    const peerNames = Object.keys(manifest.peerDependencies ?? {}).sort();
    const expectedPeers = packageInfo.type === 'javascript' ? ['vue'] : [];
    if (JSON.stringify(peerNames) !== JSON.stringify(expectedPeers)) {
      throw new Error(`${packageInfo.name} 存在未纳入消费者验证的 peer dependency`);
    }

    const installedLicense = await readFile(
      path.join(installedRoot, 'dist', 'THIRD_PARTY_LICENSES', 'Semi-Design.txt'),
      'utf8',
    );
    const projectLicense = await readFile(path.join(workspaceRoot, 'LICENSE'), 'utf8');
    const installedProjectLicense = await readFile(path.join(installedRoot, 'LICENSE'), 'utf8');
    if (installedProjectLicense !== projectLicense) {
      throw new Error(`${packageInfo.name} 未携带项目 MIT License`);
    }
    if (installedLicense !== upstreamLicense) {
      throw new Error(`${packageInfo.name} 未原样携带上游许可证`);
    }
    if (packageInfo.name === '@aifuxi/semi-ui-vue') {
      const uiDistRoot = path.join(installedRoot, 'dist');
      const uiRootJavaScriptNames = (await readdir(uiDistRoot, { recursive: true })).filter(
        (fileName) => fileName.endsWith('.js'),
      );
      const uiRootJavaScript = (
        await Promise.all(
          uiRootJavaScriptNames.map((fileName) =>
            readFile(path.join(uiDistRoot, fileName), 'utf8'),
          ),
        )
      ).join('\n');
      if (
        !uiRootJavaScript.includes('@aifuxi/semi-illustrations-vue') ||
        uiRootJavaScript.includes('packages/illustrations') ||
        uiRootJavaScript.includes('../illustrations/dist')
      ) {
        throw new Error('@aifuxi/semi-ui-vue 未保留独立插画包边界');
      }
      const visited = new Set();
      async function readStaticGraph(file) {
        if (visited.has(file)) return '';
        visited.add(file);
        const code = await readFile(file, 'utf8');
        const dependencies = ts
          .preProcessFile(code, true, true)
          .importedFiles.map(({ fileName }) => fileName)
          .filter((imported) => imported.startsWith('.'));
        const parts = await Promise.all(
          dependencies.map((imported) =>
            readStaticGraph(path.resolve(path.dirname(file), imported)),
          ),
        );
        return [code, ...parts].join('\n');
      }
      const jsonViewerDist = await readStaticGraph(path.join(uiDistRoot, 'json-viewer/index.js'));
      if (
        jsonViewerDist.includes('%WORKER_RAW%') ||
        jsonViewerDist.includes('vendor/semi-design') ||
        !jsonViewerDist.includes('createObjectURL')
      ) {
        throw new Error('@aifuxi/semi-ui-vue 的 JsonViewer 未包含 SSR-safe 内联 Worker');
      }
      for (const [dependency, licenseFile] of [
        ['async-validator', 'LICENSE.md'],
        ['@mdx-js/mdx', 'license'],
        ['bezier-easing', 'LICENSE'],
        ['classnames', 'LICENSE'],
        ['date-fns', 'LICENSE.md'],
        ['date-fns-tz', 'LICENSE.md'],
        ['lodash', 'LICENSE'],
        ['lottie-web', 'LICENSE.md'],
        ['jsonc-parser', 'LICENSE.md'],
        ['prismjs', 'LICENSE'],
        ['remark-gfm', 'license'],
        ['scroll-into-view-if-needed', 'LICENSE'],
      ]) {
        const installedLicense = await readFile(
          path.join(
            installedRoot,
            'dist',
            'THIRD_PARTY_LICENSES',
            `${dependency.replace(/^@/, '').replaceAll('/', '--')}.txt`,
          ),
          'utf8',
        );
        const sourceLicense = await readFile(
          path.join(
            workspaceRoot,
            ...(dependency === 'jsonc-parser'
              ? ['packages', 'foundation-integration', 'node_modules']
              : dependency === '@mdx-js/mdx' || dependency === 'remark-gfm'
                ? ['packages', 'ui', 'node_modules']
                : ['node_modules']),
            dependency,
            licenseFile,
          ),
          'utf8',
        );
        if (installedLicense !== sourceLicense) {
          throw new Error(`@aifuxi/semi-ui-vue 未原样携带 ${dependency} 许可证`);
        }
      }
    }

    const sbom = JSON.parse(
      await readFile(path.join(installedRoot, 'dist', 'SBOM.spdx.json'), 'utf8'),
    );
    const expectedSbomPackageNames = [
      manifest.name,
      '@douyinfe/semi-design',
      ...Object.keys({
        ...(manifest.dependencies ?? {}),
        ...(manifest.optionalDependencies ?? {}),
        ...(manifest.peerDependencies ?? {}),
      }),
      ...(packageInfo.name === '@aifuxi/semi-ui-vue' ? ['jsonc-parser'] : []),
    ].sort();
    const actualSbomPackageNames = (sbom.packages ?? []).map(({ name }) => name).sort();
    const expectedSbomVersions = {
      [manifest.name]: manifest.version,
      ...manifest.dependencies,
      ...manifest.optionalDependencies,
      ...manifest.peerDependencies,
      ...(packageInfo.name === '@aifuxi/semi-ui-vue' ? { 'jsonc-parser': '3.3.1' } : {}),
    };
    const hasExpectedSbomVersions = Object.entries(expectedSbomVersions).every(([name, version]) =>
      (sbom.packages ?? []).some(
        ({ name: packageName, versionInfo }) => packageName === name && versionInfo === version,
      ),
    );
    const documentedPackage = (sbom.packages ?? []).find(
      ({ SPDXID }) => SPDXID === 'SPDXRef-Package-Workspace',
    );
    const sbomCreationTime = sbom.creationInfo?.created;
    const hasValidCreationTime =
      typeof sbomCreationTime === 'string' &&
      !Number.isNaN(Date.parse(sbomCreationTime)) &&
      new Date(sbomCreationTime).toISOString() === sbomCreationTime;
    if (
      sbom.spdxVersion !== 'SPDX-2.3' ||
      sbom.dataLicense !== 'CC0-1.0' ||
      !sbom.documentNamespace?.startsWith('https://github.com/aifuxi/semi-ui-vue/spdx/') ||
      !hasValidCreationTime ||
      !sbom.documentDescribes?.includes('SPDXRef-Package-Workspace') ||
      documentedPackage?.name !== manifest.name ||
      documentedPackage?.versionInfo !== manifest.version ||
      documentedPackage?.licenseDeclared !== 'MIT' ||
      documentedPackage?.licenseConcluded !== 'MIT' ||
      !hasExpectedSbomVersions ||
      JSON.stringify(actualSbomPackageNames) !== JSON.stringify(expectedSbomPackageNames) ||
      !sbom.relationships?.some(
        ({ relationshipType, relatedSpdxElement }) =>
          relationshipType === 'DERIVED_FROM' &&
          relatedSpdxElement === 'SPDXRef-Package-Semi-Design',
      )
    ) {
      throw new Error(`${packageInfo.name} 的 SPDX SBOM 不完整`);
    }
  }

  const javascriptPackages = packages
    .filter(({ type }) => type === 'javascript')
    .map(({ name }) => name);
  await writeFile(
    path.join(consumerRoot, 'smoke.mjs'),
    `await Promise.all(${JSON.stringify(javascriptPackages)}.map(packageName => import(packageName)));
		const [uiRoot, baseRoot, baseTypes, baseFoundation, baseComponent, componentUtils, utils, prevFocus, vueRender, utilsGlobal, configProvider] = await Promise.all([
		  import('@aifuxi/semi-ui-vue'),
		  import('@aifuxi/semi-ui-vue/_base'),
		  import('@aifuxi/semi-ui-vue/_base/base'),
		  import('@aifuxi/semi-ui-vue/_base/base-foundation'),
		  import('@aifuxi/semi-ui-vue/_base/base-component'),
		  import('@aifuxi/semi-ui-vue/_base/component-utils'),
		  import('@aifuxi/semi-ui-vue/_utils'),
		  import('@aifuxi/semi-ui-vue/_utils/use-prev-focus'),
		  import('@aifuxi/semi-ui-vue/_utils/vue-render'),
		  import('@aifuxi/semi-ui-vue/_utils/semi-global'),
		  import('@aifuxi/semi-ui-vue/config-provider'),
		]);
		if (typeof baseRoot.BaseComponent !== 'function' || typeof baseRoot.BaseFoundation !== 'function') {
		  throw new Error('_base 运行时导出不完整');
		}
		if (!Array.isArray(baseTypes.VALIDATE_STATUSES) || typeof baseFoundation.BaseFoundation !== 'function' || typeof baseComponent.default !== 'function' || typeof componentUtils.isVueComponent !== 'function') {
		  throw new Error('_base 子路径运行时导出不完整');
		}
		if (typeof utils.cloneDeep !== 'function' || typeof prevFocus.usePrevFocus !== 'function' || typeof vueRender.render !== 'function') {
		  throw new Error('_utils 子路径运行时导出不完整');
		}
		if (uiRoot.semiGlobal !== utils.semiGlobal || uiRoot.semiGlobal !== utilsGlobal.default || uiRoot.semiGlobal !== configProvider.semiGlobal) {
		  throw new Error('semiGlobal 多入口 singleton identity 分裂');
		}
		await import('@aifuxi/semi-ui-vue/anchor');
		await import('@aifuxi/semi-ui-vue/avatar');
		await import('@aifuxi/semi-ui-vue/badge');
		await import('@aifuxi/semi-ui-vue/banner');
		await import('@aifuxi/semi-ui-vue/feedback');
		await import('@aifuxi/semi-ui-vue/notification');
		await import('@aifuxi/semi-ui-vue/calendar');
		await import('@aifuxi/semi-ui-vue/card');
		await import('@aifuxi/semi-ui-vue/carousel');
		await import('@aifuxi/semi-ui-vue/cascader');
		await import('@aifuxi/semi-ui-vue/color-picker');
		await import('@aifuxi/semi-ui-vue/date-picker');
		await import('@aifuxi/semi-ui-vue/form');
		await import('@aifuxi/semi-ui-vue/collapse');
		await import('@aifuxi/semi-ui-vue/code-highlight');
		await import('@aifuxi/semi-ui-vue/collapsible');
		await import('@aifuxi/semi-ui-vue/cropper');
		await import('@aifuxi/semi-ui-vue/descriptions');
		await import('@aifuxi/semi-ui-vue/dropdown');
		await import('@aifuxi/semi-ui-vue/drag-move');
		await import('@aifuxi/semi-ui-vue/hot-keys');
		await import('@aifuxi/semi-ui-vue/lottie');
		await import('@aifuxi/semi-ui-vue/audio-player');
		await import('@aifuxi/semi-ui-vue/video-player');
		await import('@aifuxi/semi-ui-vue/user-guide');
		await import('@aifuxi/semi-ui-vue/json-viewer');
		await import('@aifuxi/semi-ui-vue/ai-chat-dialogue');
		await import('@aifuxi/semi-ui-vue/ai-chat-dialogue/data-adapter');
		await import('@aifuxi/semi-ui-vue/sidebar');
		await import('@aifuxi/semi-ui-vue/chat');
		await import('@aifuxi/semi-ui-vue/markdown-render');
		await import('@aifuxi/semi-ui-vue/locale');
		const localeModules = await Promise.all(${JSON.stringify(localeSourceNames)}.map(sourceName => import('@aifuxi/semi-ui-vue/locale/source/' + sourceName)));
		if (localeModules.length !== 57 || localeModules.some(module => typeof module.default?.code !== 'string')) {
		  throw new Error('57 个 Locale 默认导出不完整');
		}
		await import('@aifuxi/semi-ui-vue/empty');
		await import('@aifuxi/semi-ui-vue/highlight');
		await import('@aifuxi/semi-ui-vue/image');
		await import('@aifuxi/semi-ui-vue/list');
		await import('@aifuxi/semi-ui-vue/modal');
		await import('@aifuxi/semi-ui-vue/overflow-list');
		await import('@aifuxi/semi-ui-vue/popover');
		await import('@aifuxi/semi-ui-vue/popconfirm');
		await import('@aifuxi/semi-ui-vue/progress');
		await import('@aifuxi/semi-ui-vue/skeleton');
		await import('@aifuxi/semi-ui-vue/spin');
		await import('@aifuxi/semi-ui-vue/transfer');
		await import('@aifuxi/semi-ui-vue/upload');
		await import('@aifuxi/semi-ui-vue/navigation');
		await import('@aifuxi/semi-ui-vue/toast');
		await import('@aifuxi/semi-ui-vue/scroll-list');
		await import('@aifuxi/semi-ui-vue/side-sheet');
		await import('@aifuxi/semi-ui-vue/table');
		await import('@aifuxi/semi-ui-vue/tag');
		await import('@aifuxi/semi-ui-vue/timeline');
	await import('@aifuxi/semi-ui-vue/back-top');
	await import('@aifuxi/semi-ui-vue/breadcrumb');
	await import('@aifuxi/semi-ui-vue/button');
	await import('@aifuxi/semi-ui-vue/icon-button');
	await import('@aifuxi/semi-ui-vue/checkbox');
	await import('@aifuxi/semi-ui-vue/auto-complete');
	await import('@aifuxi/semi-ui-vue/config-provider');
	await import('@aifuxi/semi-ui-vue/divider');
	await import('@aifuxi/semi-ui-vue/float-button');
	await import('@aifuxi/semi-ui-vue/grid');
	await import('@aifuxi/semi-ui-vue/icon');
	await import('@aifuxi/semi-ui-vue/input');
	await import('@aifuxi/semi-ui-vue/input-number');
	await import('@aifuxi/semi-ui-vue/pin-code');
	await import('@aifuxi/semi-ui-vue/pagination');
	await import('@aifuxi/semi-ui-vue/radio');
	await import('@aifuxi/semi-ui-vue/rating');
	await import('@aifuxi/semi-ui-vue/layout');
	await import('@aifuxi/semi-ui-vue/resizable');
	await import('@aifuxi/semi-ui-vue/select');
	await import('@aifuxi/semi-ui-vue/slider');
	await import('@aifuxi/semi-ui-vue/space');
	await import('@aifuxi/semi-ui-vue/steps');
	await import('@aifuxi/semi-ui-vue/tabs');
	await import('@aifuxi/semi-ui-vue/tree');
	await import('@aifuxi/semi-ui-vue/tree-select');
	await import('@aifuxi/semi-ui-vue/switch');
	await import('@aifuxi/semi-ui-vue/tag-input');
	await import('@aifuxi/semi-ui-vue/time-picker');
	await import('@aifuxi/semi-ui-vue/tooltip');
	await import('@aifuxi/semi-ui-vue/typography');
	await import('@aifuxi/semi-icons-vue/Icon');
	await import('@aifuxi/semi-icons-vue/icons/IconHome');
	await import('@aifuxi/semi-icons-lab-vue/Icon');
	await import('@aifuxi/semi-icons-lab-vue/icons/IconAvatar');
	await import('@aifuxi/semi-illustrations-vue/Illustration');
	await import('@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoContent');
	const stableIcons = await import('@aifuxi/semi-icons-vue');
	const labIcons = await import('@aifuxi/semi-icons-lab-vue');
	const illustrations = await import('@aifuxi/semi-illustrations-vue');
	if (Object.keys(stableIcons).length !== 525) throw new Error('稳定版 Icon 根导出数量不完整');
	if (Object.keys(labIcons).length !== 85) throw new Error('Lab Icon 根导出数量不完整');
	if (Object.keys(illustrations).length !== 17) throw new Error('Illustrations 根导出数量不完整');
	const rootTheme = import.meta.resolve('@aifuxi/semi-theme-default');
const cssTheme = import.meta.resolve('@aifuxi/semi-theme-default/index.css');
if (rootTheme !== cssTheme) throw new Error('默认主题根导出未指向 index.css');
		if (!import.meta.resolve('@aifuxi/semi-theme-default/anchor.css').endsWith('/dist/anchor.css')) {
		  throw new Error('Anchor 逐组件样式导出未指向 dist/anchor.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/avatar.css').endsWith('/dist/avatar.css')) {
		  throw new Error('Avatar 逐组件样式导出未指向 dist/avatar.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/badge.css').endsWith('/dist/badge.css')) {
		  throw new Error('Badge 逐组件样式导出未指向 dist/badge.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/banner.css').endsWith('/dist/banner.css')) {
		  throw new Error('Banner 逐组件样式导出未指向 dist/banner.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/feedback.css').endsWith('/dist/feedback.css')) {
		  throw new Error('Feedback 逐组件样式导出未指向 dist/feedback.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/notification.css').endsWith('/dist/notification.css')) {
		  throw new Error('Notification 逐组件样式导出未指向 dist/notification.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/popconfirm.css').endsWith('/dist/popconfirm.css')) {
		  throw new Error('Popconfirm 逐组件样式导出未指向 dist/popconfirm.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/progress.css').endsWith('/dist/progress.css')) {
		  throw new Error('Progress 逐组件样式导出未指向 dist/progress.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/skeleton.css').endsWith('/dist/skeleton.css')) {
		  throw new Error('Skeleton 逐组件样式导出未指向 dist/skeleton.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/spin.css').endsWith('/dist/spin.css')) {
		  throw new Error('Spin 逐组件样式导出未指向 dist/spin.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/transfer.css').endsWith('/dist/transfer.css')) {
		  throw new Error('Transfer 逐组件样式导出未指向 dist/transfer.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/upload.css').endsWith('/dist/upload.css')) {
		  throw new Error('Upload 逐组件样式导出未指向 dist/upload.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/navigation.css').endsWith('/dist/navigation.css')) {
		  throw new Error('Navigation 逐组件样式导出未指向 dist/navigation.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/toast.css').endsWith('/dist/toast.css')) {
		  throw new Error('Toast 逐组件样式导出未指向 dist/toast.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/calendar.css').endsWith('/dist/calendar.css')) {
		  throw new Error('Calendar 逐组件样式导出未指向 dist/calendar.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/card.css').endsWith('/dist/card.css')) {
		  throw new Error('Card 逐组件样式导出未指向 dist/card.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/carousel.css').endsWith('/dist/carousel.css')) {
		  throw new Error('Carousel 逐组件样式导出未指向 dist/carousel.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/cascader.css').endsWith('/dist/cascader.css')) {
		  throw new Error('Cascader 逐组件样式导出未指向 dist/cascader.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/color-picker.css').endsWith('/dist/color-picker.css')) {
		  throw new Error('ColorPicker 逐组件样式导出未指向 dist/color-picker.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/date-picker.css').endsWith('/dist/date-picker.css')) {
		  throw new Error('DatePicker 逐组件样式导出未指向 dist/date-picker.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/form.css').endsWith('/dist/form.css')) {
		  throw new Error('Form 逐组件样式导出未指向 dist/form.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/collapse.css').endsWith('/dist/collapse.css')) {
		  throw new Error('Collapse 逐组件样式导出未指向 dist/collapse.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/code-highlight.css').endsWith('/dist/code-highlight.css')) {
		  throw new Error('CodeHighlight 逐组件样式导出未指向 dist/code-highlight.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/collapsible.css').endsWith('/dist/collapsible.css')) {
		  throw new Error('Collapsible 逐组件样式导出未指向 dist/collapsible.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/cropper.css').endsWith('/dist/cropper.css')) {
		  throw new Error('Cropper 逐组件样式导出未指向 dist/cropper.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/descriptions.css').endsWith('/dist/descriptions.css')) {
		  throw new Error('Descriptions 逐组件样式导出未指向 dist/descriptions.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/dropdown.css').endsWith('/dist/dropdown.css')) {
		  throw new Error('Dropdown 逐组件样式导出未指向 dist/dropdown.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/drag-move.css').endsWith('/dist/drag-move.css')) {
		  throw new Error('DragMove 逐组件样式导出未指向 dist/drag-move.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/hot-keys.css').endsWith('/dist/hot-keys.css')) {
		  throw new Error('HotKeys 逐组件样式导出未指向 dist/hot-keys.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/lottie.css').endsWith('/dist/lottie.css')) {
		  throw new Error('Lottie 逐组件样式导出未指向 dist/lottie.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/audio-player.css').endsWith('/dist/audio-player.css')) {
		  throw new Error('AudioPlayer 逐组件样式导出未指向 dist/audio-player.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/video-player.css').endsWith('/dist/video-player.css')) {
		  throw new Error('VideoPlayer 逐组件样式导出未指向 dist/video-player.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/user-guide.css').endsWith('/dist/user-guide.css')) {
		  throw new Error('UserGuide 逐组件样式导出未指向 dist/user-guide.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/json-viewer.css').endsWith('/dist/json-viewer.css')) {
		  throw new Error('JsonViewer 逐组件样式导出未指向 dist/json-viewer.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/ai-chat-input.css').endsWith('/dist/ai-chat-input.css')) {
		  throw new Error('AIChatInput 逐组件样式导出未指向 dist/ai-chat-input.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/ai-chat-dialogue.css').endsWith('/dist/ai-chat-dialogue.css')) {
		  throw new Error('AIChatDialogue 逐组件样式导出未指向 dist/ai-chat-dialogue.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/sidebar.css').endsWith('/dist/sidebar.css')) {
		  throw new Error('Sidebar 逐组件样式导出未指向 dist/sidebar.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/chat.css').endsWith('/dist/chat.css')) {
		  throw new Error('Chat 逐组件样式导出未指向 dist/chat.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/markdown-render.css').endsWith('/dist/markdown-render.css')) {
		  throw new Error('MarkdownRender 逐组件样式导出未指向 dist/markdown-render.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/locale.css').endsWith('/dist/locale.css')) {
		  throw new Error('Locale 逐组件样式导出未指向 dist/locale.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/empty.css').endsWith('/dist/empty.css')) {
		  throw new Error('Empty 逐组件样式导出未指向 dist/empty.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/highlight.css').endsWith('/dist/highlight.css')) {
		  throw new Error('Highlight 逐组件样式导出未指向 dist/highlight.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/image.css').endsWith('/dist/image.css')) {
		  throw new Error('Image 逐组件样式导出未指向 dist/image.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/list.css').endsWith('/dist/list.css')) {
		  throw new Error('List 逐组件样式导出未指向 dist/list.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/modal.css').endsWith('/dist/modal.css')) {
		  throw new Error('Modal 逐组件样式导出未指向 dist/modal.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/overflow-list.css').endsWith('/dist/overflow-list.css')) {
		  throw new Error('OverflowList 逐组件样式导出未指向 dist/overflow-list.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/popover.css').endsWith('/dist/popover.css')) {
		  throw new Error('Popover 逐组件样式导出未指向 dist/popover.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/scroll-list.css').endsWith('/dist/scroll-list.css')) {
		  throw new Error('ScrollList 逐组件样式导出未指向 dist/scroll-list.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/side-sheet.css').endsWith('/dist/side-sheet.css')) {
		  throw new Error('SideSheet 逐组件样式导出未指向 dist/side-sheet.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/table.css').endsWith('/dist/table.css')) {
		  throw new Error('Table 逐组件样式导出未指向 dist/table.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/tag.css').endsWith('/dist/tag.css')) {
		  throw new Error('Tag 逐组件样式导出未指向 dist/tag.css');
		}
		if (!import.meta.resolve('@aifuxi/semi-theme-default/timeline.css').endsWith('/dist/timeline.css')) {
		  throw new Error('Timeline 逐组件样式导出未指向 dist/timeline.css');
		}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/back-top.css').endsWith('/dist/back-top.css')) {
	  throw new Error('BackTop 逐组件样式导出未指向 dist/back-top.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/breadcrumb.css').endsWith('/dist/breadcrumb.css')) {
	  throw new Error('Breadcrumb 逐组件样式导出未指向 dist/breadcrumb.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/button.css').endsWith('/dist/button.css')) {
	  throw new Error('Button 逐组件样式导出未指向 dist/button.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/icon-button.css').endsWith('/dist/icon-button.css')) {
	  throw new Error('IconButton 逐组件样式导出未指向 dist/icon-button.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/checkbox.css').endsWith('/dist/checkbox.css')) {
	  throw new Error('Checkbox 逐组件样式导出未指向 dist/checkbox.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/auto-complete.css').endsWith('/dist/auto-complete.css')) {
	  throw new Error('AutoComplete 逐组件样式导出未指向 dist/auto-complete.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/config-provider.css').endsWith('/dist/config-provider.css')) {
	  throw new Error('ConfigProvider 逐组件样式导出未指向 dist/config-provider.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/divider.css').endsWith('/dist/divider.css')) {
	  throw new Error('Divider 逐组件样式导出未指向 dist/divider.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/float-button.css').endsWith('/dist/float-button.css')) {
	  throw new Error('FloatButton 逐组件样式导出未指向 dist/float-button.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/grid.css').endsWith('/dist/grid.css')) {
	  throw new Error('Grid 逐组件样式导出未指向 dist/grid.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/icon.css').endsWith('/dist/icon.css')) {
	  throw new Error('Icon 逐组件样式导出未指向 dist/icon.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/input.css').endsWith('/dist/input.css')) {
	  throw new Error('Input 逐组件样式导出未指向 dist/input.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/input-number.css').endsWith('/dist/input-number.css')) {
	  throw new Error('InputNumber 逐组件样式导出未指向 dist/input-number.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/pin-code.css').endsWith('/dist/pin-code.css')) {
	  throw new Error('PinCode 逐组件样式导出未指向 dist/pin-code.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/pagination.css').endsWith('/dist/pagination.css')) {
	  throw new Error('Pagination 逐组件样式导出未指向 dist/pagination.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/radio.css').endsWith('/dist/radio.css')) {
	  throw new Error('Radio 逐组件样式导出未指向 dist/radio.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/rating.css').endsWith('/dist/rating.css')) {
	  throw new Error('Rating 逐组件样式导出未指向 dist/rating.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/layout.css').endsWith('/dist/layout.css')) {
	  throw new Error('Layout 逐组件样式导出未指向 dist/layout.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/resizable.css').endsWith('/dist/resizable.css')) {
	  throw new Error('Resizable 逐组件样式导出未指向 dist/resizable.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/select.css').endsWith('/dist/select.css')) {
	  throw new Error('Select 逐组件样式导出未指向 dist/select.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/slider.css').endsWith('/dist/slider.css')) {
	  throw new Error('Slider 逐组件样式导出未指向 dist/slider.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/space.css').endsWith('/dist/space.css')) {
	  throw new Error('Space 逐组件样式导出未指向 dist/space.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/steps.css').endsWith('/dist/steps.css')) {
	  throw new Error('Steps 逐组件样式导出未指向 dist/steps.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/tabs.css').endsWith('/dist/tabs.css')) {
	  throw new Error('Tabs 逐组件样式导出未指向 dist/tabs.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/tree.css').endsWith('/dist/tree.css')) {
	  throw new Error('Tree 逐组件样式导出未指向 dist/tree.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/tree-select.css').endsWith('/dist/tree-select.css')) {
	  throw new Error('TreeSelect 逐组件样式导出未指向 dist/tree-select.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/switch.css').endsWith('/dist/switch.css')) {
	  throw new Error('Switch 逐组件样式导出未指向 dist/switch.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/tag-input.css').endsWith('/dist/tag-input.css')) {
	  throw new Error('TagInput 逐组件样式导出未指向 dist/tag-input.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/time-picker.css').endsWith('/dist/time-picker.css')) {
	  throw new Error('TimePicker 逐组件样式导出未指向 dist/time-picker.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/tooltip.css').endsWith('/dist/tooltip.css')) {
	  throw new Error('Tooltip 逐组件样式导出未指向 dist/tooltip.css');
	}
	if (!import.meta.resolve('@aifuxi/semi-theme-default/typography.css').endsWith('/dist/typography.css')) {
	  throw new Error('Typography 逐组件样式导出未指向 dist/typography.css');
	}
	`,
  );
  run(process.execPath, ['smoke.mjs'], consumerRoot);

  // Exercise the installed tarball, so the palette fix cannot be lost during bundling.
  await writeFile(
    path.join(consumerRoot, 'icon-palette-smoke.mjs'),
    String.raw`
import assert from 'node:assert/strict';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import { IconAIFilledLevel3 } from '@aifuxi/semi-icons-vue';
import DirectIcon from '@aifuxi/semi-icons-vue/icons/IconAIFilledLevel3';
for (const Icon of [IconAIFilledLevel3, DirectIcon]) {
  for (const [fill, expected] of [
    [['red'], ['red', 'red', 'red', 'red']],
    [['red', 'blue'], ['red', 'blue', 'red', 'blue']],
    [['red', 'blue', 'green'], ['red', 'blue', 'green', 'red']],
    [['red', 'blue', 'green', 'yellow'], ['yellow', 'green', 'blue', 'red']],
  ]) {
    const html = await renderToString(h(Icon, { fill }));
    const stops = [...html.matchAll(/stop-color="([^"]+)"/g)].map((match) => match[1]);
    assert.deepEqual(stops, expected, 'Installed Icon gradient palette order');
  }
}
`,
  );
  run(process.execPath, ['icon-palette-smoke.mjs'], consumerRoot);

  await writeFile(
    path.join(consumerRoot, 'config-provider-smoke.mjs'),
    String.raw`
import assert from 'node:assert/strict';
import { h } from 'vue';
import { renderToString } from 'vue/server-renderer';
import * as root from '@aifuxi/semi-ui-vue';
import * as config from '@aifuxi/semi-ui-vue/config-provider';
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import zhCN from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
for (const { ConfigProvider, ConfigConsumer } of [root, config]) {
  let received;
  await renderToString(h(ConfigProvider, null, () => h(ConfigConsumer, null, {
    default: (context) => { received = context.locale; return h('span', context.locale.code); },
  })));
  assert.deepEqual(JSON.parse(JSON.stringify(received)), JSON.parse(JSON.stringify(zhCN)));
  assert.equal(received.dateFnsLocale.code, 'zh-CN');
  assert.ok(received.AIChatInput && received.DatePicker && received.TimePicker);
}
for (const Component of [root.DatePicker, DatePicker]) {
  for (const inputReadOnly of [undefined, false, true]) {
    const html = await renderToString(h(Component, inputReadOnly === undefined ? {} : { inputReadOnly }));
    assert.equal(html.includes('semi-datepicker-input-readonly'), inputReadOnly === true);
  }
}
`,
  );
  run(process.execPath, ['config-provider-smoke.mjs'], consumerRoot);

  await writeFile(
    path.join(consumerRoot, 'type-smoke.ts'),
    `${javascriptPackages.map((packageName) => `import '${packageName}';`).join('\n')}
	import { BaseComponent, BaseFoundation, type BaseProps, type ValidateStatus } from '@aifuxi/semi-ui-vue/_base';
	import { VALIDATE_STATUSES } from '@aifuxi/semi-ui-vue/_base/base';
	import { BaseFoundation as DirectBaseFoundation } from '@aifuxi/semi-ui-vue/_base/base-foundation';
	import DirectBaseComponent from '@aifuxi/semi-ui-vue/_base/base-component';
	import { isElement, isVueComponent } from '@aifuxi/semi-ui-vue/_base/component-utils';
	import { cloneDeep, getDefaultPropsFromGlobalConfig, registerMediaQuery, type RegisterMediaQueryOption } from '@aifuxi/semi-ui-vue/_utils';
	import { usePrevFocus, type PreviousFocusRef } from '@aifuxi/semi-ui-vue/_utils/use-prev-focus';
	import { getRef, render as renderVNode, resolveDOM, unmount as unmountVNode } from '@aifuxi/semi-ui-vue/_utils/vue-render';
	import utilitySemiGlobal from '@aifuxi/semi-ui-vue/_utils/semi-global';
	import { AutoComplete, AutoCompleteOption, type AutoCompleteModelValue } from '@aifuxi/semi-ui-vue/auto-complete';
		import { Anchor, AnchorLink, type AnchorPosition } from '@aifuxi/semi-ui-vue/anchor';
		import { Avatar, AvatarGroup, type AvatarColor, type AvatarSize } from '@aifuxi/semi-ui-vue/avatar';
		import { Badge, type BadgePosition, type BadgeType } from '@aifuxi/semi-ui-vue/badge';
		import { Banner, type BannerType } from '@aifuxi/semi-ui-vue/banner';
		import { Feedback, type FeedbackMode, type FeedbackProps, type FeedbackValue } from '@aifuxi/semi-ui-vue/feedback';
		import { Notification, type NotificationPosition } from '@aifuxi/semi-ui-vue/notification';
		import { Popconfirm, type PopconfirmProps } from '@aifuxi/semi-ui-vue/popconfirm';
		import { Progress, type ProgressProps, type ProgressStrokePoint } from '@aifuxi/semi-ui-vue/progress';
		import { Skeleton, type SkeletonAvatarSize, type SkeletonProps } from '@aifuxi/semi-ui-vue/skeleton';
		import { Spin, type SpinProps, type SpinSize } from '@aifuxi/semi-ui-vue/spin';
		import { Transfer, type TransferDataItem, type TransferProps, type TransferSourceItemProps, type TransferType } from '@aifuxi/semi-ui-vue/transfer';
		import { Upload, type UploadFileItem, type UploadListType, type UploadProps } from '@aifuxi/semi-ui-vue/upload';
		import { Nav, NavItem, SubNav, type NavigationItems, type NavigationMode } from '@aifuxi/semi-ui-vue/navigation';
		import { Toast, ToastFactory, useToast, type ToastTheme } from '@aifuxi/semi-ui-vue/toast';
		import { Calendar, type CalendarEvent, type CalendarMode } from '@aifuxi/semi-ui-vue/calendar';
		import { Card, CardGroup, CardMeta, type CardShadows } from '@aifuxi/semi-ui-vue/card';
		import { Carousel, type CarouselMethods, type CarouselTheme } from '@aifuxi/semi-ui-vue/carousel';
		import { Cascader, type CascaderData, type CascaderProps, type CascaderValue } from '@aifuxi/semi-ui-vue/cascader';
		import { ColorPicker, colorStringToValue, type ColorPickerFormat, type ColorPickerProps, type ColorValue } from '@aifuxi/semi-ui-vue/color-picker';
		import { DatePicker, type DatePickerProps, type DatePickerType, type DatePickerValue } from '@aifuxi/semi-ui-vue/date-picker';
		import { ArrayField, Form, useFieldApi, useForm, type ArrayFieldSlotProps, type FormApi, type FormInputProps, type FormState } from '@aifuxi/semi-ui-vue/form';
		import { Collapse, CollapsePanel, type CollapseActiveKey, type CollapseIconPosition, type CollapseProps } from '@aifuxi/semi-ui-vue/collapse';
		import { CodeHighlight, type CodeHighlightProps } from '@aifuxi/semi-ui-vue/code-highlight';
		import { Collapsible, type CollapsibleProps } from '@aifuxi/semi-ui-vue/collapsible';
		import { Cropper, type CropperMethods, type CropperShape } from '@aifuxi/semi-ui-vue/cropper';
		import { Descriptions, DescriptionsItem, type DescriptionsDataItem, type DescriptionsLayout } from '@aifuxi/semi-ui-vue/descriptions';
		import { Dropdown, DropdownItem, DropdownMenu, type DropdownItemType, type DropdownMenuItem } from '@aifuxi/semi-ui-vue/dropdown';
		import { DragMove, type DragMoveConstrainer, type DragMoveProps } from '@aifuxi/semi-ui-vue/drag-move';
		import { HotKeys, type HotKeysKey, type HotKeysProps } from '@aifuxi/semi-ui-vue/hot-keys';
		import { Lottie, type LottieAnimationItem, type LottieParams, type LottiePlayer } from '@aifuxi/semi-ui-vue/lottie';
		import { AudioPlayer, formatAudioTime, type AudioInfo, type AudioPlayerProps, type AudioPlayerTheme } from '@aifuxi/semi-ui-vue/audio-player';
		import { VideoPlayer, formatVideoTime, type VideoPlayerMarker, type VideoPlayerProps, type VideoPlayerTheme } from '@aifuxi/semi-ui-vue/video-player';
		import { UserGuide, type UserGuideMode, type UserGuideProps, type UserGuideStepItem } from '@aifuxi/semi-ui-vue/user-guide';
		import { JsonViewer, type JsonViewerOptions, type JsonViewerProps, type JsonViewerSearchControls } from '@aifuxi/semi-ui-vue/json-viewer';
		import { AIChatInput, AIChatInputConfigure, AIChatInputConfigureItem, type AIChatInputProps, type Attachment, type MessageContent } from '@aifuxi/semi-ui-vue/ai-chat-input';
		import { AIChatDialogue, AIChatDialogueReasoning, type AIChatDialogueMessage, type AIChatDialogueProps } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';
		import { chatCompletionToMessage, streamingChatCompletionToMessage, type ChatCompletion, type StreamingChatState } from '@aifuxi/semi-ui-vue/ai-chat-dialogue/data-adapter';
		import { Sidebar, type SidebarMode, type SidebarOption, type SidebarProps } from '@aifuxi/semi-ui-vue/sidebar';
		import { Chat, type ChatMessage, type ChatProps, type ChatSendHotKey } from '@aifuxi/semi-ui-vue/chat';
		import { MarkdownRender, markdownRenderDefaultComponents, type MarkdownRenderFormat, type MarkdownRenderProps } from '@aifuxi/semi-ui-vue/markdown-render';
		import { LocaleConsumer, LocaleProvider, type LocaleConsumerSlotProps, type LocaleProviderProps } from '@aifuxi/semi-ui-vue/locale';
		import enGB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
		import { Empty, type EmptyLayout, type EmptySvgNode } from '@aifuxi/semi-ui-vue/empty';
		import { Highlight, type HighlightSearchWords } from '@aifuxi/semi-ui-vue/highlight';
		import { Image, ImagePreview, type ImagePreviewProps, type ImageRatioType } from '@aifuxi/semi-ui-vue/image';
		import { List, ListItem, type ListGrid, type ListSize } from '@aifuxi/semi-ui-vue/list';
		import { Modal, type ModalHandle, type ModalSize } from '@aifuxi/semi-ui-vue/modal';
		import { OverflowList, type OverflowItem, type OverflowListRenderMode } from '@aifuxi/semi-ui-vue/overflow-list';
		import { Popover, type PopoverPosition } from '@aifuxi/semi-ui-vue/popover';
		import { ScrollItem, ScrollList, type ScrollItemData, type ScrollItemMode } from '@aifuxi/semi-ui-vue/scroll-list';
		import { SideSheet, type SideSheetPlacement, type SideSheetSize } from '@aifuxi/semi-ui-vue/side-sheet';
		import { Table, TableColumn, type TableColumnProps, type TableRowSelection } from '@aifuxi/semi-ui-vue/table';
		import { SplitTagGroup, Tag, TagGroup, type TagColor, type TagData } from '@aifuxi/semi-ui-vue/tag';
		import { Timeline, TimelineItem, type TimelineData, type TimelineMode } from '@aifuxi/semi-ui-vue/timeline';
	import { BackTop, type BackTopTarget } from '@aifuxi/semi-ui-vue/back-top';
	import { Breadcrumb, BreadcrumbItem, type BreadcrumbMoreType } from '@aifuxi/semi-ui-vue/breadcrumb';
	import { Button, ButtonGroup, SplitButtonGroup, type ButtonType } from '@aifuxi/semi-ui-vue/button';
	import { IconButton, type HorizontalPaddingType, type IconButtonProps } from '@aifuxi/semi-ui-vue/icon-button';
	import { Checkbox, CheckboxGroup, type CheckboxType, type CheckboxValue } from '@aifuxi/semi-ui-vue/checkbox';
	import { ConfigConsumer, ConfigProvider, defaultResponsiveMap, type Breakpoint } from '@aifuxi/semi-ui-vue/config-provider';
	import { Divider, type DividerAlign } from '@aifuxi/semi-ui-vue/divider';
	import { FloatButton, FloatButtonGroup, type FloatButtonShape } from '@aifuxi/semi-ui-vue/float-button';
	import { Col, Row, type GridGutter } from '@aifuxi/semi-ui-vue/grid';
	import { Icon } from '@aifuxi/semi-ui-vue/icon';
	import { Input, InputGroup, TextArea, type InputSize, type InputValue, type TextAreaResize } from '@aifuxi/semi-ui-vue/input';
	import { InputNumber, type InputNumberValue } from '@aifuxi/semi-ui-vue/input-number';
	import { PinCode, type PinCodeFormat } from '@aifuxi/semi-ui-vue/pin-code';
	import { Radio, RadioGroup, type RadioType, type RadioValue } from '@aifuxi/semi-ui-vue/radio';
	import { Rating, type RatingSize } from '@aifuxi/semi-ui-vue/rating';
	import { Layout, LayoutContent, LayoutSider, type LayoutBreakpoint } from '@aifuxi/semi-ui-vue/layout';
	import { Resizable, ResizeGroup, ResizeHandler, ResizeItem, type ResizeDirection, type ResizeSize } from '@aifuxi/semi-ui-vue/resizable';
	import { Select, SelectOption, SelectOptionGroup, type SelectModelValue } from '@aifuxi/semi-ui-vue/select';
	import { Slider, type SliderValue } from '@aifuxi/semi-ui-vue/slider';
	import { Space, type SpaceAlign, type SpaceSpacingValue } from '@aifuxi/semi-ui-vue/space';
	import { Step, Steps, type StepsStatus, type StepsType } from '@aifuxi/semi-ui-vue/steps';
	import { TabItem, TabPane, Tabs, type TabPosition, type TabType } from '@aifuxi/semi-ui-vue/tabs';
	import { Tree, type TreeNodeData, type TreeValue } from '@aifuxi/semi-ui-vue/tree';
	import { TreeSelect, type TreeSelectProps, type TreeSelectSelectedItemProps } from '@aifuxi/semi-ui-vue/tree-select';
	import { Switch, type SwitchSize } from '@aifuxi/semi-ui-vue/switch';
	import { TagInput, type TagInputSize } from '@aifuxi/semi-ui-vue/tag-input';
	import { TimePicker, type TimePickerType, type TimePickerValue } from '@aifuxi/semi-ui-vue/time-picker';
	import { Tooltip, type TooltipPosition } from '@aifuxi/semi-ui-vue/tooltip';
	import { Typography, Text, Title, Paragraph, Numeral, type TypographyType, type TypographyNumeralRule } from '@aifuxi/semi-ui-vue/typography';
	import IconBase, { convertIcon, type IconSize } from '@aifuxi/semi-icons-vue/Icon';
	import { IconAIWandLevel3, IconHome } from '@aifuxi/semi-icons-vue';
	import IconHomeDirect from '@aifuxi/semi-icons-vue/icons/IconHome';
	import { IconAvatar } from '@aifuxi/semi-icons-lab-vue';
	import IconAvatarDirect from '@aifuxi/semi-icons-lab-vue/icons/IconAvatar';
	import { IllustrationNoContent, type IllustrationProps } from '@aifuxi/semi-illustrations-vue';
	import { convertIllustration } from '@aifuxi/semi-illustrations-vue/Illustration';
	import IllustrationNoContentDirect from '@aifuxi/semi-illustrations-vue/illustrations/IllustrationNoContent';
	import { h } from 'vue';
	type ConsumerBaseState = Record<string, unknown> & { ready: boolean };
	const baseProps: BaseProps = { class: 'consumer' };
	const validateStatus: ValidateStatus = VALIDATE_STATUSES[0];
	const baseController = new BaseComponent<BaseProps, ConsumerBaseState>({ props: baseProps, state: { ready: false } });
	const directBaseController = new DirectBaseComponent({ props: baseProps });
	const baseFoundation = new BaseFoundation<BaseProps, ConsumerBaseState>({ getProps: () => baseProps });
	const directBaseFoundation = new DirectBaseFoundation({});
	baseController.mount();
	baseFoundation.init();
	directBaseFoundation.destroy();
	void directBaseController;
	void validateStatus;
	const clonedConsumer = cloneDeep({ ready: true });
	const globalDefaults = getDefaultPropsFromGlobalConfig('Consumer', { size: 'default' });
	const mediaOptions: RegisterMediaQueryOption = { callInInit: false };
	const unregisterConsumerMedia = registerMediaQuery('(min-width: 1px)', mediaOptions);
	unregisterConsumerMedia();
	const previousFocusType: PreviousFocusRef | undefined = undefined;
	void previousFocusType;
	void usePrevFocus;
	void renderVNode;
	void unmountVNode;
	void resolveDOM;
	void getRef;
	void utilitySemiGlobal;
	void clonedConsumer;
	void globalDefaults;
	void isElement(h('span'));
	void isVueComponent(Button);
const type: ButtonType = 'primary';
h(Button, { type, htmlType: 'submit' });
	const horizontalPadding: HorizontalPaddingType = 'left';
	const iconButtonProps: IconButtonProps = { noHorizontalPadding: [horizontalPadding], type };
	h(IconButton, iconButtonProps, { icon: () => h('svg', { 'aria-hidden': 'true' }) });
		const anchorPosition: AnchorPosition = 'right';
		h(Anchor, { position: anchorPosition, showTooltip: true }, () => h(AnchorLink, { href: '#consumer', title: 'Consumer' }));
		const avatarColor: AvatarColor = 'light-blue';
		const avatarSize: AvatarSize = 'large';
		h(Avatar, { border: true, color: avatarColor, size: avatarSize }, () => 'A');
		h(AvatarGroup, { maxCount: 2, size: avatarSize }, () => [h(Avatar, null, () => 'A')]);
		h(Avatar.Group, { shape: 'square' }, () => [h(Avatar, null, () => 'B')]);
		const badgePosition: BadgePosition = 'rightTop';
		const badgeType: BadgeType = 'danger';
		h(Badge, { count: 120, overflowCount: 99, position: badgePosition, type: badgeType }, () => h(Avatar, null, () => 'B'));
		const bannerType: BannerType = 'warning';
		h(Banner, { description: 'Consumer notice', fullMode: false, type: bannerType, onClose: () => undefined }, () => h('button', 'Action'));
		const feedbackMode: FeedbackMode = 'popup';
		const feedbackValue: FeedbackValue = { emoji: '😃' };
		const feedbackProps: FeedbackProps = { mode: feedbackMode, visible: false, onValueChange: value => void value };
		h(Feedback, feedbackProps);
		void feedbackValue;
		const notificationPosition: NotificationPosition = 'topRight';
		const notificationId: string = Notification.info({ content: 'Consumer notification', duration: 0, position: notificationPosition });
		Notification.close(notificationId);
		const popconfirmProps: PopconfirmProps = { content: 'Consumer confirmation', title: 'Continue?' };
		h(Popconfirm, { ...popconfirmProps, onConfirm: () => Promise.resolve() }, () => h('button', 'Continue'));
		const progressStroke: ProgressStrokePoint[] = [{ percent: 100, color: '#0064fa' }];
		const progressProps: ProgressProps = { percent: 60, stroke: progressStroke, strokeGradient: true };
		h(Progress, progressProps, { format: ({ percent }: { percent: number }) => String(percent) + '%' });
		const skeletonSize: SkeletonAvatarSize = 'large';
		const skeletonProps: SkeletonProps = { active: true, loading: true };
		h(Skeleton, skeletonProps, { placeholder: () => h(Skeleton.Avatar, { size: skeletonSize }) });
		h(Skeleton.Paragraph, { rows: 2 });
		const spinSize: SpinSize = 'large';
		const spinProps: SpinProps = { delay: 100, size: spinSize, spinning: true };
		h(Spin, spinProps, { indicator: () => h('span', 'Loading'), tip: () => 'Please wait' });
		const transferType: TransferType = 'list';
		const transferData: TransferDataItem[] = [{ key: 'consumer', label: 'Consumer' }];
		const transferProps: TransferProps = { dataSource: transferData, defaultValue: ['consumer'], type: transferType };
		h(Transfer, transferProps, { sourceItem: ({ label }: TransferSourceItemProps) => h('span', String(label ?? '')) });
		const uploadListType: UploadListType = 'picture';
		const uploadFiles: UploadFileItem[] = [{ uid: 'consumer', name: 'consumer.png', size: 1024, status: 'success' }];
		const uploadProps: UploadProps = { action: '/upload', defaultFileList: uploadFiles, listType: uploadListType };
		h(Upload, uploadProps, () => h('button', 'Select file'));
		const navigationMode: NavigationMode = 'vertical';
		const navigationItems: NavigationItems = [{ itemKey: 'consumer', text: 'Consumer' }];
		h(Nav, { items: navigationItems, mode: navigationMode }, () => h(NavItem, { itemKey: 'slot', text: 'Slot' }));
		h(SubNav, { itemKey: 'sub', text: 'Sub' }, () => h(NavItem, { itemKey: 'nested', text: 'Nested' }));
		const toastTheme: ToastTheme = 'light';
		const toastId: string = Toast.info({ content: 'Consumer toast', duration: 0, theme: toastTheme });
		Toast.close(toastId);
		ToastFactory.create({ top: 12 });
		const [toastApi, ToastHolder] = useToast();
		h(ToastHolder);
		toastApi.open({ content: 'Holder toast', duration: 0 });
		const calendarMode: CalendarMode = 'week';
		const calendarEvents: CalendarEvent[] = [{ key: 'consumer', start: new Date(2023, 3, 10, 9), content: 'Consumer event' }];
		h(Calendar, { mode: calendarMode, displayValue: new Date(2023, 3, 10), events: calendarEvents, showCurrTime: false });
		const cardShadows: CardShadows = 'hover';
		h(Card, { title: 'Consumer', shadows: cardShadows, actions: [h('button', 'Action')] }, () => h(CardMeta, { title: 'Meta' }));
		h(Card.Meta, { description: 'Compound Meta' });
		h(CardGroup, { type: 'grid', spacing: [8, 12] }, () => h(Card, { bordered: false }));
		const carouselTheme: CarouselTheme = 'dark';
		const carouselMethods: CarouselMethods = { play() {}, stop() {}, goTo() {}, prev() {}, next() {} };
		h(Carousel, { autoPlay: false, theme: carouselTheme, showArrow: true }, () => [h('div', 'One'), h('div', 'Two')]);
		carouselMethods.goTo(1);
		const cascaderData: CascaderData[] = [{ label: 'Consumer', value: 'consumer' }];
		const cascaderValue: CascaderValue = ['consumer'];
		const cascaderProps: CascaderProps = { treeData: cascaderData, defaultValue: cascaderValue, filterTreeNode: true };
		h(Cascader, cascaderProps, { empty: () => 'No data' });
		const colorPickerFormat: ColorPickerFormat = 'hex';
		const colorPickerValue: ColorValue = colorStringToValue('#39c5bbcc');
		const colorPickerProps: ColorPickerProps = { alpha: true, defaultFormat: colorPickerFormat, defaultValue: colorPickerValue, eyeDropper: false };
		h(ColorPicker, colorPickerProps, { top: () => 'Top', bottom: () => 'Bottom' });
		ColorPicker.colorStringToValue('rgba(57,197,187,0.8)');
		const datePickerType: DatePickerType = 'dateRange';
		const datePickerValue: DatePickerValue = [new Date(2024, 4, 10), new Date(2024, 4, 12)];
		const datePickerProps: DatePickerProps = { defaultValue: datePickerValue, motion: false, type: datePickerType };
		h(DatePicker, datePickerProps, { prefix: () => 'Date', rangeSeparator: () => 'to' });
		const formInputProps: FormInputProps = { field: 'name', label: 'Name', rules: [{ required: true }] };
		const [formApi] = useForm();
		const [typedFormApi, typedFormStateRef] = useForm<{ name: string }>();
		const checkedFormApi: FormApi<{ name: string }> = typedFormApi;
		const typedFormState: FormState<{ name: string }> = typedFormStateRef.value;
		h(Form, { initValues: { name: 'Semi' }, form: formApi }, { default: () => h(Form.Input, formInputProps) });
		h(ArrayField, { field: 'people', initValue: [] }, { default: ({ arrayFields }: ArrayFieldSlotProps) => arrayFields.length });
		void useFieldApi;
		void checkedFormApi;
		void typedFormState;
		const collapseActiveKey: CollapseActiveKey = ['overview'];
		const collapseIconPosition: CollapseIconPosition = 'left';
		const collapseProps: CollapseProps = { activeKey: collapseActiveKey, expandIconPosition: collapseIconPosition, motion: false };
		h(Collapse, collapseProps, { default: () => h(CollapsePanel, { itemKey: 'overview', header: 'Overview' }, () => 'Content') });
		h(Collapse.Panel, { itemKey: 'compound', header: 'Compound' }, () => 'Content');
		const codeHighlightProps: CodeHighlightProps = { code: 'const ready = true;', language: 'javascript', lineNumber: true };
		h(CodeHighlight, codeHighlightProps);
		const collapsibleProps: CollapsibleProps = { collapseHeight: 24, motion: true };
		h(Collapsible, collapsibleProps, () => h('div', 'Collapsible content'));
		const cropperShape: CropperShape = 'roundRect';
		const cropperMethods: CropperMethods | undefined = undefined;
		h(Cropper, { src: '/crop.png', shape: cropperShape, showResizeBox: false });
		void cropperMethods;
		const descriptionsLayout: DescriptionsLayout = 'horizontal';
		const descriptionsData: DescriptionsDataItem[] = [{ key: 'User', value: 'Semi', span: 2 }];
		h(Descriptions, { column: 3, data: descriptionsData, layout: descriptionsLayout });
		h(Descriptions.Item, { itemKey: 'Compound' }, () => 'Value');
		h(DescriptionsItem, { itemKey: 'Named' }, () => 'Value');
		const dropdownType: DropdownItemType = 'danger';
		const dropdownMenu: DropdownMenuItem[] = [{ node: 'item', name: 'Delete', type: dropdownType }];
		h(Dropdown, { menu: dropdownMenu, trigger: 'click' }, () => h('button', 'Menu'));
		h(Dropdown.Menu, null, () => h(Dropdown.Item, { type: dropdownType }, () => 'Delete'));
		h(DropdownMenu, null, () => h(DropdownItem, null, () => 'Named'));
		const dragMoveConstrainer: DragMoveConstrainer = 'parent';
		const dragMoveProps: DragMoveProps = { allowInputDrag: false, constrainer: dragMoveConstrainer, positionStrategy: 'relative' };
		h(DragMove, dragMoveProps, () => h('div', 'Drag me'));
		const hotKeysKey: HotKeysKey = HotKeys.Keys.K;
		const hotKeysProps: HotKeysProps = { hotKeys: [HotKeys.Keys.Control, hotKeysKey], preventDefault: true };
		h(HotKeys, hotKeysProps);
		const lottieParams: LottieParams = { animationData: {}, autoplay: false, loop: false };
		const lottiePlayer: LottiePlayer = Lottie.getLottie();
		let lottieAnimation: LottieAnimationItem | null = null;
		h(Lottie, { params: lottieParams, getAnimationInstance: instance => { lottieAnimation = instance; } });
		void lottiePlayer;
		void lottieAnimation;
		const audioTheme: AudioPlayerTheme = 'light';
		const audioInfo: AudioInfo = { src: 'data:audio/wav;base64,', title: 'Consumer track' };
		const audioPlayerProps: AudioPlayerProps = { audioUrl: audioInfo, showToolbar: false, theme: audioTheme };
		h(AudioPlayer, audioPlayerProps);
		if (formatAudioTime(4) !== '0:04') throw new Error('AudioPlayer 公开时间格式化函数异常');
		const videoTheme: VideoPlayerTheme = 'dark';
		const videoMarkers: VideoPlayerMarker[] = [{ start: 0, title: 'Intro' }];
		const videoPlayerProps: VideoPlayerProps = { src: '/video.mp4', clickToPlay: false, markers: videoMarkers, theme: videoTheme };
		h(VideoPlayer, videoPlayerProps);
		if (formatVideoTime(4) !== '00:04') throw new Error('VideoPlayer 公开时间格式化函数异常');
		const userGuideMode: UserGuideMode = 'popup';
		const userGuideSteps: UserGuideStepItem[] = [{ target: () => null, title: 'Consumer guide' }];
		const userGuideProps: UserGuideProps = { current: 0, mode: userGuideMode, steps: userGuideSteps, visible: false };
		h(UserGuide, userGuideProps);
		const jsonViewerOptions: JsonViewerOptions = { readOnly: true, autoWrap: true };
		const jsonViewerProps: JsonViewerProps = { value: '{"ready":true}', width: 320, height: 160, options: jsonViewerOptions };
		const jsonViewerSearchControls: JsonViewerSearchControls | undefined = undefined;
		h(JsonViewer, { ...jsonViewerProps, 'onUpdate:value': value => void value });
		void jsonViewerSearchControls;
		const aiAttachment: Attachment = { uid: 'consumer-file', name: 'consumer.txt', size: 8, status: 'success' };
		const aiChatInputProps: AIChatInputProps = { defaultContent: '<p>Consumer</p>', uploadProps: { action: '', defaultFileList: [aiAttachment] } };
		const aiMessage: MessageContent = { attachments: [aiAttachment], inputContents: [{ type: 'text', text: 'Consumer' }] };
		h(AIChatInput, aiChatInputProps);
		h(AIChatInputConfigure.Item, { field: "model", initValue: ["GPT", "GPT-4o"] });
		h(AIChatInputConfigureItem, { field: "custom", initValue: false });
		void aiMessage;
		const aiDialogueMessages: AIChatDialogueMessage[] = [{ id: 'consumer-dialogue', role: 'assistant', content: 'Ready', status: 'completed' }];
		const aiDialogueProps: AIChatDialogueProps = { chats: aiDialogueMessages, hints: ['Continue'], roleConfig: { assistant: { name: 'Assistant' } } };
		h(AIChatDialogue, aiDialogueProps);
		h(AIChatDialogueReasoning, { content: [{ type: 'reasoning_text', text: 'Reasoning' }], status: 'completed' });
		const completion: ChatCompletion = { id: 'completion', choices: [{ message: { role: 'assistant', content: 'Ready' } }] };
		chatCompletionToMessage(completion);
		const streamingState: StreamingChatState = { choices: new Map() };
		streamingChatCompletionToMessage([{ id: 'chunk', choices: [] }], streamingState);
		const sidebarMode: SidebarMode = 'main';
		const sidebarOptions: SidebarOption[] = [{ key: 'code', icon: h('span', 'C'), name: 'Code' }];
		const sidebarProps: SidebarProps = { mode: sidebarMode, activeKey: 'code', options: sidebarOptions, visible: true, motion: false };
		h(Sidebar, sidebarProps);
		h(Sidebar.CodeContent, { activeKey: 'main', codes: [{ key: 'main', name: 'main.ts', content: 'export {}' }] });
		const chatHotKey: ChatSendHotKey = 'enter';
		const chatMessages: ChatMessage[] = [{ id: 'consumer-chat', role: 'assistant', content: 'Ready', status: 'complete' }];
		const chatProps: ChatProps = { chats: chatMessages, sendHotKey: chatHotKey, enableUpload: false };
		h(Chat, chatProps);
		const markdownRenderFormat: MarkdownRenderFormat = 'md';
		const markdownRenderProps: MarkdownRenderProps = { raw: '# Consumer', format: markdownRenderFormat };
		h(MarkdownRender, markdownRenderProps);
		void markdownRenderDefaultComponents;
		const localeProviderProps: LocaleProviderProps = { locale: enGB };
		const localeSlot: LocaleConsumerSlotProps<{ begin: string }> | undefined = undefined;
		h(LocaleProvider, localeProviderProps, () => h(LocaleConsumer, { componentName: 'TimePicker' }));
		void localeSlot;
		const emptyLayout: EmptyLayout = 'horizontal';
		const emptyImage: EmptySvgNode = { id: 'consumer-empty' };
		h(Empty, { image: emptyImage, layout: emptyLayout, title: 'No content' }, () => h('button', 'Create'));
		const highlightWords: HighlightSearchWords = ['Semi', { text: 'Vue', className: 'consumer-keyword', style: { borderRadius: '4px' } }];
		h(Highlight, { sourceString: 'Semi Vue', searchWords: highlightWords, autoEscape: false });
		const imageRatio: ImageRatioType = 'adaptation';
		const imagePreviewProps: ImagePreviewProps = { src: ['/one.png'], visible: false };
		h(Image, { src: '/one.png', width: 80, height: 60, preview: { previewTitle: imageRatio } });
		h(ImagePreview, imagePreviewProps);
		const listGrid: ListGrid = { gutter: 12, span: 12 };
		const listSize: ListSize = 'small';
		h(List, { dataSource: ['A'], grid: listGrid, size: listSize });
		h(List.Item, null, () => 'Compound item');
		h(ListItem, null, () => 'Named item');
		const modalSize: ModalSize = 'small';
		h(Modal, { visible: false, size: modalSize, title: 'Consumer modal' }, () => 'Body');
		const modalHandle: ModalHandle | undefined = undefined;
		void modalHandle;
		const sideSheetPlacement: SideSheetPlacement = 'right';
		const sideSheetSize: SideSheetSize = 'small';
		h(SideSheet, { visible: false, placement: sideSheetPlacement, size: sideSheetSize }, () => 'Body');
		const tableColumns: TableColumnProps[] = [{ dataIndex: 'name', title: 'Name', width: 160 }];
		const tableSelection: TableRowSelection<Record<string, unknown>> = { selectedRowKeys: ['consumer'] };
		h(Table, { columns: tableColumns, dataSource: [{ key: 'consumer', name: 'Semi Vue' }], pagination: false, rowSelection: tableSelection });
		h(Table.Column, { dataIndex: 'name', title: 'Compound column' });
		h(TableColumn, { dataIndex: 'name', title: 'Named column' });
		const tagColor: TagColor = 'blue';
		const tagData: TagData[] = [{ tagKey: 'consumer', content: 'Consumer', color: tagColor }];
		h(Tag, { color: tagColor, closable: true }, () => 'Consumer tag');
		h(TagGroup, { maxTagCount: 1, tagList: tagData });
		h(SplitTagGroup, null, () => [h(Tag, null, () => 'One'), h(Tag, null, () => 'Two')]);
		const timelineMode: TimelineMode = 'center';
		const timelineData: TimelineData[] = [{ content: 'Consumer event', time: '10:00', type: 'success' }];
		h(Timeline, { dataSource: timelineData, mode: timelineMode });
		h(Timeline.Item, { position: 'right' }, () => 'Compound item');
		h(TimelineItem, { type: 'ongoing' }, () => 'Named item');
		const overflowItems: OverflowItem[] = [{ key: 'consumer' }];
		const overflowMode: OverflowListRenderMode = 'collapse';
		h(OverflowList, { items: overflowItems, renderMode: overflowMode });
	const backTopTarget: () => BackTopTarget = () => window;
	h(BackTop, { target: backTopTarget, visibilityHeight: 120, duration: 300 }, () => 'TOP');
	const breadcrumbMoreType: BreadcrumbMoreType = 'popover';
	h(Breadcrumb, { moreType: breadcrumbMoreType, routes: ['Home', 'Docs', 'Detail'] }, () => h(BreadcrumbItem, { href: '#consumer' }, () => 'Consumer'));
	const checkboxType: CheckboxType = 'card';
	const checkboxValue: CheckboxValue = 'semi';
	h(Checkbox, { modelValue: true, type: checkboxType, value: checkboxValue }, () => 'Semi');
	h(CheckboxGroup, { modelValue: [checkboxValue], options: ['semi', { label: 'Vue', value: 'vue' }] });
	const autoCompleteValue: AutoCompleteModelValue = 'semi';
	h(AutoComplete, { modelValue: autoCompleteValue, data: ['semi', { value: 'vue', label: 'Vue' }] });
	h(AutoCompleteOption, { value: 'semi', focused: true }, () => 'Semi');
	const breakpoint: Breakpoint = 'md';
	h(ConfigProvider, { direction: 'rtl', responsiveObserve: true, responsiveMap: defaultResponsiveMap }, () => h(ConfigConsumer));
	void breakpoint;
	h(ButtonGroup, { size: 'large' });
	h(SplitButtonGroup, { 'aria-label': 'actions' });
	const align: DividerAlign = 'left';
	h(Divider, { align, layout: 'horizontal', margin: 12 });
	const floatButtonShape: FloatButtonShape = 'square';
	h(FloatButton, { badge: { count: 8 }, shape: floatButtonShape, size: 'large' });
	h(FloatButtonGroup, { items: [{ content: 'Help', value: 'help' }] });
	const gridGutter: GridGutter = { xs: 8, md: 24 };
	h(Row, { gutter: [gridGutter, 16], type: 'flex' }, () => h(Col, { span: 8, md: { span: 6, offset: 2 } }));
	const iconSize: IconSize = 'large';
	h(Icon, { size: iconSize });
	const inputSize: InputSize = 'large';
	const inputValue: InputValue = 'consumer';
	h(Input, { modelValue: inputValue, size: inputSize, showClear: true, 'onUpdate:modelValue': (_value: InputValue) => undefined });
	h(InputGroup, { label: { text: 'Name', required: true } }, () => h(Input));
	const textareaResize: TextAreaResize = 'vertical';
	h(TextArea, { modelValue: 'consumer', resize: textareaResize, showClear: true, maxCount: 20 });
	const inputNumberValue: InputNumberValue = 12.5;
	h(InputNumber, { modelValue: inputNumberValue, precision: 1, currency: 'CNY' });
	const pinCodeFormat: PinCodeFormat = 'mixed';
	h(PinCode, { modelValue: 'A1b2', count: 4, format: pinCodeFormat, 'onUpdate:modelValue': (_value: string) => undefined });
	const radioType: RadioType = 'card';
	const radioValue: RadioValue = 'semi';
	h(Radio, { modelValue: true, type: radioType, value: radioValue }, () => 'Semi');
	h(RadioGroup, { modelValue: radioValue, options: ['semi', { label: 'Vue', value: 'vue' }] });
	const ratingSize: RatingSize = 32;
	h(Rating, { modelValue: 3.5, allowHalf: true, size: ratingSize, tooltips: ['bad', 'good'] });
	const layoutBreakpoint: LayoutBreakpoint = 'md';
	h(Layout, { hasSider: true }, () => [
	  h(LayoutSider, { breakpoint: [layoutBreakpoint] }),
	  h(LayoutContent),
	]);
	const resizeDirection: ResizeDirection = 'right';
	const resizeSize: ResizeSize = { width: 320, height: '50%' };
	h(Resizable, { defaultSize: resizeSize, beforeResizeStart: (_event, direction) => direction === resizeDirection });
	h(ResizeGroup, { direction: 'horizontal' }, () => [
	  h(ResizeItem, { defaultSize: '35%', min: '20%' }),
	  h(ResizeHandler),
	  h(ResizeItem, { defaultSize: '65%' }),
	]);
	const selectValue: SelectModelValue = ['douyin'];
	h(Select, { modelValue: selectValue, multiple: true, filter: true }, () => [
	  h(SelectOptionGroup, { label: 'Apps' }, () => [
	    h(SelectOption, { value: 'douyin' }, () => '抖音'),
	  ]),
	]);
	const sliderValue: SliderValue = [20, 60];
	h(Slider, { modelValue: sliderValue, range: true, marks: { 20: 'low', 60: 'high' } });
	const spaceAlign: SpaceAlign = 'baseline';
	const spaceSpacing: SpaceSpacingValue = [12, 'loose'];
	h(Space, { align: spaceAlign, spacing: spaceSpacing, wrap: true });
	const stepsType: StepsType = 'basic';
	const stepsStatus: StepsStatus = 'warning';
	h(Steps, { current: 1, type: stepsType }, () => [h(Step, { title: 'First' }), h(Step, { status: stepsStatus, title: 'Second' })]);
	h(Steps.Step, { title: 'Compound Step' });
	const tabType: TabType = 'card';
	const tabPosition: TabPosition = 'top';
	h(Tabs, { defaultActiveKey: 'first', type: tabType, tabPosition }, () => [
	  h(TabPane, { itemKey: 'first', tab: 'First' }, () => 'First pane'),
	  h(TabPane, { itemKey: 'second', tab: 'Second' }, () => 'Second pane'),
	]);
	h(TabItem, { itemKey: 'consumer', tab: 'Consumer', type: tabType });
	const treeData: TreeNodeData[] = [{ key: 'root', label: 'Root', value: 'root', children: [{ key: 'leaf', label: 'Leaf', value: 'leaf' }] }];
	const treeValue: TreeValue = 'leaf';
	h(Tree, { defaultExpandAll: true, modelValue: treeValue, treeData, 'onUpdate:modelValue': (_value: TreeValue | undefined) => undefined });
	const treeSelectProps: TreeSelectProps = { treeData, defaultValue: 'leaf', filterTreeNode: true };
	h(TreeSelect, treeSelectProps, { selectedItem: ({ node }: TreeSelectSelectedItemProps) => h('span', String(node.label ?? '')) });
	const switchSize: SwitchSize = 'large';
	h(Switch, { modelValue: true, size: switchSize, ariaLabel: 'consumer switch', 'onUpdate:modelValue': (_checked: boolean) => undefined });
	const tagInputSize: TagInputSize = 'large';
	h(TagInput, { modelValue: ['Semi', 'Vue'], size: tagInputSize, showClear: true, 'onUpdate:modelValue': (_value: string[]) => undefined });
	const timePickerType: TimePickerType = 'timeRange';
	const timePickerValue: TimePickerValue = ['09:00:00', '18:00:00'];
	h(TimePicker, { modelValue: timePickerValue, type: timePickerType, minuteStep: 15, 'onUpdate:modelValue': (_value: Date | Date[] | undefined) => undefined });
	const tooltipPosition: TooltipPosition = 'bottomRight';
	h(Tooltip, { content: 'consumer tooltip', position: tooltipPosition, trigger: 'custom', visible: true }, () => h('button', 'trigger'));
	const popoverPosition: PopoverPosition = 'right';
	h(Popover, { content: 'consumer popover', position: popoverPosition, showArrow: true, trigger: 'custom', visible: true }, () => h('button', 'trigger'));
	const scrollItemMode: ScrollItemMode = 'wheel';
	const scrollItemData: ScrollItemData[] = [{ value: 'AM' }, { value: 'PM', disabled: true }];
	h(ScrollList, { bodyHeight: 180, header: 'Consumer list' }, () => h(ScrollItem, { ariaLabel: 'Period', list: scrollItemData, mode: scrollItemMode, motion: false, selectedIndex: 0 }));
	h(ScrollList.Item, { list: scrollItemData, mode: 'normal' });
	const typographyType: TypographyType = 'secondary';
	const numeralRule: TypographyNumeralRule = 'bytes-binary';
	h(Typography, null, () => [
	  h(Title, { heading: 2, weight: 'semibold' }, () => 'Title'),
	  h(Text, { type: typographyType, copyable: true }, () => 'Text'),
	  h(Paragraph, { spacing: 'extended', ellipsis: { rows: 2 } }, () => 'Paragraph'),
	  h(Numeral, { rule: numeralRule, precision: 2 }, () => '1536'),
	]);
	h(IconBase, { spin: true, rotate: 45 });
	h(IconHome, { size: 'large' });
	h(IconHomeDirect, { 'aria-label': 'home' });
	h(IconAIWandLevel3, { fill: ['#111', '#222', '#333', '#444'] });
	h(IconAvatar, { size: 'extra-large' });
	h(IconAvatarDirect);
	convertIcon(() => h('svg'), 'IconConsumer');
	const illustrationProps: IllustrationProps = { 'aria-label': 'empty', width: 150 };
	h(IllustrationNoContent, illustrationProps);
	h(IllustrationNoContentDirect, { class: 'consumer-illustration' });
	convertIllustration((props) => h('svg', props), 'IllustrationConsumer');
	`,
  );
  await writeFile(
    path.join(consumerRoot, 'tsconfig.json'),
    `${JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          module: 'ESNext',
          moduleResolution: 'Bundler',
          strict: true,
          noEmit: true,
          skipLibCheck: false,
          types: [],
        },
        include: ['type-smoke.ts'],
      },
      null,
      2,
    )}\n`,
  );
  run(
    process.execPath,
    [
      path.join(workspaceRoot, 'node_modules', 'typescript', 'lib', 'tsc.js'),
      '-p',
      'tsconfig.json',
    ],
    consumerRoot,
  );

  await verifyThemeCss(path.join(consumerRoot, 'node_modules/@aifuxi/semi-theme-default/dist'));

  await verifyUiTreeshaking(consumerRoot);
  await verifyJsonViewerPackedWorker(consumerRoot);
  process.stdout.write(
    '真实 tarball 的安装、exports、ESM、类型、样式、SSR import 与 JsonViewer Worker 搜索替换均通过\n',
  );
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
