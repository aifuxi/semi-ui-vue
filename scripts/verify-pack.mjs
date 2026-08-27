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

const workspaceRoot = fileURLToPath(new URL('..', import.meta.url));
const pnpmExecPath = process.env.npm_execpath;
const packages = [
  { directory: 'ui', name: '@workspace/ui', type: 'javascript' },
  { directory: 'theme-default', name: '@workspace/theme-default', type: 'style' },
  { directory: 'icons', name: '@workspace/icons', type: 'javascript' },
  { directory: 'icons-lab', name: '@workspace/icons-lab', type: 'javascript' },
  { directory: 'illustrations', name: '@workspace/illustrations', type: 'javascript' },
];

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
      packageInfo.name === '@workspace/ui' &&
      !packedFiles.has('dist/THIRD_PARTY_LICENSES/lodash.txt')
    ) {
      throw new Error('@workspace/ui 的 tarball 缺少 Lodash 许可证');
    }

    tarballs.set(packageInfo.name, path.resolve(artifactsRoot, packResult.filename));
  }

  const linkedLodash = `link:${await realpath(path.join(workspaceRoot, 'node_modules', 'lodash'))}`;
  const dependencies = {
    ...Object.fromEntries(
      [...tarballs].map(([packageName, tarballPath]) => [packageName, `file:${tarballPath}`]),
    ),
    vue: `link:${await realpath(path.join(workspaceRoot, 'node_modules', 'vue'))}`,
    lodash: linkedLodash,
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
      `  lodash: ${JSON.stringify(linkedLodash)}`,
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
    if (installedLicense !== upstreamLicense) {
      throw new Error(`${packageInfo.name} 未原样携带上游许可证`);
    }
    if (packageInfo.name === '@workspace/ui') {
      const installedLodashLicense = await readFile(
        path.join(installedRoot, 'dist', 'THIRD_PARTY_LICENSES', 'lodash.txt'),
        'utf8',
      );
      const sourceLodashLicense = await readFile(
        path.join(workspaceRoot, 'node_modules', 'lodash', 'LICENSE'),
        'utf8',
      );
      if (installedLodashLicense !== sourceLodashLicense) {
        throw new Error('@workspace/ui 未原样携带 Lodash 许可证');
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
    const sbomCreationTime = sbom.creationInfo?.created;
    const hasValidCreationTime =
      typeof sbomCreationTime === 'string' &&
      !Number.isNaN(Date.parse(sbomCreationTime)) &&
      new Date(sbomCreationTime).toISOString() === sbomCreationTime;
    if (
      sbom.spdxVersion !== 'SPDX-2.3' ||
      sbom.dataLicense !== 'CC0-1.0' ||
      !hasValidCreationTime ||
      !sbom.documentDescribes?.includes('SPDXRef-Package-Workspace') ||
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
	await import('@workspace/ui/button');
	await import('@workspace/ui/divider');
	await import('@workspace/ui/float-button');
	await import('@workspace/ui/grid');
	await import('@workspace/ui/icon');
	await import('@workspace/ui/layout');
	await import('@workspace/ui/resizable');
	await import('@workspace/ui/space');
	await import('@workspace/ui/typography');
	await import('@workspace/icons/Icon');
	await import('@workspace/icons/icons/IconHome');
	await import('@workspace/icons-lab/Icon');
	await import('@workspace/icons-lab/icons/IconAvatar');
	const stableIcons = await import('@workspace/icons');
	const labIcons = await import('@workspace/icons-lab');
	if (Object.keys(stableIcons).length !== 525) throw new Error('稳定版 Icon 根导出数量不完整');
	if (Object.keys(labIcons).length !== 85) throw new Error('Lab Icon 根导出数量不完整');
	const rootTheme = import.meta.resolve('@workspace/theme-default');
const cssTheme = import.meta.resolve('@workspace/theme-default/index.css');
if (rootTheme !== cssTheme) throw new Error('默认主题根导出未指向 index.css');
	if (!import.meta.resolve('@workspace/theme-default/button.css').endsWith('/dist/button.css')) {
	  throw new Error('Button 逐组件样式导出未指向 dist/button.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/divider.css').endsWith('/dist/divider.css')) {
	  throw new Error('Divider 逐组件样式导出未指向 dist/divider.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/float-button.css').endsWith('/dist/float-button.css')) {
	  throw new Error('FloatButton 逐组件样式导出未指向 dist/float-button.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/grid.css').endsWith('/dist/grid.css')) {
	  throw new Error('Grid 逐组件样式导出未指向 dist/grid.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/icon.css').endsWith('/dist/icon.css')) {
	  throw new Error('Icon 逐组件样式导出未指向 dist/icon.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/layout.css').endsWith('/dist/layout.css')) {
	  throw new Error('Layout 逐组件样式导出未指向 dist/layout.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/resizable.css').endsWith('/dist/resizable.css')) {
	  throw new Error('Resizable 逐组件样式导出未指向 dist/resizable.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/space.css').endsWith('/dist/space.css')) {
	  throw new Error('Space 逐组件样式导出未指向 dist/space.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/typography.css').endsWith('/dist/typography.css')) {
	  throw new Error('Typography 逐组件样式导出未指向 dist/typography.css');
	}
	`,
  );
  run(process.execPath, ['smoke.mjs'], consumerRoot);

  await writeFile(
    path.join(consumerRoot, 'type-smoke.ts'),
    `${javascriptPackages.map((packageName) => `import '${packageName}';`).join('\n')}
	import { Button, ButtonGroup, SplitButtonGroup, type ButtonType } from '@workspace/ui/button';
	import { Divider, type DividerAlign } from '@workspace/ui/divider';
	import { FloatButton, FloatButtonGroup, type FloatButtonShape } from '@workspace/ui/float-button';
	import { Col, Row, type GridGutter } from '@workspace/ui/grid';
	import { Icon } from '@workspace/ui/icon';
	import { Layout, LayoutContent, LayoutSider, type LayoutBreakpoint } from '@workspace/ui/layout';
	import { Resizable, ResizeGroup, ResizeHandler, ResizeItem, type ResizeDirection, type ResizeSize } from '@workspace/ui/resizable';
	import { Space, type SpaceAlign, type SpaceSpacingValue } from '@workspace/ui/space';
	import { Typography, Text, Title, Paragraph, Numeral, type TypographyType, type TypographyNumeralRule } from '@workspace/ui/typography';
	import IconBase, { convertIcon, type IconSize } from '@workspace/icons/Icon';
	import { IconAIWandLevel3, IconHome } from '@workspace/icons';
	import IconHomeDirect from '@workspace/icons/icons/IconHome';
	import { IconAvatar } from '@workspace/icons-lab';
	import IconAvatarDirect from '@workspace/icons-lab/icons/IconAvatar';
	import { h } from 'vue';
const type: ButtonType = 'primary';
h(Button, { type, htmlType: 'submit' });
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
	const spaceAlign: SpaceAlign = 'baseline';
	const spaceSpacing: SpaceSpacingValue = [12, 'loose'];
	h(Space, { align: spaceAlign, spacing: spaceSpacing, wrap: true });
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
    '@workspace',
    'theme-default',
    'dist',
    'index.css',
  );
  const themeCss = await readFile(installedTheme, 'utf8');
  if (!themeCss.includes('.semi-button')) {
    throw new Error('安装后的默认主题缺少组件样式');
  }
  if (!themeCss.includes('.semi-divider')) {
    throw new Error('安装后的默认主题缺少 Divider 样式');
  }
  if (!themeCss.includes('.semi-icon')) {
    throw new Error('安装后的默认主题缺少 Icon 样式');
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
  if (!themeCss.includes('.semi-typography')) {
    throw new Error('安装后的默认主题缺少 Typography 样式');
  }
  const buttonThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'button.css'),
    'utf8',
  );
  if (!buttonThemeCss.includes('.semi-button-split')) {
    throw new Error('安装后的 Button 逐组件样式缺少 SplitButtonGroup 样式');
  }
  const dividerThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'divider.css'),
    'utf8',
  );
  if (!dividerThemeCss.includes('.semi-divider-with-text')) {
    throw new Error('安装后的 Divider 逐组件样式缺少内容分割线样式');
  }
  const floatButtonThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@workspace',
      'theme-default',
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'grid.css'),
    'utf8',
  );
  if (!gridThemeCss.includes('.semi-row-flex') || !gridThemeCss.includes('.semi-col-lg-24')) {
    throw new Error('安装后的 Grid 逐组件样式缺少 Flex 或响应式栅格样式');
  }
  const iconThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'icon.css'),
    'utf8',
  );
  if (
    !iconThemeCss.includes('.semi-icon-extra-large') ||
    !iconThemeCss.includes('.semi-icon-spinning')
  ) {
    throw new Error('安装后的 Icon 逐组件样式缺少尺寸或旋转样式');
  }
  const layoutThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'layout.css'),
    'utf8',
  );
  if (
    !layoutThemeCss.includes('.semi-layout-has-sider') ||
    !layoutThemeCss.includes('.semi-layout-sider-children')
  ) {
    throw new Error('安装后的 Layout 逐组件样式缺少 Sider 布局样式');
  }
  const resizableThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'resizable.css'),
    'utf8',
  );
  if (
    !resizableThemeCss.includes('.semi-resizable-resizableHandler-topRight') ||
    !resizableThemeCss.includes('.semi-resizable-handler-horizontal') ||
    !resizableThemeCss.includes('.semi-icon-default')
  ) {
    throw new Error('安装后的 Resizable 逐组件样式缺少单体、Group 或默认手柄样式');
  }
  const spaceThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'space.css'),
    'utf8',
  );
  if (
    !spaceThemeCss.includes('.semi-space-wrap') ||
    !spaceThemeCss.includes('.semi-space-tight-horizontal')
  ) {
    throw new Error('安装后的 Space 逐组件样式缺少换行或预设间距样式');
  }
  const typographyThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@workspace',
      'theme-default',
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
