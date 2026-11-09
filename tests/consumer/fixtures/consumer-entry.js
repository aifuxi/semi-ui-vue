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
  Tag,
  Toast,
  Tooltip,
  Typography,
} from '@aifuxi/semi-ui-vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import { Form } from '@aifuxi/semi-ui-vue/form';
import { Dropdown } from '@aifuxi/semi-ui-vue/dropdown';
import { semiGlobal } from '@aifuxi/semi-ui-vue/config-provider';
import { createColorTheme, colorThemeToCss } from '@aifuxi/semi-theme-default/colors';
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import { Popover } from '@aifuxi/semi-ui-vue/popover';

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
// 固定列专项通过 CSS 变量和公开 columns.width 复现，不注入组件补丁。
const tableFixedCase = dropdownQuery.has('table-fixed-widths');
// 可访问性专项只使用公开 Modal，不注入 DOM ID 或业务样式补丁。
const modalA11yCase = dropdownQuery.has('modal-a11y');
// 模拟详情内部的状态操作，默认关闭内层，保留原始入场与退场动效。
const nestedModalVisible = ref(false);
// 外层也保持受控，不能用 closeOnEsc=false 掩盖两层同时取消的错误。
const outerModalVisible = ref(true);
// 模拟 Dropdown 菜单项打开确认后从文档移除。
const modalOpenerVisible = ref(true);

/** 与业务现场相同，初始打开已有详情，保留默认动效。 */
const sideSheetVisible = ref(true);
/** 名称由公开 aria-label 和 title 插槽共享，模拟切换工作项。 */
const sideSheetName = ref('工作项详情');

/** 只在受控用例中作为 visible 输入，其他用例由组件持有状态。 */
const popoverVisible = ref(false);
/** 公开事件轨迹用于识别关闭后又重新发出 true 的回归。 */
const popoverEvents = ref([]);

/** 以原生按钮与公开属性复现重复点击，不添加业务 toggle 或关闭补丁。 */
function renderPackedPopoverRepeat() {
  /** omitted 与显式 false 分开验证，默认行为保持不变。 */
  const hide = dropdownQuery.get('hide');
  return h('main', { style: { padding: '32px' } }, [
    h(
      Popover,
      {
        trigger: 'click',
        ...(hide === 'omitted' ? {} : { clickTriggerToHide: hide === 'true' }),
        ...(dropdownQuery.has('controlled') ? { visible: popoverVisible.value } : {}),
        // 默认保留真实动效，仅显式专项同时覆盖 motion=false。
        ...(dropdownQuery.has('no-motion') ? { motion: false } : {}),
        content: h('button', { type: 'button' }, '面板操作'),
        // 只同步公开模型并记录事件，不从消费侧决定是否关闭。
        'onUpdate:visible': (visible) => {
          popoverVisible.value = visible;
          popoverEvents.value.push(visible);
        },
      },
      {
        // 触发器本身没有 toggle 事件，状态变化必须来自组件库。
        default: () => h('button', { type: 'button' }, '排序'),
      },
    ),
    h('button', { type: 'button', style: { marginLeft: '240px' } }, '外部区域'),
    h('output', { 'data-testid': 'popover-events' }, popoverEvents.value.join(',')),
  ]);
}

/** 渲染真实安装包的侧边详情，仅通过公开属性与插槽驱动状态。 */
function renderPackedSideSheet() {
  return h('main', [
    h(
      'button',
      {
        // 关闭退出后通过原入口重新打开，不操作内部 DOM。
        onClick: () => {
          sideSheetVisible.value = true;
        },
      },
      '打开详情',
    ),
    h(
      SideSheet,
      {
        visible: sideSheetVisible.value,
        mask: false,
        'aria-label': sideSheetName.value,
        // 沿用组件公开的可见性事件，保留真实退出时机。
        'onUpdate:visible': (value) => {
          sideSheetVisible.value = value;
        },
      },
      {
        // 标题插槽与显式名称同时存在，复现原始调用方式。
        title: () => h('h2', sideSheetName.value),
        // 通过真实控件更新公开名称，检查生产包的响应式链路。
        default: () =>
          h(
            'button',
            {
              // 切换详情内容时应同步更新可访问名称。
              onClick: () => {
                sideSheetName.value = '更新后的详情';
              },
            },
            '切换工作项',
          ),
      },
    ),
  ]);
}

