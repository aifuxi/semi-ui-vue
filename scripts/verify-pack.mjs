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

    tarballs.set(packageInfo.name, path.resolve(artifactsRoot, packResult.filename));
  }

  const dependencies = {
    ...Object.fromEntries(
      [...tarballs].map(([packageName, tarballPath]) => [packageName, `file:${tarballPath}`]),
    ),
    vue: `link:${await realpath(path.join(workspaceRoot, 'node_modules', 'vue'))}`,
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
    `packages:\n  - .\noverrides:\n${[...tarballs]
      .map(
        ([packageName, tarballPath]) =>
          `  ${JSON.stringify(packageName)}: ${JSON.stringify(`file:${tarballPath}`)}`,
      )
      .join('\n')}\n`,
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
	await import('@workspace/ui/icon');
	await import('@workspace/ui/space');
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
	if (!import.meta.resolve('@workspace/theme-default/icon.css').endsWith('/dist/icon.css')) {
	  throw new Error('Icon 逐组件样式导出未指向 dist/icon.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/space.css').endsWith('/dist/space.css')) {
	  throw new Error('Space 逐组件样式导出未指向 dist/space.css');
	}
	`,
  );
  run(process.execPath, ['smoke.mjs'], consumerRoot);

  await writeFile(
    path.join(consumerRoot, 'type-smoke.ts'),
    `${javascriptPackages.map((packageName) => `import '${packageName}';`).join('\n')}
	import { Button, ButtonGroup, SplitButtonGroup, type ButtonType } from '@workspace/ui/button';
	import { Divider, type DividerAlign } from '@workspace/ui/divider';
	import { Icon } from '@workspace/ui/icon';
	import { Space, type SpaceAlign, type SpaceSpacingValue } from '@workspace/ui/space';
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
	const iconSize: IconSize = 'large';
	h(Icon, { size: iconSize });
	const spaceAlign: SpaceAlign = 'baseline';
	const spaceSpacing: SpaceSpacingValue = [12, 'loose'];
	h(Space, { align: spaceAlign, spacing: spaceSpacing, wrap: true });
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

  process.stdout.write('真实 tarball 的安装、exports、ESM、类型、样式与 SSR import 均通过\n');
} finally {
  await rm(temporaryRoot, { recursive: true, force: true });
}
