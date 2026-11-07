import { computed, inject, reactive, type InjectionKey } from 'vue';
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
/** 创建应用自身的编辑会话；不写 body、文档站状态或持久化偏好。 */
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
  /** CSS 只选择工作台的两个预览边界，并输出公开 API 提供的双模式载体。 */
  const css = computed(() => {
    /** 逐边界生成普通 CSS，固定基线分支不序列化颜色。 */
    return (
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
      .join('\n');
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
    // 即使合法主题值未变，也丢弃编辑器尚未提交的无效草稿。
    settings.revision += 1;
  }
  return { global, local, settings, globalTheme, localTheme, css, reset };
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