// 仅改变外层 CSS，不更换 columns/rowSelection/scroll 的对象身份，确保重测来自 ResizeObserver。
const packedTableWideColumns = ref(false);
// 容器缩窄独立于主题列宽，分别验证两条浏览器布局路径。
const packedTableNarrowContainer = ref(false);
// 三十四条记录与工单相同，默认每页二十条，以验证换页和纵向滚动。
const packedFixedTableData = Array.from(
  { length: 34 },
  // 内容使用稳定编号，分页不得由测试直接重写数据。
  (_, index) => ({
    key: index,
    name: `工作项 ${index + 1}`,
    status: '待处理',
    owner: '研发',
    last: '操作',
  }),
);
// 保持 props 身份不变，防止父级更新触发列 watcher 而掩盖 CSS 独立重测缺失。
const packedFixedTableProps = {
  direction: dropdownQuery.get('direction') === 'rtl' ? 'rtl' : 'ltr',
  columns: [
    {
      key: 'name',
      dataIndex: 'name',
      title: '名称',
      width: 'var(--table-name-width)',
      fixed: 'left',
    },
    { key: 'status', dataIndex: 'status', title: '状态', width: 480 },
    { key: 'owner', dataIndex: 'owner', title: '负责人', width: 'calc(48px * 2)', fixed: 'right' },
    {
      key: 'last',
      dataIndex: 'last',
      title: '操作',
      width: 'var(--table-end-width)',
      fixed: 'right',
    },
  ],
  dataSource: packedFixedTableData,
  rowSelection: { fixed: 'left', width: 'var(--table-selection-width)' },
  scroll: {
    x: 'calc(var(--table-selection-width) + var(--table-name-width) + 480px + 96px + var(--table-end-width))',
    y: 260,
  },
  pagination: { pageSize: 20 },
};

/** 标准 Table 的真实包消费，列宽仅由祖先 CSS 变量与容器尺寸决定。 */
function renderPackedTableFixedWidths() {
  return h('main', [
    h(
      Button,
      {
        // 只切换祖先主题变量；Table props 引用保持原样。
        onClick: () => {
          packedTableWideColumns.value = !packedTableWideColumns.value;
        },
      },
      { /* 通过可见控件触发主题列宽变更。 */ default: () => '切换列宽' },
    ),
    h(
      Button,
      {
        // 根容器宽度变化应复用原 Observer 路径。
        onClick: () => {
          packedTableNarrowContainer.value = !packedTableNarrowContainer.value;
        },
      },
      { /* 容器变化与纯 CSS 变量变化独立。 */ default: () => '切换容器宽度' },
    ),
    h(
      'section',
      {
        'data-testid': 'packed-fixed-table-host',
        style: {
          width: packedTableNarrowContainer.value ? '560px' : '600px',
          '--table-selection-width': packedTableWideColumns.value ? '72px' : '56px',
          '--table-name-width': '240px',
          '--table-end-width': packedTableWideColumns.value ? '112px' : '80px',
        },
      },
      [h(Table, packedFixedTableProps)],
    ),
  ]);
}

