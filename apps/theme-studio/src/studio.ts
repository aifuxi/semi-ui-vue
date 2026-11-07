import { computed, inject, reactive, ref, watch, type InjectionKey } from 'vue';
import { tokens, baselineVariables, type TokenDefinition } from './token-catalog';
import { dieluPreset } from './dielu-preset';
import { dieluForegroundVariables, dieluTypography } from './dielu-foreground-preset';
import { dieluTypographyVariables } from './dielu-typography-preset';
import { dieluEffectsVariables } from './dielu-effects-preset';
import {
  colorThemeToCss,
  createColorTheme,
  type ColorMode,
} from '@aifuxi/semi-theme-default/colors';

/** 固定 Semi v2.102.0 的公开字体栈，不从颜色生成器推导默认主题。 */
export const baselineFont =
  '"Inter", -apple-system, BlinkMacSystemFont, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Segoe UI", "Helvetica Neue", Helvetica, Arial, sans-serif';
/** 可编辑排版统一使用 px；字重使用 CSS 数值。 */
export interface TypographySettings {
  family: string;
  size: number;
  lineHeight: number;
  weight: number;
  strong: number;
  titleSize: number;
  titleLineHeight: number;
}
/** 每个边界显式管理模式；fixed 为真时仅使用编译后的固定基线色盘。 */
export interface ThemeSettings {
  brand: string;
  fixed: boolean;
  mode: ColorMode;
  typography: TypographySettings;
}
/** 新建一份独立的固定排版，避免全局和局部共享可变对象。
 * 14/20、400/600、四级标题 20/28 均来自主题包公开的 Semi v2.102.0 默认值。
 */
