/* global document, location -- 此入口只在真实浏览器消费页面运行。 */
import { createApp, h, ref } from 'vue';
import {
  Button,
  CodeHighlight,
  Input,
  Modal,
  Nav,
  Select,
  Table,
  Toast,
  Tooltip,
  Typography,
} from '@aifuxi/semi-ui-vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import { Form } from '@aifuxi/semi-ui-vue/form';
import { Dropdown } from '@aifuxi/semi-ui-vue/dropdown';
import { semiGlobal } from '@aifuxi/semi-ui-vue/config-provider';

// 保留这些组件的真实包入口及其 CSS，用于验证不同共享样式依赖的组合。
const styleCoverage = [Nav, Modal, Toast];

const input = ref('Initial');
const selected = ref('first');
// 真实安装包的错误状态必须保持空字符串，不能在消费者端转换为 false 或添加 v-if。
const packedError = ref('');

// 专项页面复用同一真实 tarball 服务，以 query 选择受控的测试输入。
const dropdownQuery = new URLSearchParams(location.search);
// 未指定专项参数时，原消费测试页面保持原来的组件组合。
const dropdownCase = dropdownQuery.get('dropdown');
// 排版专项复用真实安装包，仅切换测试页面，不注入组件实现。
const typographyThemeCase = dropdownQuery.has('typography-theme');
// 页面操作控制主题和新挂载对照，用于验证已挂载组件的自动重测。
const typographyThemeEnabled = ref(false);
const typographyReference = ref(0);
// Modal 保持声明式挂载，分别覆盖关闭 Portal 与直接卸载组件的生命周期。
const typographyModalVisible = ref(false);
const typographyModalCustom = ref(false);
const typographyModalMounted = ref(true);
// 混合宽窄字符使省略结果依赖真实字体及字重，而非固定字符数。
const typographyContent =
  '主题排版 WWW iii 编号 2026：保持宽度不变，切换字体、字重和行高后应重新计算省略内容。'.repeat(5);
// 真实点击反馈，不通过测试直接修改组件内部状态。
const dropdownStatus = ref('等待操作');
// 内容变宽后通过公开 rePosKey 触发定位，保留固定上游的更新契约。
const wideMenu = ref(false);
if (dropdownCase !== null) {
  document.body.style.margin = '0';
  // 全局覆盖仅作用于当前隔离消费页面，不接触任何应用配置。
  semiGlobal.config = {
    overrideDefaultProps: {
      Dropdown: {
        autoAdjustOverflow: dropdownQuery.has('global')
          ? dropdownQuery.get('global') === 'true'
          : undefined,
      },
      Tooltip: {
        autoAdjustOverflow: dropdownQuery.has('tooltip')
          ? dropdownQuery.get('tooltip') === 'true'
          : undefined,
      },
    },
  };
}

/** 渲染无业务 CSS、默认 Portal 和默认 position 的右上角最小复现。 */
function renderPackedDropdown() {
  // 缺省 case 不创建该键；undefined case 则显式传入 undefined。
  const optional =
    dropdownCase === 'omitted'
      ? {}
      : {
          autoAdjustOverflow: dropdownCase === 'undefined' ? undefined : dropdownCase === 'true',
        };
  // 四角均保留 16px 横向、12px 纵向间距，模拟原入口并检查翻转。
  const corner = dropdownQuery.get('corner') ?? 'top-right';
  return h('main', { style: { height: '100vh', padding: '12px 16px', boxSizing: 'border-box' } }, [
    h(
      'div',
      {
        style: {
          position: 'absolute',
          [corner.includes('bottom') ? 'bottom' : 'top']: '12px',
          [corner.includes('left') ? 'left' : 'right']: '16px',
        },
      },
      [
        h(
          Dropdown,
          {
            ...optional,
            trigger: 'click',
            rePosKey: String(wideMenu.value),
            menu: [
              // 菜单点击只更新可观察反馈，不增加应用侧关闭或定位绕过。
              {
                node: 'item',
                name: '离线文本 (.txt)',
                // 文本菜单回调显示实际鼠标或键盘激活的结果。
                onClick: () => {
                  dropdownStatus.value = '已选择文本';
                },
              },
              {
                node: 'item',
                name: wideMenu.value
                  ? 'Excel 工作簿与更多导出选项 (.xlsx)'
                  : 'Excel 工作簿 (.xlsx)',
                // 第二项单独反馈，用于核对 ArrowDown 导航后的激活目标。
                onClick: () => {
                  dropdownStatus.value = '已选择 Excel';
                },
              },
            ],
          },
          {
            // 使用真实 Button 组件作为默认触发器，并保留其普通文本插槽。
            default: () => h(Button, { size: 'small', theme: 'solid' }, () => '导出'),
          },
        ),
      ],
    ),
    h('output', { style: { position: 'absolute', left: '40%', top: '45%' } }, dropdownStatus.value),
    h(
      'button',
      {
        style: { position: 'absolute', left: '40%', top: '55%' },
        // 通过页面外部控件更新菜单宽度，同时覆盖外部点击关闭路径。
        onClick: () => {
          wideMenu.value = !wideMenu.value;
        },
      },
      '切换菜单内容',
    ),
  ]);
}