/** 渲染真实安装包的详情、嵌套确认与命令式确认入口。 */
function renderPackedModalA11y() {
  return h(
    Modal,
    {
      visible: outerModalVisible.value,
      title: '详情外层',
      // 外层用默认 Esc 行为，取消应当只在它成为顶层后发生。
      'onUpdate:visible': (visible) => {
        outerModalVisible.value = visible;
      },
      maskClosable: false,
      footer: null,
    },
    {
      // 与工单相同，同时提供 title 和自定义 header；不添加固定 ID。
      ...(dropdownQuery.has('custom-header')
        ? {
            // 自定义头部只决定视觉结构，名称继续由公开 title 提供。
            header: () => h('header', [h('h2', '详情外层'), h('span', '附加操作')]),
          }
        : {}),
      // 内层由真实控件切换 visible，Portal 和焦点全部由库自身管理。
      default: () => [
        h('p', '外层正文'),
        modalOpenerVisible.value
          ? h(
              Button,
              {
                // 公开可见性状态驱动嵌套组件。
                onClick: () => {
                  nestedModalVisible.value = true;
                  if (dropdownQuery.has('removed-opener')) modalOpenerVisible.value = false;
                },
              },
              {
                // 保留稳定的用户操作名称。
                default: () => '打开操作确认',
              },
            )
          : null,
        h(
          Button,
          {
            // 两次静态调用创建两个 app，覆盖 useId 的跨 app 边界。
            onClick: () => {
              Modal.confirm({ title: '命令确认', content: '命令确认正文' });
              Modal.info({ title: '命令提示', content: '命令提示正文' });
            },
          },
          {
            // 提供独立入口，不与声明式内层状态混用。
            default: () => '打开命令式弹窗',
          },
        ),
        h(
          Modal,
          {
            visible: nestedModalVisible.value,
            title: '操作确认',
            maskClosable: false,
            closeOnEsc: !dropdownQuery.has('inner-protected'),
            keepDOM: dropdownQuery.has('keep-dom'),
            // 用户取消或 Esc 只改变内层的公开 visible。
            'onUpdate:visible': (visible) => {
              nestedModalVisible.value = visible;
            },
          },
          {
            // 不使用自定义 header，直接复现工单的标准标题路径。
            default: () => '内层正文',
          },
        ),
      ],
    },
  );
}
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

// 颜色专项从真实安装包导入纯函数，其他专项页面不主动生成或加载颜色主题。
const colorThemeCase = dropdownQuery.has('color-theme');
// 两个独立品牌用于核对并列、嵌套及实时切换，默认 CSS 不参与生成。
const colorThemes = colorThemeCase
  ? [createColorTheme({ brand: '#7c3aed' }), createColorTheme({ brand: '#e8590c' })]
  : [];
// 公开属性变化驱动真实主题刷新，不调用组件私有更新方法。
const colorThemeMode = ref('light');
const colorThemeAlternate = ref(false);
const colorThemeEnabled = ref(true);
// Modal 分别覆盖正常关闭与直接卸载后的重新创建。
const colorModalVisible = ref(false);
const colorModalCustom = ref(false);
const colorModalMounted = ref(true);

/** 返回有独立品牌和深色模式的显式弹层容器。 */
function packedColorPopupContainer() {
  return document.getElementById('packed-color-popup-container');
}

/** 渲染主题中实际消费 primary 的按钮，保持组件默认尺寸和字体。 */
function renderPackedColorButton(id, text) {
  return h(
    Button,
    { theme: 'solid', 'data-testid': id },
    // 普通文字插槽不声明业务颜色，全部由公开主题变量决定。
    () => text,
  );
}

/** 将实际生成的色盘暴露为测试输入，消费断言独立验证语义绑定和组件最终样式。 */
function renderPackedColorExpected(id, theme, mode) {
  return h(
    'output',
    { 'data-testid': id, style: { display: 'none' } },
    JSON.stringify(theme.palette[mode]),
  );
}

