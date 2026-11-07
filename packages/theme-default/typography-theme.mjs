import { existsSync, readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sass from 'sass';

/** 主题包位置用于解析只读固定基线，不进入公开 CSS 产物。 */
const themeRoot = path.dirname(fileURLToPath(import.meta.url));
/** 固定上游的唯一样式来源；转换仅在内存中发生。 */
const vendorRoot = path.resolve(themeRoot, '../../vendor/semi-design/packages');
/** 自定义 import 前缀确保 Sass 不绕过内存适配器直接读取文件。 */
const importPrefix = 'semi-typography:';
/** 与固定基线 mixin 一致的排版尺度，字号和行高独立公开。 */
export const typographyScales = {
  small: [12, 16],
  regular: [14, 20],
  'header-6': [16, 22],
  'header-5': [18, 24],
  'header-4': [20, 28],
  'header-3': [24, 32],
  'header-2': [28, 40],
  'header-1': [32, 44],
};

/** 收集变量声明以追踪组件变量到基础排版变量的引用，保留 Sass 原值。 */
function collectVariables(directory, variables = new Map()) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    // 每个组件有独立变量文件；递归覆盖嵌套样式模块。
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) collectVariables(file, variables);
    else if (entry.name === 'variables.scss') {
      for (const match of readFileSync(file, 'utf8').matchAll(/(\$[\w-]+)\s*:\s*([^;]+);/g)) {
        variables.set(match[1], match[2].trim());
      }
    }
  }
  return variables;
}

/** 基础与组件变量的只读声明索引，不把 SCSS 变量改为 CSS 字符串。 */
const variables = collectVariables(path.join(vendorRoot, 'semi-foundation'));
for (const match of readFileSync(
  path.join(vendorRoot, 'semi-theme-default/scss/variables.scss'),
  'utf8',
).matchAll(/(\$[\w-]+)\s*:\s*([^;]+);/g)) {
  variables.set(match[1], match[2].trim());
}

/** 将原变量名称转为公开组件语义名称，例如 button_small-fontSize。 */
function componentToken(variable) {
  // 个别旧变量省略属性词；公开名称仍明确它控制字体，便于主题作用域传递。
  const name = variable
    .slice('$font-'.length)
    .replaceAll('_', '-')
    .replace(/([a-z\d])([A-Z])/g, '$1-$2')
    .toLowerCase();
  if (name.includes('font-') || name.includes('line-height')) return `--semi-${name}`;
  if (/-(size|weight|family)$/.test(name))
    return `--semi-${name.replace(/-(size|weight|family)$/, '-font-$1')}`;
  return `--semi-${name}-font-size`;
}

/** 生成消费位置的变量链，显式标题命名字重保留原 API 的固定含义。 */
function variableValue(variable, fallback, seen = new Set()) {
  if (seen.has(variable)) return fallback;
  if (
    /^\$font-typography_title\d-(light|regular|medium|semibold|bold)-fontWeight$/.test(variable)
  ) {
    return fallback;
  }
  // 沿用固定基线的显式常规与强调语义，避免把继承文本强制成 400。
  // 公开基础变量与旧 Sass 变量一一对应。
  const globalToken =
    variable === '$font-weight-bold'
      ? '--semi-font-weight-strong'
      : variable === '$font-weight-regular'
        ? '--semi-font-weight-regular'
        : /^\$font-(size|family)-/.test(variable)
          ? `--semi-${variable.slice(1)}`
          : null;
  if (globalToken) return `var(${globalToken}, ${fallback})`;
  if (!variable.startsWith('$font-')) return fallback;
  // 同一变量也可能通过组件变量引用另外一层组件语义。
  // 只有单一变量引用才递归；表达式保留编译后的原值作为 fallback。
  const declaration = variables.get(variable);
  // 不把 Sass 运算转换为 CSS 运算，以保持固定默认行为。
  const reference = declaration?.match(/^\$[\w-]+$/)?.[0];
  // 防止意外循环引用影响构建诊断。
  const nextSeen = new Set(seen).add(variable);
  let inherited = reference ? variableValue(reference, fallback, nextSeen) : fallback;
  if (/^\$font-button(?:_(small|large))?-lineHeight$/.test(variable)) {
    inherited = `var(--semi-line-height-regular, ${fallback})`;
  }
  if (variable === '$font-table_base-fontSize') {
    inherited = `var(--semi-font-size-regular, ${fallback})`;
  }
  if (variable === '$font-typography_paragraph_extended-lineHeight') {
    inherited = `var(--semi-line-height-paragraph-extended, ${fallback})`;
  }
  // 三档 Button 共用默认语义，尺寸级覆盖仍可优先设置。
  // 三档 Button 的别名只扩展已确认的排版属性。
  const genericButtonToken = variable.match(
    /^\$font-button_(?:small|large)-(fontSize|fontWeight|lineHeight)$/,
  );
  if (genericButtonToken) {
    inherited = `var(${componentToken(`$font-button-${genericButtonToken[1]}`)}, ${inherited})`;
  }
  return `var(${componentToken(variable)}, ${inherited})`;
}