function defaultTypography(): TypographySettings {
  return {
    family: baselineFont,
    size: 14,
    lineHeight: 20,
    weight: 400,
    strong: 600,
    titleSize: 20,
    titleLineHeight: 28,
  };
}
/** 将编辑值映射到公开 CSS 变量，组件尺寸继续由原 API 控制。 */
export function typographyVariables(value: TypographySettings): Record<string, string> {
  return {
    '--semi-font-family-regular': value.family,
    '--semi-font-size-regular': `${value.size}px`,
    '--semi-line-height-regular': `${value.lineHeight}px`,
    '--semi-font-weight-regular': String(value.weight),
    '--semi-typography-font-weight': String(value.weight),
    '--semi-font-weight-strong': String(value.strong),
    '--semi-font-size-header-4': `${value.titleSize}px`,
    '--semi-line-height-header-4': `${value.titleLineHeight}px`,
  };
}
/** 创建应用自身编辑会话；只有显式保存/恢复才访问本地草稿。 */
export function createStudio() {
  /** 全局初始为原始默认色；品牌输入只在用户编辑后生效。 */
  const global = reactive<ThemeSettings>({
    brand: '#0077fa',
    fixed: true,
    mode: 'light',
    typography: defaultTypography(),
  });
  /** 局部初始展示独立青绿深色，用于和外层并列比较。 */
  const local = reactive<ThemeSettings>({
    brand: '#00a696',
    fixed: false,
    mode: 'dark',
    typography: defaultTypography(),
  });
  /** 关闭时同时移除边界、颜色、排版和模式，恢复自然继承。 */
  const settings = reactive({
    localEnabled: true,
    category: 'color',
    component: 'button',
    componentEnabled: false,
    buttonSize: 14,
    buttonWeight: 600,
    buttonLineHeight: 20,
    revision: 0,
  });
  /** 仅自定义品牌调用生成器；默认色盘始终来自已编译 CSS。 */
  const globalTheme = computed(() =>
    global.fixed ? null : createColorTheme({ brand: global.brand }),
  );
  /** 局部品牌拥有自己的双模式色盘，启停由预览的主题边界控制。 */
  const localTheme = computed(() =>
    local.fixed ? null : createColorTheme({ brand: local.brand }),
  );
  /** 深浅模式分别保存覆盖；目录中的原值始终保留用于单项复原。 */
  const overrides = reactive<Record<ColorMode, Record<string, string>>>({ light: {}, dark: {} });
  /** 当前检查的变量和检索条件属于编辑导航，不进入主题文件。 */
  const selection = reactive({ name: '--semi-color-primary', search: '', modifiedOnly: false });
  /** 本地保存与文件操作的反馈，不参与撤销历史。 */
  const message = ref('');
  /** JSON 文件中的设置只保留实际主题能力，不包含面板导航。 */
  function documentValue() {
    return {
      version: 1,
      global: { ...global, typography: { ...global.typography } },
      local: { ...local, typography: { ...local.typography } },
      settings: {
        localEnabled: settings.localEnabled,
        componentEnabled: settings.componentEnabled,
        buttonSize: settings.buttonSize,
        buttonWeight: settings.buttonWeight,
        buttonLineHeight: settings.buttonLineHeight,
      },
      overrides: { light: { ...overrides.light }, dark: { ...overrides.dark } },
    };
  }
  /** 已确认文档结构供导入、草稿和历史共用。 */
  type StudioDocument = ReturnType<typeof documentValue>;
  /** 历史保存完整文档，避免撤销后遗留另一种模式的变量。 */
  const history = ref([JSON.stringify(documentValue())]);
  /** 游标指向当前文档，分支编辑会截去后面的重做记录。 */
  const cursor = ref(0);
  /** 恢复标识防止历史应用本身产生新的历史记录。 */
  let restoring = '';
  /** 单一存储键仅保存此工具的显式草稿。 */
  const storageKey = 'theme-studio-draft-v1';
  // 同一 Vue 更新周期的多字段编辑合并为一个可撤销操作。
  watch(
    /** 只跟踪主题文档，不将分类切换计为样式修改。 */
    () => JSON.stringify(documentValue()),
    /** 完整快照让重置、导入与跨模式覆盖都能原子撤销。 */
    (value) => {
      if (value === restoring) {
        restoring = '';
        return;
      }
      if (value === history.value[cursor.value]) return;
      history.value = [...history.value.slice(0, cursor.value + 1), value];
      cursor.value = history.value.length - 1;
    },
  );
  /** 应用已校验的完整主题，同时丢弃编辑器未提交的草稿。 */
  function applyDocument(value: StudioDocument): void {
    Object.assign(global, value.global);
    Object.assign(local, value.local);
    Object.assign(settings, value.settings);
    overrides.light = { ...value.overrides.light };
    overrides.dark = { ...value.overrides.dark };
    settings.revision += 1;
  }
  /** 移动历史游标并恢复该位置的完整主题。 */
  function moveHistory(direction: number): void {
    /** UI 禁用边界外的操作；函数同时防止键盘越界。 */
    const next = cursor.value + direction;
    if (next < 0 || next >= history.value.length) return;
    cursor.value = next;
    restoring = history.value[next]!;
    applyDocument(JSON.parse(restoring) as StudioDocument);
  }
  /** 读取当前模式覆盖，否则读取固定目录默认值。 */
  function tokenValue(token: TokenDefinition, mode: ColorMode = global.mode): string {
    return (
      overrides[mode][token.name] ??
      typographyVariables(global.typography)[token.name] ??
      globalTheme.value?.variables[mode][token.name] ??
      (mode === 'dark' ? (token.darkValue ?? token.defaultValue) : token.defaultValue)
    );
  }
  /** 校验 CSS 值，拒绝声明注入和外部资源；变量引用必须来自本目录。 */
  function validateToken(token: TokenDefinition, value: string): void {
    if (!value.trim() || /[;{}@]|url\s*\(|!important/i.test(value))
      throw new Error('请输入有效的 CSS 变量值。');
    /** 复合值也用目标 CSS 属性验证，避免保存后被浏览器静默忽略。 */
    const property =
      token.bindings?.[0]?.property ??
      (token.category === 'shadow'
        ? 'box-shadow'
        : token.category === 'radius'
          ? 'border-radius'
          : token.category === 'spacing'
            ? 'gap'
            : token.name.includes('font-family')
              ? 'font-family'
              : token.name.includes('function')
                ? 'transition-timing-function'
                : token.name.includes('transform')
                  ? 'transform'
                  : token.defaultValue.includes('gradient(')
                    ? 'background-image'
                    : undefined);
    if (property && !CSS.supports(property, value)) throw new Error('该值不能用于此样式属性。');
    for (const match of value.matchAll(/var\(\s*(--[\w-]+)/g)) {
      if (
        !tokens.some(
          /** 引用仅指向已知变量，避免拼错后静默失效。 */
          (item) => item.name === match[1],
        )
      )
        throw new Error(`找不到引用变量 ${match[1]}。`);
      if (match[1] === token.name) throw new Error('变量不能引用自身。');
    }
    /** RGB 通道 token 需要三个 0–255 通道，不能当作完整 HEX 写入。 */
    const channels = token.channels;
    if (channels) {
      /** 三个 RGB 通道取 0–255；AI 色阶的第四个 alpha 通道取 0–1。 */
      const parts = value.split(',').map(
        /** 严格数值格式在下面整体校验，不让空通道变成隐式 0。 */
        (channel) => Number(channel.trim()),
      );
      if (
        !/^\s*\d+(?:\.\d+)?(?:\s*,\s*\d+(?:\.\d+)?){2,3}\s*$/.test(value) ||
        parts.length !== (token.alphaChannel ? 4 : 3) ||
        parts.some(
          /** alpha 与 RGB 分别检查实际有效范围。 */
          (channel, index) => channel < 0 || channel > (index === 3 ? 1 : 255),
        )
      )
        throw new Error(
          token.alphaChannel
            ? '请输入 0–255 的 RGB 与 0–1 的透明度，例如 0, 100, 250, 1。'
            : '请输入 0–255 的 RGB 通道，例如 0, 100, 250。',
        );
    } else if (token.kind === 'color' && !CSS.supports('color', value))
      throw new Error('请输入 CSS 颜色或变量引用。');
    else if (token.kind === 'number' && !/^var\(/.test(value)) {
      /** 按目录给出的单位与范围验证数值，不接受浏览器会忽略的字符串。 */
      const numeric = Number.parseFloat(value);
      if (
        !Number.isFinite(numeric) ||
        !/^-?\d+(?:\.\d+)?(?:px|ms|s|%|em|rem)?$/.test(value) ||
        (token.min !== undefined && numeric < token.min) ||
        (token.max !== undefined && numeric > token.max)
      )
        throw new Error('数值超出允许范围或单位无效。');
      if (token.unit && !value.endsWith(token.unit) && numeric !== 0)
        throw new Error(`请使用 ${token.unit} 单位。`);
    }
  }
  /** 单项编辑经过校验后进入对应模式；默认值用删除覆盖表达。 */
  function setToken(token: TokenDefinition, value: string): void {
    validateToken(token, value);
    validateReferences({ ...overrides[global.mode], [token.name]: value }, global.mode);
    overrides[global.mode][token.name] = value.trim();
    message.value = '';
  }
  /** CSS 变量循环会让整个引用链失效，因此在文档进入预览之前检查依赖图。 */
  function validateReferences(values: Record<string, string>, mode: ColorMode): void {
    /** 已完成路径不再重复遍历；当前路径用于识别间接循环。 */
    const done = new Set<string>();
    /** 已解析结果供兄弟分支复用，也用于验证引用后的属性类型。 */
    const resolved = new Map<string, string>();
    /** 深度优先跟随每个变量的显式引用，并保留模式独立性。 */
    function visit(name: string, path = new Set<string>()): string {
      if (path.has(name)) throw new Error('变量引用形成循环，请选择其他变量。');
      if (done.has(name)) return resolved.get(name)!;
      /** 目录保证每个进入此函数的变量都已存在。 */
      const definition = tokens.find(
        /** 引用名称经过 validateToken 白名单校验。 */
        (item) => item.name === name,
      );
      if (!definition) throw new Error(`找不到引用变量 ${name}。`);
      /** 当前文档覆盖优先于品牌生成结果和固定默认值。 */
      const current =
        values[name] ??
        globalTheme.value?.variables[mode][name] ??
        (mode === 'dark'
          ? (definition.darkValue ?? definition.defaultValue)
          : definition.defaultValue);
      /** 路径分别复制，兄弟分支共享同一引用不算循环。 */
      const nextPath = new Set(path).add(name);
      for (const match of current.matchAll(/var\(\s*(--[\w-]+)/g)) visit(match[1]!, nextPath);
      /** 将无 fallback 的标准引用展开后再验证，阻止字号引用颜色等无效设计值。 */
      const output = current.replace(
        /var\(\s*(--[\w-]+)\s*\)/g,
        /** 子路径已完成循环检测，返回同模式的解析结果。 */
        (_match, target: string) => resolved.get(target)!,
      );
      validateToken(definition, output);
      resolved.set(name, output);
      done.add(name);
      return output;
    }
    for (const name of Object.keys(values)) visit(name);
  }
  /** 恢复单项默认值，不影响其他变量或另一模式。 */
  function resetToken(token: TokenDefinition): void {
    delete overrides[global.mode][token.name];
  }
  /** 只合并迁移范围内的变量，其他编辑和模式保留；一次操作可整体撤销。 */
  function applyDieluPreset(): void {
    // 保持固定基线，避免整盘算法连带更改信息、成功、警告与危险色。
    Object.assign(global, { brand: dieluPreset.brand, fixed: true });
    for (const mode of ['light', 'dark'] as const) {
      overrides[mode] = { ...overrides[mode], ...dieluPreset.variables[mode] };
    }
    settings.revision += 1;
    message.value = '已应用迭鹿品牌色与圆角';
  }
  /** 排版与前景独立于品牌填充预设，合并后仍可整体撤销和继续编辑。 */
  function applyDieluForegroundPreset(): void {
    Object.assign(global.typography, dieluTypography);
    /** 新排版接替同层基础排版覆盖，组件专属编辑继续保留。 */
    const typographyKeys = Object.keys(typographyVariables(global.typography));
    for (const mode of ['light', 'dark'] as const) {
      for (const name of typographyKeys) delete overrides[mode][name];
      overrides[mode] = {
        ...overrides[mode],
        ...dieluForegroundVariables(mode),
        ...dieluTypographyVariables(),
      };
    }
    settings.revision += 1;
    message.value = '已应用迭鹿排版、前景与键盘轮廓，背景保持不变';
  }
  /** 阴影与交互是独立增量，不重新应用品牌、排版或来源背景。 */
  function applyDieluEffectsPreset(): void {
    for (const mode of ['light', 'dark'] as const) {
      overrides[mode] = { ...overrides[mode], ...dieluEffectsVariables(mode) };
    }
    settings.revision += 1;
    message.value = '已适配阴影、光晕与交互，保留当前背景和填充';
  }
  /** 变量列表生成普通 CSS 声明，不将编辑器状态带入产物。 */
  function declarations(values: Record<string, string>): string {
    return Object.entries(values)
      .map(
        /** 所有值均已在编辑或导入边界校验。 */
        ([name, value]) => `  ${name}: ${value};`,
      )
      .join('\n');
  }
  /** 公共变量直接赋值；私有适配变量另外映射已确认的消费位置。 */
  function overrideCss(scope: string, mode: ColorMode): string {
    /** 适配声明和 token 声明保持同一主题边界。 */
    const values = overrides[mode];
    /** CSS 引用在声明所在边界计算；需要在预览容器重声明颜色关系，基础通道编辑才能联动语义色。 */
    const colors = Object.fromEntries(
      Object.entries(globalTheme.value?.variables[mode] ?? baselineVariables[mode]).filter(
        /** 排版和尺寸由各自的公开变量管理，此处只重新建立颜色依赖。 */
        ([name]) => /^--semi-(?:color-|ai-|(?:[a-z-]+-\d|black|white)$)/.test(name),
      ),
    );
    /** scoped CSS 只补充当前实际修改的绑定。 */
    const rules = [`${scope} {\n${declarations({ ...colors, ...values })}\n}`];
    for (const token of tokens) {
      if (!(token.name in values) || !token.bindings) continue;
      for (const binding of token.bindings) {
        // 每个逗号分隔选择器都必须带边界，避免未限定分支污染编辑器与默认对照。
        for (const selector of binding.selector.split(',')) {
          /** 同一条规则用于在线预览和 CSS 导出，响应式值不固化为当前窗口尺寸。 */
          const rule = `${scope} ${selector.trim()} { ${binding.property}: var(${token.name}); }`;
          rules.push(binding.media ? `@media ${binding.media} { ${rule} }` : rule);
        }
      }
    }
    return rules.join('\n');
  }
  /** 导出 CSS 与在线预览共用规则，业务侧只需加载默认主题及此文件。 */
  function exportCss(): string {
    /** 交付容器类名不依赖工作台 DOM；通过 theme-mode 切换模式。 */
    const scope = '.theme-studio-theme';
    /** 品牌覆盖继续使用公开双模式序列化 API。 */
    const color = globalTheme.value
      ? colorThemeToCss(globalTheme.value, {
          selectors: { light: `${scope}[theme-mode="light"]`, dark: `${scope}[theme-mode="dark"]` },
        })
      : '';
    /** 共享排版和原有按钮覆盖使用真实公共变量。 */
    const common: Record<string, string> = typographyVariables(global.typography);
    if (settings.componentEnabled)
      Object.assign(common, {
        '--semi-button-font-size': `${settings.buttonSize}px`,
        '--semi-button-font-weight': String(settings.buttonWeight),
        '--semi-button-line-height': `${settings.buttonLineHeight}px`,
      });
    return `/* Theme Studio：加载默认主题后，在容器添加 theme-studio-theme 和 theme-mode=light 或 dark。 */\n${color}\n${scope} {\n${declarations(common)}\n}\n${overrideCss(`${scope}[theme-mode="light"]`, 'light')}\n${overrideCss(`${scope}[theme-mode="dark"]`, 'dark')}\n`;
  }
  /** 通过浏览器下载本地文件，不上传主题或发起远端发布。 */
  function download(kind: 'json' | 'css'): void {
    /** Blob URL 只在本次下载期间存在。 */
    const url = URL.createObjectURL(
      new Blob([kind === 'json' ? JSON.stringify(documentValue(), null, 2) : exportCss()], {
        type: kind === 'json' ? 'application/json' : 'text/css',
      }),
    );
    /** 临时链接由浏览器处理下载，随后撤回 URL。 */
    const link = document.createElement('a');
    link.href = url;
    link.download = `theme-studio.${kind}`;
    link.click();
    URL.revokeObjectURL(url);
    message.value = `已导出 ${kind.toUpperCase()}`;
  }
  /** 外部 JSON 必须为受支持版本，所有主题值均在边界重新验证。 */
  function parseDocument(text: string): StudioDocument {
    /** JSON.parse 的结果在完成下列检查之前始终是不可信输入。 */
    const value: unknown = JSON.parse(text);
    if (!isRecord(value) || value.version !== 1)
      throw new Error('请选择 Theme Studio 导出的版本 1 JSON 文件。');
    for (const name of ['global', 'local']) {
      /** 两个主题边界使用相同文件契约。 */
      const theme = value[name];
      if (
        !isRecord(theme) ||
        typeof theme.brand !== 'string' ||
        typeof theme.fixed !== 'boolean' ||
        !['light', 'dark'].includes(String(theme.mode)) ||
        !isRecord(theme.typography)
      )
        throw new Error('主题配置不完整。');
      createColorTheme({ brand: theme.brand });
      /** 排版字段的界限与原编辑器一致。 */
      const typography = theme.typography;
      if (typeof typography.family !== 'string' || /[;{}@]|url\s*\(/i.test(typography.family))
        throw new Error('字体配置无效。');
      for (const [key, [min, max]] of Object.entries({
        size: [10, 32],
        lineHeight: [12, 64],
        weight: [100, 900],
        strong: [100, 900],
        titleSize: [12, 48],
        titleLineHeight: [16, 72],
      } as const)) {
        if (
          typeof typography[key] !== 'number' ||
          !Number.isFinite(typography[key]) ||
          Number(typography[key]) < min ||
          Number(typography[key]) > max
        )
          throw new Error('排版数值超出编辑范围。');
      }
    }
    if (
      !isRecord(value.settings) ||
      typeof value.settings.localEnabled !== 'boolean' ||
      typeof value.settings.componentEnabled !== 'boolean'
    )
      throw new Error('组件设置不完整。');
    for (const [key, [min, max]] of Object.entries({
      buttonSize: [10, 32],
      buttonWeight: [100, 900],
      buttonLineHeight: [12, 48],
    } as const)) {
      if (
        typeof value.settings[key] !== 'number' ||
        !Number.isFinite(value.settings[key]) ||
        Number(value.settings[key]) < min ||
        Number(value.settings[key]) > max
      )
        throw new Error('按钮数值超出编辑范围。');
    }
    if (!isRecord(value.overrides)) throw new Error('缺少模式变量配置。');
    for (const mode of ['light', 'dark']) {
      /** 覆盖仅能写目录中的变量，防止任意选择器或声明进入样式。 */
      const items = value.overrides[mode];
      if (!isRecord(items)) throw new Error('模式变量配置无效。');
      for (const [name, cssValue] of Object.entries(items)) {
        /** 文件只能包含本工具实际支持的变量。 */
        const token = tokens.find(
          /** 按完整 CSS 变量名称匹配。 */
          (item) => item.name === name,
        );
        if (!token || typeof cssValue !== 'string') throw new Error(`不支持的变量 ${name}。`);
        validateToken(token, cssValue);
      }
      validateReferences(items as Record<string, string>, mode as ColorMode);
    }
    /** 仅返回契约字段，拒绝把文件中的额外属性透传到响应式对象。 */
    const validated = value as unknown as StudioDocument;
    /** 按已校验字段建立干净主题，字体栈不会附带对象原型或额外配置。 */
    function cleanTheme(theme: ThemeSettings): ThemeSettings {
      return {
        brand: theme.brand,
        fixed: theme.fixed,
        mode: theme.mode,
        typography: {
          family: theme.typography.family,
          size: theme.typography.size,
          lineHeight: theme.typography.lineHeight,
          weight: theme.typography.weight,
          strong: theme.typography.strong,
          titleSize: theme.typography.titleSize,
          titleLineHeight: theme.typography.titleLineHeight,
        },
      };
    }
    return {
      version: 1,
      global: cleanTheme(validated.global),
      local: cleanTheme(validated.local),
      settings: {
        localEnabled: validated.settings.localEnabled,
        componentEnabled: validated.settings.componentEnabled,
        buttonSize: validated.settings.buttonSize,
        buttonWeight: validated.settings.buttonWeight,
        buttonLineHeight: validated.settings.buttonLineHeight,
      },
      overrides: { light: { ...validated.overrides.light }, dark: { ...validated.overrides.dark } },
    };
  }
  /** 导入失败不修改当前主题，错误反馈给文件操作区域。 */
  function importJson(text: string): void {
    try {
      applyDocument(parseDocument(text));
      message.value = '已导入主题';
    } catch (cause) {
      message.value =
        cause instanceof SyntaxError
          ? 'JSON 格式无效，请选择 Theme Studio 导出的 JSON 文件。'
          : cause instanceof Error
            ? cause.message
            : '无法导入主题。';
    }
  }
  /** 显式保存草稿，不自动覆盖用户已有的本地主题。 */
  function save(): void {
    try {
      localStorage.setItem(storageKey, JSON.stringify(documentValue()));
      message.value = '草稿已保存到此浏览器';
    } catch {
      message.value = '浏览器存储不可用，请导出 JSON 保存。';
    }
  }
  /** 读取草稿同样经过文件校验，不信任浏览器存储。 */
  function load(): void {
    try {
      /** 本工具不读取其他应用的存储。 */
      const saved = localStorage.getItem(storageKey);
      if (!saved) {
        message.value = '此浏览器还没有保存的草稿';
        return;
      }
      importJson(saved);
    } catch {
      message.value = '无法读取草稿，请使用 JSON 导入。';
    }
  }
  /** CSS 只选择工作台的两个预览边界，并输出公开 API 提供的双模式载体。 */
  const css = computed(() => {
    /** 逐边界生成普通 CSS，固定基线分支不序列化颜色。 */
    return (
      (
        [
          ['studio-global', globalTheme.value],
          ['studio-local', localTheme.value],
        ] as const
      )
        .map(
          /** 模式选择器必须显式指定；取消边界后不再匹配局部 CSS。 */
          ([name, theme]) =>
            theme
              ? colorThemeToCss(theme, {
                  selectors: {
                    light: `[data-semi-theme="${name}"][theme-mode="light"]`,
                    dark: `[data-semi-theme="${name}"][theme-mode="dark"]`,
                  },
                })
              : '',
        )
        .join('\n') +
      '\n' +
      overrideCss('[data-semi-theme="studio-global"][theme-mode="light"]', 'light') +
      '\n' +
      overrideCss('[data-semi-theme="studio-global"][theme-mode="dark"]', 'dark')
    );
  });
  /** 复原本次会话，不改变浏览器或其他应用主题。 */
  function reset(): void {
    Object.assign(global, {
      brand: '#0077fa',
      fixed: true,
      mode: 'light',
      typography: defaultTypography(),
    });
    Object.assign(local, {
      brand: '#00a696',
      fixed: false,
      mode: 'dark',
      typography: defaultTypography(),
    });
    Object.assign(settings, {
      localEnabled: true,
      componentEnabled: false,
      buttonSize: 14,
      buttonWeight: 600,
      buttonLineHeight: 20,
    });
    overrides.light = {};
    overrides.dark = {};
    // 即使合法主题值未变，也丢弃编辑器尚未提交的无效草稿。
    settings.revision += 1;
  }
  /** 撤销与重做按钮根据游标更新禁用状态。 */
  const canUndo = computed(() => cursor.value > 0);
  /** 最后一项之后没有可以重做的编辑。 */
  const canRedo = computed(() => cursor.value < history.value.length - 1);
  return {
    global,
    local,
    settings,
    globalTheme,
    localTheme,
    css,
    reset,
    overrides,
    selection,
    tokenValue,
    setToken,
    resetToken,
    applyDieluPreset,
    applyDieluForegroundPreset,
    applyDieluEffectsPreset,
    canUndo,
    canRedo,
    moveHistory,
    save,
    load,
    download,
    importJson,
    message,
    exportCss,
  };
}
/** 跨面板共享当前应用的会话，不依赖 docs 或全局单例。 */
export type Studio = ReturnType<typeof createStudio>;
/** 注入标识只在本应用内可见。 */
export const studioKey: InjectionKey<Studio> = Symbol('theme-studio');
/** 子面板获取 App 创建的会话；缺少 Provider 是应用编程错误。 */
export function useStudio(): Studio {
  /** 每个工作台实例独立提供状态。 */
  const studio = inject(studioKey);
  if (!studio) throw new Error('Theme Studio provider is missing');
  return studio;
}

/** 区分 JSON 对象与数组/null，供外部文件的单一边界校验使用。 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
