/* global document, location -- 此入口只在真实浏览器消费页面运行。 */
import { createApp, h, ref } from 'vue';
import { Button, CodeHighlight, Input, Modal, Nav, Select, Toast } from '@aifuxi/semi-ui-vue';
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

createApp({
  // 根消费示例保留原有组件交互，并加入直接调用的错误提示区域。
  render: () =>
    dropdownCase !== null
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