/** 根边界只提供默认常量；局部主题和 always-light/dark 不重复重置它们。 */
function defaultTokens() {
  // 字体值取自原始 Sass 变量，保持字体回退顺序与基线一致。
  const declarations = [
    '--semi-font-family-regular: #{inspect($font-family-regular)};',
    '--semi-font-weight-regular: 400;',
    '--semi-font-weight-strong: 600;',
    '--semi-line-height-paragraph-extended: 24px;',
  ];
  for (const [name, [size, lineHeight]] of Object.entries(typographyScales)) {
    declarations.push(`--semi-font-size-${name}: ${size}px;`);
    declarations.push(`--semi-line-height-${name}: ${lineHeight}px;`);
  }
  return `\nbody, :host {\n${declarations.join('\n')}\n}\n[data-semi-theme] { font-family: var(--semi-font-family-regular); }\n`;
}

/** 解析实际 Sass 文件；仅处理项目和固定 vendor 中已存在的普通 import。 */
function resolveImport(specifier, importer) {
  if (/^(?:https?:|url\(|sass:)/.test(specifier) || specifier.endsWith('.css')) return null;
  // Sass 的相对查找以原始文件而非虚拟 URL 为准。
  // 编译调用方始终提供原始文件位置。
  const resolved = path.resolve(path.dirname(importer), specifier);
  // 兼容上游省略扩展名的 Sass import。
  const extension = path.extname(resolved) ? '' : '.scss';
  // partial 文件按照 Sass 的下划线命名规则解析。
  const candidates = [
    resolved,
    `${resolved}${extension}`,
    path.join(path.dirname(resolved), `_${path.basename(resolved)}${extension}`),
  ];
  // 未命中的路径交回 Sass 生成原生错误信息。
  return candidates.find((candidate) => existsSync(candidate)) ?? null;
}

/** 适配源声明而非编译数值，避免把布局中的同值尺寸误认为字号。 */
export function transformTypographySource(source, file) {
  let transformed = source;
  if (file.startsWith(vendorRoot)) {
    transformed = transformed.replace(
      /(^\s*(?:font-size|font-weight|font-family|line-height)\s*:\s*)(?:#\{)?(\$[\w-]+)(?:\})?(\s*;)/gm,
      // 最终数值由原 Sass 变量展开，fallback 始终保持固定基线。
      (_match, prefix, variable, suffix) =>
        `${prefix}${variableValue(variable, variable)}${suffix}`,
    );
    if (file.endsWith('/scss/_font.scss')) {
      transformed = transformed.replace(
        /(@mixin font-size-([\w-]+)\s*\{[\s\S]*?line-height:\s*)(\d+px)(;)/g,
        // 原 mixin 的每一个固定行高具有明确的字号层级语义。
        (_match, prefix, scale, value, suffix) =>
          `${prefix}var(--semi-line-height-${scale}, ${value})${suffix}`,
      );
    }
    transformed = transformed.replace(
      /(^\s*font-family:\s*)([^;\n]+)(;)/gm,
      // 代码字体只有显式覆盖时统一；否则保留每个组件的原回退栈。
      (match, prefix, value, suffix) =>
        value.includes('monospace') && !value.includes('var(')
          ? `${prefix}var(--semi-font-family-monospace, ${value})${suffix}`
          : match,
    );
    if (file.endsWith('/scss/global.scss')) {
      transformed = transformed.replace(
        /(^\s*font-family:\s*)([^;\n]+)(;)/gm,
        // body 中的原生固定字体栈也必须消费公开入口。
        (_match, prefix, value, suffix) =>
          `${prefix}var(--semi-font-family-regular, ${value})${suffix}`,
      );
      transformed += defaultTokens();
    }
    if (file.endsWith('/typography/typography.scss')) {
      transformed = transformed.replace(
        '.#{$module} {',
        '.#{$module} {\n    font-weight: var(--semi-typography-font-weight, inherit);',
      );
    }
  }
  return transformed.replace(
    /@import\s+(['"])([^'"]+)\1/g,
    // 每个 import 都先进入适配器；无法解析的外部 import 仍交给 Sass。
    (match, _quote, specifier) => {
      // 自定义协议使用已观察到的真实文件路径。
      const target = resolveImport(specifier, file);
      return target ? `@import ${JSON.stringify(`${importPrefix}${target}`)}` : match;
    },
  );
}

/** 编译入口供 npm CSS 构建和开发虚拟样式共用，消费者不需要 Sass。 */
export function compileTypographyTheme(options) {
  // 虚拟样式传入 data，普通发布入口直接读取文件。
  const source = options.data ?? readFileSync(options.file, 'utf8');
  return sass
    .renderSync({
      ...options,
      data: transformTypographySource(source, options.file),
      outputStyle: 'expanded',
      sourceMap: false,
      // 自定义协议仅解析本次适配后的 import，不更改 vendor 文件。
      importer(specifier) {
        if (!specifier.startsWith(importPrefix)) return null;
        // 协议路径仅来自本模块重写的 import。
        const file = specifier.slice(importPrefix.length);
        return { file, contents: transformTypographySource(readFileSync(file, 'utf8'), file) };
      },
    })
    .css.toString();
}
