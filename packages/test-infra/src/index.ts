export const REFERENCE_BASELINE = Object.freeze({
  name: 'Semi Design',
  tag: 'v2.102.0',
  version: '2.102.0',
  commit: 'cdfba6e520fc83ad871b30f51f36d8af3aaa5a21',
});

export const REFERENCE_SOURCE_PATHS = Object.freeze({
  buttonPublicEntry: 'vendor/semi-design/packages/semi-ui/button/index.tsx',
  buttonGroupEntry: 'vendor/semi-design/packages/semi-ui/button/buttonGroup.tsx',
  splitButtonGroupEntry: 'vendor/semi-design/packages/semi-ui/button/splitButtonGroup.tsx',
  buttonFoundationStyle: 'vendor/semi-design/packages/semi-foundation/button/button.scss',
  buttonDocumentation: 'vendor/semi-design/content/basic/button/index.md',
  dividerPublicEntry: 'vendor/semi-design/packages/semi-ui/divider/index.tsx',
  dividerFoundationStyle: 'vendor/semi-design/packages/semi-foundation/divider/divider.scss',
  dividerDocumentation: 'vendor/semi-design/content/basic/divider/index.md',
  floatButtonPublicEntry: 'vendor/semi-design/packages/semi-ui/floatButton/index.tsx',
  floatButtonGroupEntry: 'vendor/semi-design/packages/semi-ui/floatButton/floatButtonGroup.tsx',
  floatButtonFoundationStyle:
    'vendor/semi-design/packages/semi-foundation/floatButton/floatButton.scss',
  floatButtonDocumentation: 'vendor/semi-design/content/basic/floatbutton/index.md',
  iconPublicEntry: 'vendor/semi-design/packages/semi-ui/icons/index.tsx',
  iconBaseEntry: 'vendor/semi-design/packages/semi-icons/src/components/Icon.tsx',
  iconStableEntry: 'vendor/semi-design/packages/semi-icons/src/index.ts',
  iconLabEntry: 'vendor/semi-design/packages/semi-icons-lab/src/index.ts',
  iconStyle: 'vendor/semi-design/packages/semi-icons/src/styles/icons.scss',
  iconDocumentation: 'vendor/semi-design/content/basic/icon/index.md',
  gridPublicEntry: 'vendor/semi-design/packages/semi-ui/grid/index.tsx',
  gridRowEntry: 'vendor/semi-design/packages/semi-ui/grid/row.tsx',
  gridColEntry: 'vendor/semi-design/packages/semi-ui/grid/col.tsx',
  gridFoundationStyle: 'vendor/semi-design/packages/semi-foundation/grid/grid.scss',
  gridDocumentation: 'vendor/semi-design/content/basic/grid/index.md',
  layoutPublicEntry: 'vendor/semi-design/packages/semi-ui/layout/index.tsx',
  layoutSiderEntry: 'vendor/semi-design/packages/semi-ui/layout/Sider.tsx',
  layoutFoundationStyle: 'vendor/semi-design/packages/semi-foundation/layout/layout.scss',
  layoutDocumentation: 'vendor/semi-design/content/basic/layout/index.md',
  spacePublicEntry: 'vendor/semi-design/packages/semi-ui/space/index.tsx',
  spaceUtilities: 'vendor/semi-design/packages/semi-ui/space/utils.ts',
  spaceFoundationStyle: 'vendor/semi-design/packages/semi-foundation/space/space.scss',
  spaceDocumentation: 'vendor/semi-design/content/basic/space/index.md',
});

export const PARITY_VIEWPORTS = Object.freeze({
  desktop: Object.freeze({ width: 1440, height: 900, deviceScaleFactor: 1 }),
  mobile: Object.freeze({ width: 390, height: 844, deviceScaleFactor: 1 }),
});

export const VISUAL_THRESHOLDS = Object.freeze({
  screenshotThreshold: 0.1,
  maxDiffPixelRatio: 0.001,
  boundingRectToleranceCssPx: 0.5,
});

export const PARITY_THEME_MODES = ['light', 'dark'] as const;
export const PARITY_DIRECTIONS = ['ltr', 'rtl'] as const;
export const PARITY_LOCALES = ['zh-CN', 'en-US'] as const;

export type ParityThemeMode = (typeof PARITY_THEME_MODES)[number];
export type ParityDirection = (typeof PARITY_DIRECTIONS)[number];
export type ParityLocale = (typeof PARITY_LOCALES)[number];
export type ScenarioReadiness = 'ready' | 'pending';

