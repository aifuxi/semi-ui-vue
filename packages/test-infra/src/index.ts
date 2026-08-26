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
