import type { TokenBinding, TokenDefinition } from './token-catalog';

/** 来源 typography.css 的 14 个角色；顺序同时用于预览与变量目录。 */
export const dieluTypeRoles = [
  { name: 'title', label: '页面标题', size: 24, height: '32px', weight: 600 },
  { name: 'section', label: '分区标题', size: 16, height: '24px', weight: 600 },
  { name: 'subsection', label: '小节标题', size: 14, height: '20px', weight: 600 },
  { name: 'label', label: '表单标签', size: 14, height: '20px', weight: 500 },
  { name: 'body', label: '界面正文', size: 14, height: '20px', weight: 400 },
  { name: 'body-small', label: '次级正文', size: 13, height: '20px', weight: 400 },
  { name: 'caption', label: '辅助说明', size: 12, height: '16px', weight: 400 },
  { name: 'meta', label: '元信息', size: 11, height: '16px', weight: 400 },
  { name: 'code', label: '代码', size: 13, height: '22px', weight: 400 },
  { name: 'reading', label: '长文正文', size: 16, height: '1.8', weight: 400 },
  { name: 'document-title', label: '文档标题', size: 32, height: '44px', weight: 600 },
  { name: 'document-h1', label: '文档一级标题', size: 28, height: '1.4', weight: 600 },
  { name: 'document-h2', label: '文档二级标题', size: 24, height: '1.4', weight: 600 },
  { name: 'document-h3', label: '文档三级标题', size: 20, height: '1.4', weight: 600 },
];

/** 前景适配不会越过独立局部主题，:where 不增加组件单项覆盖所需的优先级。 */
function binding(selector: string, property: string, media?: string): TokenBinding {
  return {
    selector: selector.replace(
      /(::[\w-]+)?$/,
      ':where(:not([data-semi-theme="studio-local"] *))$1',
    ),
    property,
    ...(media ? { media } : {}),
  };
}

/** 所有新增值只消费文字或 outline 属性，不重写共享颜色、尺寸或背景。 */
function textToken(
  name: string,
  label: string,
  value: string,
  property: string,
  selectors: string[],
): TokenDefinition {
  return {
    name: `--studio-dielu-${name}`,
    label: `迭鹿 · ${label}`,
    category: 'typography',
    kind: 'text',
    source: 'studio',
    defaultValue: value,
    bindings: selectors.map(
      /** 每个选择器单独输出，避免逗号分支逃离主题边界。 */
      (selector) => binding(selector, property),
    ),
  };
}

/** 键盘实际焦点在原生 input 上，轮廓绘制在可见外层；鼠标操作不触发此规则。 */
const focusSelectors = [
  '.semi-button:focus-visible:not(:disabled)',
  '.semi-switch:not(.semi-switch-disabled):has(input:focus-visible)',
  '.semi-checkbox:not(.semi-checkbox-disabled):has(input:focus-visible)',
  '.semi-radio:not(.semi-radio-disabled):has(input:focus-visible)',
];

