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
      [
        'bezier-easing.txt',
        'date-fns.txt',
        'date-fns-tz.txt',
        'lodash.txt',
        'scroll-into-view-if-needed.txt',
      ].some((license) => !packedFiles.has(`dist/THIRD_PARTY_LICENSES/${license}`))
    ) {
      throw new Error('@workspace/ui 的 tarball 缺少运行时依赖许可证');
    }

    tarballs.set(packageInfo.name, path.resolve(artifactsRoot, packResult.filename));
  }

  const linkedRuntimeDependencies = Object.fromEntries(
    await Promise.all(
      ['bezier-easing', 'date-fns', 'date-fns-tz', 'lodash', 'scroll-into-view-if-needed'].map(
        async (dependency) => [
          dependency,
          `link:${await realpath(path.join(workspaceRoot, 'node_modules', dependency))}`,
        ],
      ),
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
      for (const [dependency, licenseFile] of [
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
          throw new Error(`@workspace/ui 未原样携带 ${dependency} 许可证`);
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
	await import('@workspace/ui/anchor');
	await import('@workspace/ui/back-top');
	await import('@workspace/ui/breadcrumb');
	await import('@workspace/ui/button');
	await import('@workspace/ui/checkbox');
	await import('@workspace/ui/auto-complete');
	await import('@workspace/ui/config-provider');
	await import('@workspace/ui/divider');
	await import('@workspace/ui/float-button');
	await import('@workspace/ui/grid');
	await import('@workspace/ui/icon');
	await import('@workspace/ui/input');
	await import('@workspace/ui/input-number');
	await import('@workspace/ui/pin-code');
	await import('@workspace/ui/pagination');
	await import('@workspace/ui/radio');
	await import('@workspace/ui/rating');
	await import('@workspace/ui/layout');
	await import('@workspace/ui/resizable');
	await import('@workspace/ui/select');
	await import('@workspace/ui/slider');
	await import('@workspace/ui/space');
	await import('@workspace/ui/steps');
	await import('@workspace/ui/tabs');
	await import('@workspace/ui/switch');
	await import('@workspace/ui/tag-input');
	await import('@workspace/ui/time-picker');
	await import('@workspace/ui/tooltip');
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
	if (!import.meta.resolve('@workspace/theme-default/anchor.css').endsWith('/dist/anchor.css')) {
	  throw new Error('Anchor 逐组件样式导出未指向 dist/anchor.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/back-top.css').endsWith('/dist/back-top.css')) {
	  throw new Error('BackTop 逐组件样式导出未指向 dist/back-top.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/breadcrumb.css').endsWith('/dist/breadcrumb.css')) {
	  throw new Error('Breadcrumb 逐组件样式导出未指向 dist/breadcrumb.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/button.css').endsWith('/dist/button.css')) {
	  throw new Error('Button 逐组件样式导出未指向 dist/button.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/checkbox.css').endsWith('/dist/checkbox.css')) {
	  throw new Error('Checkbox 逐组件样式导出未指向 dist/checkbox.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/auto-complete.css').endsWith('/dist/auto-complete.css')) {
	  throw new Error('AutoComplete 逐组件样式导出未指向 dist/auto-complete.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/config-provider.css').endsWith('/dist/config-provider.css')) {
	  throw new Error('ConfigProvider 逐组件样式导出未指向 dist/config-provider.css');
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
	if (!import.meta.resolve('@workspace/theme-default/input.css').endsWith('/dist/input.css')) {
	  throw new Error('Input 逐组件样式导出未指向 dist/input.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/input-number.css').endsWith('/dist/input-number.css')) {
	  throw new Error('InputNumber 逐组件样式导出未指向 dist/input-number.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/pin-code.css').endsWith('/dist/pin-code.css')) {
	  throw new Error('PinCode 逐组件样式导出未指向 dist/pin-code.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/pagination.css').endsWith('/dist/pagination.css')) {
	  throw new Error('Pagination 逐组件样式导出未指向 dist/pagination.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/radio.css').endsWith('/dist/radio.css')) {
	  throw new Error('Radio 逐组件样式导出未指向 dist/radio.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/rating.css').endsWith('/dist/rating.css')) {
	  throw new Error('Rating 逐组件样式导出未指向 dist/rating.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/layout.css').endsWith('/dist/layout.css')) {
	  throw new Error('Layout 逐组件样式导出未指向 dist/layout.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/resizable.css').endsWith('/dist/resizable.css')) {
	  throw new Error('Resizable 逐组件样式导出未指向 dist/resizable.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/select.css').endsWith('/dist/select.css')) {
	  throw new Error('Select 逐组件样式导出未指向 dist/select.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/slider.css').endsWith('/dist/slider.css')) {
	  throw new Error('Slider 逐组件样式导出未指向 dist/slider.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/space.css').endsWith('/dist/space.css')) {
	  throw new Error('Space 逐组件样式导出未指向 dist/space.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/steps.css').endsWith('/dist/steps.css')) {
	  throw new Error('Steps 逐组件样式导出未指向 dist/steps.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/tabs.css').endsWith('/dist/tabs.css')) {
	  throw new Error('Tabs 逐组件样式导出未指向 dist/tabs.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/switch.css').endsWith('/dist/switch.css')) {
	  throw new Error('Switch 逐组件样式导出未指向 dist/switch.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/tag-input.css').endsWith('/dist/tag-input.css')) {
	  throw new Error('TagInput 逐组件样式导出未指向 dist/tag-input.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/time-picker.css').endsWith('/dist/time-picker.css')) {
	  throw new Error('TimePicker 逐组件样式导出未指向 dist/time-picker.css');
	}
	if (!import.meta.resolve('@workspace/theme-default/tooltip.css').endsWith('/dist/tooltip.css')) {
	  throw new Error('Tooltip 逐组件样式导出未指向 dist/tooltip.css');
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
	import { AutoComplete, AutoCompleteOption, type AutoCompleteModelValue } from '@workspace/ui/auto-complete';
	import { Anchor, AnchorLink, type AnchorPosition } from '@workspace/ui/anchor';
	import { BackTop, type BackTopTarget } from '@workspace/ui/back-top';
	import { Breadcrumb, BreadcrumbItem, type BreadcrumbMoreType } from '@workspace/ui/breadcrumb';
	import { Button, ButtonGroup, SplitButtonGroup, type ButtonType } from '@workspace/ui/button';
	import { Checkbox, CheckboxGroup, type CheckboxType, type CheckboxValue } from '@workspace/ui/checkbox';
	import { ConfigConsumer, ConfigProvider, defaultResponsiveMap, type Breakpoint } from '@workspace/ui/config-provider';
	import { Divider, type DividerAlign } from '@workspace/ui/divider';
	import { FloatButton, FloatButtonGroup, type FloatButtonShape } from '@workspace/ui/float-button';
	import { Col, Row, type GridGutter } from '@workspace/ui/grid';
	import { Icon } from '@workspace/ui/icon';
	import { Input, InputGroup, TextArea, type InputSize, type InputValue, type TextAreaResize } from '@workspace/ui/input';
	import { InputNumber, type InputNumberValue } from '@workspace/ui/input-number';
	import { PinCode, type PinCodeFormat } from '@workspace/ui/pin-code';
	import { Radio, RadioGroup, type RadioType, type RadioValue } from '@workspace/ui/radio';
	import { Rating, type RatingSize } from '@workspace/ui/rating';
	import { Layout, LayoutContent, LayoutSider, type LayoutBreakpoint } from '@workspace/ui/layout';
	import { Resizable, ResizeGroup, ResizeHandler, ResizeItem, type ResizeDirection, type ResizeSize } from '@workspace/ui/resizable';
	import { Select, SelectOption, SelectOptionGroup, type SelectModelValue } from '@workspace/ui/select';
	import { Slider, type SliderValue } from '@workspace/ui/slider';
	import { Space, type SpaceAlign, type SpaceSpacingValue } from '@workspace/ui/space';
	import { Step, Steps, type StepsStatus, type StepsType } from '@workspace/ui/steps';
	import { TabItem, TabPane, Tabs, type TabPosition, type TabType } from '@workspace/ui/tabs';
	import { Switch, type SwitchSize } from '@workspace/ui/switch';
	import { TagInput, type TagInputSize } from '@workspace/ui/tag-input';
	import { TimePicker, type TimePickerType, type TimePickerValue } from '@workspace/ui/time-picker';
	import { Tooltip, type TooltipPosition } from '@workspace/ui/tooltip';
	import { Typography, Text, Title, Paragraph, Numeral, type TypographyType, type TypographyNumeralRule } from '@workspace/ui/typography';
	import IconBase, { convertIcon, type IconSize } from '@workspace/icons/Icon';
	import { IconAIWandLevel3, IconHome } from '@workspace/icons';
	import IconHomeDirect from '@workspace/icons/icons/IconHome';
	import { IconAvatar } from '@workspace/icons-lab';
	import IconAvatarDirect from '@workspace/icons-lab/icons/IconAvatar';
	import { h } from 'vue';
const type: ButtonType = 'primary';
h(Button, { type, htmlType: 'submit' });
	const anchorPosition: AnchorPosition = 'right';
	h(Anchor, { position: anchorPosition, showTooltip: true }, () => h(AnchorLink, { href: '#consumer', title: 'Consumer' }));
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
	const switchSize: SwitchSize = 'large';
	h(Switch, { modelValue: true, size: switchSize, ariaLabel: 'consumer switch', 'onUpdate:modelValue': (_checked: boolean) => undefined });
	const tagInputSize: TagInputSize = 'large';
	h(TagInput, { modelValue: ['Semi', 'Vue'], size: tagInputSize, showClear: true, 'onUpdate:modelValue': (_value: string[]) => undefined });
	const timePickerType: TimePickerType = 'timeRange';
	const timePickerValue: TimePickerValue = ['09:00:00', '18:00:00'];
	h(TimePicker, { modelValue: timePickerValue, type: timePickerType, minuteStep: 15, 'onUpdate:modelValue': (_value: Date | Date[] | undefined) => undefined });
	const tooltipPosition: TooltipPosition = 'bottomRight';
	h(Tooltip, { content: 'consumer tooltip', position: tooltipPosition, trigger: 'custom', visible: true }, () => h('button', 'trigger'));
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
  if (!themeCss.includes('.semi-anchor')) {
    throw new Error('安装后的默认主题缺少 Anchor 样式');
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'button.css'),
    'utf8',
  );
  const anchorThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'anchor.css'),
    'utf8',
  );
  const backTopThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'back-top.css'),
    'utf8',
  );
  const breadcrumbThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@workspace',
      'theme-default',
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'checkbox.css'),
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
      '@workspace',
      'theme-default',
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
      '@workspace',
      'theme-default',
      'dist',
      'config-provider.css',
    ),
    'utf8',
  );
  if (!configProviderThemeCss.includes('--semi-color-primary')) {
    throw new Error('安装后的 ConfigProvider 逐组件样式缺少默认主题 Token');
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
  const inputThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'input.css'),
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
      '@workspace',
      'theme-default',
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'pin-code.css'),
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'radio.css'),
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'rating.css'),
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'slider.css'),
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
  const selectThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'select.css'),
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'space.css'),
    'utf8',
  );
  if (
    !spaceThemeCss.includes('.semi-space-wrap') ||
    !spaceThemeCss.includes('.semi-space-tight-horizontal')
  ) {
    throw new Error('安装后的 Space 逐组件样式缺少换行或预设间距样式');
  }
  const stepsThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'steps.css'),
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'tabs.css'),
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
  const switchThemeCss = await readFile(
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'switch.css'),
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'tag-input.css'),
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
    path.join(consumerRoot, 'node_modules', '@workspace', 'theme-default', 'dist', 'tooltip.css'),
    'utf8',
  );
  const timePickerThemeCss = await readFile(
    path.join(
      consumerRoot,
      'node_modules',
      '@workspace',
      'theme-default',
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