/** 使用普通 CSS 输出和公开组件验证完整的真实包颜色主题路径。 */
function renderPackedColorTheme() {
  // 初始紫色与切换后的橙色同时生成，class 变化只改变级联，不替换样式表文本。
  const initialTheme = colorThemes[0];
  const alternateTheme = colorThemes[1];
  const selectedTheme = colorThemeAlternate.value ? alternateTheme : initialTheme;
  const mainSelector = '[data-semi-theme="color-main"]';
  // 模式选择器显式声明，生成器不推断文档中任意嵌套边界的模式。
  const colorCss = [
    colorThemeToCss(initialTheme, {
      selectors: {
        light: `${mainSelector}:not(.packed-color-alternate)[theme-mode="light"]`,
        dark: `${mainSelector}:not(.packed-color-alternate)[theme-mode="dark"]`,
      },
    }),
    colorThemeToCss(alternateTheme, {
      selectors: {
        light: `${mainSelector}.packed-color-alternate[theme-mode="light"]`,
        dark: `${mainSelector}.packed-color-alternate[theme-mode="dark"]`,
      },
    }),
    colorThemeToCss(alternateTheme, {
      selectors: {
        light: '[data-semi-theme="color-independent"][theme-mode="light"]',
        dark: '[data-semi-theme="color-independent"][theme-mode="dark"]',
      },
    }),
    colorThemeToCss(initialTheme, {
      selectors: {
        light: 'body[data-color-global="on"]:not([theme-mode="dark"])',
        dark: 'body[data-color-global="on"][theme-mode="dark"]',
      },
    }),
  ].join('\n');
  return h('main', { style: { padding: '24px' } }, [
    h('style', colorCss),
    renderPackedColorExpected('packed-color-expected', selectedTheme, colorThemeMode.value),
    renderPackedColorExpected('packed-color-expected-light', selectedTheme, 'light'),
    renderPackedColorExpected('packed-color-expected-dark', selectedTheme, 'dark'),
    renderPackedColorExpected(
      'packed-color-alternate-expected',
      alternateTheme,
      colorThemeMode.value,
    ),
    renderPackedColorExpected('packed-color-independent-expected', alternateTheme, 'dark'),
    renderPackedColorExpected('packed-color-global-expected', initialTheme, colorThemeMode.value),
    h('div', {
      id: 'packed-color-popup-container',
      'data-semi-theme': 'color-independent',
      'theme-mode': 'dark',
    }),
    h(
      'button',
      {
        type: 'button',
        // 用户操作改变普通 class，保持已打开的 Portal 节点不被重新挂载。
        onClick: () => {
          colorThemeAlternate.value = !colorThemeAlternate.value;
        },
      },
      '切换品牌颜色',
    ),
    h(
      'button',
      {
        type: 'button',
        // 全局和局部模式一起改变，检验跨 body Portal 的显式模式桥接。
        onClick: () => {
          colorThemeMode.value = colorThemeMode.value === 'light' ? 'dark' : 'light';
          document.body.setAttribute('theme-mode', colorThemeMode.value);
        },
      },
      '切换颜色模式',
    ),
    h(
      'button',
      {
        type: 'button',
        // 撤销主题边界后，默认 body Portal 必须恢复全局颜色而非残留旧变量。
        onClick: () => {
          colorThemeEnabled.value = !colorThemeEnabled.value;
        },
      },
      '切换局部颜色边界',
    ),
    h(
      'button',
      {
        type: 'button',
        // 主题显式启用后才覆盖 body，单纯导入生成器不能改变默认颜色。
        onClick: () => {
          document.body.setAttribute('data-color-global', 'on');
        },
      },
      '启用全局颜色主题',
    ),
    h(
      'section',
      {
        'data-testid': 'packed-color-root',
        'data-semi-theme': colorThemeEnabled.value ? 'color-main' : undefined,
        'theme-mode': colorThemeMode.value,
        class: colorThemeAlternate.value ? 'packed-color-alternate' : undefined,
        style: { padding: '16px', display: 'grid', gap: '12px', maxWidth: '480px' },
      },
      [
        renderPackedColorButton('packed-color-button', '品牌主要按钮'),
        h(
          Typography.Text,
          { link: true, 'data-testid': 'packed-color-link' },
          // 链接和焦点使用 brand，info 仍使用独立 blue 色阶。
          () => '品牌链接',
        ),
        h(
          Typography.Text,
          { 'data-testid': 'packed-color-text' },
          // 正文验证生成灰阶与默认排版分别保持自己的契约。
          () => '品牌正文',
        ),
        h(Input, { 'aria-label': '颜色输入框', value: '保持默认字体与高度' }),
        h(Select, {
          value: 'first',
          motion: false,
          optionList: [
            { label: '颜色选项 First', value: 'first' },
            { label: '颜色选项 Second', value: 'second' },
          ],
        }),
        h(
          Tag,
          { color: 'blue', type: 'solid', 'data-testid': 'packed-color-tag' },
          // 显式蓝色标签应使用生成 blue，而不是将所有蓝色强行替换为 brand。
          () => '独立信息蓝标签',
        ),
        h(
          Tooltip,
          {
            trigger: 'click',
            motion: false,
            position: 'bottom',
            content: h(
              Typography.Text,
              { link: true, 'data-testid': 'packed-color-tooltip-link' },
              // Portal 内真实链接消费其物理宿主的语义颜色。
              () => '默认颜色提示链接',
            ),
          },
          {
            // 默认 Tooltip 保持 body Portal，必须由库本身桥接局部颜色。
            default: () => h(Button, {}, () => '打开颜色提示'),
          },
        ),
        h(
          Tooltip,
          {
            trigger: 'click',
            motion: false,
            position: 'bottom',
            getPopupContainer: packedColorPopupContainer,
            content: h(
              Typography.Text,
              { link: true, 'data-testid': 'packed-color-custom-link' },
              // 显式容器故意处于不同品牌与模式，不能复制源主题覆盖它。
              () => '独立容器提示链接',
            ),
          },
          {
            // 第二个真实触发器区分显式容器路径。
            default: () => h(Button, {}, () => '打开独立颜色提示'),
          },
        ),
        h('div', { class: 'semi-always-light' }, [
          renderPackedColorButton('packed-color-always-light', '固定浅色品牌按钮'),
        ]),
        h('div', { class: 'semi-always-dark' }, [
          renderPackedColorButton('packed-color-always-dark', '固定深色品牌按钮'),
          h(
            Tooltip,
            {
              trigger: 'click',
              motion: false,
              position: 'bottom',
              // 触发源被强制为深色，内容跨 body Portal 后仍需保留该实际计算模式。
              content: h('div', [
                renderPackedColorButton('packed-color-force-popup-dark', '提示中的深色品牌按钮'),
                h('div', { class: 'semi-always-light' }, [
                  // Portal 内再次强制浅色，验证两套 carrier 均跨边界保留。
                  renderPackedColorButton('packed-color-force-popup-light', '提示中的浅色品牌按钮'),
                ]),
              ]),
            },
            {
              // 独立触发器避免默认提示覆盖后续控件，专项用例单独打开该弹层。
              default: () => h(Button, {}, () => '打开固定深色颜色提示'),
            },
          ),
        ]),
        h('section', { 'data-semi-theme': 'color-independent', 'theme-mode': 'dark' }, [
          renderPackedColorButton('packed-color-nested', '嵌套独立品牌按钮'),
        ]),
        // 两个公开入口复用相同声明位置，仅显式容器配置不同。
        ...[false, true].map(
          // 用户点击时重新挂载已卸载的 Modal，覆盖完整生命周期。
          (custom) =>
            h(
              Button,
              {
                // 每次用户打开均从当前主题和显式容器配置创建弹层。
                onClick: () => {
                  colorModalMounted.value = true;
                  colorModalCustom.value = custom;
                  colorModalVisible.value = true;
                },
              },
              // 插槽文案明确区分实际容器。
              () => (custom ? '打开独立颜色弹窗' : '打开默认颜色弹窗'),
            ),
        ),
        colorModalMounted.value
          ? h(
              Modal,
              {
                visible: colorModalVisible.value,
                motion: false,
                title: '颜色主题弹窗',
                getPopupContainer: colorModalCustom.value ? packedColorPopupContainer : undefined,
                // 正常关闭仍保留声明位置，重开需使用当前主题。
                onCancel: () => {
                  colorModalVisible.value = false;
                },
              },
              {
                // 内容按钮使用真实组件变量，不能由测试专用 style 代替主题消费。
                default: () => [
                  renderPackedColorButton('packed-color-modal-button', '弹窗品牌按钮'),
                  h(
                    Button,
                    {
                      // 直接卸载可见实例，检验镜像属性与订阅同时释放。
                      onClick: () => {
                        colorModalMounted.value = false;
                      },
                    },
                    // 保留用户可见的卸载控件。
                    () => '卸载颜色弹窗',
                  ),
                ],
              },
            )
          : null,
      ],
    ),
    h('section', { 'data-testid': 'packed-color-neighbor' }, [
      renderPackedColorButton('packed-color-neighbor-button', '相邻全局按钮'),
    ]),
  ]);
}