/** 使用打包后的公开 Form 子路径渲染错误边界与错误清除操作。 */
function renderPackedErrorCases() {
  // 静态空错误与显式布尔错误用于核对生产编译后的 props 语义。
  const cases = [
    ['undefined', undefined],
    ['false', false],
    ['empty', ''],
    ['true', true],
  ];
  return h('section', { 'aria-label': 'Packed Form.ErrorMessage' }, [
    // 每个宿主均保持存在，让测试能区分隐藏错误和未加载示例。
    ...cases.map(([id, error]) =>
      h('div', { 'data-packed-error': id }, [
        h(Form.ErrorMessage, { error, validateStatus: 'error', showValidateIcon: true }),
      ]),
    ),
    h('div', { 'data-packed-error': 'dynamic' }, [
      h(Form.ErrorMessage, {
        error: packedError.value,
        validateStatus: 'error',
        showValidateIcon: true,
      }),
    ]),
    // 重复进入错误和清除状态，检查生产包是否留下无文字图标。
    h(
      'button',
      {
        type: 'button',
        onClick: () => {
          packedError.value = '请填写名称。';
        },
      },
      'Packed show error',
    ),
    // 直接传递空字符串，复验本次发布产物最初报告的输入。
    h(
      'button',
      {
        type: 'button',
        onClick: () => {
          packedError.value = '';
        },
      },
      'Packed clear error',
    ),
  ]);
}

/** 返回显式容器，验证其主题优先于触发器所在主题。 */
function packedThemePopupContainer() {
  return document.getElementById('packed-theme-popup-container');
}

/** 渲染强制走 JavaScript 省略路径的固定尺寸段落。 */
function renderPackedThemeEllipsis(id, key) {
  return h(
    Typography.Paragraph,
    {
      key,
      'data-testid': id,
      strong: true,
      ellipsis: {
        rows: 2,
        expandable: true,
        collapsible: true,
        collapseText: '收起全文',
        showTooltip: false,
      },
      // 固定外框尺寸，排除 ResizeObserver 恰好发现尺寸变化的偶然通过。
      style: { width: '240px', height: '84px', margin: '0' },
    },
    // 同一正文用于已挂载实例和后续新实例的公开行为对照。
    () => typographyContent,
  );
}