export interface ScenarioTarget {
  readonly id: string;
  readonly selector: string;
  readonly computedStyleProperties: readonly string[];
}

export interface ParityScenarioDefinition {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly referenceStatus: ScenarioReadiness;
  readonly vueStatus: ScenarioReadiness;
  readonly referenceSource: string | null;
  readonly sourceEvidence: readonly string[];
  readonly targets: readonly ScenarioTarget[];
}

export const PARITY_SCENARIOS = [
  {
    id: 'harness-calibration',
    title: '工作台视觉校准',
    description: '验证 React 与 Vue 工作台的字体、视口、DPR 和壳层样式一致。',
    referenceStatus: 'ready',
    vueStatus: 'ready',
    referenceSource: null,
    sourceEvidence: [],
    targets: [
      {
        id: 'visual-calibration',
        selector: '[data-testid="visual-calibration"]',
        computedStyleProperties: [
          'backgroundColor',
          'borderRadius',
          'boxShadow',
          'display',
          'gap',
          'height',
          'padding',
          'width',
        ],
      },
    ],
  },
  {
    id: 'button-types',
    title: 'Button 按钮类型',
    description: '复现固定中文文档中的首个 Button 类型场景。',
    referenceStatus: 'ready',
    vueStatus: 'ready',
    referenceSource: REFERENCE_SOURCE_PATHS.buttonPublicEntry,
    sourceEvidence: [
      REFERENCE_SOURCE_PATHS.buttonPublicEntry,
      REFERENCE_SOURCE_PATHS.buttonFoundationStyle,
      REFERENCE_SOURCE_PATHS.buttonDocumentation,
    ],
    targets: [
      {
        id: 'button-primary',
        selector: '[data-parity-target="button-primary"]',
        computedStyleProperties: [
          'backgroundColor',
          'borderRadius',
          'color',
          'fontFamily',
          'fontSize',
          'fontWeight',
          'height',
          'lineHeight',
          'paddingLeft',
          'paddingRight',
        ],
      },
      ...(['secondary', 'tertiary', 'warning', 'danger'] as const).map((type) => ({
        id: `button-${type}`,
        selector: `[data-parity-target="button-${type}"]`,
        computedStyleProperties: [
          'backgroundColor',
          'borderRadius',
          'color',
          'fontFamily',
          'fontSize',
          'fontWeight',
          'height',
          'lineHeight',
          'paddingLeft',
          'paddingRight',
        ],
      })),
    ],
  },
  {
    id: 'button-contract',
    title: 'Button 状态与组合契约',
    description: '验证 Button 的图标、加载、禁用、尺寸、组合与分裂组合。',
    referenceStatus: 'ready',
    vueStatus: 'ready',
    referenceSource: REFERENCE_SOURCE_PATHS.buttonPublicEntry,
    sourceEvidence: [
      REFERENCE_SOURCE_PATHS.buttonPublicEntry,
      REFERENCE_SOURCE_PATHS.buttonGroupEntry,
      REFERENCE_SOURCE_PATHS.splitButtonGroupEntry,
      REFERENCE_SOURCE_PATHS.buttonFoundationStyle,
      REFERENCE_SOURCE_PATHS.buttonDocumentation,
    ],
    targets: [
      {
        id: 'button-icon-right',
        selector: '[data-parity-target="button-icon-right"]',
        computedStyleProperties: [
          'backgroundColor',
          'borderRadius',
          'color',
          'display',
          'fontFamily',
          'fontSize',
          'height',
          'paddingLeft',
          'paddingRight',
        ],
      },
      {
        id: 'button-disabled',
        selector: '[data-parity-target="button-disabled"]',
        computedStyleProperties: ['backgroundColor', 'borderColor', 'color', 'cursor', 'height'],
      },
      {
        id: 'button-loading',
        selector: '[data-parity-target="button-loading"]',
        computedStyleProperties: ['backgroundColor', 'color', 'cursor', 'height', 'pointerEvents'],
      },
      {
        id: 'button-large',
        selector: '[data-parity-target="button-large"]',
        computedStyleProperties: [
          'borderRadius',
          'fontSize',
          'fontWeight',
          'height',
          'lineHeight',
          'paddingLeft',
          'paddingRight',
        ],
      },
      {
        id: 'button-outline',
        selector: '[data-parity-target="button-outline"]',
        computedStyleProperties: [
          'backgroundColor',
          'borderColor',
          'borderRadius',
          'borderWidth',
          'color',
          'height',
        ],
      },
      {
        id: 'button-borderless',
        selector: '[data-parity-target="button-borderless"]',
        computedStyleProperties: [
          'backgroundColor',
          'borderColor',
          'borderWidth',
          'color',
          'height',
        ],
      },
      {
        id: 'button-colorful',
        selector: '[data-parity-target="button-colorful"]',
        computedStyleProperties: ['backgroundImage', 'borderRadius', 'color', 'height'],
      },
      {
        id: 'button-block',
        selector: '[data-parity-target="button-block"]',
        computedStyleProperties: ['display', 'height', 'width'],
      },
      {
        id: 'button-group',
        selector: '.semi-button-group',
        computedStyleProperties: ['display', 'flexWrap'],
      },
      {
        id: 'split-button-group',
        selector: '.semi-button-split',
        computedStyleProperties: ['display'],
      },
    ],
  },
  {
    id: 'divider',
    title: 'Divider 分割线',
    description: '复现固定文档的水平、垂直、虚线、边距与内容对齐契约。',
    referenceStatus: 'ready',
    vueStatus: 'ready',
    referenceSource: REFERENCE_SOURCE_PATHS.dividerPublicEntry,
    sourceEvidence: [
      REFERENCE_SOURCE_PATHS.dividerPublicEntry,
      REFERENCE_SOURCE_PATHS.dividerFoundationStyle,
      REFERENCE_SOURCE_PATHS.dividerDocumentation,
    ],
    targets: [
      {
        id: 'divider-horizontal-solid',
        selector: '[data-parity-target="divider-horizontal-solid"]',
        computedStyleProperties: [
          'borderBottomColor',
          'borderBottomStyle',
          'borderBottomWidth',
          'boxSizing',
          'display',
          'marginBottom',
          'marginTop',
          'width',
        ],
      },
      {
        id: 'divider-horizontal-dashed',
        selector: '[data-parity-target="divider-horizontal-dashed"]',
        computedStyleProperties: [
          'borderBottomColor',
          'borderBottomStyle',
          'borderBottomWidth',
          'display',
          'marginBottom',
          'marginTop',
          'width',
        ],
      },
      {
        id: 'divider-vertical-solid',
        selector: '[data-parity-target="divider-vertical-solid"]',
        computedStyleProperties: [
          'borderLeftColor',
          'borderLeftStyle',
          'borderLeftWidth',
          'display',
          'height',
          'marginLeft',
          'marginRight',
          'verticalAlign',
        ],
      },
      {
        id: 'divider-vertical-dashed',
        selector: '[data-parity-target="divider-vertical-dashed"]',
        computedStyleProperties: [
          'borderLeftColor',
          'borderLeftStyle',
          'borderLeftWidth',
          'display',
          'height',
          'marginLeft',
          'marginRight',
          'verticalAlign',
        ],
      },
      ...(['left', 'center', 'right'] as const).map((align) => ({
        id: `divider-content-${align}`,
        selector: `[data-parity-target="divider-content-${align}"]`,
        computedStyleProperties: [
          'alignItems',
          'borderBottomWidth',
          'color',
          'display',
          'marginBottom',
          'marginTop',
          'whiteSpace',
          'width',
        ],
      })),
      {
        id: 'divider-custom-content',
        selector: '[data-parity-target="divider-custom-content"]',
        computedStyleProperties: [
          'alignItems',
          'borderBottomWidth',
          'color',
          'display',
          'marginBottom',
          'marginTop',
          'whiteSpace',
          'width',
        ],
      },
    ],
  },
  {
    id: 'float-button',
    title: 'FloatButton 悬浮按钮',
    description: '复现固定文档的尺寸、形状、彩色、禁用、徽章与按钮组契约。',
    referenceStatus: 'ready',
    vueStatus: 'ready',
    referenceSource: REFERENCE_SOURCE_PATHS.floatButtonPublicEntry,
    sourceEvidence: [
      REFERENCE_SOURCE_PATHS.floatButtonPublicEntry,
      REFERENCE_SOURCE_PATHS.floatButtonGroupEntry,
      REFERENCE_SOURCE_PATHS.floatButtonFoundationStyle,
      REFERENCE_SOURCE_PATHS.floatButtonDocumentation,
    ],
    targets: [
      ...(['small', 'default', 'large'] as const).map((size) => ({
        id: `float-button-${size}`,
        selector: `.float-button-target-${size}`,
        computedStyleProperties: [
          'borderRadius',
          'bottom',
          'cursor',
          'height',
          'position',
          'right',
          'width',
          'zIndex',
        ],
      })),
      {
        id: 'float-button-square',
        selector: '.float-button-target-square',
        computedStyleProperties: ['borderRadius', 'height', 'width'],
      },
      {
        id: 'float-button-colorful',
        selector: '.float-button-target-colorful > .semi-floatButton-body',
        computedStyleProperties: [
          'alignItems',
          'backgroundColor',
          'borderRadius',
          'boxShadow',
          'color',
          'display',
          'height',
          'justifyContent',
          'width',
        ],
      },
      {
        id: 'float-button-disabled',
        selector: '.float-button-target-disabled > .semi-floatButton-body',
        computedStyleProperties: ['backgroundColor', 'color', 'cursor', 'height', 'width'],
      },
      {
        id: 'float-button-badge',
        selector: '.float-button-target-badge .semi-badge-count',
        computedStyleProperties: [
          'backgroundColor',
          'borderRadius',
          'color',
          'fontSize',
          'height',
          'minWidth',
          'position',
        ],
      },
      {
        id: 'float-button-group',
        selector: '.float-button-target-group',
        computedStyleProperties: [
          'backgroundColor',
          'borderRadius',
          'boxShadow',
          'columnGap',
          'display',
          'padding',
          'position',
        ],
      },
    ],
  },
  {
    id: 'icon',
    title: 'Icon 图标',
    description: '复现固定文档的基础图标、尺寸、旋转、动画、颜色、AI fill 与 Lab 图标契约。',
    referenceStatus: 'ready',
    vueStatus: 'ready',
    referenceSource: REFERENCE_SOURCE_PATHS.iconPublicEntry,
    sourceEvidence: [
      REFERENCE_SOURCE_PATHS.iconPublicEntry,
      REFERENCE_SOURCE_PATHS.iconBaseEntry,
      REFERENCE_SOURCE_PATHS.iconStableEntry,
      REFERENCE_SOURCE_PATHS.iconLabEntry,
      REFERENCE_SOURCE_PATHS.iconStyle,
      REFERENCE_SOURCE_PATHS.iconDocumentation,
    ],
    targets: [
      ...(['extra-small', 'small', 'default', 'large', 'extra-large'] as const).map((size) => ({
        id: `icon-size-${size}`,
        selector: `[data-parity-target="icon-size-${size}"]`,
        computedStyleProperties: [
          'color',
          'display',
          'fontSize',
          'fontStyle',
          'height',
          'lineHeight',
          'width',
        ],
      })),
      {
        id: 'icon-rotate',
        selector: '[data-parity-target="icon-rotate"]',
        computedStyleProperties: ['display', 'fontSize', 'height', 'transform', 'width'],
      },
      {
        id: 'icon-spin',
        selector: '[data-parity-target="icon-spin"]',
        computedStyleProperties: [
          'animationDuration',
          'animationIterationCount',
          'animationTimingFunction',
          'display',
          'fontSize',
        ],
      },
      {
        id: 'icon-color',
        selector: '[data-parity-target="icon-color"]',
        computedStyleProperties: ['color', 'display', 'fontSize', 'height', 'width'],
      },
      ...(['bicolor', 'multicolor', 'lab'] as const).map((kind) => ({
        id: `icon-${kind}`,
        selector: `[data-parity-target="icon-${kind}"]`,
        computedStyleProperties: ['display', 'fontSize', 'height', 'lineHeight', 'width'],
      })),
    ],
  },
  {
    id: 'grid',
    title: 'Grid 栅格',
    description: '复现固定文档的 24 栅格、Gutter、Flex、排序、响应式与 RTL 契约。',
    referenceStatus: 'ready',
    vueStatus: 'ready',
    referenceSource: REFERENCE_SOURCE_PATHS.gridPublicEntry,
    sourceEvidence: [
      REFERENCE_SOURCE_PATHS.gridPublicEntry,
      REFERENCE_SOURCE_PATHS.gridRowEntry,
      REFERENCE_SOURCE_PATHS.gridColEntry,
      REFERENCE_SOURCE_PATHS.gridFoundationStyle,
      REFERENCE_SOURCE_PATHS.gridDocumentation,
    ],
    targets: [
      {
        id: 'grid-basic-row',
        selector: '[data-parity-target="grid-basic-row"]',
        computedStyleProperties: ['boxSizing', 'direction', 'display', 'height', 'width'],
      },
      {
        id: 'grid-basic-col',
        selector: '[data-parity-target="grid-basic-col"]',
        computedStyleProperties: ['boxSizing', 'display', 'float', 'position', 'width'],
      },
      {
        id: 'grid-gutter-row',
        selector: '[data-parity-target="grid-gutter-row"]',
        computedStyleProperties: [
          'display',
          'marginBottom',
          'marginLeft',
          'marginRight',
          'marginTop',
          'width',
        ],
      },
      {
        id: 'grid-gutter-col',
        selector: '[data-parity-target="grid-gutter-col"]',
        computedStyleProperties: [
          'boxSizing',
          'paddingBottom',
          'paddingLeft',
          'paddingRight',
          'paddingTop',
          'width',
        ],
      },
      {
        id: 'grid-flex-row',
        selector: '[data-parity-target="grid-flex-row"]',
        computedStyleProperties: [
          'alignItems',
          'direction',
          'display',
          'flexFlow',
          'justifyContent',
          'width',
        ],
      },
      {
        id: 'grid-ordered-col',
        selector: '[data-parity-target="grid-ordered-col"]',
        computedStyleProperties: ['display', 'float', 'order', 'position', 'width'],
      },
      {
        id: 'grid-responsive-col',
        selector: '[data-parity-target="grid-responsive-col"]',
        computedStyleProperties: ['display', 'float', 'left', 'marginLeft', 'position', 'width'],
      },
    ],
  },
  {
    id: 'layout',
    title: 'Layout 布局',
    description: '复现固定文档的三行、侧边栏、嵌套、响应式断点与语义标签契约。',
    referenceStatus: 'ready',
    vueStatus: 'ready',
    referenceSource: REFERENCE_SOURCE_PATHS.layoutPublicEntry,
    sourceEvidence: [
      REFERENCE_SOURCE_PATHS.layoutPublicEntry,
      REFERENCE_SOURCE_PATHS.layoutSiderEntry,
      REFERENCE_SOURCE_PATHS.layoutFoundationStyle,
      REFERENCE_SOURCE_PATHS.layoutDocumentation,
    ],
    targets: [
      {
        id: 'layout-vertical',
        selector: '[data-parity-target="layout-vertical"]',
        computedStyleProperties: ['display', 'flex', 'flexDirection', 'minHeight', 'width'],
      },
      {
        id: 'layout-header',
        selector: '[data-parity-target="layout-header"]',
        computedStyleProperties: ['boxSizing', 'flex', 'height', 'lineHeight'],
      },
      {
        id: 'layout-content',
        selector: '[data-parity-target="layout-content"]',
        computedStyleProperties: ['boxSizing', 'flex', 'height', 'lineHeight', 'minHeight'],
      },
      {
        id: 'layout-footer',
        selector: '[data-parity-target="layout-footer"]',
        computedStyleProperties: ['boxSizing', 'flex', 'height', 'lineHeight'],
      },
      {
        id: 'layout-with-sider',
        selector: '[data-parity-target="layout-with-sider"]',
        computedStyleProperties: ['direction', 'display', 'flexDirection', 'width'],
      },
      {
        id: 'layout-sider',
        selector: '[data-parity-target="layout-sider"]',
        computedStyleProperties: ['boxSizing', 'minWidth', 'position', 'width'],
      },
      {
        id: 'layout-nested',
        selector: '[data-parity-target="layout-nested"]',
        computedStyleProperties: ['display', 'flex', 'flexDirection', 'overflowX'],
      },
      {
        id: 'layout-semantic',
        selector: '[data-parity-target="layout-semantic"]',
        computedStyleProperties: ['direction', 'display', 'flexDirection', 'minHeight'],
      },
    ],
  },
  {
    id: 'space',
    title: 'Space 间距',
    description: '复现固定文档的预设/自定义间距、方向、换行、交叉轴对齐与 RTL 契约。',
    referenceStatus: 'ready',
    vueStatus: 'ready',
    referenceSource: REFERENCE_SOURCE_PATHS.spacePublicEntry,
    sourceEvidence: [
      REFERENCE_SOURCE_PATHS.spacePublicEntry,
      REFERENCE_SOURCE_PATHS.spaceUtilities,
      REFERENCE_SOURCE_PATHS.spaceFoundationStyle,
      REFERENCE_SOURCE_PATHS.spaceDocumentation,
    ],
    targets: [
      ...(['tight', 'medium', 'loose'] as const).map((spacing) => ({
        id: `space-${spacing}`,
        selector: `[data-parity-target="space-${spacing}"]`,
        computedStyleProperties: [
          'alignItems',
          'columnGap',
          'display',
          'flexDirection',
          'flexWrap',
          'rowGap',
        ],
      })),
      {
        id: 'space-number',
        selector: '[data-parity-target="space-number"]',
        computedStyleProperties: ['alignItems', 'columnGap', 'display', 'flexDirection', 'rowGap'],
      },
      {
        id: 'space-array-wrap',
        selector: '[data-parity-target="space-array-wrap"]',
        computedStyleProperties: [
          'alignItems',
          'columnGap',
          'display',
          'flexDirection',
          'flexWrap',
          'rowGap',
          'width',
        ],
      },
      {
        id: 'space-vertical',
        selector: '[data-parity-target="space-vertical"]',
        computedStyleProperties: [
          'alignItems',
          'columnGap',
          'display',
          'flexDirection',
          'flexWrap',
          'rowGap',
        ],
      },
      ...(['start', 'center', 'end', 'baseline'] as const).map((align) => ({
        id: `space-align-${align}`,
        selector: `[data-parity-target="space-align-${align}"]`,
        computedStyleProperties: [
          'alignItems',
          'columnGap',
          'direction',
          'display',
          'flexDirection',
          'rowGap',
        ],
      })),
    ],
  },
] as const satisfies readonly ParityScenarioDefinition[];

