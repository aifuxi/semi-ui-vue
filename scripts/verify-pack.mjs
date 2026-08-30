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

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const pnpmExecPath = process.env.npm_execpath;

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
  return run(process.execPath, [pnpmExecPath, ...args], cwd);
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
        'bezier-easing.txt',
        'date-fns.txt',
        'date-fns-tz.txt',
        'lodash.txt',
        'scroll-into-view-if-needed.txt',
      ].some((license) => !packedFiles.has(`dist/THIRD_PARTY_LICENSES/${license}`))
    ) {
      throw new Error('@aifuxi/semi-ui-vue 的 tarball 缺少运行时依赖许可证');
    }

    tarballs.set(packageInfo.name, path.resolve(artifactsRoot, packResult.filename));
  }

  const linkedRuntimeDependencies = Object.fromEntries(
    await Promise.all(
      [
        'async-validator',
        'bezier-easing',
        'date-fns',
        'date-fns-tz',
        'lodash',
        'scroll-into-view-if-needed',
      ].map(async (dependency) => [
        dependency,
        `link:${await realpath(path.join(workspaceRoot, 'node_modules', dependency))}`,
      ]),
    ),
  );
  const dependencies = {
    ...Object.fromEntries(
      [...tarballs].map(([packageName, tarballPath]) => [packageName, `file:${tarballPath}`]),
    ),
    vue: `link:${await realpath(path.join(workspaceRoot, 'node_modules', 'vue'))}`,
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
        ([dependency, link]) => `  ${dependency}: ${JSON.stringify(link)}`,
      ),
    ].join('\n')}\n`,
  );

  runPnpm(
    [
      'install',
      '--offline',
      '--ignore-scripts',
      '--strict-peer-dependencies=true',
      '--config.auto-install-peers=false',
      `--store-dir=${consumerStoreRoot}`,
    ],
    consumerRoot,
  );

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
    if (
      packageInfo.name === '@aifuxi/semi-ui-vue' &&
      manifest.dependencies?.['@aifuxi/semi-icons-vue'] !== manifest.version
    ) {
      throw new Error('@aifuxi/semi-ui-vue 未精确依赖同版本公开图标包');
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
      for (const [dependency, licenseFile] of [
        ['async-validator', 'LICENSE.md'],
        ['bezier-easing', 'LICENSE'],
        ['date-fns', 'LICENSE.md'],
        ['date-fns-tz', 'LICENSE.md'],
        ['lodash', 'LICENSE'],
        ['scroll-into-view-if-needed', 'LICENSE'],
      ]) {
        const installedLicense = await readFile(
          path.join(installedRoot, 'dist', 'THIRD_PARTY_LICENSES', `${dependency}.txt`),
          'utf8',
        );
        const sourceLicense = await readFile(
          path.join(workspaceRoot, 'node_modules', dependency, licenseFile),
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
    ].sort();
    const actualSbomPackageNames = (sbom.packages ?? []).map(({ name }) => name).sort();
    const expectedSbomVersions = {
      [manifest.name]: manifest.version,
      ...manifest.dependencies,
      ...manifest.optionalDependencies,
      ...manifest.peerDependencies,
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
		await import('@aifuxi/semi-ui-vue/anchor');
		await import('@aifuxi/semi-ui-vue/avatar');
		await import('@aifuxi/semi-ui-vue/badge');
		await import('@aifuxi/semi-ui-vue/banner');
		await import('@aifuxi/semi-ui-vue/notification');
		await import('@aifuxi/semi-ui-vue/calendar');
		await import('@aifuxi/semi-ui-vue/card');
		await import('@aifuxi/semi-ui-vue/carousel');
		await import('@aifuxi/semi-ui-vue/cascader');
		await import('@aifuxi/semi-ui-vue/color-picker');
		await import('@aifuxi/semi-ui-vue/date-picker');
		await import('@aifuxi/semi-ui-vue/form');
		await import('@aifuxi/semi-ui-vue/collapse');
		await import('@aifuxi/semi-ui-vue/collapsible');
		await import('@aifuxi/semi-ui-vue/cropper');
		await import('@aifuxi/semi-ui-vue/descriptions');
		await import('@aifuxi/semi-ui-vue/dropdown');
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

  await writeFile(
    path.join(consumerRoot, 'type-smoke.ts'),
    `${javascriptPackages.map((packageName) => `import '${packageName}';`).join('\n')}
	import { AutoComplete, AutoCompleteOption, type AutoCompleteModelValue } from '@aifuxi/semi-ui-vue/auto-complete';
		import { Anchor, AnchorLink, type AnchorPosition } from '@aifuxi/semi-ui-vue/anchor';
		import { Avatar, AvatarGroup, type AvatarColor, type AvatarSize } from '@aifuxi/semi-ui-vue/avatar';
		import { Badge, type BadgePosition, type BadgeType } from '@aifuxi/semi-ui-vue/badge';
		import { Banner, type BannerType } from '@aifuxi/semi-ui-vue/banner';
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
		import { Collapsible, type CollapsibleProps } from '@aifuxi/semi-ui-vue/collapsible';
		import { Cropper, type CropperMethods, type CropperShape } from '@aifuxi/semi-ui-vue/cropper';
		import { Descriptions, DescriptionsItem, type DescriptionsDataItem, type DescriptionsLayout } from '@aifuxi/semi-ui-vue/descriptions';
		import { Dropdown, DropdownItem, DropdownMenu, type DropdownItemType, type DropdownMenuItem } from '@aifuxi/semi-ui-vue/dropdown';
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

  const installedTheme = path.join(
    consumerRoot,
    'node_modules',
    '@aifuxi',
    'semi-theme-default',
    'dist',
    'index.css',
  );
  const themeCss = await readFile(installedTheme, 'utf8');
  if (!themeCss.includes('.semi-anchor')) {
    throw new Error('安装后的默认主题缺少 Anchor 样式');
  }
  if (!themeCss.includes('.semi-avatar') || !themeCss.includes('.semi-avatar-group')) {
    throw new Error('安装后的默认主题缺少 Avatar 或 AvatarGroup 样式');
  }
  if (!themeCss.includes('.semi-badge-count') || !themeCss.includes('.semi-badge-dot')) {
    throw new Error('安装后的默认主题缺少 Badge 样式');
  }
  if (!themeCss.includes('.semi-calendar-week') || !themeCss.includes('.semi-calendar-month')) {
    throw new Error('安装后的默认主题缺少 Calendar 样式');
  }
  if (!themeCss.includes('.semi-card') || !themeCss.includes('.semi-card-group-grid')) {
    throw new Error('安装后的默认主题缺少 Card 或 CardGroup 样式');
  }
  if (!themeCss.includes('.semi-carousel') || !themeCss.includes('.semi-carousel-indicator')) {
    throw new Error('安装后的默认主题缺少 Carousel 样式');
  }
  if (!themeCss.includes('.semi-collapsible-transition')) {
    throw new Error('安装后的默认主题缺少 Collapsible 样式');
  }
  if (!themeCss.includes('.semi-collapse-item') || !themeCss.includes('.semi-collapse-header')) {
    throw new Error('安装后的默认主题缺少 Collapse 样式');
  }
  if (!themeCss.includes('.semi-progress-track-inner')) {
    throw new Error('安装后的默认主题缺少 Progress 样式');
  }
  if (!themeCss.includes('.semi-skeleton-active')) {
    throw new Error('安装后的默认主题缺少 Skeleton 样式');
  }
  if (!themeCss.includes('.semi-spin-wrapper') || !themeCss.includes('.semi-spin-hidden')) {
    throw new Error('安装后的默认主题缺少 Spin 样式');
  }
  if (
    !themeCss.includes('.semi-transfer-left') ||
    !themeCss.includes('.semi-transfer-right-item')
  ) {
    throw new Error('安装后的默认主题缺少 Transfer 样式');
  }
  if (
    !themeCss.includes('.semi-upload-file-card') ||
    !themeCss.includes('.semi-upload-picture-add')
  ) {
    throw new Error('安装后的默认主题缺少 Upload 样式');
  }
  if (
    !themeCss.includes('.semi-navigation-item') ||
    !themeCss.includes('.semi-navigation-sub-title')
  ) {
    throw new Error('安装后的默认主题缺少 Navigation 样式');
  }
  if (!themeCss.includes('.semi-tree-select') || !themeCss.includes('.semi-tree-select-popover')) {
    throw new Error('安装后的默认主题缺少 TreeSelect 样式');
  }
  if (!themeCss.includes('.semi-cascader') || !themeCss.includes('.semi-cascader-popover')) {
    throw new Error('安装后的默认主题缺少 Cascader 样式');
  }
  if (!themeCss.includes('.semi-colorPicker') || !themeCss.includes('.semi-colorPicker-popover')) {
    throw new Error('安装后的默认主题缺少 ColorPicker 样式');
  }
  if (!themeCss.includes('.semi-datepicker') || !themeCss.includes('.semi-datepicker-month')) {
    throw new Error('安装后的默认主题缺少 DatePicker 样式');
  }
  if (!themeCss.includes('.semi-form-field') || !themeCss.includes('.semi-form-horizontal')) {
    throw new Error('安装后的默认主题缺少 Form 样式');
  }
  if (!themeCss.includes('.semi-cropper-box-corner')) {
    throw new Error('安装后的默认主题缺少 Cropper 样式');
  }
  if (!themeCss.includes('.semi-descriptions-horizontal')) {
    throw new Error('安装后的默认主题缺少 Descriptions 样式');
  }
  if (!themeCss.includes('.semi-dropdown-wrapper')) {
    throw new Error('安装后的默认主题缺少 Dropdown 样式');
  }
  if (!themeCss.includes('.semi-empty-vertical')) {
    throw new Error('安装后的默认主题缺少 Empty 样式');
  }
  if (!themeCss.includes('.semi-highlight-tag')) {
    throw new Error('安装后的默认主题缺少 Highlight 样式');
  }
  if (!themeCss.includes('.semi-image-preview')) {
    throw new Error('安装后的默认主题缺少 Image 样式');
  }
  if (!themeCss.includes('.semi-list-item')) {
    throw new Error('安装后的默认主题缺少 List 样式');
  }
  if (!themeCss.includes('.semi-modal-content')) {
    throw new Error('安装后的默认主题缺少 Modal 样式');
  }
  if (!themeCss.includes('.semi-overflow-list-scroll-wrapper')) {
    throw new Error('安装后的默认主题缺少 OverflowList 样式');
  }
  if (!themeCss.includes('.semi-popover-wrapper')) {
    throw new Error('安装后的默认主题缺少 Popover 样式');
  }
  if (!themeCss.includes('.semi-backtop')) {
    throw new Error('安装后的默认主题缺少 BackTop 样式');
  }
  if (!themeCss.includes('.semi-breadcrumb')) {
    throw new Error('安装后的默认主题缺少 Breadcrumb 样式');
  }
  if (!themeCss.includes('.semi-button')) {
    throw new Error('安装后的默认主题缺少组件样式');
  }
  if (!themeCss.includes('.semi-divider')) {
    throw new Error('安装后的默认主题缺少 Divider 样式');
  }
  if (!themeCss.includes('.semi-checkbox') || !themeCss.includes('.semi-checkboxGroup')) {
    throw new Error('安装后的默认主题缺少 Checkbox 或 CheckboxGroup 样式');
  }
  if (
    !themeCss.includes('.semi-autocomplete') ||
    !themeCss.includes('.semi-autocomplete-option-list')
  ) {
    throw new Error('安装后的默认主题缺少 AutoComplete 样式');
  }
  if (!themeCss.includes('.semi-icon')) {
    throw new Error('安装后的默认主题缺少 Icon 样式');
  }
  if (
    !themeCss.includes('.semi-input-wrapper') ||
    !themeCss.includes('.semi-input-textarea-wrapper') ||
    !themeCss.includes('.semi-input-group')
  ) {
    throw new Error('安装后的默认主题缺少 Input、TextArea 或 InputGroup 样式');
  }
  if (!themeCss.includes('.semi-pincode-wrapper')) {
    throw new Error('安装后的默认主题缺少 PinCode 样式');
  }
  if (!themeCss.includes('.semi-radio') || !themeCss.includes('.semi-radioGroup')) {
    throw new Error('安装后的默认主题缺少 Radio 或 RadioGroup 样式');
  }
  if (!themeCss.includes('.semi-rating')) {
    throw new Error('安装后的默认主题缺少 Rating 样式');
  }
  if (!themeCss.includes('.semi-space')) {
    throw new Error('安装后的默认主题缺少 Space 样式');
  }
  if (!themeCss.includes('.semi-layout')) {
    throw new Error('安装后的默认主题缺少 Layout 样式');
  }
  if (!themeCss.includes('.semi-floatButton')) {
    throw new Error('安装后的默认主题缺少 FloatButton 样式');
  }
  if (!themeCss.includes('.semi-row') || !themeCss.includes('.semi-col-24')) {
    throw new Error('安装后的默认主题缺少 Grid 样式');
  }
  if (!themeCss.includes('.semi-resizable-resizable')) {
    throw new Error('安装后的默认主题缺少 Resizable 样式');
  }
  if (!themeCss.includes('.semi-select') || !themeCss.includes('.semi-select-option-list')) {
    throw new Error('安装后的默认主题缺少 Select 样式');
  }
  if (!themeCss.includes('.semi-slider')) {
    throw new Error('安装后的默认主题缺少 Slider 样式');
  }
  if (!themeCss.includes('.semi-typography')) {
    throw new Error('安装后的默认主题缺少 Typography 样式');
  }
  if (!themeCss.includes('.semi-switch')) {
    throw new Error('安装后的默认主题缺少 Switch 样式');
  }
  if (!themeCss.includes('.semi-tagInput')) {
    throw new Error('安装后的默认主题缺少 TagInput 样式');
  }
  if (!themeCss.includes('.semi-timepicker')) {
    throw new Error('安装后的默认主题缺少 TimePicker 样式');
  }
  if (!themeCss.includes('.semi-tooltip-wrapper')) {
    throw new Error('安装后的默认主题缺少 Tooltip 样式');
  }
  const buttonThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'button.css'),
    'utf8',
  );
  const anchorThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'anchor.css'),
    'utf8',
  );
  const backTopThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'back-top.css',
    ),
    'utf8',
  );
  const breadcrumbThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'breadcrumb.css',
    ),
    'utf8',
  );
  if (
    !anchorThemeCss.includes('.semi-anchor-link-title-active') ||
    !anchorThemeCss.includes('.semi-anchor-link-tooltip') ||
    !anchorThemeCss.includes('.semi-rtl .semi-anchor') ||
    !anchorThemeCss.includes('.semi-tooltip-wrapper')
  ) {
    throw new Error('安装后的 Anchor 逐组件样式缺少 active、Tooltip 或 RTL 样式');
  }
  if (
    !backTopThemeCss.includes('.semi-backtop') ||
    !backTopThemeCss.includes('.semi-rtl .semi-backtop') ||
    !backTopThemeCss.includes('.semi-button-with-icon-only')
  ) {
    throw new Error('安装后的 BackTop 逐组件样式缺少默认按钮或 RTL 样式');
  }
  if (
    !breadcrumbThemeCss.includes('.semi-breadcrumb-collapse') ||
    !breadcrumbThemeCss.includes('.semi-breadcrumb-item-active') ||
    !breadcrumbThemeCss.includes('.semi-popover-wrapper') ||
    !breadcrumbThemeCss.includes('.semi-rtl .semi-breadcrumb-wrapper')
  ) {
    throw new Error('安装后的 Breadcrumb 逐组件样式缺少折叠、Popover、active 或 RTL 样式');
  }
  if (!buttonThemeCss.includes('.semi-button-split')) {
    throw new Error('安装后的 Button 逐组件样式缺少 SplitButtonGroup 样式');
  }
  const checkboxThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'checkbox.css',
    ),
    'utf8',
  );
  if (
    !checkboxThemeCss.includes('.semi-checkbox-indeterminate') ||
    !checkboxThemeCss.includes('.semi-checkbox-cardType_checked') ||
    !checkboxThemeCss.includes('.semi-checkboxGroup-horizontal') ||
    !checkboxThemeCss.includes('.semi-icon-default')
  ) {
    throw new Error('安装后的 Checkbox 逐组件样式缺少 Group、卡片、部分选中或 Icon 样式');
  }
  const autoCompleteThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'auto-complete.css',
    ),
    'utf8',
  );
  if (
    !autoCompleteThemeCss.includes('.semi-autocomplete-option-focused') ||
    !autoCompleteThemeCss.includes('.semi-input-wrapper') ||
    !autoCompleteThemeCss.includes('.semi-popover-wrapper') ||
    !autoCompleteThemeCss.includes('.semi-spin-wrapper')
  ) {
    throw new Error('安装后的 AutoComplete 逐组件样式缺少候选项、Input、Popover 或 Spin 样式');
  }
  const configProviderThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'config-provider.css',
    ),
    'utf8',
  );
  if (!configProviderThemeCss.includes('--semi-color-primary')) {
    throw new Error('安装后的 ConfigProvider 逐组件样式缺少默认主题 Token');
  }
  const dividerThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'divider.css'),
    'utf8',
  );
  if (!dividerThemeCss.includes('.semi-divider-with-text')) {
    throw new Error('安装后的 Divider 逐组件样式缺少内容分割线样式');
  }
  const floatButtonThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'float-button.css',
    ),
    'utf8',
  );
  if (
    !floatButtonThemeCss.includes('.semi-floatButtonGroup-item') ||
    !floatButtonThemeCss.includes('.semi-badge-count')
  ) {
    throw new Error('安装后的 FloatButton 逐组件样式缺少 Group 或 Badge 样式');
  }
  const gridThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'grid.css'),
    'utf8',
  );
  if (!gridThemeCss.includes('.semi-row-flex') || !gridThemeCss.includes('.semi-col-lg-24')) {
    throw new Error('安装后的 Grid 逐组件样式缺少 Flex 或响应式栅格样式');
  }
  const iconThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'icon.css'),
    'utf8',
  );
  if (
    !iconThemeCss.includes('.semi-icon-extra-large') ||
    !iconThemeCss.includes('.semi-icon-spinning')
  ) {
    throw new Error('安装后的 Icon 逐组件样式缺少尺寸或旋转样式');
  }
  const inputThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'input.css'),
    'utf8',
  );
  if (
    !inputThemeCss.includes('.semi-input-clearbtn') ||
    !inputThemeCss.includes('.semi-input-modebtn') ||
    !inputThemeCss.includes('.semi-input-textarea-counter') ||
    !inputThemeCss.includes('.semi-input-textarea-lineNumber') ||
    !inputThemeCss.includes('.semi-input-group') ||
    !inputThemeCss.includes('.semi-form-field-label') ||
    !inputThemeCss.includes('.semi-icon-default')
  ) {
    throw new Error(
      '安装后的 Input 逐组件样式缺少清除、密码、计数、行号、Group、Label 或 Icon 样式',
    );
  }
  const inputNumberThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'input-number.css',
    ),
    'utf8',
  );
  if (
    !inputNumberThemeCss.includes('.semi-input-number-suffix-btns') ||
    !inputNumberThemeCss.includes('.semi-input-number-button-up') ||
    !inputNumberThemeCss.includes('.semi-rtl .semi-input-number')
  ) {
    throw new Error('安装后的 InputNumber 逐组件样式缺少步进器或 RTL 样式');
  }
  const pinCodeThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'pin-code.css',
    ),
    'utf8',
  );
  if (
    !pinCodeThemeCss.includes('.semi-pincode-wrapper') ||
    !pinCodeThemeCss.includes('.semi-input-wrapper-small') ||
    !pinCodeThemeCss.includes('.semi-input-wrapper-large')
  ) {
    throw new Error('安装后的 PinCode 逐组件样式缺少根、尺寸或 Input 样式');
  }
  const radioThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'radio.css'),
    'utf8',
  );
  if (
    !radioThemeCss.includes('.semi-radio-buttonRadioGroup-large') ||
    !radioThemeCss.includes('.semi-radio-cardRadioGroup_checked') ||
    !radioThemeCss.includes('.semi-radioGroup-horizontal') ||
    !radioThemeCss.includes('.semi-rtl .semi-radio') ||
    !radioThemeCss.includes('.semi-icon-default')
  ) {
    throw new Error('安装后的 Radio 逐组件样式缺少 Group、按钮、卡片、RTL 或 Icon 样式');
  }
  const ratingThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'rating.css'),
    'utf8',
  );
  if (
    !ratingThemeCss.includes('.semi-rating-star-half') ||
    !ratingThemeCss.includes('.semi-rating-star-small') ||
    !ratingThemeCss.includes('.semi-rtl .semi-rating') ||
    !ratingThemeCss.includes('.semi-icon-extra-large')
  ) {
    throw new Error('安装后的 Rating 逐组件样式缺少半星、尺寸、RTL 或 Icon 样式');
  }
  const sliderThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'slider.css'),
    'utf8',
  );
  if (
    !sliderThemeCss.includes('.semi-slider-handle-clicked') ||
    !sliderThemeCss.includes('.semi-slider-vertical-wrapper') ||
    !sliderThemeCss.includes('.semi-rtl .semi-slider') ||
    !sliderThemeCss.includes('.semi-tooltip-wrapper')
  ) {
    throw new Error('安装后的 Slider 逐组件样式缺少拖拽、纵向、RTL 或 Tooltip 样式');
  }
  const layoutThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'layout.css'),
    'utf8',
  );
  if (
    !layoutThemeCss.includes('.semi-layout-has-sider') ||
    !layoutThemeCss.includes('.semi-layout-sider-children')
  ) {
    throw new Error('安装后的 Layout 逐组件样式缺少 Sider 布局样式');
  }
  const resizableThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'resizable.css',
    ),
    'utf8',
  );
  if (
    !resizableThemeCss.includes('.semi-resizable-resizableHandler-topRight') ||
    !resizableThemeCss.includes('.semi-resizable-handler-horizontal') ||
    !resizableThemeCss.includes('.semi-icon-default')
  ) {
    throw new Error('安装后的 Resizable 逐组件样式缺少单体、Group 或默认手柄样式');
  }
  const selectThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'select.css'),
    'utf8',
  );
  if (
    !selectThemeCss.includes('.semi-select-option-selected') ||
    !selectThemeCss.includes('.semi-input-wrapper') ||
    !selectThemeCss.includes('.semi-tag') ||
    !selectThemeCss.includes('.semi-popover-wrapper')
  ) {
    throw new Error('安装后的 Select 逐组件样式缺少选项、Input、Tag 或 Popover 样式');
  }
  const spaceThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'space.css'),
    'utf8',
  );
  if (
    !spaceThemeCss.includes('.semi-space-wrap') ||
    !spaceThemeCss.includes('.semi-space-tight-horizontal')
  ) {
    throw new Error('安装后的 Space 逐组件样式缺少换行或预设间距样式');
  }
  const stepsThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'steps.css'),
    'utf8',
  );
  if (
    !stepsThemeCss.includes('.semi-steps-item-process') ||
    !stepsThemeCss.includes('.semi-steps-basic') ||
    !stepsThemeCss.includes('.semi-steps-nav') ||
    !stepsThemeCss.includes('.semi-rtl .semi-steps') ||
    !stepsThemeCss.includes('.semi-icon-default')
  ) {
    throw new Error('安装后的 Steps 逐组件样式缺少状态、类型、RTL 或 Icon 样式');
  }
  const tabsThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'tabs.css'),
    'utf8',
  );
  if (
    !tabsThemeCss.includes('.semi-tabs-bar-card') ||
    !tabsThemeCss.includes('.semi-tabs-bar-overflow-list') ||
    !tabsThemeCss.includes('.semi-dropdown-menu') ||
    !tabsThemeCss.includes('.semi-rtl .semi-tabs') ||
    !tabsThemeCss.includes('.semi-icon-default')
  ) {
    throw new Error('安装后的 Tabs 逐组件样式缺少类型、折叠、Dropdown、RTL 或 Icon 样式');
  }
  const treeThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'tree.css'),
    'utf8',
  );
  if (
    !treeThemeCss.includes('.semi-tree-option-selected') ||
    !treeThemeCss.includes('.semi-tree-option-indent-show-line') ||
    !treeThemeCss.includes('.semi-checkbox') ||
    !treeThemeCss.includes('.semi-input-wrapper') ||
    !treeThemeCss.includes('.semi-rtl .semi-tree')
  ) {
    throw new Error('安装后的 Tree 逐组件样式缺少节点、连接线、依赖或 RTL 样式');
  }
  const treeSelectThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'tree-select.css',
    ),
    'utf8',
  );
  if (
    !treeSelectThemeCss.includes('.semi-tree-select-selection') ||
    !treeSelectThemeCss.includes('.semi-tree-select-popover') ||
    !treeSelectThemeCss.includes('.semi-tree-search-wrapper') ||
    !treeSelectThemeCss.includes('.semi-rtl .semi-tree-select')
  ) {
    throw new Error('安装后的 TreeSelect 逐组件样式缺少触发器、浮层、搜索或 RTL 样式');
  }
  const cascaderThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'cascader.css',
    ),
    'utf8',
  );
  if (
    !cascaderThemeCss.includes('.semi-cascader-selection') ||
    !cascaderThemeCss.includes('.semi-cascader-popover') ||
    !cascaderThemeCss.includes('.semi-cascader-option-list') ||
    !cascaderThemeCss.includes('.semi-rtl .semi-cascader')
  ) {
    throw new Error('安装后的 Cascader 逐组件样式缺少触发器、浮层、选项或 RTL 样式');
  }
  const colorPickerThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'color-picker.css',
    ),
    'utf8',
  );
  if (
    !colorPickerThemeCss.includes('.semi-colorPicker-colorChooseArea') ||
    !colorPickerThemeCss.includes('.semi-colorPicker-colorSlider') ||
    !colorPickerThemeCss.includes('.semi-colorPicker-alphaSlider') ||
    !colorPickerThemeCss.includes('.semi-colorPicker-dataPart') ||
    !colorPickerThemeCss.includes('.semi-colorPicker-popover')
  ) {
    throw new Error('安装后的 ColorPicker 逐组件样式缺少选色区、滑条、数据区或浮层样式');
  }
  const datePickerThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'date-picker.css',
    ),
    'utf8',
  );
  if (
    !datePickerThemeCss.includes('.semi-datepicker-navigation') ||
    !datePickerThemeCss.includes('.semi-datepicker-month') ||
    !datePickerThemeCss.includes('.semi-datepicker-day-selected') ||
    !datePickerThemeCss.includes('.semi-datepicker-footer')
  ) {
    throw new Error('安装后的 DatePicker 逐组件样式缺少导航、月份、选中态或页脚样式');
  }
  const formThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'form.css'),
    'utf8',
  );
  if (
    !formThemeCss.includes('.semi-form-vertical') ||
    !formThemeCss.includes('.semi-form-horizontal') ||
    !formThemeCss.includes('.semi-form-field-error-message') ||
    !formThemeCss.includes('.semi-rtl .semi-form')
  ) {
    throw new Error('安装后的 Form 逐组件样式缺少布局、错误或 RTL 样式');
  }
  const avatarThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'avatar.css'),
    'utf8',
  );
  if (
    !avatarThemeCss.includes('.semi-avatar-group') ||
    !avatarThemeCss.includes('.semi-avatar-additionalBorder') ||
    !avatarThemeCss.includes('.semi-avatar-top_slot') ||
    !avatarThemeCss.includes('.semi-rtl .semi-avatar')
  ) {
    throw new Error('安装后的 Avatar 逐组件样式缺少 Group、装饰、边框或 RTL 样式');
  }
  const badgeThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'badge.css'),
    'utf8',
  );
  if (
    !badgeThemeCss.includes('.semi-badge-count') ||
    !badgeThemeCss.includes('.semi-badge-custom') ||
    !badgeThemeCss.includes('.semi-badge-success') ||
    !badgeThemeCss.includes('.semi-rtl .semi-badge')
  ) {
    throw new Error('安装后的 Badge 逐组件样式缺少计数、自定义、类型或 RTL 样式');
  }
  const bannerThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'banner.css'),
    'utf8',
  );
  if (
    !bannerThemeCss.includes('.semi-banner-info') ||
    !bannerThemeCss.includes('.semi-banner-in-container') ||
    !bannerThemeCss.includes('.semi-banner-close') ||
    !bannerThemeCss.includes('.semi-rtl .semi-banner')
  ) {
    throw new Error('安装后的 Banner 逐组件样式缺少类型、容器、关闭按钮或 RTL 样式');
  }
  const notificationThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'notification.css',
    ),
    'utf8',
  );
  if (
    !notificationThemeCss.includes('.semi-notification-wrapper') ||
    !notificationThemeCss.includes('.semi-notification-notice-info') ||
    !notificationThemeCss.includes('.semi-notification-notice-icon-close') ||
    !notificationThemeCss.includes('.semi-notification-notice-rtl')
  ) {
    throw new Error('安装后的 Notification 逐组件样式缺少 wrapper、类型、关闭按钮或 RTL 样式');
  }
  const toastThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'toast.css'),
    'utf8',
  );
  if (
    !toastThemeCss.includes('.semi-toast-wrapper') ||
    !toastThemeCss.includes('.semi-toast-content') ||
    !toastThemeCss.includes('.semi-toast-close-button') ||
    !toastThemeCss.includes('.semi-toast-rtl')
  ) {
    throw new Error('安装后的 Toast 逐组件样式缺少 wrapper、内容、关闭按钮或 RTL 样式');
  }
  const popconfirmThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'popconfirm.css',
    ),
    'utf8',
  );
  if (
    !popconfirmThemeCss.includes('.semi-popconfirm-inner') ||
    !popconfirmThemeCss.includes('.semi-popconfirm-header-title') ||
    !popconfirmThemeCss.includes('.semi-popconfirm-footer') ||
    !popconfirmThemeCss.includes('.semi-popconfirm-popover') ||
    !popconfirmThemeCss.includes('.semi-popconfirm-rtl')
  ) {
    throw new Error('安装后的 Popconfirm 逐组件样式缺少卡片、按钮、Popover 或 RTL 样式');
  }
  const progressThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'progress.css',
    ),
    'utf8',
  );
  if (
    !progressThemeCss.includes('.semi-progress-track-inner') ||
    !progressThemeCss.includes('.semi-progress-circle-ring-inner') ||
    !progressThemeCss.includes('.semi-rtl .semi-progress')
  ) {
    throw new Error('安装后的 Progress 逐组件样式缺少线形、环形或 RTL 样式');
  }
  const skeletonThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'skeleton.css',
    ),
    'utf8',
  );
  if (
    !skeletonThemeCss.includes('.semi-skeleton-avatar-medium') ||
    !skeletonThemeCss.includes('.semi-skeleton-paragraph') ||
    !skeletonThemeCss.includes('.semi-skeleton-active') ||
    !skeletonThemeCss.includes('.semi-rtl .semi-skeleton')
  ) {
    throw new Error('安装后的 Skeleton 逐组件样式缺少占位项、动画或 RTL 样式');
  }
  const spinThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'spin.css'),
    'utf8',
  );
  if (
    !spinThemeCss.includes('.semi-spin-wrapper') ||
    !spinThemeCss.includes('.semi-spin-animate') ||
    !spinThemeCss.includes('.semi-spin-hidden') ||
    !spinThemeCss.includes('.semi-rtl .semi-spin')
  ) {
    throw new Error('安装后的 Spin 逐组件样式缺少默认、自定义、hidden 或 RTL 样式');
  }
  const transferThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'transfer.css',
    ),
    'utf8',
  );
  if (
    !transferThemeCss.includes('.semi-transfer-left') ||
    !transferThemeCss.includes('.semi-transfer-filter') ||
    !transferThemeCss.includes('.semi-transfer-right-item') ||
    !transferThemeCss.includes('.semi-rtl .semi-transfer')
  ) {
    throw new Error('安装后的 Transfer 逐组件样式缺少双面板、搜索、条目或 RTL 样式');
  }
  const uploadThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'upload.css'),
    'utf8',
  );
  if (
    !uploadThemeCss.includes('.semi-upload-file-card') ||
    !uploadThemeCss.includes('.semi-upload-file-card-fail') ||
    !uploadThemeCss.includes('.semi-upload-picture-file-card') ||
    !uploadThemeCss.includes('.semi-upload-picture-add') ||
    !uploadThemeCss.includes('.semi-rtl .semi-upload')
  ) {
    throw new Error('安装后的 Upload 逐组件样式缺少列表、失败、图片墙或 RTL 样式');
  }
  const navigationThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'navigation.css',
    ),
    'utf8',
  );
  if (
    !navigationThemeCss.includes('.semi-navigation-item-selected') ||
    !navigationThemeCss.includes('.semi-navigation-sub-title') ||
    !navigationThemeCss.includes('.semi-navigation-collapse-btn') ||
    !navigationThemeCss.includes('.semi-dropdown-wrapper') ||
    !navigationThemeCss.includes('.semi-rtl .semi-navigation')
  ) {
    throw new Error('安装后的 Navigation 逐组件样式缺少状态、依赖或 RTL 样式');
  }
  const calendarThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'calendar.css',
    ),
    'utf8',
  );
  if (
    !calendarThemeCss.includes('.semi-calendar-day') ||
    !calendarThemeCss.includes('.semi-calendar-week') ||
    !calendarThemeCss.includes('.semi-calendar-month-event-card') ||
    !calendarThemeCss.includes('.semi-popover') ||
    !calendarThemeCss.includes('.semi-rtl .semi-calendar')
  ) {
    throw new Error('安装后的 Calendar 逐组件样式缺少日周月、浮层或 RTL 样式');
  }
  const cardThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'card.css'),
    'utf8',
  );
  if (
    !cardThemeCss.includes('.semi-card-body-actions') ||
    !cardThemeCss.includes('.semi-card-meta-wrapper-description') ||
    !cardThemeCss.includes('.semi-card-group-grid') ||
    !cardThemeCss.includes('.semi-skeleton-active') ||
    !cardThemeCss.includes('.semi-rtl .semi-card')
  ) {
    throw new Error('安装后的 Card 逐组件样式缺少 actions、Meta、Group、loading 或 RTL 样式');
  }
  const carouselThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'carousel.css',
    ),
    'utf8',
  );
  if (
    !carouselThemeCss.includes('.semi-carousel-content-slide') ||
    !carouselThemeCss.includes('.semi-carousel-indicator-columnar') ||
    !carouselThemeCss.includes('.semi-carousel-arrow-prev') ||
    !carouselThemeCss.includes('.semi-rtl .semi-carousel') ||
    !carouselThemeCss.includes('.semi-icon')
  ) {
    throw new Error('安装后的 Carousel 逐组件样式缺少动效、指示器、箭头、RTL 或 Icon 样式');
  }
  const collapsibleThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'collapsible.css',
    ),
    'utf8',
  );
  if (
    !collapsibleThemeCss.includes('.semi-collapsible-transition') ||
    !collapsibleThemeCss.includes('transition: height') ||
    !collapsibleThemeCss.includes('opacity')
  ) {
    throw new Error('安装后的 Collapsible 逐组件样式缺少高度或透明度过渡');
  }
  const collapseThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'collapse.css',
    ),
    'utf8',
  );
  if (
    !collapseThemeCss.includes('.semi-collapse-item') ||
    !collapseThemeCss.includes('.semi-collapse-header-disabled') ||
    !collapseThemeCss.includes('.semi-collapse-header-iconLeft') ||
    !collapseThemeCss.includes('.semi-collapsible-transition') ||
    !collapseThemeCss.includes('.semi-rtl .semi-collapse')
  ) {
    throw new Error('安装后的 Collapse 逐组件样式缺少状态、依赖或 RTL 样式');
  }
  const descriptionsThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'descriptions.css',
    ),
    'utf8',
  );
  if (
    !descriptionsThemeCss.includes('.semi-descriptions-horizontal') ||
    !descriptionsThemeCss.includes('.semi-descriptions-double-large') ||
    !descriptionsThemeCss.includes('.semi-rtl .semi-descriptions')
  ) {
    throw new Error('安装后的 Descriptions 逐组件样式缺少横向、双行或 RTL 样式');
  }
  const dropdownThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'dropdown.css',
    ),
    'utf8',
  );
  if (
    !dropdownThemeCss.includes('.semi-dropdown-wrapper') ||
    !dropdownThemeCss.includes('.semi-dropdown-item-disabled') ||
    !dropdownThemeCss.includes('.semi-rtl .semi-dropdown') ||
    !dropdownThemeCss.includes('.semi-portal-inner')
  ) {
    throw new Error('安装后的 Dropdown 逐组件样式缺少 Portal、Item 或 RTL 样式');
  }
  const emptyThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'empty.css'),
    'utf8',
  );
  if (
    !emptyThemeCss.includes('.semi-empty-vertical') ||
    !emptyThemeCss.includes('.semi-empty-title.semi-typography') ||
    !emptyThemeCss.includes('.semi-rtl .semi-empty')
  ) {
    throw new Error('安装后的 Empty 逐组件样式缺少布局、Typography 或 RTL 样式');
  }
  const highlightThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'highlight.css',
    ),
    'utf8',
  );
  if (
    !highlightThemeCss.includes('.semi-highlight-tag') ||
    !highlightThemeCss.includes('var(--semi-color-highlight)') ||
    !highlightThemeCss.includes('var(--semi-color-highlight-bg)')
  ) {
    throw new Error('安装后的 Highlight 逐组件样式缺少标签或颜色 Token');
  }
  const imageThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'image.css'),
    'utf8',
  );
  if (
    !imageThemeCss.includes('.semi-image-preview') ||
    !imageThemeCss.includes('.semi-skeleton-image') ||
    !imageThemeCss.includes('.semi-spin-wrapper') ||
    !imageThemeCss.includes('.semi-slider') ||
    !imageThemeCss.includes('.semi-tooltip-wrapper') ||
    !imageThemeCss.includes('.semi-rtl .semi-image-preview')
  ) {
    throw new Error('安装后的 Image 逐组件样式缺少预览、加载、菜单或 RTL 依赖');
  }
  const cropperThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'cropper.css'),
    'utf8',
  );
  if (
    !cropperThemeCss.includes('.semi-cropper-mask') ||
    !cropperThemeCss.includes('.semi-cropper-box-corner') ||
    !cropperThemeCss.includes('.semi-cropper-view-box-round')
  ) {
    throw new Error('安装后的 Cropper 逐组件样式缺少遮罩、调整块或圆形裁切样式');
  }
  const listThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'list.css'),
    'utf8',
  );
  if (
    !listThemeCss.includes('.semi-list-item-body') ||
    !listThemeCss.includes('.semi-row-flex') ||
    !listThemeCss.includes('.semi-spin-wrapper') ||
    !listThemeCss.includes('.semi-rtl .semi-list')
  ) {
    throw new Error('安装后的 List 逐组件样式缺少 Item、Grid、loading 或 RTL 依赖');
  }
  const modalThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'modal.css'),
    'utf8',
  );
  if (
    !modalThemeCss.includes('.semi-modal-content') ||
    !modalThemeCss.includes('.semi-modal-mask') ||
    !modalThemeCss.includes('.semi-modal-confirm') ||
    !modalThemeCss.includes('.semi-portal') ||
    !modalThemeCss.includes('.semi-modal-rtl')
  ) {
    throw new Error('安装后的 Modal 逐组件样式缺少内容、遮罩、confirm、Portal 或 RTL 依赖');
  }
  const overflowListThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'overflow-list.css',
    ),
    'utf8',
  );
  if (
    !overflowListThemeCss.includes('.semi-overflow-list') ||
    !overflowListThemeCss.includes('.semi-overflow-list-scroll-wrapper') ||
    !overflowListThemeCss.includes('.semi-rtl .semi-overflow-list')
  ) {
    throw new Error('OverflowList 逐组件主题 CSS 未包含预期选择器');
  }
  const popoverThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'popover.css'),
    'utf8',
  );
  if (
    !popoverThemeCss.includes('.semi-portal-inner') ||
    !popoverThemeCss.includes('.semi-popover-wrapper') ||
    !popoverThemeCss.includes('.semi-popover-icon-arrow') ||
    !popoverThemeCss.includes('.semi-popover-animation-show') ||
    !popoverThemeCss.includes('.semi-popover.semi-popover-rtl')
  ) {
    throw new Error('安装后的 Popover 逐组件样式缺少 Portal、卡片、箭头、动效或 RTL 样式');
  }
  const scrollListThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'scroll-list.css',
    ),
    'utf8',
  );
  if (
    !scrollListThemeCss.includes('.semi-scrolllist-body') ||
    !scrollListThemeCss.includes('.semi-scrolllist-item-wheel') ||
    !scrollListThemeCss.includes('.semi-scrolllist-selector') ||
    !scrollListThemeCss.includes('.semi-rtl .semi-scrolllist')
  ) {
    throw new Error('安装后的 ScrollList 逐组件样式缺少 body、wheel、selector 或 RTL 样式');
  }
  const sideSheetThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'side-sheet.css',
    ),
    'utf8',
  );
  if (
    !sideSheetThemeCss.includes('.semi-sidesheet-inner') ||
    !sideSheetThemeCss.includes('.semi-sidesheet-mask') ||
    !sideSheetThemeCss.includes('.semi-sidesheet-animation-content_show_right') ||
    !sideSheetThemeCss.includes('.semi-sidesheet-rtl') ||
    !sideSheetThemeCss.includes('.semi-portal')
  ) {
    throw new Error('安装后的 SideSheet 逐组件样式缺少 panel、mask、动效、RTL 或 Portal 样式');
  }
  const tableThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'table.css'),
    'utf8',
  );
  if (
    !tableThemeCss.includes('.semi-table-wrapper') ||
    !tableThemeCss.includes('.semi-table-selection-wrap') ||
    !tableThemeCss.includes('.semi-table-cell-fixed-left') ||
    !tableThemeCss.includes('.semi-table-pagination-outer') ||
    !tableThemeCss.includes('.semi-table-wrapper-rtl .semi-table')
  ) {
    throw new Error('安装后的 Table 逐组件样式缺少根、选择、固定列、分页或 RTL 样式');
  }
  const tagThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'tag.css'),
    'utf8',
  );
  if (
    !tagThemeCss.includes('.semi-tag-blue-solid') ||
    !tagThemeCss.includes('.semi-tag-group') ||
    !tagThemeCss.includes('.semi-tag-split') ||
    !tagThemeCss.includes('.semi-rtl .semi-tag')
  ) {
    throw new Error('安装后的 Tag 逐组件样式缺少颜色、Group、Split 或 RTL 样式');
  }
  const timelineThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'timeline.css',
    ),
    'utf8',
  );
  if (
    !timelineThemeCss.includes('.semi-timeline-item-head-success') ||
    !timelineThemeCss.includes('.semi-timeline-center') ||
    !timelineThemeCss.includes('.semi-rtl .semi-timeline')
  ) {
    throw new Error('安装后的 Timeline 逐组件样式缺少节点、center 或 RTL 样式');
  }
  const switchThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'switch.css'),
    'utf8',
  );
  if (
    !switchThemeCss.includes('.semi-switch-native-control') ||
    !switchThemeCss.includes('.semi-switch-loading-spin') ||
    !switchThemeCss.includes('.semi-spin-wrapper')
  ) {
    throw new Error('安装后的 Switch 逐组件样式缺少原生控件、loading 或 Spin 样式');
  }
  const tagInputThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'tag-input.css',
    ),
    'utf8',
  );
  if (
    !tagInputThemeCss.includes('.semi-tagInput-wrapper-input') ||
    !tagInputThemeCss.includes('.semi-tagInput-wrapper-n') ||
    !tagInputThemeCss.includes('.semi-tag-close') ||
    !tagInputThemeCss.includes('.semi-popover-wrapper') ||
    !tagInputThemeCss.includes('.semi-rtl .semi-tagInput')
  ) {
    throw new Error('安装后的 TagInput 逐组件样式缺少 Input、Tag、Popover 或 RTL 样式');
  }
  const tooltipThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@aifuxi', 'semi-theme-default', 'dist', 'tooltip.css'),
    'utf8',
  );
  const timePickerThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'time-picker.css',
    ),
    'utf8',
  );
  if (
    !timePickerThemeCss.includes('.semi-timepicker-panel-list-hour') ||
    !timePickerThemeCss.includes('.semi-timepicker-range-panel') ||
    !timePickerThemeCss.includes('.semi-scrolllist-body') ||
    !timePickerThemeCss.includes('.semi-popover-wrapper') ||
    !timePickerThemeCss.includes('.semi-rtl .semi-timepicker-panel')
  ) {
    throw new Error('安装后的 TimePicker 逐组件样式缺少面板、ScrollList、Popover 或 RTL 样式');
  }
  if (
    !tooltipThemeCss.includes('.semi-portal-inner') ||
    !tooltipThemeCss.includes('.semi-tooltip-wrapper') ||
    !tooltipThemeCss.includes('.semi-tooltip-icon-arrow') ||
    !tooltipThemeCss.includes('.semi-tooltip-animation-show')
  ) {
    throw new Error('安装后的 Tooltip 逐组件样式缺少 Portal、箭头或动效样式');
  }
  const typographyThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@aifuxi',
      'semi-theme-default',
      'dist',
      'typography.css',
    ),
    'utf8',
  );
  if (
    !typographyThemeCss.includes('.semi-typography-paragraph') ||
    !typographyThemeCss.includes('.semi-typography-action-copy') ||
    !typographyThemeCss.includes('.semi-tooltip-wrapper') ||
    !typographyThemeCss.includes('.semi-icon-default')
  ) {
    throw new Error('安装后的 Typography 逐组件样式缺少正文、复制、Tooltip 或 Icon 样式');
  }

  process.stdout.write('真实 tarball 的安装、exports、ESM、类型、样式与 SSR import 均通过\n');
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