/** 两种模式共享文字尺度；前景色跟随现有主题，轮廓复用来源的品牌焦点色。 */
export const dieluTypographyTokens: TokenDefinition[] = [
  ...dieluTypeRoles.map(
    /** font 简写只用于显式排版角色，不重置组件自身字号、字重变体。 */
    (role) =>
      textToken(
        `type-${role.name}`,
        `${role.label}排版`,
        `${role.weight} ${role.size}px/${role.height} var(${role.name === 'code' ? '--studio-dielu-code-font-family' : '--semi-font-family-regular'})`,
        'font',
        [`.dielu-type-${role.name}`],
      ),
  ),
  {
    ...textToken(
      'type-document-title-compact',
      '窄屏文档标题排版',
      '600 24px/32px var(--semi-font-family-regular)',
      'font',
      [],
    ),
    bindings: [binding('.dielu-type-document-title', 'font', '(max-width: 640px)')],
  },
  // 来源 typography-components.css；正文/H4 继续跟随已有便捷设置，显式字重继续由组件处理。
  textToken('typography-size', '正文组件字号', 'var(--semi-font-size-regular)', 'font-size', [
    '.semi-typography',
  ]),
  textToken('typography-height', '正文组件行高', 'var(--semi-line-height-regular)', 'line-height', [
    '.semi-typography',
  ]),
  ...[
    [1, 32, 44],
    [2, 28, 40],
    [3, 24, 32],
    [4, 20, 28],
    [5, 18, 24],
    [6, 16, 22],
  ].flatMap(
    /** 六级标题保持来源尺寸，H4 同时兼容现有标题便捷编辑器。 */
    ([level, size, height]) => [
      textToken(
        `heading-${level}-size`,
        `H${level} 字号`,
        level === 4 ? 'var(--semi-font-size-header-4)' : `${size}px`,
        'font-size',
        [`h${level}.semi-typography`, `.semi-typography-h${level}.semi-typography`],
      ),
      textToken(
        `heading-${level}-height`,
        `H${level} 行高`,
        level === 4 ? 'var(--semi-line-height-header-4)' : `${height}px`,
        'line-height',
        [`h${level}.semi-typography`, `.semi-typography-h${level}.semi-typography`],
      ),
    ],
  ),
  textToken('heading-light-weight', '标题轻字重', '300', 'font-weight', [
    '.semi-typography[class*="-weight-light"]',
  ]),
  textToken(
    'small-text-font',
    '小号文字排版',
    '400 12px/16px var(--semi-font-family-regular)',
    'font',
    ['.semi-typography-small'],
  ),
  textToken('extended-paragraph-height', '舒展段落行高', '24px', 'line-height', [
    '.semi-typography-paragraph.semi-typography-extended',
  ]),
  // 按钮和 Select 已有公开编辑变量，继续引用它们，避免迁移后单项编辑失效。
  textToken(
    'button-font',
    '按钮文字排版',
    'var(--semi-button-font-weight, var(--semi-font-weight-strong)) var(--semi-button-font-size, var(--semi-font-size-regular))/var(--semi-button-line-height, var(--semi-line-height-regular)) var(--semi-font-family-regular)',
    'font',
    ['.semi-button'],
  ),
  textToken(
    'control-font',
    '输入附加文字排版',
    '14px/20px var(--semi-font-family-regular)',
    'font',
    ['.semi-input-prepend', '.semi-input-append'],
  ),
  ...[
    ['small', 14, 22],
    ['default', 14, 30],
    ['large', 16, 38],
  ].map(
    /** 行高扣除既有控件的上下边框，不改变 24/32/40px 高度。 */
    ([size, fontSize, height]) =>
      textToken(
        `input-${size}-font`,
        `${size} 输入文字排版`,
        `${fontSize}px/${height}px var(--semi-font-family-regular)`,
        'font',
        [`.semi-input-wrapper-${size}`, `.semi-input-${size}`],
      ),
  ),
  textToken('control-label-weight', '输入标签字重', '600', 'font-weight', [
    '.semi-input-inset-label',
    '.semi-input-prefix-text',
    '.semi-input-suffix-text',
    '.semi-select-inset-label',
    '.semi-select-prefix-text',
    '.semi-select-suffix-text',
  ]),
  textToken('select-font', '选项文字排版', '14px/20px var(--semi-font-family-regular)', 'font', [
    '.semi-select-option',
    '.semi-select-selection',
  ]),
  textToken(
    'select-weight',
    '选择器字重',
    'var(--semi-select-font-weight, var(--semi-font-weight-regular))',
    'font-weight',
    ['.semi-select', '.semi-select-selection'],
  ),
  textToken('select-selected-weight', '选中选项字重', '600', 'font-weight', [
    '.semi-select-option-selected',
    '.semi-select-option-keyword',
  ]),
  textToken(
    'select-large-font',
    '大号选中文字排版',
    '16px/22px var(--semi-font-family-regular)',
    'font',
    ['.semi-select-large .semi-select-selection'],
  ),
  textToken(
    'select-group-font',
    '选项分组排版',
    '12px/16px var(--semi-font-family-regular)',
    'font',
    ['.semi-select-group'],
  ),
  textToken('checkbox-font', '复选文字排版', '14px/20px var(--semi-font-family-regular)', 'font', [
    '.semi-checkbox',
  ]),
  textToken('radio-font', '单选文字排版', '14px/20px var(--semi-font-family-regular)', 'font', [
    '.semi-radio',
  ]),
  textToken('table-font', '表格文字排版', '14px/20px var(--semi-font-family-regular)', 'font', [
    '.semi-table-wrapper',
  ]),
  textToken('table-heading-weight', '表头字重', '600', 'font-weight', ['.semi-table-row-head']),
  textToken('tag-font', '标签文字排版', '12px/16px var(--semi-font-family-regular)', 'font', [
    '.semi-tag-default',
    '.semi-tag-small',
    '.semi-tag-large',
  ]),
  textToken('tag-colorful-weight', '彩色标签字重', '600', 'font-weight', ['.semi-tag-colorful']),
  textToken('popup-font', '浮层文字排版', '14px/20px var(--semi-font-family-regular)', 'font', [
    '.semi-modal',
    '.semi-tooltip-wrapper',
  ]),
  textToken('modal-heading-weight', '弹窗标题字重', '600', 'font-weight', ['.semi-modal-header']),
  textToken(
    'form-label-font',
    '组件表单标签排版',
    '600 14px/20px var(--semi-font-family-regular)',
    'font',
    ['.semi-form-field-label'],
  ),
  textToken(
    'focus-outline',
    '键盘焦点轮廓',
    '2px solid var(--semi-color-focus-border)',
    'outline',
    focusSelectors,
  ),
  textToken('focus-outline-offset', '键盘轮廓间隔', '2px', 'outline-offset', focusSelectors),
];

/** 与变量目录共用来源值，合并到两种模式的覆盖并参与撤销、导入和 CSS 导出。 */
export function dieluTypographyVariables(): Record<string, string> {
  return Object.fromEntries(
    dieluTypographyTokens.map(
      /** 不生成任何背景、填充、阴影或布局变量。 */
      (token) => [token.name, token.defaultValue],
    ),
  );
}