/** 菜单及弹窗均使用公开受控值，复现菜单关闭与弹窗打开的同一轮更新。 */
const dropdownModalMenuVisible = ref(false);
/** 不添加 autofocus 或延时，保留 Modal 默认聚焦取消按钮的行为。 */
const dropdownModalVisible = ref(false);
/** 公开回调的执行次数用于发现重复激活及意外取消。 */
const dropdownModalActions = ref(0);
/** 只有用户明确取消后才应增加。 */
const dropdownModalCancels = ref(0);

/** 使用公开 Dropdown/Modal 复现键盘激活，不加业务侧事件拦截。 */
function renderPackedDropdownModal() {
  /** 默认动效与关闭动效都必须保持同样的键盘契约。 */
  const motion = !dropdownQuery.has('no-motion');
  return h('main', [
    h(
      Dropdown,
      {
        trigger: 'click',
        motion,
        visible: dropdownModalMenuVisible.value,
        // 公开 v-model 回写，不使用 visibleChange 替代请求事件。
        'onUpdate:visible': (visible) => {
          dropdownModalMenuVisible.value = visible;
        },
      },
      {
        // 使用真实 Button，浏览器负责产生完整键盘默认动作。
        default: () => h(Button, null, () => '打开管理菜单'),
        content: () =>
          h(Dropdown.Menu, null, () =>
            h(
              Dropdown.Item,
              {
                // 与业务现场一致：同步关闭菜单并打开 Modal。
                onClick: () => {
                  dropdownModalActions.value += 1;
                  dropdownModalMenuVisible.value = false;
                  dropdownModalVisible.value = true;
                },
              },
              // 菜单项名称供键盘和鼠标对照共用。
              () => '重命名',
            ),
          ),
      },
    ),
    h(
      Modal,
      {
        title: '管理表单',
        visible: dropdownModalVisible.value,
        motion,
        // 仅记录公开取消回调，不从测试写入内部状态。
        onCancel: () => {
          dropdownModalCancels.value += 1;
          dropdownModalVisible.value = false;
        },
      },
      // 不声明 autofocus，确保测试覆盖原缺陷的默认焦点路径。
      () => h('input', { 'aria-label': '名称' }),
    ),
    h(
      'output',
      { 'data-testid': 'dropdown-modal-state' },
      `actions=${dropdownModalActions.value};cancels=${dropdownModalCancels.value};visible=${dropdownModalVisible.value}`,
    ),
  ]);
}

/** 浮层专项复用真实包服务，其他组件消费页面保持原入口。 */
const overlayRender = dropdownQuery.has('dropdown-modal')
  ? renderPackedDropdownModal
  : dropdownQuery.has('popover-repeat')
    ? renderPackedPopoverRepeat
    : dropdownQuery.has('side-sheet-a11y')
      ? renderPackedSideSheet
      : undefined;

createApp({
  // 根消费示例保留原有组件交互，并加入直接调用的错误提示区域。
  render: () =>
    overlayRender
      ? overlayRender()
      : tableFixedCase
        ? renderPackedTableFixedWidths()
        : modalA11yCase
          ? renderPackedModalA11y()
          : colorThemeCase
            ? renderPackedColorTheme()
            : typographyThemeCase
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
                    h(CodeHighlight, {
                      code: 'const ready = true;\nready();',
                      language: 'javascript',
                    }),
                    h(JsonViewer, { value: '{"name":"Semi"}', width: 600, height: 160 }),
                    renderPackedErrorCases(),
                  ]),
}).mount('#app');

console.log(styleCoverage.length);