/** 用普通 CSS 和公开组件渲染真实 tarball 排版主题消费页面。 */
function renderPackedTypographyTheme() {
  return h('main', { style: { padding: '24px' } }, [
    h(
      'style',
      // 主题仅声明公开变量，不覆盖 .semi-* 规则或修改组件内部 DOM。
      `.packed-theme-on {
        --semi-font-family-regular: monospace;
        --semi-font-family-monospace: "Courier New", monospace;
        --semi-font-size-regular: 18px;
        --semi-line-height-regular: 30px;
        --semi-font-size-small: 13px;
        --semi-line-height-small: 18px;
        --semi-font-size-header-1: 36px;
        --semi-line-height-header-1: 50px;
        --semi-font-size-header-5: 25px;
        --semi-line-height-header-5: 34px;
        --semi-font-weight-regular: 450;
        --semi-font-weight-strong: 800;
        --semi-button-font-size: 19px;
      }
      .packed-theme-on.packed-theme-roomy {
        --semi-font-size-regular: 24px;
        --semi-line-height-regular: 36px;
        --semi-font-weight-strong: 900;
      }
      .packed-theme-inner {
        --semi-font-size-regular: 16px;
        --semi-line-height-regular: 26px;
      }
      .packed-theme-on [data-testid^="packed-ellipsis-"] {
        --semi-font-family-regular: Arial, sans-serif;
        --semi-typography-strong-font-weight: 400;
      }
      .packed-theme-roomy [data-testid^="packed-ellipsis-"] {
        --semi-typography-strong-font-weight: 900;
      }
      #packed-theme-popup-container {
        --semi-font-family-regular: serif;
        --semi-font-size-regular: 22px;
        --semi-line-height-regular: 34px;
        --semi-font-size-header-5: 27px;
        --semi-line-height-header-5: 38px;
      }`,
    ),
    h('div', { id: 'packed-theme-popup-container', 'data-semi-theme': 'popup' }),
    h(
      'button',
      {
        type: 'button',
        // 仅通过用户可见控件切换普通 class；组件不能依赖测试专用刷新 API。
        onClick: () => {
          typographyThemeEnabled.value = !typographyThemeEnabled.value;
        },
      },
      '切换排版主题',
    ),
    h(
      'button',
      {
        type: 'button',
        // 在同样主题下新挂载一个独立实例，校验已挂载实例的自动更新结果。
        onClick: () => {
          typographyReference.value += 1;
        },
      },
      '挂载排版对照',
    ),
    h(
      'section',
      {
        'data-testid': 'packed-theme-root',
        'data-semi-theme': 'consumer',
        class: typographyThemeEnabled.value ? 'packed-theme-on' : undefined,
      },
      [
        h(Typography.Text, { 'data-testid': 'packed-theme-text' }, () => '主题正文'),
        h(
          Typography.Text,
          { size: 'small', 'data-testid': 'packed-theme-small' },
          () => '主题小字',
        ),
        h(
          Typography.Text,
          { strong: true, 'data-testid': 'packed-theme-strong' },
          () => '主题强调',
        ),
        h(Typography.Text, { weight: 500, 'data-testid': 'packed-theme-weight' }, () => '显式字重'),
        h(
          Typography.Text,
          { style: { fontSize: '21px', lineHeight: '33px' }, 'data-testid': 'packed-theme-inline' },
          () => '显式内联排版',
        ),
        // 标题各级分别取基线值，防止只接入正文或错误地改成等比标题。
        // 每个层级使用独立公开 heading，避免测试直接构造内部 class。
        ...[1, 2, 3, 4, 5, 6].map((heading) =>
          h(
            Typography.Title,
            { heading, 'data-testid': `packed-theme-h${heading}` },
            () => `标题 ${heading}`,
          ),
        ),
        h(
          Typography.Title,
          { heading: 6, weight: 'bold', 'data-testid': 'packed-theme-bold' },
          () => '显式粗标题',
        ),
        h(
          Typography.Paragraph,
          { spacing: 'extended', 'data-testid': 'packed-theme-extended' },
          () => '宽松段落',
        ),
        h(Button, { 'data-testid': 'packed-theme-button' }, () => '主题按钮'),
        h(Input, { 'aria-label': '主题默认输入框', value: '默认尺寸' }),
        h(Input, { 'aria-label': '主题小输入框', size: 'small', value: '小尺寸' }),
        h(Input, { 'aria-label': '主题大输入框', size: 'large', value: '大尺寸' }),
        h(Select, {
          'aria-label': '主题选择器',
          value: 'first',
          motion: false,
          style: { width: '200px' },
          optionList: [
            { label: '主题选项 First', value: 'first' },
            { label: '主题选项 Second', value: 'second' },
          ],
        }),
        h(
          Tooltip,
          {
            trigger: 'click',
            motion: false,
            position: 'bottom',
            content: h('span', { 'data-testid': 'packed-theme-tooltip' }, '默认容器提示'),
          },
          // 真实 Button 默认插槽作为交互触发器。
          { default: () => h(Button, {}, () => '打开主题提示') },
        ),
        h(
          Tooltip,
          {
            trigger: 'click',
            motion: false,
            position: 'bottom',
            getPopupContainer: packedThemePopupContainer,
            content: h('span', { 'data-testid': 'packed-theme-custom-tooltip' }, '显式容器提示'),
          },
          // 第二个触发器专门验证显式容器优先级。
          { default: () => h(Button, {}, () => '打开独立容器提示') },
        ),
        h(Table, {
          pagination: false,
          columns: [{ title: '主题表格', dataIndex: 'label' }],
          dataSource: [{ key: 'first', label: '主题单元格' }],
        }),
        h(CodeHighlight, { code: 'const theme = true;', language: 'javascript' }),
        h(JsonViewer, { value: '{"theme":true}', width: 360, height: 100 }),
        h('div', { class: 'semi-always-light' }, [
          h(Typography.Text, { 'data-testid': 'packed-theme-always-light' }, () => '固定浅色排版'),
        ]),
        h('div', { class: 'semi-always-dark' }, [
          h(Typography.Text, { 'data-testid': 'packed-theme-always-dark' }, () => '固定深色排版'),
        ]),
        h('section', { class: 'packed-theme-inner', 'data-semi-theme': 'nested' }, [
          h(Typography.Text, { 'data-testid': 'packed-theme-inner-text' }, () => '嵌套正文'),
        ]),
        // 默认 body 与显式外部容器复用相同声明位置，便于核对容器优先级。
        ...[false, true].map((custom) =>
          h(
            Button,
            {
              // 重新挂载后打开，检查上一次卸载不会留下主题观察或覆盖。
              onClick: () => {
                typographyModalMounted.value = true;
                typographyModalCustom.value = custom;
                typographyModalVisible.value = true;
              },
            },
            // 入口名称明确区分默认 Portal 和调用方显式容器。
            () => (custom ? '打开显式容器弹窗' : '打开默认主题弹窗'),
          ),
        ),
        typographyModalMounted.value
          ? h(
              Modal,
              {
                visible: typographyModalVisible.value,
                motion: false,
                title: '排版主题弹窗',
                getPopupContainer: typographyModalCustom.value
                  ? packedThemePopupContainer
                  : undefined,
                // 正常关闭仍保留声明式组件，只销毁其默认不保留的 Portal。
                onCancel: () => {
                  typographyModalVisible.value = false;
                },
              },
              {
                // 内容使用真实 Typography，测试其在 body Portal 下继续消费局部主题。
                default: () => [
                  h(
                    Typography.Text,
                    { 'data-testid': 'packed-theme-modal-text' },
                    // 普通正文不通过消费者 CSS 特殊适配 Modal。
                    () => '声明式弹窗正文',
                  ),
                  h(
                    'button',
                    {
                      type: 'button',
                      // 可见时直接卸载整个 Modal，覆盖隐藏流程之外的清理路径。
                      onClick: () => {
                        typographyModalMounted.value = false;
                      },
                    },
                    '卸载声明式弹窗',
                  ),
                ],
              },
            )
          : null,
        renderPackedThemeEllipsis('packed-ellipsis-live', 'live'),
        typographyReference.value > 0
          ? renderPackedThemeEllipsis('packed-ellipsis-reference', typographyReference.value)
          : null,
      ],
    ),
    h('section', { 'data-semi-theme': 'neighbor' }, [
      h(Typography.Text, { 'data-testid': 'packed-theme-neighbor' }, () => '相邻默认正文'),
    ]),
  ]);
}

