import { createApp, h, ref } from 'vue';
import { Button, CodeHighlight, Input, Modal, Nav, Select, Toast } from '@aifuxi/semi-ui-vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';
import { Form } from '@aifuxi/semi-ui-vue/form';

// 保留这些组件的真实包入口及其 CSS，用于验证不同共享样式依赖的组合。
const styleCoverage = [Nav, Modal, Toast];

const input = ref('Initial');
const selected = ref('first');
// 真实安装包的错误状态必须保持空字符串，不能在消费者端转换为 false 或添加 v-if。
const packedError = ref('');

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
    h('main', [
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