export type ParityScenarioId = (typeof PARITY_SCENARIOS)[number]['id'];

export const DEFAULT_SCENARIO_ID: ParityScenarioId = 'harness-calibration';

export interface ParityScenarioOptions {
  readonly scenarioId: ParityScenarioId;
  readonly theme: ParityThemeMode;
  readonly direction: ParityDirection;
  readonly locale: ParityLocale;
}

function includesValue<T extends string>(values: readonly T[], value: string | null): value is T {
  return value !== null && values.includes(value as T);
}

export function isParityScenarioId(value: string | null): value is ParityScenarioId {
  return PARITY_SCENARIOS.some((scenario) => scenario.id === value);
}

export function getParityScenario(scenarioId: ParityScenarioId): ParityScenarioDefinition {
  const scenario = PARITY_SCENARIOS.find((candidate) => candidate.id === scenarioId);
  if (!scenario) throw new Error(`未知对照场景：${scenarioId}`);
  return scenario;
}

export function parseParityScenarioOptions(search: string): ParityScenarioOptions {
  const query = new URLSearchParams(search);
  const scenario = query.get('scenario');
  const theme = query.get('theme');
  const direction = query.get('direction');
  const locale = query.get('locale');

  return {
    scenarioId: isParityScenarioId(scenario) ? scenario : DEFAULT_SCENARIO_ID,
    theme: includesValue(PARITY_THEME_MODES, theme) ? theme : 'light',
    direction: includesValue(PARITY_DIRECTIONS, direction) ? direction : 'ltr',
    locale: includesValue(PARITY_LOCALES, locale) ? locale : 'zh-CN',
  };
}

export function createParityScenarioUrl(baseUrl: string, options: ParityScenarioOptions): string {
  const url = new URL(baseUrl);
  url.searchParams.set('scenario', options.scenarioId);
  url.searchParams.set('theme', options.theme);
  url.searchParams.set('direction', options.direction);
  url.searchParams.set('locale', options.locale);
  return url.toString();
}

export function assertScenarioComparable(scenarioId: ParityScenarioId): ParityScenarioDefinition {
  const scenario = getParityScenario(scenarioId);
  if (scenario.referenceStatus !== 'ready' || scenario.vueStatus !== 'ready') {
    throw new Error(
      `${scenario.id} 尚不可执行 React/Vue 对照：React=${scenario.referenceStatus}，Vue=${scenario.vueStatus}`,
    );
  }
  return scenario;
}
