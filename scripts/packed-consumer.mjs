import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { mkdir, mkdtemp, readFile, realpath, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { publicPackages as packages } from './public-packages.mjs';
import { inspectPackedRelease } from './packed-release.mjs';

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));

function runPnpm(args, cwd) {
  const pnpmExecPath = process.env.npm_execpath;
  if (!pnpmExecPath) {
    throw new Error('真实安装包验证必须通过 pnpm script 运行，以固定包管理器版本');
  }
  return execFileSync(pnpmExecPath, args, {
    cwd,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
  }).trim();
}

/** Prepare actual public tarballs; callers own cleanup and any further validation. */
export async function preparePackedConsumer({
  isolated = process.env.PACK_ISOLATED === '1',
  packDirectory = process.env.PACK_DIR,
  verifyUiTransitives = false,
} = {}) {
  const suppliedTarballs = packDirectory ? await inspectPackedRelease(packDirectory) : undefined;
  const temporaryRoot = await mkdtemp(path.join(tmpdir(), 'semi-ui-vue-pack-'));

  try {
    const artifactsRoot = path.join(temporaryRoot, 'artifacts');
    const consumerRoot = path.join(temporaryRoot, 'consumer');
    const consumerStoreRoot = path.join(temporaryRoot, 'pnpm-store');
    await Promise.all([mkdir(artifactsRoot), mkdir(consumerRoot)]);

    const tarballs = new Map();
    for (const packageInfo of packages) {
      const packageRoot = path.join(workspaceRoot, 'packages', packageInfo.directory);
      let packResult = suppliedTarballs?.get(packageInfo.name);
      if (!packResult) {
        const packOutput = runPnpm(
          ['pack', '--json', `--pack-destination=${artifactsRoot}`],
          packageRoot,
        );
        const parsedPackOutput = JSON.parse(packOutput);
        packResult = Array.isArray(parsedPackOutput) ? parsedPackOutput[0] : parsedPackOutput;
      }

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
      for (const publicMetadataPath of ['package.json', 'README.md', 'LICENSE', 'CHANGELOG.md']) {
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
        ? JSON.parse(await readFile(path.join(workspaceRoot, 'package.json'), 'utf8'))
            .devDependencies.vue
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

    const transitiveVersions = {};
    if (verifyUiTransitives) {
      const uiOnlyRoot = path.join(temporaryRoot, 'ui-only-consumer');
      await mkdir(uiOnlyRoot);
      await writeFile(
        path.join(uiOnlyRoot, 'package.json'),
        `${JSON.stringify(
          {
            name: 'ui-only-consumer',
            private: true,
            type: 'module',
            dependencies: {
              '@aifuxi/semi-ui-vue': `file:${tarballs.get('@aifuxi/semi-ui-vue')}`,
              vue: dependencies.vue,
            },
          },
          null,
          2,
        )}\n`,
      );
      await writeFile(
        path.join(uiOnlyRoot, 'pnpm-workspace.yaml'),
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
          ...(isolated
            ? [
                '--registry=https://registry.npmjs.org/',
                '--strict-peer-dependencies',
                '--config.auto-install-peers=false',
              ]
            : [
                '--offline',
                '--strict-peer-dependencies=false',
                '--config.auto-install-peers=false',
              ]),
          `--store-dir=${consumerStoreRoot}`,
        ],
        uiOnlyRoot,
      );
      const [uiOnlyGraph] = JSON.parse(runPnpm(['list', '--json', '--depth=2'], uiOnlyRoot));
      const uiDependencies = uiOnlyGraph.dependencies?.['@aifuxi/semi-ui-vue']?.dependencies;
      for (const packageName of [
        '@aifuxi/semi-theme-default',
        '@aifuxi/semi-icons-lab-vue',
        '@aifuxi/semi-icons-vue',
        '@aifuxi/semi-illustrations-vue',
      ]) {
        const dependency = uiDependencies?.[packageName];
        if (!dependency) throw new Error(`仅安装 UI 时缺少传递依赖：${packageName}`);
        transitiveVersions[packageName] = dependency.version;
      }
    }

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

    const installedPackages = {};
    const tarballHashes = {};
    const realConsumerRoot = await realpath(consumerRoot);
    for (const packageInfo of packages) {
      const installedRoot = await realpath(
        path.join(consumerRoot, 'node_modules', ...packageInfo.name.split('/')),
      );
      if (!installedRoot.startsWith(realConsumerRoot + path.sep)) {
        throw new Error(`${packageInfo.name} 未从临时消费者的真实 tarball 安装：${installedRoot}`);
      }
      const manifest = JSON.parse(await readFile(path.join(installedRoot, 'package.json'), 'utf8'));
      const sourceManifest = JSON.parse(
        await readFile(
          path.join(workspaceRoot, 'packages', packageInfo.directory, 'package.json'),
          'utf8',
        ),
      );
      if (manifest.name !== packageInfo.name || manifest.version !== sourceManifest.version) {
        throw new Error(`${packageInfo.name} 安装产物的名称或版本与当前发布候选不一致`);
      }
      installedPackages[packageInfo.name] = installedRoot;
      tarballHashes[packageInfo.name] = createHash('sha256')
        .update(await readFile(tarballs.get(packageInfo.name)))
        .digest('hex');
    }
    return {
      consumerRoot,
      installedPackages,
      tarballHashes,
      tarballs: Object.fromEntries(tarballs),
      transitiveVersions,
      isolated,
      dispose: () => rm(temporaryRoot, { recursive: true, force: true }),
    };
  } catch (error) {
    await rm(temporaryRoot, { recursive: true, force: true });
    throw error;
  }
}