createApp({
  // 根消费示例保留原有组件交互，并加入直接调用的错误提示区域。
  render: () =>
    typographyThemeCase
      ? renderPackedTypographyTheme()
      : dropdownCase !== null
        ? renderPackedDropdown()
        : h('main', [
            h(
              Button,
              {
                // 按钮驱动现有输入状态。
                onClick: () => {
                  input.value = 'Clicked';
                },
              },
              // 保留真实 Button 默认插槽。
              () => 'Packed button',
            ),
            h(Input, {
              value: input.value,
              'aria-label': 'Packed input',
              // 原样同步输入的公开 change 值。
              onChange: (value) => {
                input.value = value;
              },
            }),
            h(Select, {
              value: selected.value,
              'aria-label': 'Packed select',
              optionList: [
                { label: 'First', value: 'first' },
                { label: 'Second', value: 'second' },
              ],
              // 原样同步选择器的公开 change 值。
              onChange: (value) => {
                selected.value = value;
              },
            }),
            h('output', { id: 'packed-state' }, input.value + ':' + selected.value),
            h(CodeHighlight, { code: 'const ready = true;\nready();', language: 'javascript' }),
            h(JsonViewer, { value: '{"name":"Semi"}', width: 600, height: 160 }),
            renderPackedErrorCases(),
          ]),
}).mount('#app');

console.log(styleCoverage.length);
