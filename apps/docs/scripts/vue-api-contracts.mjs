/**
 * 已完成人工核对的 Vue API 契约。
 *
 * 上游表格继续承载属性说明、默认值与版本信息；这里仅声明需要从 React 语义中
 * 分离出的 emits / slots / v-model / 命令式方法，以及少量正文措辞。每条契约都指向公开类型来源，
 * 不根据上游 onXxx 名称做全局猜测。
 */

const event = (name, parameters, description) => ({ name, parameters, description });
const slot = (name, scope, description) => ({ name, scope, description });
const method = (name, signature, description) => ({ name, signature, description });

const sidebarContainerDescriptions = {
  title: '标题内容；title 插槽优先',
  visible: '是否显示侧边栏',
  motion: '是否启用显隐动画',
  minWidth: '可调整宽度时的最小宽度',
  maxWidth: '可调整宽度时的最大宽度',
  resizable: '是否允许调整宽度',
  defaultSize: '可调整宽度时的默认尺寸',
  showClose: '是否显示关闭按钮',
  closeOnEsc: '是否允许按 Escape 请求关闭',
  class: 'Vue class 入口',
  className: '兼容 className 入口',
  style: '自定义内联样式',
  renderHeader: '头部渲染 callback prop；header 插槽优先',
  containerRef: '容器元素回调 ref；模板 ref 另暴露 getContainerElement()',
};

const sidebarContainerDefaults = {
  visible: 'false',
  motion: 'true',
  minWidth: '150',
  resizable: 'true',
  showClose: 'true',
  closeOnEsc: 'false',
};

export const vueTypeRewrites = [
  ['React.ReactNode', 'VNodeChild'],
  ['React.ReactElement', 'VNodeChild'],
  ['ReactNode', 'VNodeChild'],
  ['React.CSSProperties', 'StyleValue'],
  ['CSSProperties', 'StyleValue'],
  ['React.MouseEvent', 'MouseEvent'],
  ['React.KeyboardEvent', 'KeyboardEvent'],
  ['React.FocusEvent', 'FocusEvent'],
  ['ReactEvent', 'Event'],
  ['ReactElement', 'VNodeChild'],
  ['JSX.Element', 'VNodeChild'],
];

const vueCode = (source) => ({ language: 'vue', source: source.trim() });

/** 无法通过类型名替换安全迁移的上游 JSX 片段。 */
export const vueStaticCodeOverrides = new Map([
  [
    'zh-CN-ai-aiChatDialogue-18',
    {
      language: 'ts',
      source: `import { AIChatDialogue } from '@aifuxi/semi-ui-vue/ai-chat-dialogue';

const markdownRenderProps = {
  components: {
    code: AIChatDialogue.defaultComponents.code,
  },
};`,
    },
  ],
  [
    'zh-CN-basic-icon-9',
    vueCode(`
<script setup lang="ts">
import { Icon } from '@aifuxi/semi-ui-vue/icon';
import StarIcon from './StarIcon.vue';
</script>

<template>
  <Icon><StarIcon /></Icon>
</template>
`),
  ],
  [
    'zh-CN-plus-chat-12',
    {
      language: 'ts',
      source: `import { h, type VNodeChild } from 'vue';
import type { ChatRenderInputAreaProps } from '@aifuxi/semi-ui-vue/chat';

function renderInputArea({ detailProps }: ChatRenderInputAreaProps): VNodeChild {
  const { uploadNode, inputNode, sendNode, onClick } = detailProps;
  return h(
    'div',
    {
      style: {
        margin: '8px 16px',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '10px',
        border: '1px solid var(--semi-color-border)',
        borderRadius: '16px',
      },
      onClick,
    },
    [uploadNode, inputNode, sendNode],
  );
}`,
    },
  ],
  [
    'zh-CN-plus-markdownrender-5',
    vueCode(`
<script setup lang="ts">
import { MarkdownRender } from '@aifuxi/semi-ui-vue/markdown-render';
import rehypeRaw from 'rehype-raw';

const raw = '<span style="color:red">红色文字</span>';
</script>

<template>
  <MarkdownRender format="md" :raw="raw" :rehype-plugins="[rehypeRaw]" />
</template>
`),
  ],
  [
    'zh-CN-input-form-45',
    vueCode(`
<script setup lang="ts">
import { Form, FormInput, useForm } from '@aifuxi/semi-ui-vue/form';
import { Button } from '@aifuxi/semi-ui-vue/button';

const [formApi] = useForm();

function logForm() {
  console.log(formApi.getFormState());
}
</script>

<template>
  <Form :form="formApi">
    <FormInput field="a" />
    <Button @click="logForm">log</Button>
  </Form>
</template>
`),
  ],
  [
    'zh-CN-input-form-46',
    vueCode(`
<script setup lang="ts">
import { ref } from 'vue';
import { Form, type FormApi } from '@aifuxi/semi-ui-vue/form';
import { Button } from '@aifuxi/semi-ui-vue/button';

const formA = ref<{ formApi: FormApi } | null>(null);
const formB = ref<{ formApi: FormApi } | null>(null);

function changeValues() {
  formA.value?.formApi.setValues({ a: 1 });
  formB.value?.formApi.setValues({ b: 2 });
}
</script>

<template>
  <Form ref="formA" />
  <Form ref="formB" />
  <Button @click="changeValues">Change</Button>
</template>
`),
  ],
  [
    'zh-CN-input-select-30',
    {
      language: 'ts',
      source: `import { shallowRef } from 'vue';
import type { SelectModelValue } from '@aifuxi/semi-ui-vue/select';

const selected = shallowRef<string[]>([]);

function change(value: SelectModelValue) {
  if (Array.isArray(value) && value.every((item) => typeof item === 'string')) {
    selected.value = value;
  }
}`,
    },
  ],
  [
    'zh-CN-input-treeselect-22',
    vueCode(`
<script setup lang="ts">
import { TreeSelect } from '@aifuxi/semi-ui-vue/tree-select';
</script>

<template>
  <TreeSelect aria-label="示例树选择器" />
</template>
`),
  ],
  [
    'zh-CN-navigation-anchor-3',
    vueCode(`
<script setup lang="ts">
import { Anchor, AnchorLink } from '@aifuxi/semi-ui-vue/anchor';

const getContainer = () => document.querySelector<HTMLElement>('#scroll-container') ?? document.body;
</script>

<template>
  <div id="scroll-container">
    <Anchor :get-container="getContainer" :offset-top="100" :target-offset="100">
      <AnchorLink href="#基本示例" title="基本示例" />
      <AnchorLink href="#综合使用" title="综合使用" />
      <AnchorLink href="#API参考" title="API 参考">
        <AnchorLink href="#Anchor" title="Anchor" />
        <AnchorLink href="#AnchorLink" title="AnchorLink" />
      </AnchorLink>
    </Anchor>
  </div>
</template>
`),
  ],
  [
    'zh-CN-navigation-navigation-5',
    vueCode(`
<script setup lang="ts">
import { h } from 'vue';
import { RouterLink } from 'vue-router';
import { Nav, type NavigationWrapperData } from '@aifuxi/semi-ui-vue/navigation';

const routes: Record<string, string> = {
  Home: '/',
  About: '/about',
  Dashboard: '/dashboard',
};

function renderWrapper({ itemElement, props }: NavigationWrapperData) {
  return h(RouterLink, { to: routes[String(props.itemKey)] ?? '/' }, () => itemElement);
}

const items = [
  { itemKey: 'Home', text: 'Home' },
  { itemKey: 'About', text: 'About' },
  { itemKey: 'Dashboard', text: 'Dashboard' },
];
</script>

<template>
  <Nav :items="items" :render-wrapper="renderWrapper" />
</template>
`),
  ],
  [
    'zh-CN-navigation-tree-33',
    vueCode(`
<script setup lang="ts">
import { Tree } from '@aifuxi/semi-ui-vue/tree';
</script>

<template>
  <Tree aria-label="示例树" />
</template>
`),
  ],
  [
    'zh-CN-show-avatar-17',
    vueCode(`
<script setup lang="ts">
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';

const imageUrl = 'https://lf3-static.bytednsdoc.com/obj/eden-cn/ptlz_zlp/ljhwZthlaukjlkulzlp/root-web-sites/dy.png';
</script>

<template>
  <!-- 好：alt 描述人物或图片内容。 -->
  <Avatar alt="一只可爱的猫咪" :src="imageUrl" />
  <Avatar alt="姜鹏志" :src="imageUrl" />
  <!-- 装饰图片使用空 alt；避免“某某的图片”这类冗余描述。 -->
  <Avatar alt="" :src="imageUrl" />
</template>
`),
  ],
  [
    'zh-CN-show-collapse-8',
    vueCode(`
<script setup lang="ts">
import { Collapse, CollapsePanel } from '@aifuxi/semi-ui-vue/collapse';
import { Input } from '@aifuxi/semi-ui-vue/input';
</script>

<template>
  <Collapse>
    <CollapsePanel item-key="1">
      <template #header>
        <div style="display: inline-flex" @click.stop>
          <span>Panel header</span>
          <Input />
        </div>
      </template>
      <p>Hi, bytedance dance dance. This is the docsite of Semi UI.</p>
    </CollapsePanel>
  </Collapse>
</template>
`),
  ],
  [
    'zh-CN-show-collapsible-6',
    vueCode(`
<script setup lang="ts">
import { shallowRef, useId } from 'vue';
import { Collapsible } from '@aifuxi/semi-ui-vue/collapsible';
import { Button } from '@aifuxi/semi-ui-vue/button';

const visible = shallowRef(false);
const collapseId = useId();
</script>

<template>
  <Button :aria-controls="collapseId" :aria-expanded="visible" @click="visible = !visible">
    {{ visible ? 'hide' : 'show' }}
  </Button>
  <Collapsible :id="collapseId" :is-open="visible">
    <div>hide content</div>
  </Collapsible>
</template>
`),
  ],
  [
    'zh-CN-show-table-46',
    vueCode(`
<script setup lang="ts">
import { Table } from '@aifuxi/semi-ui-vue/table';

const columns = [
  { title: '姓名', dataIndex: 'name', width: 180, fixed: 'left' },
  { title: '年龄', dataIndex: 'age', width: 120 },
  { title: '地址', dataIndex: 'address', width: 280 },
  { title: '公司', dataIndex: 'company', width: 280 },
];
const dataSource = Array.from({ length: 6 }, (_, index) => ({
  key: index,
  name: 'Edward ' + index,
  age: 20 + index,
  address: '西湖区湖底公园 1 号',
  company: 'Semi Design',
}));
</script>

<template>
  <Table
    :columns="columns"
    :data-source="dataSource"
    :scroll="{ x: 900 }"
    :header-style="{ backgroundColor: '#F5F6F7', fontWeight: 600 }"
  />
</template>
`),
  ],
  [
    'zh-CN-show-table-48',
    {
      language: 'ts',
      source: `import type { TableColumnProps } from '@aifuxi/semi-ui-vue/table';

interface RecordItem {
  key: string;
  name: string;
  age: number;
  address: string;
}

const columns: TableColumnProps<RecordItem>[] = [
  { title: 'Name', dataIndex: 'name', width: 200 },
];

const dataSource: RecordItem[] = [
  { key: '1', name: 'John Brown', age: 32, address: 'New York No. 1 Lake Park' },
];`,
    },
  ],
  [
    'zh-CN-show-table-49',
    vueCode(`
<script setup lang="ts">
import { Table, type TableProps } from '@aifuxi/semi-ui-vue/table';

const onRow: TableProps['onRow'] = (_record, index, rowStatus) => ({
  onClick: () => {
    if (rowStatus?.disabled) return;
    console.log('点击行', index, rowStatus);
  },
  onMouseenter: () => {},
  onMouseleave: () => {},
});

const onHeaderRow: TableProps['onHeaderRow'] = () => ({
  onClick: () => {},
  onMouseenter: () => {},
  onMouseleave: () => {},
});
</script>

<template>
  <Table :on-row="onRow" :on-header-row="onHeaderRow" />
</template>
`),
  ],
  [
    'zh-CN-show-table-51',
    vueCode(`
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { Table, type TableExposed } from '@aifuxi/semi-ui-vue/table';

const tableRef = ref<TableExposed | null>(null);
const columns = [];
const dataSource = [];

onMounted(() => {
  console.log(tableRef.value?.getCurrentPageData());
});
</script>

<template>
  <Table ref="tableRef" :columns="columns" :data-source="dataSource" />
</template>
`),
  ],
  [
    'zh-CN-show-timeline-10',
    vueCode(`
<script setup lang="ts">
import { Timeline, TimelineItem } from '@aifuxi/semi-ui-vue/timeline';
</script>

<template>
  <Timeline aria-label="事故处理过程时间线">
    <TimelineItem time="2015-09-01">创建服务现场</TimelineItem>
    <TimelineItem time="2015-09-02">初步排除网络异常</TimelineItem>
    <TimelineItem time="2015-09-03">技术测试异常</TimelineItem>
    <TimelineItem time="2015-09-05">网络异常正在修复</TimelineItem>
  </Timeline>
</template>
`),
  ],
  [
    'zh-CN-show-tooltip-11',
    vueCode(`
<script setup lang="ts">
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import { IconSetting } from '@aifuxi/semi-icons-vue';
</script>

<template>
  <Tooltip>
    <template #content><p id="description">编辑设置</p></template>
    <IconSetting aria-label="设置" />
  </Tooltip>
</template>
`),
  ],
  [
    'zh-CN-feedback-progress-14',
    vueCode(`
<script setup lang="ts">
import { Progress } from '@aifuxi/semi-ui-vue/progress';
</script>

<template>
  <p id="progressbar-label">磁盘使用量</p>
  <Progress aria-labelledby="progressbar-label" :percent="80" />
  <Progress aria-label="文件下载" :percent="80" />
  <Progress aria-label="磁盘使用量" :percent="80" aria-valuetext="步骤 2：正在复制文件…" />
</template>
`),
  ],
  [
    'zh-CN-other-configprovider-4',
    vueCode(`
<script setup lang="ts">
import { ConfigProvider, ConfigConsumer } from '@aifuxi/semi-ui-vue/config-provider';

const responsiveMap = ConfigProvider.defaultResponsiveMap;
</script>

<template>
  <ConfigProvider responsive-observe :responsive-map="responsiveMap">
    <ConfigConsumer v-slot="{ screens }">
      <pre>{{ screens }}</pre>
    </ConfigConsumer>
  </ConfigProvider>
</template>
`),
  ],
  [
    'zh-CN-other-configprovider-6',
    {
      language: 'css',
      source: `/* Vue 包固定保留 .semi-* / --semi-* 兼容契约，不提供全局 prefixCls 改写。 */
.semi-button {
  /* 在业务作用域中按需覆盖样式。 */
}`,
    },
  ],
  [
    'zh-CN-other-locale-1',
    vueCode(`
<script setup lang="ts">
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import enGB from '@aifuxi/semi-ui-vue/locale/source/en_GB';
import App from './App.vue';
</script>

<template>
  <LocaleProvider :locale="enGB">
    <App />
  </LocaleProvider>
</template>
`),
  ],
]);

/** 上游静态类型片段中的定点语法修正。 */
export const vueStaticCodeRewrites = new Map([
  [
    'zh-CN-ai-aiChatDialogue-19',
    [['Reasoning FileSearchToolCall', 'Reasoning | FileSearchToolCall']],
  ],
  ['zh-CN-ai-aiChatInput-15', [['renderTemplate?: (', 'type RenderTemplate = (']]],
  ['zh-CN-input-form-47', [['ArrayFieldItem<>', 'ArrayFieldItem[]']]],
  ['zh-CN-input-select-25', [['array<object>', 'object[]']]],
  [
    'zh-CN-input-treeselect-19',
    [
      ['onClear: e => void', 'onClear: (event: Event) => void'],
      ['onRemove: key => void', 'onRemove: (key: string | number) => void'],
      ['onSearch: inputValue => void', 'onSearch: (inputValue: string) => void'],
    ],
  ],
  ['zh-CN-input-upload-36', [['// beforeUploadResult:\n{', 'interface BeforeUploadResult {']]],
  ['zh-CN-input-upload-39', [['// afterUploadResult:\n{', 'interface AfterUploadResult {']]],
  [
    'zh-CN-input-upload-41',
    [
      ['{\n    // 当前文件名称', 'interface CustomRequestArgs {\n    // 当前文件名称'],
      ['e: event', 'e: Event'],
    ],
  ],
  [
    'zh-CN-navigation-tree-19',
    [
      ['expandIcon:', 'type ExpandIcon ='],
      ['}))', '}) => VNodeChild);'],
    ],
  ],
]);

export const vueApiContracts = new Map([
  [
    '/zh-CN/basic/button',
    {
      sources: ['packages/ui/src/button/types.ts'],
      propSections: [
        {
          heading: 'Button',
          level: 3,
          source: 'packages/ui/src/button/types.ts',
          interfaces: ['ButtonProps'],
          aliases: { contentClass: 'contentClassName' },
        },
        {
          heading: 'ButtonGroup',
          level: 3,
          source: 'packages/ui/src/button/types.ts',
          interfaces: ['ButtonGroupProps'],
        },
        {
          heading: 'SplitButtonGroup **V1.12.0新增**',
          level: 3,
          source: 'packages/ui/src/button/types.ts',
          interfaces: ['SplitButtonGroupProps'],
        },
      ],
      eventSections: [
        {
          heading: 'Button',
          level: 3,
          rows: ['onClick', 'onMouseDown', 'onMouseEnter', 'onMouseLeave'],
        },
      ],
      eventGroups: [
        {
          name: 'Button 原生事件',
          items: [
            event('click', '[event: MouseEvent]', '点击原生 button 时触发'),
            event('mousedown', '[event: MouseEvent]', '按下鼠标按钮时触发'),
            event('mouseenter', '[event: MouseEvent]', '指针进入按钮时触发'),
            event('mouseleave', '[event: MouseEvent]', '指针离开按钮时触发'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Button',
          items: [
            slot('default', '{}', '按钮内容'),
            slot('icon', '{ fill, iconSize, iconStyle }', '自定义图标'),
          ],
        },
      ],
    },
  ],
  [
    '/zh-CN/input/input',
    {
      sources: ['packages/ui/src/input/types.ts'],
      propSections: [
        {
          heading: 'Input',
          level: 3,
          source: 'packages/ui/src/input/types.ts',
          interfaces: ['InputProps'],
        },
        {
          heading: 'TextArea',
          level: 3,
          source: 'packages/ui/src/input/types.ts',
          interfaces: ['TextAreaProps'],
        },
        {
          heading: 'InputGroup',
          level: 3,
          source: 'packages/ui/src/input/types.ts',
          interfaces: ['InputGroupProps'],
        },
      ],
      models: ['Input / TextArea：`v-model` 对应 `modelValue`；同时保留 `value` 兼容入口。'],
      eventSections: [
        {
          heading: 'Input',
          level: 3,
          rows: [
            'onBlur',
            'onChange',
            'onClear',
            'onEnterPress',
            'onFocus',
            'onKeyDown',
            'onKeyPress',
            'onKeyUp',
            'onCompositionStart',
            'onCompositionEnd',
            'onCompositionUpdate',
          ],
        },
        {
          heading: 'TextArea',
          level: 3,
          rows: [
            'onBlur',
            'onChange',
            'onClear',
            'onEnterPress',
            'onFocus',
            'onKeyDown',
            'onKeyPress',
            'onKeyUp',
            'onResize',
            'onCompositionStart',
            'onCompositionEnd',
            'onCompositionUpdate',
          ],
        },
        { heading: 'InputGroup', level: 3, rows: ['onBlur', 'onFocus'] },
      ],
      eventGroups: [
        {
          name: 'Input',
          items: [
            event('change', '[value: string, event: Event]', '输入值变化'),
            event('input', '[event: Event]', '原生 input 事件'),
            event('clear', '[event: Event]', '点击清除按钮'),
            event('enterPress', '[event: KeyboardEvent]', '按下 Enter'),
            event('focus / blur', '[event: FocusEvent]', '获得或失去焦点'),
            event('keydown / keypress / keyup', '[event: KeyboardEvent]', '键盘事件'),
            event(
              'compositionStart / compositionUpdate / compositionEnd',
              '[event: CompositionEvent]',
              '输入法组合事件',
            ),
          ],
        },
        {
          name: 'TextArea',
          items: [
            event('change', '[value: string, event: Event]', '输入值变化'),
            event('resize', '[data: { height: number; width?: number }]', '文本域尺寸变化'),
            event('clear / enterPress / focus / blur', '见 Input 对应事件', '交互事件'),
            event('keydown / keypress / keyup', '[event: KeyboardEvent]', '键盘事件'),
            event(
              'compositionStart / compositionUpdate / compositionEnd',
              '[event: CompositionEvent]',
              '输入法组合事件',
            ),
          ],
        },
        {
          name: 'InputGroup',
          items: [event('focus / blur', '[event: FocusEvent]', '组内输入框获得或失去焦点')],
        },
      ],
      slotGroups: [
        {
          name: 'Input',
          items: [
            slot('addonBefore / addonAfter', '{}', '前置或后置标签'),
            slot('prefix / suffix', '{}', '输入框前缀或后缀'),
            slot('clearIcon', '{}', '清除图标'),
            slot('insetLabel', '{}', '内嵌标签'),
          ],
        },
        { name: 'InputGroup', items: [slot('default', '{}', '组合内的输入控件')] },
      ],
      textRewrites: [
        [
          '`Input` 值完全取决于传入的 `value` 值，配合 `onChange` 回调函数使用',
          '`Input` 可通过 `v-model` 双向绑定，也可使用 `modelValue` 并监听 `change` 事件。',
        ],
        [
          '`onChange` 不会在输入法未确认（如拼音过程中）触发，而是在输入法确认后触发一次',
          '`change` 事件不会在输入法未确认（如拼音过程中）触发，而是在输入法确认后触发一次',
        ],
        [
          '开启后输入法未确认期间不会触发 onChange，输入法确认后触发一次 onChange',
          '开启后输入法未确认期间不会触发 change 事件，输入法确认后触发一次 change 事件',
        ],
        [
          'disabled、onFocus、onBlur 三个属性会被子组件继承覆盖',
          '`disabled` 属性以及 `focus`、`blur` 监听器会由组内输入控件统一继承',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/select',
    {
      sources: ['packages/ui/src/select/types.ts'],
      propSections: [
        {
          heading: 'Select Props',
          level: 3,
          source: 'packages/ui/src/select/types.ts',
          interfaces: ['SelectProps'],
        },
        {
          heading: 'Option Props',
          level: 3,
          source: 'packages/ui/src/select/types.ts',
          interfaces: ['SelectOptionProps'],
          aliases: { class: 'className' },
        },
        {
          heading: 'OptGroup Props',
          level: 3,
          source: 'packages/ui/src/select/types.ts',
          interfaces: ['SelectOptionGroupProps'],
          aliases: { class: 'className' },
        },
      ],
      models: ['`v-model` 对应 `modelValue`；单选和多选值由 `SelectModelValue` 统一约束。'],
      eventSections: [
        {
          heading: 'Select Props',
          level: 3,
          rows: [
            'onBlur',
            'onChange',
            'onCreate',
            'onClear',
            'onDropdownVisibleChange',
            'onListScroll',
            'onSearch',
            'onSelect',
            'onDeselect',
            'onExceed',
            'onFocus',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Select',
          items: [
            event('change', '[value: SelectModelValue]', '选中值变化'),
            event('select / deselect', '[value, option]', '选择或取消选择候选项'),
            event('create', '[option: SelectOptionProps]', '创建候选项'),
            event('clear', '[]', '清除当前值'),
            event('dropdownVisibleChange', '[visible: boolean]', '下拉层显隐变化'),
            event('search', '[value: string, event?: Event]', '搜索文本变化'),
            event('listScroll', '[event: Event]', '候选列表滚动'),
            event('exceed', '[option: SelectOptionProps]', '选择数量超过 max'),
            event('focus / blur', '[event: FocusEvent]', '获得或失去焦点'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Select',
          items: [
            slot('default', '{}', 'Option / OptGroup 子组件'),
            slot(
              'trigger',
              '{ value, inputValue, disabled, placeholder, onSearch, onClear, onRemove }',
              '自定义触发器',
            ),
            slot('option', 'SelectOptionRenderProps', '自定义候选项'),
            slot('selectedItem', '{ option, index }', '自定义已选项'),
            slot('createItem', '{ inputValue, focused, style }', '自定义创建项'),
            slot('prefix / suffix', '{}', '触发器前缀或后缀'),
            slot('arrowIcon / clearIcon', '{}', '下拉或清除图标'),
            slot('emptyContent', '{}', '空状态内容'),
            slot('innerTop / innerBottom', '{}', '候选列表内部附加内容'),
            slot('outerTop / outerBottom', '{}', '候选列表外部附加内容'),
            slot('insetLabel', '{}', '内嵌标签'),
          ],
        },
      ],
      textRewrites: [
        [
          '`Select` 组件支持通过泛型参数来约束 `value` 的类型，从而提供更好的类型推断。',
          'Vue 模板不能传入组件泛型；请用 `SelectModelValue` 收窄 `change` 事件或 `v-model` 的值类型。',
        ],
        [
          '使用泛型参数后，你可以获得更精确的类型推断，无需再手动进行类型转换。',
          '根据单选或多选模式对 `SelectModelValue` 做类型收窄后，再写入业务状态。',
        ],
        ['同时会触发`onExceed`回调', '同时会触发 `exceed` 事件'],
        [
          '默认情况下`onChange`只能拿到 value，如果需要拿选中节点的其他属性，可以使用`onChangeWithObject`属性',
          '默认情况下 `change` 事件只返回 value；如果需要选中节点的其他属性，可以启用 `onChangeWithObject`。',
        ],
        [
          '此时`onChange`函数的入参将会是 object，包含 option 的各种属性，例如 `onChange({ value, label, ...rest })`',
          '此时 `change` 事件的入参是包含 option 属性的对象，例如 `{ value, label, ...rest }`。',
        ],
        ['Option 的 children 或 label', 'Option 的默认插槽或 label'],
        ['通过 jsx 方式声明 children', '通过模板声明 Option 子组件'],
        ['option.label 或 option.children', 'option.label 或 Option 默认插槽'],
        [
          '但你可以通过 `renderSelectedItem` 自定义选择框中已选项标签的渲染结构',
          '可以通过 `#selectedItem="{ option, index }"` 自定义选择框中已选项标签的渲染结构',
        ],
        [
          '- 单选时 `renderSelectedItem(optionNode:object) => content:VNodeChild`',
          '- 插槽参数 `option` 是当前选项，`index` 是已选项索引',
        ],
        [
          '- 多选时 `renderSelectedItem(optionNode:object, { index:number, onClose:function }) => { isRenderInTag:bool, content:VNodeChild }`',
          '- 多选项的移除和交互仍由 Select 管理，插槽只负责内容渲染',
        ],
        [
          "允许通过 `renderCreateItem` 自定义创建标签时的内容显示（通过返回 VNodeChild，注意你需要自定义样式），该函数默认值为 (input, isFocus, style) => '创建' + input",
          '允许通过 `#createItem="{ inputValue, focused, style }"` 自定义创建项；使用虚拟列表时应将作用域中的 style 绑定到根元素。',
        ],
        [
          '如果 Select 默认的触发器样式满足不了你的需求，可以用`triggerRender`自定义选择框的展示',
          '如果默认触发器不能满足需求，可以使用 `#trigger` 作用域插槽自定义展示。',
        ],
        ['triggerRender 入参如下', '`trigger` 插槽参数如下'],
        ['通过 triggerRender 为 Select 增加排序', '通过 `trigger` 插槽为 Select 增加排序'],
        [
          '通过 Option 的 label 属性或者 children 传入 VNodeChild',
          '通过 Option 的 label 属性或默认插槽传入内容',
        ],
        [
          '通过传入`renderOptionItem`，你可以完全接管列表中候选项的渲染，并且从回调入参中，获取到相关的状态值。',
          '通过 `#option` 作用域插槽可以接管候选项渲染，并从插槽参数中获取相关状态。',
        ],
        ['innerTopSlot', '#innerTop'],
        ['innerBottomSlot', '#innerBottom'],
        ['outerTopSlot', '#outerTop'],
        ['outerBottomSlot', '#outerBottom'],
        ['triggerRender', '`trigger` 插槽'],
        ['renderSelectedItem', '`selectedItem` 插槽'],
        ['renderCreateItem', '`createItem` 插槽'],
        ['renderOptionItem', '`option` 插槽'],
        ['optionList / children', 'optionList / Option 子组件'],
        ['optionList 或者 children', 'optionList 或 Option 子组件'],
        ['children VNodeChild 的 key', 'Option 子组件的 key'],
        ['children jsx 方式声明 Options', '通过 Option 子组件声明 Options'],
        ['使用 jsx 方式声明 Option', '通过 Option 子组件声明 Option'],
        ['若无则取 children、value', '若无则取默认插槽、value'],
        ['`remote={true}`', '`:remote="true"`'],
        [
          'props 传入的 style 需在 wrapper dom 上进行消费，否则在虚拟化场景下会无法正常使用',
          '插槽参数中的 `style` 需要绑定到自定义内容的根元素，否则虚拟化场景无法正确定位。',
        ],
        [
          'props 传入的 className、onMouseEnter 需在 wrapper dom 上进行消费，否则上下键盘操作时显示会有问题',
          '插槽参数中的 `class` 与 `onMouseenter` 也需要绑定到根元素，确保键盘高亮与鼠标交互一致。',
        ],
        [
          '选中(selected)、聚焦(focused)、禁用(disabled)等状态的样式需自行加上，你可以从 props 中获取到相对的 boolean 值',
          '选中（`selected`）、聚焦（`focused`）、禁用（`disabled`）等状态可从插槽参数读取，自定义内容需自行应用相应样式。',
        ],
        [
          '如果你的自定义 item 为 Select.Option，需要将 renderProps.onClick 透传给 Option 的 onSelect prop',
          '自定义根元素需要调用插槽参数提供的 `onClick`；不要在 `#option` 中再次嵌套 `Select.Option`。',
        ],
        [
          '请不要传入 value、ref、onChange、onFocus，否则会覆盖 Select 相关回调，影响组件行为',
          '请不要传入 value、ref、change 或 focus 监听器，否则会覆盖 Select 的内部交互',
        ],
        [
          '设为 true 时，onChange 的入参类型会从 string 变为 object',
          '设为 true 时，change 事件的入参会从 string 变为 object',
        ],
        ['配合 `onChange` 使用', '配合 `v-model` 或 `change` 事件使用'],
      ],
    },
  ],
  [
    '/zh-CN/input/form',
    {
      sources: ['packages/ui/src/form/types.ts', 'packages/ui/src/form/index.ts'],
      propSections: [
        {
          heading: 'Form Props',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['FormProps'],
        },
        {
          heading: 'Field Props',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['CommonFieldProps'],
        },
        {
          heading: 'ArrayField Props',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['ArrayFieldProps'],
        },
        {
          heading: 'Form.Section',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['FormSectionProps'],
        },
        {
          heading: 'Form.Label',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['FormLabelProps'],
        },
        {
          heading: 'Form.ErrorMessage',
          level: 2,
          source: 'packages/ui/src/form/types.ts',
          interfaces: ['FormErrorMessageProps'],
        },
      ],
      eventSections: [
        {
          heading: 'Form Props',
          level: 2,
          rows: [
            'onChange',
            'onValueChange',
            'onErrorChange',
            'onReset',
            'onSubmit',
            'onSubmitFail',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Form',
          items: [
            event('change', '[formState: FormState<Values>]', '表单状态变化'),
            event('valueChange', '[values: Values, changedValues: Partial<Values>]', '字段值变化'),
            event('errorChange', '[errors, changedErrors]', '校验错误变化'),
            event('reset', '[]', '表单重置'),
            event('submit', '[values: Values, event?: Event]', '校验成功后提交'),
            event('submitFail', '[errors, values: Values, event?: Event]', '校验失败后提交'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Form',
          items: [slot('default', '{ formState, formApi, values }', '表单内容与作用域状态')],
        },
        {
          name: 'ArrayField',
          items: [slot('default', '{ add, addWithInitValue, arrayFields }', '动态字段列表')],
        },
      ],
      textRewrites: [
        ['通过 child render function', '通过默认插槽'],
        ['child render function 方式声明表单', '默认插槽方式声明表单'],
        ['通过 props.component', '通过 component prop'],
        ['以 VNodeChild 形式传入', '以组件形式传入'],
        [
          'Form 的 children 是一个 function，return 出所有表单控件',
          'Form 的默认插槽可以接收 `formState`、`formApi` 与 `values`，并返回全部表单控件。',
        ],
        ['不可与 render、props.children 同时使用', '不可与 `render` 或默认插槽同时使用'],
        ['不可与 component、props.children 同时使用', '不可与 `component` 或默认插槽同时使用'],
        [
          '你可以通过监听 Field 的 onChange 事件，然后使用 formApi 进行相关修改，来使 Field 之间达到联动',
          '你可以监听字段组件的 `change` 事件，再通过 `formApi` 修改其他字段，实现字段联动。',
        ],
        [
          'Form 组件在 ComponentDidMount 阶段，会执行 props 传入的 getFormApi 回调',
          'Form 组件初始化后会执行 `getFormApi` 回调',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/table',
    {
      sources: ['packages/ui/src/table/types.ts'],
      propSections: [
        {
          heading: 'Table',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableProps'],
        },
        {
          heading: 'Column',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableColumn'],
        },
        {
          heading: 'rowSelection',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableRowSelection'],
        },
        {
          heading: 'scroll',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableScroll'],
        },
        {
          heading: 'Resizable',
          level: 2,
          source: 'packages/ui/src/table/types.ts',
          interfaces: ['TableResizable'],
        },
      ],
      eventSections: [
        { heading: 'Table', level: 2, rows: ['onChange', 'onExpand', 'onExpandedRowsChange'] },
      ],
      eventGroups: [
        {
          name: 'Table',
          items: [
            event('change', '[changeInfo: TableChangeInfo<RecordType>]', '分页、排序或筛选变化'),
            event('expand', '[expanded, record, event?: MouseEvent]', '展开状态变化'),
            event('expandedRowsChange', '[expandedRows: RecordType[]]', '展开行集合变化'),
            event('pageChange', '[currentPage: number, pageSize: number]', '分页变化'),
            event('select', '[record, selected, selectedRows, event?]', '选择单行'),
            event('selectAll', '[selected, selectedRows, changedRows]', '全选状态变化'),
            event('selectChange', '[selectedRowKeys, selectedRows]', '选择集合变化'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Table',
          items: [
            slot('default', '{}', '声明式 Table.Column'),
            slot('cell', '{ column, record, rowIndex, text }', '单元格内容'),
            slot('headerCell', '{ column }', '表头单元格'),
            slot('expandedRow', '{ expanded, index, record }', '展开行'),
            slot('title / footer', '{ pageData }', '表格标题或尾部'),
            slot('pagination', '{ pagination }', '分页器'),
            slot('groupSection', '{ group, groupKey }', '分组表头'),
            slot('empty', '{}', '空状态内容'),
          ],
        },
      ],
      textRewrites: [
        [
          'Semi Table 底层借助了 `react-window` 的能力来实现虚拟化，因此 `react-window` `VariableSizeList` 所支持的其他参数也可以通过 `virtualized`(object) 传入，例如 `overscanCount`',
          'Table 的虚拟化模式支持通过 `virtualized` 对象补充配置，例如 `overscanCount`。',
        ],
        ['表头除了通过 `children` 写法进行合并外', '表头除了通过嵌套列配置进行合并外'],
        [
          'React 需要的 key，如果已经设置了唯一的 dataIndex，可以忽略这个属性',
          '列的稳定 key；如果已经设置唯一的 dataIndex，可以忽略该属性',
        ],
        [
          '- Table 的树形数据暂不支持 RTL（[Chrome、Safari 浏览器表现与 Firefox 表现不同](https://codesandbox.io/s/table-rtl-treedata-uy7gzl?file=/src/App.jsx)）',
          '- Table 的树形数据暂不支持 RTL；Chrome、Safari 与 Firefox 的表现存在差异。',
        ],
        [
          '表头的 tr 定义了 `onMouseEnter`/`onMouseLeave`',
          '表头的 `tr` 绑定了 `mouseenter` / `mouseleave` 监听器',
        ],
        [
          '你也可以使用 JSX 语法定义 `columns`，注意 Table 仅支持 `columns` 的 JSX 语法定义。你不能够使用任何组件包裹 `Table.Column` 组件。',
          '你也可以通过 `Table.Column` 子组件声明列；不要再用其他组件包裹 `Table.Column`，也不要与 `columns` 配置同时使用。',
        ],
        [
          '使用 JSX 写法时，请不要与配置写法同时使用；如果同时使用，仅配置写法生效，不会进行聚合操作。',
          '使用 `Table.Column` 时，请不要与 `columns` 配置同时使用；如果同时使用，仅配置写法生效。',
        ],
        ['JSX 或者配置式写法', '`Table.Column` 或配置式写法'],
        ['JSX 写法', '声明式列写法'],
        ['React.RefObject', '{ current: TableVirtualizedListRef | null }'],
      ],
    },
  ],
  [
    '/zh-CN/show/modal',
    {
      sources: ['packages/ui/src/modal/types.ts'],
      propSections: [
        {
          heading: 'Modal',
          level: 3,
          source: 'packages/ui/src/modal/types.ts',
          interfaces: ['ModalProps'],
        },
        {
          heading: 'Modal.method()',
          level: 3,
          source: 'packages/ui/src/modal/types.ts',
          interfaces: ['ModalProps', 'ModalConfirmProps'],
        },
      ],
      models: [
        '`v-model:visible` 对应 `visible` 与 `update:visible`。`onOk` / `onCancel` 是保留的 callback props。',
      ],
      eventGroups: [
        {
          name: 'Modal',
          items: [
            event('update:visible', '[visible: boolean]', '可见状态更新，用于 `v-model:visible`'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Modal',
          items: [
            slot('default / body', '{}', '对话框正文'),
            slot('header / title', '{}', '头部或标题'),
            slot('footer', '{}', '底部操作区'),
            slot('closeIcon', '{}', '关闭图标'),
            slot('icon', '{}', '状态图标'),
          ],
        },
      ],
      textRewrites: [
        ['Hooks 用法', 'useModal 用法'],
        [
          '注意：命令式调用的 Modal 需要通过这两个属性来设置 i18 的文本，因为我们无法修改 React 组件树，命令式调用插入的 Component 无法消费到 Locale 相关的 Context',
          '注意：命令式 Modal 不在当前组件的注入层级内，需要通过这两个属性显式设置国际化文案。',
        ],
        [
          'Modal 使用 Portal 将浮层节点插入到 DOM 树中。但这个操作仅能改变节点在 DOM 树中的位置，无法改变节点在 React 节点树中的位置，LocalProvider是基于 Context 机制传递的，必须是从属的 React 子结点才可消费到 Local 相关 Context。因此命令式的 Modal 的内置文本无法自动适配国际化。',
          '命令式 Modal 由独立应用实例挂载，不在当前 `ConfigProvider` 的 provide/inject 层级内，因此不会自动继承国际化配置。',
        ],
        [
          '在1.2版本之后，你也可以通过 Modal.useModal 方法来返回 modal 实体以及 contextHolder 节点。将 contextHolder 插入到你需要获取 context 位置，即可使 Modal 获取到对应的 Context，如 ConfigProvider 或者 LocaleProvider 的配置。',
          '也可以使用 `Modal.useModal()` 获取 modal 方法和 `ContextHolder` 组件，并在需要继承配置的位置渲染该组件，使其读取对应的 `ConfigProvider` 配置。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/tooltip',
    {
      sources: ['packages/ui/src/tooltip/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/tooltip/types.ts',
          interfaces: ['TooltipProps'],
        },
      ],
      models: ['`v-model:visible` 对应 `visible` 与 `update:visible`。'],
      eventSections: [
        { heading: 'API 参考', level: 2, rows: ['onVisibleChange', 'onClickOutSide'] },
      ],
      eventGroups: [
        {
          name: 'Tooltip',
          items: [
            event('visibleChange', '[visible: boolean]', '显隐状态变化'),
            event('clickOutside', '[event: MouseEvent]', '点击触发器和浮层以外区域'),
            event('afterClose', '[]', '关闭动画完成'),
            event('escKeydown', '[event: KeyboardEvent]', '按下 Escape'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Tooltip',
          items: [
            slot('default', '{}', '触发元素'),
            slot('content', '{ initialFocusRef }', '浮层内容'),
            slot('arrow', '{}', '自定义箭头'),
          ],
        },
      ],
      textRewrites: [
        ['非Children、非浮层', '非触发元素、非浮层'],
        [
          'Tooltip 需要将 DOM 事件监听器应用到 children 中，如果子元素是自定义的组件，你需要确保它能将属性传递至底层的 DOM 元素',
          'Tooltip 会把 DOM 事件监听器合并到默认插槽的触发元素；使用自定义组件时，需要将 attrs 透传到底层 DOM 元素。',
        ],
        [
          '同时为了计算弹出层的定位，需要获取到 children 的真实 DOM 元素，因此 Tooltip 支持如下类型的 children',
          '定位计算需要取得触发元素的真实 DOM 节点，因此默认插槽应提供以下类型的内容：',
        ],
        [
          '1. 使用 forwardRef 包裹后的函数式组件，将 props 与 ref 透传到 children 内真实的 DOM 节点上',
          '1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件',
        ],
        ['2. 真实 DOM 节点, 如 span，div，p...', '2. 原生 DOM 元素，例如 `span`、`div`、`p`'],
        [
          '3. Class Component，不强制绑定ref，但需要确保 props 可被透传至真实的 DOM 节点上 (**注**: 此条规则仅在 React 版本低于 v19 时使用 @aifuxi/semi-ui-vue 可行， 在 React v19 版本使用 @aifuxi/semi-ui-vue-19 不可行，详情见 [React v19 适配注意事项](https://semi.design/zh-CN/start/react19#%E6%B3%A8%E6%84%8F%E4%BA%8B%E9%A1%B9))',
          '3. 多个根节点或特殊节点会按 `wrapWhenSpecial` 的设置使用包装元素。',
        ],
        [
          'Tooltip、Popconfirm、Popover 都需要劫持 children 的相关事件（onMouseEnter/onMouseLeave/onClick....），用于配置 trigger。',
          'Tooltip、Popconfirm、Popover 会在默认插槽的触发元素上合并鼠标或点击监听器，用于实现 `trigger`；触发元素需要能够接收并透传 DOM 事件。',
        ],
        ['children', '触发元素'],
      ],
    },
  ],
  [
    '/zh-CN/input/upload',
    {
      sources: ['packages/ui/src/upload/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/upload/types.ts',
          interfaces: ['UploadProps'],
        },
      ],
      models: ['`v-model` 对应 `modelValue`；也支持 `v-model:fileList`。'],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: [
            'onAcceptInvalid',
            'onChange',
            'onClear',
            'onDrop',
            'onError',
            'onExceed',
            'onFileChange',
            'onOpenFileDialog',
            'onPreviewClick',
            'onProgress',
            'onPastingError',
            'onRemove',
            'onRetry',
            'onSizeError',
            'onSuccess',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Upload',
          items: [
            event('change', '[payload: UploadChangePayload]', '文件列表或当前文件变化'),
            event('fileChange', '[files: File[]]', '选择文件'),
            event('success / error / progress', '见 UploadEmits', '上传状态变化'),
            event('remove / retry / clear', '见 UploadEmits', '列表操作'),
            event('drop', '[event: Event, files, fileList]', '释放拖拽文件'),
            event('exceed / acceptInvalid / sizeError', '见 UploadEmits', '文件限制校验'),
            event('previewClick', '[file: UploadFileItem]', '点击文件卡片'),
            event('openFileDialog', '[]', '打开系统文件选择器'),
            event('pastingError', '[error: Error | PermissionStatus]', '读取粘贴内容失败'),
            event('cropError', '[error: Error]', '图片裁切失败；同时保留 `onCropError` prop'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Upload',
          items: [
            slot('default', '{}', '上传触发区'),
            slot('dragIcon / dragMainText / dragSubText', '{}', '拖拽区内容'),
            slot('prompt', '{}', '提示内容'),
            slot('fileItem', 'UploadRenderFileItemProps', '文件项'),
            slot(
              'thumbnail / picInfo / picPreviewIcon',
              'UploadRenderFileItemProps',
              '图片列表内容',
            ),
            slot('picClose', 'UploadRenderPictureCloseProps', '图片关闭按钮'),
            slot('fileOperation', 'UploadRenderFileItemProps', '文件操作区'),
            slot('fileListTitle', 'UploadRenderFileListTitleProps', '文件列表标题'),
          ],
        },
      ],
      textRewrites: [
        ['字符串或 VNodeChild 形式', '字符串、VNodeChild 或插槽形式'],
        ['通过 `children` 传入 VNodeChild', '通过默认插槽传入内容'],
        ['children', '默认插槽内容'],
        ['并不会触发onExceed回调', '并不会触发 `exceed` 事件'],
        ['通过设置 `onSizeError` 可以设置超出限制时的回调', '超出限制时会触发 `sizeError` 事件'],
        ['- `onClear`: 清空文件的回调函数', '- `clear`：清空文件时触发的事件'],
        [
          '当传入`fileList`时，作为受控组件使用。需要监听 onChange 回调，并且将 fileList 回传给 Upload（注意需传入一个新的数组对象）',
          '传入 `fileList` 时组件受控；推荐使用 `v-model:fileList`，也可以监听 `change` 事件并回传新的数组对象。',
        ],
        [
          '可以通过 `renderPicPreviewIcon`，`onPreviewClick` 来自定义预览图标',
          '可以通过 `#picPreviewIcon` 插槽自定义预览图标，并监听 `previewClick` 事件',
        ],
        [
          '使用 `renderPicPreviewIcon` 监听图标点击事件即可',
          '使用 `#picPreviewIcon` 插槽并监听 `previewClick` 事件即可',
        ],
        [
          '`onPreviewClick` 监听的是单张图片容器的点击事件',
          '`previewClick` 在点击单张图片容器时触发',
        ],
      ],
    },
  ],
  [
    '/zh-CN/navigation/tabs',
    {
      sources: ['packages/ui/src/tabs/types.ts'],
      propSections: [
        {
          heading: 'Tab',
          level: 3,
          source: 'packages/ui/src/tabs/types.ts',
          interfaces: ['TabsProps'],
        },
        {
          heading: 'TabPane',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/tabs/types.ts',
              interfaces: ['PlainTab', 'TabPaneProps'],
            },
          ],
        },
      ],
      models: ['`v-model` 对应 `modelValue`；也可用 `v-model:activeKey` 显式绑定当前标签页。'],
      eventSections: [
        {
          heading: 'Tab',
          level: 3,
          rows: ['onChange', 'onTabClick', 'onTabClose', 'onVisibleTabsChange'],
        },
      ],
      eventGroups: [
        {
          name: 'Tabs',
          items: [
            event('change', '[activeKey: string]', '当前标签页变化'),
            event(
              'tabClick',
              '[activeKey: string, event: MouseEvent | KeyboardEvent]',
              '点击或键盘激活标签页',
            ),
            event('tabClose', '[tabKey: string]', '关闭标签页'),
            event(
              'visibleTabsChange',
              '[visibleState: Map<string, boolean>]',
              '滚动折叠模式下可见项变化',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Tabs',
          items: [
            slot('default', '{}', 'TabPane 子组件'),
            slot('tabBarExtraContent', '{}', '标签栏扩展内容'),
            slot('tabBar', 'TabsTabBarSlotProps', '自定义整个标签栏'),
            slot('more', '{ hiddenTabs: PlainTab[] }', '自定义更多菜单触发器'),
            slot('arrow', 'TabsArrowSlotProps', '自定义滚动折叠箭头'),
          ],
        },
        {
          name: 'TabPane',
          items: [
            slot('default', '{}', '标签页面板内容'),
            slot('icon', '{}', '标签图标'),
            slot('tab', '{}', '标签文本或内容'),
          ],
        },
      ],
      textRewrites: [
        [
          '- 或使用 `` 逐项显式传入，使用 `` 时默认会渲染所有面板，可以通过设置 `keepDOM={false}` 只渲染当前面板，此时不会有动画效果。',
          '- 或通过 `TabPane` 子组件逐项声明；默认会渲染所有面板，可以设置 `:keep-d-o-m="false"` 只渲染当前面板，此时不会有动画效果。',
        ],
        ['通过 renderArrow 修改', '通过 `#arrow` 插槽修改'],
        ['renderArrow', '`arrow` 插槽'],
        [
          '传入 `renderTabBar` 函数可对标签栏进行二次封装。',
          '使用 `#tabBar` 作用域插槽可对标签栏进行二次封装。',
        ],
        ['`renderTabBar` API', '`tabBar` 作用域插槽'],
        ['renderTabBar', '`tabBar` 插槽'],
        ['onTabClose', '`tabClose` 事件'],
        ['onChange', '`change` 事件'],
        ['motion={false}', ':motion="false"'],
      ],
    },
  ],
  [
    '/zh-CN/navigation/pagination',
    {
      sources: ['packages/ui/src/pagination/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/pagination/types.ts',
          interfaces: ['PaginationProps'],
        },
      ],
      models: ['`v-model` 对应 `modelValue`；也支持 `v-model:currentPage` 与 `v-model:pageSize`。'],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: ['onChange', 'onPageChange', 'onPageSizeChange'],
        },
      ],
      eventGroups: [
        {
          name: 'Pagination',
          items: [
            event('change', '[currentPage: number, pageSize: number]', '页码或每页条数变化'),
            event('pageChange', '[currentPage: number]', '页码变化'),
            event('pageSizeChange', '[pageSize: number]', '每页条数变化'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Pagination',
          items: [slot('prev', '{}', '自定义上一页内容'), slot('next', '{}', '自定义下一页内容')],
        },
      ],
      textRewrites: [
        [
          '传入 `currentPage` 后，分页器即为受控组件，一般配合 `onPageChange` 使用。当前激活页码完全取决于传入的 `currentPage`的 值',
          '传入 `currentPage` 后分页器受控，推荐使用 `v-model:currentPage`，也可以监听 `pageChange` 事件更新当前页码。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/navigation/navigation',
    {
      sources: ['packages/ui/src/navigation/types.ts'],
      propSections: [
        {
          heading: 'Nav',
          level: 3,
          source: 'packages/ui/src/navigation/types.ts',
          interfaces: ['NavigationProps'],
        },
        {
          heading: 'Nav.Item',
          level: 3,
          source: 'packages/ui/src/navigation/types.ts',
          interfaces: ['NavItemProps'],
        },
        {
          heading: 'Nav.Sub',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/navigation/types.ts',
              interfaces: ['NavItemProps'],
              omit: ['forwardRef', 'isSubNav', 'link', 'linkOptions', 'tabIndex'],
            },
            {
              source: 'packages/ui/src/navigation/types.ts',
              interfaces: ['SubNavProps'],
            },
          ],
        },
        {
          heading: 'Nav.Header',
          level: 3,
          source: 'packages/ui/src/navigation/types.ts',
          interfaces: ['NavHeaderProps'],
        },
        {
          heading: 'Nav.Footer',
          level: 3,
          source: 'packages/ui/src/navigation/types.ts',
          interfaces: ['NavFooterProps'],
        },
      ],
      models: [
        '折叠、展开项与选中项分别支持 `v-model:isCollapsed`、`v-model:openKeys`、`v-model:selectedKeys`。',
      ],
      eventSections: [
        {
          heading: 'Nav',
          level: 3,
          rows: ['onClick', 'onCollapseChange', 'onOpenChange', 'onSelect'],
        },
        {
          heading: 'Nav.Item',
          level: 3,
          rows: ['onClick', 'onMouseEnter', 'onMouseLeave'],
        },
        {
          heading: 'Nav.Sub',
          level: 3,
          rows: ['onMouseEnter', 'onMouseLeave'],
        },
        { heading: 'Nav.Footer', level: 3, rows: ['onClick'] },
      ],
      eventGroups: [
        {
          name: 'Navigation',
          items: [
            event('click', '[data: NavigationClickData]', '点击任意导航项'),
            event('collapseChange', '[isCollapsed: boolean]', '折叠状态变化'),
            event('openChange', '[data: NavigationOpenChangeData]', '子导航展开状态变化'),
            event('select', '[data: NavigationSelectData]', '导航项选中'),
            event('deselect', '[data?: unknown]', '导航项取消选中'),
          ],
        },
        {
          name: 'Nav.Item',
          items: [
            event('click', '[data: NavItemSelectedData]', '点击导航项'),
            event('mouseenter / mouseleave', '[event: MouseEvent]', '指针进入或离开导航项'),
          ],
        },
        {
          name: 'Nav.Footer',
          items: [event('click', '[event: MouseEvent]', '点击底部区域')],
        },
      ],
      slotGroups: [
        {
          name: 'Navigation',
          items: [
            slot('default', '{}', '声明式导航子组件'),
            slot('header / footer', '{}', '头部或底部内容'),
            slot('itemWrapper', 'NavigationWrapperData', '包装每个导航项'),
          ],
        },
        {
          name: 'Nav.Item',
          items: [
            slot('default / text', '{}', '导航项文本或内容'),
            slot('icon', '{}', '导航项图标'),
          ],
        },
        {
          name: 'Nav.Sub',
          items: [
            slot('default', '{}', '子导航项'),
            slot('text / icon / expandIcon', '{}', '标题、图标与展开图标'),
          ],
        },
        {
          name: 'Nav.Header',
          items: [slot('default / text', '{}', '头部内容'), slot('logo', '{}', 'Logo')],
        },
        {
          name: 'Nav.Footer',
          items: [slot('default', '{}', '底部内容'), slot('collapseButton', '{}', '折叠按钮内容')],
        },
      ],
      textRewrites: [
        ['### JSX 写法', '### 组件写法'],
        ['title="JSX 写法"', 'title="组件写法"'],
        [
          '可以使用 JSX 写法定义导航头部、导航项以及导航底部。使用 JSX写法时，在 Nav 的 children 层级，你除了可以使用 Nav.Header、Nav.Item、Nav.Sub、Nav.Footer外，你也可以置入其他自定义的 VNodeChild 元素',
          '可以通过模板定义导航头部、导航项与底部。在 Nav 默认插槽中，除 Nav.Header、Nav.Item、Nav.Sub、Nav.Footer 外，也可以放置其他 Vue 节点。',
        ],
        ['配合 react-router 等路由组件', '配合 vue-router 等路由组件'],
        [
          '为了在使用 react-router 等路由组件时，能将 NavItem 包裹在路由组件提供的 Link 或者 NavLink 中来让用户点击 NavItem 时候触发路由组件的点击事件， 我们需要自定义渲染。',
          '配合 vue-router 时，可使用 `#itemWrapper` 把 Nav.Item 包裹在 RouterLink 中，由路由组件处理导航。',
        ],
        [
          '使用 renderWrapper 在每个导航项外包裹自定义导航组件 [查看此 CodeSandBox](https://codesandbox.io/s/semi-navigation-with-react-router-9kk9dm?file=/src/App.js)',
          '使用 `#itemWrapper` 作用域插槽在每个导航项外包裹自定义路由组件。',
        ],
        [
          '`onCollapseChange(isCollapsed: boolean): void`',
          '`collapseChange(isCollapsed: boolean)` 事件',
        ],
        [
          '`onSelect({ itemKey: string, selectedKeys: string[], domEvent: MouseEvent, isOpen: boolean }): void`',
          '`select(data: NavigationSelectData)` 事件',
        ],
        [
          '`onOpenChange({ itemKey: string, openKeys: string[], domEvent: MouseEvent, isOpen: boolean }): void`',
          '`openChange(data: NavigationOpenChangeData)` 事件',
        ],
        [
          '在使用函数式组件时，应该用 useState 或者 useMemo 包裹一下 items，原因是 items 直接传一个数组会触发组件重新渲染。',
          '请保持 `items` 的引用稳定；在 Vue 中可使用 `shallowRef` 或 `computed` 管理数组。',
        ],
        ['配合 `onOpenChange` 回调', '配合 `openChange` 事件'],
        ['配合 `onSelect` 回调', '配合 `select` 事件'],
        ['Footer 组件的 children 参数为空', 'Nav.Footer 默认插槽为空'],
      ],
    },
  ],
  [
    '/zh-CN/navigation/breadcrumb',
    {
      sources: ['packages/ui/src/breadcrumb/types.ts', 'packages/ui/src/breadcrumb/index.ts'],
      propSections: [
        {
          heading: 'Breadcrumb',
          level: 3,
          source: 'packages/ui/src/breadcrumb/types.ts',
          interfaces: ['BreadcrumbProps'],
        },
        {
          heading: 'Breadcrumb.Item',
          level: 3,
          source: 'packages/ui/src/breadcrumb/types.ts',
          interfaces: ['BreadcrumbItemProps'],
        },
        {
          heading: 'Route',
          level: 3,
          source: 'packages/ui/src/breadcrumb/types.ts',
          interfaces: ['BreadcrumbRoute'],
        },
      ],
      eventSections: [
        { heading: 'Breadcrumb', level: 3, rows: ['onClick'] },
        { heading: 'Breadcrumb.Item', level: 3, rows: ['onClick'] },
      ],
      eventGroups: [
        {
          name: 'Breadcrumb',
          items: [
            event(
              'click',
              '[item: BreadcrumbItemInfo, event: MouseEvent | KeyboardEvent]',
              '点击任一面包屑项',
            ),
          ],
        },
        {
          name: 'Breadcrumb.Item',
          items: [
            event(
              'click',
              '[item: BreadcrumbItemInfo, event: MouseEvent | KeyboardEvent]',
              '点击当前面包屑项',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Breadcrumb',
          items: [
            slot('default', '{}', 'Breadcrumb.Item 子组件'),
            slot('item', '{ index: number; route: BreadcrumbRoute }', '自定义路由项'),
            slot(
              'more',
              '{ expand: (event?: MouseEvent | KeyboardEvent) => void; items: VNodeChild[] }',
              '自定义折叠项',
            ),
            slot('separator', '{}', '自定义分隔符'),
          ],
        },
        {
          name: 'Breadcrumb.Item',
          items: [
            slot('default', '{}', '面包屑项内容'),
            slot('icon', '{}', '图标'),
            slot('separator', '{}', '分隔符'),
          ],
        },
      ],
      textRewrites: [
        [
          '| activeIndex| 受控使用，当前选择的导航序号 | - | 2.61.0 |',
          '| activeIndex | 受控使用，当前选择的导航序号 | number | - | 2.61.0 |',
        ],
      ],
    },
  ],
  [
    '/zh-CN/navigation/steps',
    {
      sources: ['packages/ui/src/steps/types.ts', 'packages/ui/src/steps/index.ts'],
      propSections: [
        {
          heading: 'Steps',
          level: 3,
          source: 'packages/ui/src/steps/types.ts',
          interfaces: ['StepsProps'],
          aliases: { ariaLabel: 'aria-label' },
        },
        {
          heading: 'Steps.Step',
          level: 3,
          source: 'packages/ui/src/steps/types.ts',
          interfaces: ['StepProps'],
          aliases: { ariaLabel: 'aria-label' },
        },
      ],
      eventSections: [
        { heading: 'Steps', level: 3, rows: ['onChange'] },
        { heading: 'Steps.Step', level: 3, rows: ['onClick', 'onKeyDown'] },
      ],
      eventGroups: [
        {
          name: 'Steps',
          items: [event('change', '[current: number]', '当前步骤变化')],
        },
        {
          name: 'Steps.Step',
          items: [
            event('click', '[event: MouseEvent]', '点击步骤'),
            event('keyDown', '[event: KeyboardEvent]', '步骤触发键盘事件'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Steps',
          items: [slot('default', '{}', 'Steps.Step 子组件')],
        },
        {
          name: 'Steps.Step',
          items: [
            slot('description', '{}', '步骤描述'),
            slot('icon', '{}', '步骤图标'),
            slot('title', '{}', '步骤标题'),
          ],
        },
      ],
      textRewrites: [
        ['### onChange 回调', '### change 事件'],
        ['title="onChange 回调"', 'title="change 事件"'],
        [
          '从 1.29.0 版本开始支持 onChange，可以使用它来实现处理进度。onChange 接收一个 number 类型的参数，该参数等于 initial + current。',
          '从 1.29.0 版本开始支持 `change` 事件，可以使用它来实现处理进度。事件接收一个 number 类型的参数，该参数等于 initial + current。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/navigation/anchor',
    {
      sources: ['packages/ui/src/anchor/types.ts', 'packages/ui/src/anchor/index.ts'],
      propSections: [
        {
          heading: 'Anchor',
          level: 3,
          source: 'packages/ui/src/anchor/types.ts',
          interfaces: ['AnchorProps'],
        },
        {
          heading: 'Anchor.Link',
          level: 3,
          source: 'packages/ui/src/anchor/types.ts',
          interfaces: ['AnchorLinkProps'],
        },
      ],
      eventSections: [{ heading: 'Anchor', level: 3, rows: ['onChange', 'onClick'] }],
      eventGroups: [
        {
          name: 'Anchor',
          items: [
            event('change', '[currentLink: string, previousLink: string]', '当前锚点变化'),
            event('click', '[event: MouseEvent | KeyboardEvent, currentLink: string]', '点击锚点'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Anchor',
          items: [slot('default', '{}', 'Anchor.Link 子组件')],
        },
        {
          name: 'Anchor.Link',
          items: [
            slot('default', '{}', '嵌套 Anchor.Link 子组件'),
            slot('title', '{}', '链接标题'),
          ],
        },
      ],
      textRewrites: [
        [
          '| ------------- | ------------------------------------------------ | ----------------------------------- | --------- | - |',
          '| ------------- | ------------------------------------------------ | ----------------------------------- | --------- | ------- |',
        ],
        [
          ` import React from 'react';
 import { Anchor } from '@aifuxi/semi-ui-vue';

 function() {
 // 此容器不是 Anchor 组件的容器，是文档内容的容器，因为要根据文档容器去计算当前是哪个 id 在容器上方
 const getContainer = () => {
 return document.querySelector('.my-container');
 }
 return (
 /* Links */

 )
 }`,
          ` // 将函数传给 Anchor 的 getContainer prop
 const getContainer = () => document.querySelector<HTMLElement>('.my-container');`,
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/dropdown',
    {
      sources: ['packages/ui/src/dropdown/types.ts', 'packages/ui/src/tooltip/types.ts'],
      propSections: [
        {
          heading: 'Dropdown',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/tooltip/types.ts',
              interfaces: ['TooltipProps'],
              omit: [
                'class',
                'content',
                'mouseLeaveDelay',
                'position',
                'prefixCls',
                'returnFocusOnClose',
                'role',
                'showArrow',
                'spacing',
                'style',
                'trigger',
                'visible',
                'wrapperClassName',
              ],
            },
            {
              source: 'packages/ui/src/dropdown/types.ts',
              interfaces: ['DropdownProps'],
            },
          ],
        },
        {
          heading: 'Dropdown.Menu',
          level: 3,
          source: 'packages/ui/src/dropdown/types.ts',
          interfaces: ['DropdownMenuProps'],
        },
        {
          heading: 'Dropdown.Item',
          level: 3,
          source: 'packages/ui/src/dropdown/types.ts',
          interfaces: ['DropdownItemProps'],
        },
        {
          heading: 'Dropdown.Title',
          level: 3,
          source: 'packages/ui/src/dropdown/types.ts',
          interfaces: ['DropdownTitleProps'],
        },
      ],
      models: ['`v-model:visible` 对应 `visible` 与 `update:visible`。'],
      eventSections: [
        {
          heading: 'Dropdown',
          level: 3,
          rows: ['onClickOutSide', 'onEscKeyDown', 'onVisibleChange'],
        },
        {
          heading: 'Dropdown.Item',
          level: 3,
          rows: ['onClick', 'onMouseEnter', 'onMouseLeave', 'onContextMenu'],
        },
      ],
      eventGroups: [
        {
          name: 'Dropdown',
          items: [
            event('visibleChange', '[visible: boolean]', '浮层显隐变化'),
            event('clickOutside', '[event: MouseEvent]', '点击触发器和浮层以外区域'),
            event('escKeydown', '[event: KeyboardEvent]', '按下 Escape'),
            event('afterClose', '[]', '关闭动画完成'),
          ],
        },
        {
          name: 'Dropdown.Item',
          items: [
            event('click / contextmenu', '[event: MouseEvent]', '点击或右键点击菜单项'),
            event('mouseenter / mouseleave', '[event: MouseEvent]', '指针进入或离开菜单项'),
            event('keydown', '[event: KeyboardEvent]', '菜单项键盘事件'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Dropdown',
          items: [slot('default', '{}', '触发元素'), slot('content', '{}', '下拉内容')],
        },
        {
          name: 'Dropdown.Menu / Title',
          items: [slot('default', '{}', '菜单项或标题内容')],
        },
        {
          name: 'Dropdown.Item',
          items: [slot('default', '{}', '菜单项内容'), slot('icon', '{}', '菜单项图标')],
        },
      ],
      textRewrites: [
        [
          '在 Dropdown 的 children 中为它的 Trigger 触发器：默认为 hover 展示，可通过 props.trigger 修改为 `click`、`custom`、`contextMenu`等值指定不同触发方式',
          'Dropdown 的默认插槽是触发元素：默认 hover 展示，可通过 `trigger` 改为 `click`、`custom`、`contextMenu` 等触发方式。',
        ],
        [
          '更复杂的自定义结构，你可以通过 children 传入 ReactNode自定义渲染',
          '更复杂的结构可以通过默认插槽自定义渲染。',
        ],
        [
          '点击菜单项后可触发不同鼠标事件，支持 `onClick`，`onMouseEnter`， `onMouseLeave` 和 `onContextMenu`。',
          '菜单项支持 `click`、`mouseenter`、`mouseleave` 与 `contextmenu` 事件。',
        ],
        ['### Json 用法', '### JSON 配置用法'],
        ['title="Json 用法"', 'title="JSON 配置用法"'],
        ['若菜单项绑定了 onClick，事件会被触发', '若菜单项监听了 `click`，事件会被触发'],
        [
          '更复杂的自定义结构，你可以通过 children 传入 VNodeChild自定义渲染',
          '更复杂的结构可以通过默认插槽自定义渲染。',
        ],
        ['非 Children、非弹出层内部区域', '触发元素和弹出层以外区域'],
        ['Trigger 元素（即 Dropdown children）', '触发元素（即默认插槽内容）'],
      ],
    },
  ],
  [
    '/zh-CN/show/popover',
    {
      sources: ['packages/ui/src/popover/types.ts', 'packages/ui/src/tooltip/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          sources: [
            {
              source: 'packages/ui/src/tooltip/types.ts',
              interfaces: ['TooltipProps'],
              omit: ['class', 'content', 'prefixCls', 'role', 'showArrow', 'style', 'zIndex'],
            },
            {
              source: 'packages/ui/src/popover/types.ts',
              interfaces: ['PopoverProps'],
            },
          ],
        },
      ],
      models: ['`v-model:visible` 对应 `visible` 与 `update:visible`。'],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: ['onClickOutSide', 'onEscKeyDown', 'onVisibleChange'],
        },
      ],
      eventGroups: [
        {
          name: 'Popover',
          items: [
            event('visibleChange', '[visible: boolean]', '浮层显隐变化'),
            event('clickOutside', '[event: MouseEvent]', '点击触发器和浮层以外区域'),
            event('escKeydown', '[event: KeyboardEvent]', '按下 Escape'),
            event('afterClose', '[]', '关闭动画完成'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Popover',
          items: [
            slot('default', '{}', '触发元素'),
            slot('content', '{ initialFocusRef }', '浮层内容'),
          ],
        },
      ],
      textRewrites: [
        [
          'Popover 需要将 DOM 事件监听器应用到 children 中，如果子元素是自定义的组件，你需要确保它能将属性传递至底层的 DOM 元素',
          'Popover 会把 DOM 事件监听器合并到默认插槽的触发元素；使用自定义组件时，需要将 attrs 透传到底层 DOM 元素。',
        ],
        [
          '同时为了计算弹出层的定位，需要获取到 children 的真实 DOM 元素，因此 Popover 支持如下类型的 children',
          '定位计算需要取得触发元素的真实 DOM 节点，因此默认插槽应提供以下类型的内容：',
        ],
        ['1. 真实 DOM 节点，如 span，div，p...', '1. 原生 DOM 元素，例如 `span`、`div`、`p`'],
        [
          '2. 使用 forwardRef 包裹后的函数式组件，将 props 与 ref 透传到 children 内真实的 DOM 节点上',
          '2. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件',
        ],
        [
          '3. Class Component，不强制绑定 ref，但需要确保 props 可被透传至真实的 DOM 节点上',
          '3. 多个根节点或特殊节点会按 `wrapWhenSpecial` 的设置使用包装元素',
        ],
        [
          '将浮层的触发器 Trigger 作为`children`，使用 Popover 包裹（如下的例子中触发器为 Tag 元素）。浮层内容通过`content`传入',
          '将触发元素放入默认插槽，并通过 `#content` 插槽提供浮层内容。',
        ],
        ['condition={false}', ':condition="false"'],
        [
          '显示的内容（函数类型，2.8.0 版本支持）',
          '显示内容；需要 initialFocusRef 时使用 content 插槽',
        ],
        [
          'const renderContent = ({ initialFocusRef }) => {',
          '使用 `#content="{ initialFocusRef }"` 获取初始焦点引用。',
        ],
        ['Popover 的 children', 'Popover 的默认插槽触发元素'],
        [
          'Popover 底层依赖了 Tooltip，Tooltip 为了计算定位，需要获取到 children 的真实 DOM 元素，因此 Popover 类型目前支持如下类型的 children：',
          'Popover 底层依赖 Tooltip 定位，需要取得默认插槽触发元素的真实 DOM 节点：',
        ],
        [
          '1. Class Component，不强制绑定ref，但需要确保 props 可被透传至真实的 DOM 节点上',
          '1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件',
        ],
        [
          '2. 使用 forwardRef 包裹后的函数式组件，将 props 与 ref 透传到 children 内真实的 DOM 节点上',
          '2. 原生 DOM 元素，例如 `span`、`div`、`p`',
        ],
        ['3. 真实 DOM 节点, 如 span，div，p...', '3. 特殊节点会按 `wrapWhenSpecial` 使用包装元素'],
        [
          '若通过 ref 或 findDOMNode 获取到的真实 DOM 节点宽高并非是你的 children 元素的全部',
          '若触发元素根节点的宽高并未覆盖全部可见内容',
        ],
        ['children', '默认插槽触发元素'],
        [
          '1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件\n2. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件\n3. 特殊节点会按 `wrapWhenSpecial` 使用包装元素',
          '1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件\n2. 原生 DOM 元素，例如 `span`、`div`、`p`\n3. 特殊节点会按 `wrapWhenSpecial` 使用包装元素',
        ],
        [
          ' 1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件\n 2. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件\n 3. 特殊节点会按 `wrapWhenSpecial` 使用包装元素',
          ' 1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件\n 2. 原生 DOM 元素，例如 `span`、`div`、`p`\n 3. 特殊节点会按 `wrapWhenSpecial` 使用包装元素',
        ],
      ],
    },
  ],
  [
    '/zh-CN/feedback/toast',
    {
      sources: [
        'packages/ui/src/toast/types.ts',
        'packages/ui/src/toast/index.ts',
        'packages/ui/src/toast/use-toast.ts',
      ],
      propSections: [
        {
          heading: 'Options',
          level: 2,
          source: 'packages/ui/src/toast/types.ts',
          interfaces: ['ToastOptions'],
        },
        {
          heading: 'Config',
          level: 2,
          source: 'packages/ui/src/toast/types.ts',
          interfaces: ['ToastConfig'],
        },
      ],
      usageNotes: [
        '`useToast()` 可直接导入，也可通过 `Toast.useToast()` 调用。',
        '返回元组第二项是 Vue `Component`；请在调用组件的模板中渲染该 holder，使 Toast 继承当前位置的 provide / inject 上下文。',
      ],
      methodGroups: [
        {
          name: 'Toast',
          items: [
            method(
              'Toast.info / error / warning / success',
              '(options: ToastInput) => ToastId',
              '展示对应类型的 Toast',
            ),
            method('Toast.close', '(id: ToastInputId) => ToastId', '关闭指定 Toast'),
            method(
              'Toast.config',
              '(config: ToastConfig) => void',
              '设置当前 Toast 实例的默认配置',
            ),
            method('Toast.destroyAll', '() => void', '销毁当前 Toast 实例的全部消息'),
            method('Toast.getWrapperId', '() => string | null', '获取当前 Toast 容器 id'),
            method(
              'ToastFactory.create',
              '(config?: ToastConfig) => ToastStaticMethods',
              '创建独立配置的 Toast 实例',
            ),
          ],
        },
      ],
      composableGroups: [
        {
          name: 'useToast',
          items: [
            method(
              'useToast',
              '() => readonly [ToastMethods, Component]',
              '创建局部方法集与 holder 组件',
            ),
            method('methods.open', '(options: ToastOptions) => ToastId', '展示默认类型 Toast'),
            method(
              'methods.info / error / warning / success',
              '(options: ToastOptions) => ToastId',
              '展示对应类型的局部 Toast',
            ),
            method('methods.close', '(id: ToastInputId) => ToastId', '关闭指定局部 Toast'),
          ],
        },
      ],
      textRewrites: [
        ['### 消费 Context', '### 局部上下文'],
        ['消费 Context：', '局部上下文：'],
        [
          '通过 Toast.useToast 创建支持读取 context 的 contextHolder。此时的 toast 会渲染在 contextHolder 所在的节点处。',
          '通过 `useToast()` 创建可读取 Vue provide / inject 上下文的 holder 组件；局部 Toast 会渲染在 holder 所在位置。',
        ],
        [
          '当你需要使用 Context 时，可以通过 Toast.useToast 创建一个 contextHolder 插入相应的节点中。此时通过 hooks 创建的 Toast 将会得到 contextHolder 所在位置的所有上下文。创建的 toast 对象拥有与以下方法：`info`, `success`, `warning`, `error`, `close`。',
          '需要继承局部上下文时，在 `setup` 中调用 `useToast()`，并在模板中渲染返回的 holder 组件。局部方法集包含 `open`、`info`、`success`、`warning`、`error` 和 `close`。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/feedback/notification',
    {
      sources: [
        'packages/ui/src/notification/types.ts',
        'packages/ui/src/notification/index.ts',
        'packages/ui/src/notification/use-notification.ts',
      ],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          tableIndex: 0,
          source: 'packages/ui/src/notification/types.ts',
          interfaces: ['NotificationOptions'],
        },
        {
          heading: 'API 参考',
          level: 2,
          tableIndex: 1,
          source: 'packages/ui/src/notification/types.ts',
          interfaces: ['NotificationConfig'],
        },
      ],
      usageNotes: [
        '`useNotification()` 可直接导入，也可通过 `Notification.useNotification()` 调用。',
        '返回元组第二项是 Vue `Component`；请在调用组件的模板中渲染该 holder，使 Notification 继承当前位置的 provide / inject 上下文。',
      ],
      methodGroups: [
        {
          name: 'Notification',
          items: [
            method(
              'Notification.open / info / error / warning / success',
              '(options: NotificationOptions) => NotificationId',
              '展示对应类型的通知',
            ),
            method('Notification.close', '(id: NotificationId) => NotificationId', '关闭指定通知'),
            method(
              'Notification.config',
              '(config: NotificationConfig) => void',
              '设置全局默认配置',
            ),
            method('Notification.destroyAll', '() => void', '销毁全部通知'),
          ],
        },
      ],
      composableGroups: [
        {
          name: 'useNotification',
          items: [
            method(
              'useNotification',
              '() => readonly [NotificationMethods, Component]',
              '创建局部方法集与 holder 组件',
            ),
            method(
              'methods.open / info / error / warning / success',
              '(options: NotificationOptions) => NotificationId',
              '展示对应类型的局部通知',
            ),
            method('methods.close', '(id: NotificationId) => NotificationId', '关闭指定局部通知'),
          ],
        },
      ],
      textRewrites: [
        ['Hook Notification：', '局部上下文：'],
        [
          '当你需要使用 Context 时，可以通过 Notification.useNotification 创建一个 contextHolder 插入相应的节点中。此时通过 hooks 创建的 Notification 将会得到 contextHolder 所在位置的所有上下文。创建的 notification 对象拥有与以下方法：`info`, `success`, `warning`, `error`, `open`, `close`。使用方法可以参考：[useToast](/zh-CN/feedback/toast#Hooks用法)',
          '需要继承局部上下文时，在 `setup` 中调用 `useNotification()`，并在模板中渲染返回的 holder 组件。局部方法集包含 `open`、`info`、`success`、`warning`、`error` 和 `close`。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/checkbox',
    {
      sources: ['packages/ui/src/checkbox/types.ts'],
      propSections: [
        {
          heading: 'Checkbox',
          level: 3,
          source: 'packages/ui/src/checkbox/types.ts',
          interfaces: ['CheckboxProps'],
          aliases: { ariaLabel: 'aria-label' },
        },
        {
          heading: 'Checkbox Group',
          level: 3,
          source: 'packages/ui/src/checkbox/types.ts',
          interfaces: ['CheckboxGroupProps'],
          aliases: { ariaLabel: 'aria-label' },
        },
      ],
      models: [
        '`Checkbox`：`v-model` 对应 `modelValue`，`v-model:checked` 对应 `checked`。',
        '`Checkbox.Group`：`v-model` 对应 `modelValue`，同时支持 `v-model:value`。',
      ],
      eventSections: [
        { heading: 'Checkbox', level: 3, rows: ['onChange'] },
        { heading: 'Checkbox Group', level: 3, rows: ['onChange'] },
      ],
      eventGroups: [
        {
          name: 'Checkbox',
          items: [event('change', '[event: CheckboxChangeEvent]', '选中状态变化')],
        },
        {
          name: 'Checkbox.Group',
          items: [event('change', '[value: CheckboxValue[]]', '组选中值变化')],
        },
      ],
      slotGroups: [
        {
          name: 'Checkbox',
          items: [slot('default', '{}', '复选框内容'), slot('extra', '{}', '辅助文本')],
        },
        {
          name: 'Checkbox.Group',
          items: [slot('default', '{}', 'Checkbox 子组件')],
        },
      ],
      textRewrites: [
        ['## API参考', '## API 参考'],
        ['### JSX方式声明Checkbox组', '### 模板方式声明 Checkbox 组'],
        ['title="JSX方式声明Checkbox组"', 'title="模板方式声明 Checkbox 组"'],
        [
          '通过在CheckboxGroup内部放置 Checkbox元素，可以声明Checkbox组',
          '通过在 Checkbox.Group 的默认插槽中放置 Checkbox，可以声明 Checkbox 组。',
        ],
        [
          '使用Checkbox组，你可以更便捷地通过CheckboxGroup的`defaultValue`、`value`属性去控制一组Checkbox的选中与否',
          '使用 Checkbox.Group，可以通过 `defaultValue`、`value` 或 `v-model` 管理组选中值。',
        ],
        [
          '此时Checkbox不需要再声明`defaultChecked`、`checked`属性',
          '组内 Checkbox 不需要再声明 `defaultChecked` 或 `checked`。',
        ],
        ['如果 Children 没有文本', '如果默认插槽没有文本'],
      ],
    },
  ],
  [
    '/zh-CN/input/radio',
    {
      sources: ['packages/ui/src/radio/types.ts'],
      propSections: [
        {
          heading: 'Radio',
          level: 3,
          source: 'packages/ui/src/radio/types.ts',
          interfaces: ['RadioProps'],
          aliases: { ariaLabel: 'aria-label' },
        },
        {
          heading: 'RadioGroup',
          level: 3,
          source: 'packages/ui/src/radio/types.ts',
          interfaces: ['RadioGroupProps'],
          aliases: { ariaLabel: 'aria-label' },
        },
      ],
      models: [
        '`Radio`：`v-model` 对应 `modelValue`，`v-model:checked` 对应 `checked`。',
        '`Radio.Group`：`v-model` 对应 `modelValue`，同时支持 `v-model:value`。',
      ],
      eventSections: [
        {
          heading: 'Radio',
          level: 3,
          rows: ['onChange', 'onMouseEnter', 'onMouseLeave'],
        },
        { heading: 'RadioGroup', level: 3, rows: ['onChange'] },
      ],
      eventGroups: [
        {
          name: 'Radio',
          items: [
            event('change', '[event: RadioChangeEvent]', '选中状态变化'),
            event('mouseenter / mouseleave', '[event: MouseEvent]', '指针进入或离开选项'),
          ],
        },
        {
          name: 'Radio.Group',
          items: [event('change', '[event: RadioChangeEvent]', '组选中值变化')],
        },
      ],
      slotGroups: [
        {
          name: 'Radio',
          items: [slot('default', '{}', '单选框内容'), slot('extra', '{}', '辅助文本')],
        },
        {
          name: 'Radio.Group',
          items: [slot('default', '{}', 'Radio 子组件')],
        },
      ],
    },
  ],
  [
    '/zh-CN/input/switch',
    {
      sources: ['packages/ui/src/switch/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/switch/types.ts',
          interfaces: ['SwitchProps'],
          aliases: {
            ariaDescribedby: 'aria-describedby',
            ariaErrormessage: 'aria-errormessage',
            ariaInvalid: 'aria-invalid',
            ariaLabel: 'aria-label',
            ariaLabelledby: 'aria-labelledby',
          },
        },
      ],
      models: ['`v-model` 对应 `modelValue`，`v-model:checked` 对应 `checked`。'],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: ['onChange', 'onMouseEnter', 'onMouseLeave'],
        },
      ],
      eventGroups: [
        {
          name: 'Switch',
          items: [event('change', '[checked: boolean, event: Event]', '开关状态变化')],
        },
      ],
      slotGroups: [
        {
          name: 'Switch',
          items: [
            slot('checkedText', '{}', '打开时展示的内容'),
            slot('uncheckedText', '{}', '关闭时展示的内容'),
          ],
        },
      ],
      textRewrites: [
        [
          '你可以通过 `onChange` 监听状态变化，通过 `defaultChecked` 或受控的 `checked` 制定选中状态。',
          '你可以通过 `change` 事件监听状态变化，也可以使用 `v-model`、`defaultChecked` 或受控的 `checked` 管理选中状态。',
        ],
        [
          '组件是否选中完全取决于传入的 checked 值，配合 onChange 回调函数使用',
          '受控模式下，组件是否选中完全取决于 `checked`，并通过 `change` 事件通知变化。',
        ],
        ['配合 onChange 使用', '配合 `v-model` 或 `change` 事件使用'],
        [
          '可以通过设置 loading="true" 开启加载中状态。',
          '可以通过设置 `:loading="true"` 开启加载中状态。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/datepicker',
    {
      sources: ['packages/ui/src/date-picker/types.ts', 'packages/ui/src/date-picker/index.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/date-picker/types.ts',
          interfaces: ['DatePickerProps'],
          aliases: {
            ariaDescribedby: 'aria-describedby',
            ariaErrormessage: 'aria-errormessage',
            ariaInvalid: 'aria-invalid',
            ariaLabelledby: 'aria-labelledby',
            ariaRequired: 'aria-required',
          },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue`，同时支持 `v-model:value`。',
        '`v-model:open` 对应面板展开状态。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: [
            'onBlur',
            'onCancel',
            'onChange',
            'onClear',
            'onClickOutSide',
            'onConfirm',
            'onFocus',
            'onOpenChange',
            'onPanelChange',
            'onPresetClick',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'DatePicker',
          items: [
            event('blur', '[event?: unknown]', '输入框失去焦点'),
            event(
              'cancel',
              '[date: Date | Date[] | undefined, dateString: string | string[] | undefined]',
              '取消需要确认的选择',
            ),
            event(
              'change',
              '[first: Date | Date[] | string | string[] | undefined, second: Date | Date[] | string | string[] | undefined]',
              '值变化；参数顺序由 onChangeWithDateFirst 决定',
            ),
            event('clear', '[event?: unknown]', '点击清除按钮'),
            event('clickOutside', '[event: MouseEvent]', '点击浮层和触发器之外的区域'),
            event(
              'confirm',
              '[date: Date | Date[] | undefined, dateString: string | string[] | undefined]',
              '确认需要确认的选择',
            ),
            event('focus', '[event: unknown, rangeType?: DatePickerRangeType]', '输入框获得焦点'),
            event('maxSelect', '[value?: Date[]]', '多选达到上限'),
            event('openChange', '[open: boolean]', '面板展开状态变化'),
            event(
              'panelChange',
              '[date: Date | Date[], dateString: string | string[]]',
              '面板年月切换',
            ),
            event('presetClick', '[item: DatePickerPreset, event: MouseEvent]', '点击快捷选项'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'DatePicker',
          items: [
            slot('bottom', '{}', '面板底部内容'),
            slot('clearIcon', '{}', '清除图标'),
            slot('date', '{ dayNumber: number; fullDate: string }', '日期内容'),
            slot(
              'fullDate',
              '{ dayNumber: number; fullDate: string; status: DatePickerDayStatus }',
              '完整日期格子',
            ),
            slot('insetLabel', '{}', '内嵌标签'),
            slot('left', '{}', '面板左侧内容'),
            slot('prefix', '{}', '输入框前缀'),
            slot('rangeSeparator', '{}', '范围分隔内容'),
            slot('right', '{}', '面板右侧内容'),
            slot('top', '{}', '面板顶部内容'),
            slot('trigger', 'DatePickerTriggerSlotProps', '自定义触发器'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'DatePicker ref',
          items: [
            method('open', '() => void', '展开面板'),
            method('close', '() => void', '关闭面板'),
            method('focus', "(focusType?: 'rangeStart' | 'rangeEnd') => void", '聚焦输入框'),
            method('blur', '() => void', '移除输入框焦点'),
          ],
        },
      ],
      textRewrites: [
        [
          '只有开始日期和结束日期都被选择后才会触发 onChange。',
          '只有开始日期和结束日期都被选择后才会触发 `change` 事件。',
        ],
        [
          '`onPanelChange` 回调函数会在面板的月份或年份切换改变时被调用。',
          '`panelChange` 事件会在面板的月份或年份切换时触发。',
        ],
        [
          '同时支持 “确认”（onConfirm） 和 “取消”（onCancel） 两个按钮的点击回调。',
          '同时支持“确认”按钮的 `confirm` 事件和“取消”按钮的 `cancel` 事件。',
        ],
        [
          '下面这个例子绑定了 onChange、onConfirm、onCancel 三种回调，你可以打开控制台查看打印信息的区别。',
          '下面示例同时监听 `change`、`confirm`、`cancel` 三种事件，可在控制台查看参数差异。',
        ],
        [
          '`renderDate: (dayNumber: number, fullDate: string) => ReactNode`，自定义日期内容。',
          '使用 `#date` 插槽或 `renderDate: (dayNumber: number, fullDate: string) => VNodeChild` 自定义日期内容。',
        ],
        [
          '`renderFullDate: (dayNumber: number, fullDate: string, dayStatus: object) => ReactNode`， 自定义日期格子的渲染内容。',
          '使用 `#fullDate` 插槽或 `renderFullDate: (dayNumber: number, fullDate: string, dayStatus: DatePickerDayStatus) => VNodeChild` 自定义日期格子。',
        ],
        [
          '0.x 中 onChange(string, Date), 1.0 后(Date, string)。此开关设为 false 时，入参顺序将与 0.x 版本保持一致',
          '控制 `change` 事件参数顺序；设为 `false` 时先传格式化字符串，再传日期值',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/timepicker',
    {
      sources: ['packages/ui/src/time-picker/types.ts', 'packages/ui/src/time-picker/index.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/time-picker/types.ts',
          interfaces: ['TimePickerProps'],
          aliases: {
            ariaDescribedby: 'aria-describedby',
            ariaErrormessage: 'aria-errormessage',
            ariaInvalid: 'aria-invalid',
            ariaLabel: 'aria-label',
            ariaLabelledby: 'aria-labelledby',
            ariaRequired: 'aria-required',
          },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue`，同时支持 `v-model:value`。',
        '`v-model:open` 对应面板展开状态。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: ['onBlur', 'onChange', 'onFocus', 'onOpenChange'],
        },
      ],
      eventGroups: [
        {
          name: 'TimePicker',
          items: [
            event('blur', '[event: FocusEvent | MouseEvent]', '输入框失去焦点'),
            event(
              'change',
              '[value: TimePickerChangeValue | TimePickerFormattedValue, formatted: TimePickerFormattedValue | TimePickerChangeValue]',
              '值变化；参数顺序由 onChangeWithDateFirst 决定',
            ),
            event('focus', '[event: FocusEvent]', '输入框获得焦点'),
            event('openChange', '[open: boolean]', '面板展开状态变化'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'TimePicker',
          items: [
            slot('clearIcon', '{}', '清除图标'),
            slot('insetLabel', '{}', '内嵌标签'),
            slot('panelFooter', 'TimePickerPanelSlotProps', '面板底部内容'),
            slot('panelHeader', 'TimePickerPanelSlotProps', '面板顶部内容'),
            slot('trigger', 'TimePickerTriggerSlotProps', '自定义触发器'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'TimePicker ref',
          items: [
            method('open', '() => void', '展开面板'),
            method('close', '() => void', '关闭面板'),
            method('focus', '() => void', '聚焦输入框'),
            method('blur', '() => void', '移除输入框焦点'),
          ],
        },
      ],
      textRewrites: [
        [
          '当使用 `value` 而不是 `defaultValue` 时，作为受控组件使用。`value` 和 `onChange` 需要配合使用。',
          '使用 `v-model` 管理受控值，或通过 `value` 与 `change` 事件配合管理。',
        ],
        [
          '设置为 `true` 时 onChange 的入参顺序为 (Date, string), `false` 时为 (string, Date)',
          '设置为 `true` 时 `change` 事件先传日期值，设为 `false` 时先传格式化字符串',
        ],
      ],
    },
  ],
  [
    '/zh-CN/navigation/tree',
    {
      sources: ['packages/ui/src/tree/types.ts', 'packages/ui/src/tree/index.ts'],
      propSections: [
        {
          heading: 'Tree',
          level: 3,
          source: 'packages/ui/src/tree/types.ts',
          interfaces: ['TreeProps'],
          aliases: { ariaLabel: 'aria-label' },
        },
        {
          heading: 'TreeNodeData',
          level: 3,
          source: 'packages/ui/src/tree/types.ts',
          interfaces: ['TreeNodeData'],
        },
        {
          heading: 'Virtualize Object',
          level: 3,
          source: 'packages/ui/src/tree/types.ts',
          interfaces: ['TreeVirtualize'],
        },
      ],
      models: [
        '`v-model` 对应 `modelValue`，同时支持 `v-model:value`。',
        '`v-model:expandedKeys` 对应受控展开节点。',
      ],
      eventSections: [
        {
          heading: 'Tree',
          level: 3,
          rows: [
            'onChange',
            'onDoubleClick',
            'onDragEnd',
            'onDragEnter',
            'onDragLeave',
            'onDragOver',
            'onDragStart',
            'onDrop',
            'onExpand',
            'onLoad',
            'onContextMenu',
            'onSearch',
            'onSelect',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Tree',
          items: [
            event('change', '[value?: TreeValue]', '选中值变化'),
            event('contextMenu', '[event: MouseEvent, node: TreeNodeData]', '节点右键点击'),
            event('doubleClick', '[event: MouseEvent, node: TreeNodeData]', '节点双击'),
            event('dragEnd', '[props: TreeDragProps]', '拖拽结束'),
            event('dragEnter', '[props: TreeDragEnterProps]', '拖入节点'),
            event('dragLeave', '[props: TreeDragProps]', '拖出节点'),
            event('dragOver', '[props: TreeDragProps]', '在节点上拖动'),
            event('dragStart', '[props: TreeDragProps]', '开始拖拽'),
            event('drop', '[props: TreeDropProps]', '放置节点'),
            event('expand', '[expandedKeys: string[], detail: TreeExpandDetail]', '展开状态变化'),
            event('load', '[loadedKeys: Set<string>, node?: TreeNodeData]', '异步节点加载完成'),
            event('search', '[input: string, filteredExpandedKeys: string[]]', '搜索值变化'),
            event(
              'select',
              '[key: string, selected: boolean, node: TreeNodeData]',
              '节点选中状态变化',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Tree',
          items: [
            slot('empty', '{}', '搜索无结果内容'),
            slot('expandIcon', 'TreeExpandIconSlotProps', '展开图标'),
            slot('fullLabel', 'TreeFullLabelSlotProps', '完整节点行'),
            slot('icon', '{ node: TreeNodeData; expanded: boolean }', '节点图标'),
            slot(
              'label',
              '{ label?: VNodeChild; node: TreeNodeData; searchWord?: string }',
              '节点标签',
            ),
            slot('search', 'TreeSearchSlotProps', '搜索框'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'Tree ref',
          items: [
            method('search', '(value: string) => void', '手动触发搜索'),
            method(
              'scrollTo',
              "(data: { key: string; align?: 'center' | 'start' | 'end' | 'smart' | 'auto' }) => void",
              '将虚拟化树中的已展开节点滚动到视图',
            ),
            method('focus', '() => void', '聚焦树'),
          ],
        },
      ],
      textRewrites: [
        ['## API参考', '## API 参考'],
        ['可以配合 `onExpand` 使用', '可以使用 `v-model:expandedKeys` 或监听 `expand` 事件'],
        ['`onSearch` 的入参', '`search` 事件的参数'],
        [
          '传入 `value` 时即为受控组件，可以配合 `onChange` 使用。',
          '使用 `v-model` 管理受控值，或通过 `value` 与 `change` 事件配合管理。',
        ],
        [
          '通过设置 draggable 配合 onDrop 可以实现 Tree 节点的拖拽。',
          '通过设置 `draggable` 并监听 `drop` 事件，可以实现 Tree 节点拖拽。',
        ],
        [
          '同时开启 leafOnly 可以使 onChange 的回调入参都是叶子节点。',
          '同时开启 `leafOnly` 可以使 `change` 事件参数只包含叶子节点。',
        ],
        [
          '多选模式下是否开启 onChange 回调入参及展示标签只有叶子节点',
          '多选模式下是否仅通过 change 事件参数及展示标签返回叶子节点',
        ],
        [
          '设为 true 时，onChange 的入参类型会从 string 变为 object',
          '设为 true 时，`change` 事件参数类型会从 string 变为 object',
        ],
        [
          '此时 onChange, value, defaultValue 及 onChangeWithObject 中所取的 value 属性值将改为 key 值。',
          '此时 `change` 事件、value、defaultValue 及 onChangeWithObject 中的 value 将改为 key 值。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/treeselect',
    {
      sources: [
        'packages/ui/src/tree-select/types.ts',
        'packages/ui/src/tree-select/index.ts',
        'packages/ui/src/tree/types.ts',
      ],
      propSections: [
        {
          heading: 'TreeSelect',
          level: 3,
          source: 'packages/ui/src/tree-select/types.ts',
          interfaces: ['TreeSelectProps'],
          aliases: {
            ariaDescribedby: 'aria-describedby',
            ariaErrormessage: 'aria-errormessage',
            ariaInvalid: 'aria-invalid',
            ariaLabel: 'aria-label',
            ariaLabelledby: 'aria-labelledby',
            ariaRequired: 'aria-required',
          },
        },
        {
          heading: 'TreeNodeData',
          level: 3,
          source: 'packages/ui/src/tree/types.ts',
          interfaces: ['TreeNodeData'],
        },
      ],
      models: [
        '`v-model` 对应 `modelValue`，同时支持 `v-model:value`。',
        '`v-model:expandedKeys` 对应受控展开节点。',
      ],
      eventSections: [
        {
          heading: 'TreeSelect',
          level: 3,
          rows: [
            'onBlur',
            'onChange',
            'onClear',
            'onExpand',
            'onFocus',
            'onLoad',
            'onSearch',
            'onSelect',
            'onVisibleChange',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'TreeSelect',
          items: [
            event('blur', '[event: unknown]', '选择框失去焦点'),
            event(
              'change',
              '[valueOrNode: unknown, nodeOrEvent?: unknown, event?: unknown]',
              '选中值变化',
            ),
            event('clear', '[event: MouseEvent | KeyboardEvent]', '点击清除按钮'),
            event('expand', '[expandedKeys: string[], detail: TreeExpandDetail]', '展开状态变化'),
            event('focus', '[event: unknown]', '选择框获得焦点'),
            event('load', '[loadedKeys: Set<string>, node?: TreeNodeData]', '异步节点加载完成'),
            event(
              'search',
              '[input: string, filteredExpandedKeys: string[], filteredNodes: TreeNodeData[]]',
              '搜索值变化',
            ),
            event(
              'select',
              '[key: string, selected: boolean, node: TreeNodeData]',
              '节点选中状态变化',
            ),
            event('visibleChange', '[visible: boolean]', '弹出层展示状态变化'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'TreeSelect',
          items: [
            slot('arrowIcon', '{}', '下拉箭头图标'),
            slot('clearIcon', '{}', '清除图标'),
            slot('empty', '{}', '搜索无结果内容'),
            slot('expandIcon', 'TreeExpandIconSlotProps', '展开图标'),
            slot('fullLabel', 'TreeFullLabelSlotProps', '完整节点行'),
            slot(
              'label',
              '{ label?: VNodeChild; node: TreeNodeData; searchWord?: string }',
              '节点标签',
            ),
            slot('outerBottom', '{}', '弹出层底部内容'),
            slot('outerTop', '{}', '弹出层顶部内容'),
            slot('prefix', '{}', '选择框前缀'),
            slot('search', 'TreeSelectSearchRenderProps', '搜索框'),
            slot('selectedItem', 'TreeSelectSelectedItemProps', '已选项'),
            slot('suffix', '{}', '选择框后缀'),
            slot('trigger', 'TreeSelectTriggerRenderProps', '自定义触发器'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'TreeSelect ref',
          items: [
            method('close', '() => void', '关闭弹出层'),
            method('search', '(value: string) => void', '手动触发搜索'),
          ],
        },
      ],
      textRewrites: [
        ['## API参考', '## API 参考'],
        ['onChange 的回调入参', '`change` 事件参数'],
        ['`onSearch` 回调函数', '`search` 事件'],
        ['`onSearch` 回调', '`search` 事件'],
        [
          '传入 `value` 时即为受控组件，可以配合 `onChange` 使用。',
          '使用 `v-model` 管理受控值，或通过 `value` 与 `change` 事件配合管理。',
        ],
        ['可以配合 `onExpand` 使用', '可以使用 `v-model:expandedKeys` 或监听 `expand` 事件'],
        ['`onSearch` 的入参', '`search` 事件的参数'],
        [
          '多选模式下是否开启 onChange 回调入参及展示标签只有叶子节点',
          '多选模式下是否仅通过 change 事件参数及展示标签返回叶子节点',
        ],
        ['onChange 的入参类型Function', '`change` 事件的参数类型为 Function'],
        [
          '此时 onChange, value, defaultValue 及 onChangeWithObject 中所取的 value 属性值将改为 key 值。',
          '此时 `change` 事件、value、defaultValue 及 onChangeWithObject 中的 value 将改为 key 值。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/cascader',
    {
      sources: ['packages/ui/src/cascader/types.ts', 'packages/ui/src/cascader/index.ts'],
      propSections: [
        {
          heading: 'Cascader',
          level: 3,
          source: 'packages/ui/src/cascader/types.ts',
          interfaces: ['CascaderProps'],
          aliases: {
            ariaDescribedby: 'aria-describedby',
            ariaErrormessage: 'aria-errormessage',
            ariaInvalid: 'aria-invalid',
            ariaLabel: 'aria-label',
            ariaLabelledby: 'aria-labelledby',
            ariaRequired: 'aria-required',
          },
        },
        {
          heading: 'CascaderData',
          level: 3,
          source: 'packages/ui/src/cascader/types.ts',
          interfaces: ['CascaderData'],
        },
      ],
      models: ['`v-model` 对应 `modelValue`，同时支持 `v-model:value`。'],
      eventSections: [
        {
          heading: 'Cascader',
          level: 3,
          rows: [
            'onBlur',
            'onChange',
            'onClear',
            'onDropdownVisibleChange',
            'onExceed',
            'onFocus',
            'onListScroll',
            'onLoad',
            'onSearch',
            'onSelect',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Cascader',
          items: [
            event('blur', '[event: unknown]', '选择框失去焦点'),
            event('change', '[value: CascaderValue]', '选中值变化'),
            event('clear', '[]', '点击清除按钮'),
            event('exceed', '[checkedItems: CascaderEntity[]]', '选中数量超过 max'),
            event('focus', '[event: unknown]', '选择框获得焦点'),
            event('listScroll', '[event: Event, panel: CascaderScrollPanelProps]', '下拉面板滚动'),
            event('load', '[loadedKeys: Set<string>, data: CascaderData]', '异步节点加载完成'),
            event('search', '[value: string]', '搜索值变化'),
            event('select', '[value: string | number | Array<string | number>]', '节点选中'),
            event('visibleChange', '[visible: boolean]', '弹出层展示状态变化'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Cascader',
          items: [
            slot('arrowIcon', '{}', '下拉箭头图标'),
            slot('bottom', '{}', '弹出层底部内容'),
            slot('clearIcon', '{}', '清除图标'),
            slot(
              'display',
              '{ selected: VNodeChild[] | CascaderEntity; index?: number }',
              '已选内容',
            ),
            slot('empty', '{}', '搜索无结果内容'),
            slot('expandIcon', '{}', '展开图标'),
            slot('filter', 'CascaderFilterRenderProps', '搜索结果项'),
            slot('prefix', '{}', '选择框前缀'),
            slot('suffix', '{}', '选择框后缀'),
            slot('top', '{}', '弹出层顶部内容'),
            slot('trigger', 'CascaderTriggerRenderProps', '自定义触发器'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'Cascader ref',
          items: [
            method('open', '() => void', '展开弹出层'),
            method('close', '() => void', '关闭弹出层'),
            method('focus', '() => void', '聚焦选择框'),
            method('blur', '() => void', '移除选择框焦点'),
            method('search', '(value: string) => void', '手动触发搜索'),
          ],
        },
      ],
      textRewrites: [
        ['onExceed 回调', '`exceed` 事件'],
        [
          '传入 `value` 时即为受控组件，可以配合 `onChange` 使用。',
          '使用 `v-model` 管理受控值，或通过 `value` 与 `change` 事件配合管理。',
        ],
        ['onChange 的参数 value', '`change` 事件的 value 参数'],
        ['`onSearch` 回调', '`search` 事件'],
        [
          '单选 (`multiple=false`) 时, `displayRender((labelPath: string[]) => ReactNode)`, 其中 labelPath 是由 label 构成的 path 数组。',
          '单选时可使用 `#display` 插槽，或通过 `displayRender((selected: VNodeChild[] | CascaderEntity, index?: number) => VNodeChild)` 自定义已选内容。',
        ],
        [
          '多选 (`multiple=true`) 时, `displayRender((item: Entity, index: number) => ReactNode)`, 其中 item 为节点的相关数据。',
          '多选时同样可使用 `#display` 插槽或 `displayRender`，其中 `selected` 为当前节点实体。',
        ],
        [
          '我们在级联选择器的顶部、底部分别预留了插槽，你可以通过 `topSlot` 或 `bottomSlot` 来设置。',
          '级联选择器提供 `#top` 与 `#bottom` 插槽，也兼容 `topSlot`、`bottomSlot` 属性。',
        ],
        ['onChange 的 value 参数', '`change` 事件的 value 参数'],
        ['触发 onExceed 回调', '触发 `exceed` 事件'],
        ['仅触发 `onSearch` 回调', '仅触发 `search` 事件'],
        ['onChange 的入参类型', '`change` 事件的参数类型'],
      ],
    },
  ],
  [
    '/zh-CN/show/avatar',
    {
      sources: ['packages/ui/src/avatar/types.ts', 'packages/ui/src/avatar/index.ts'],
      propSections: [
        {
          heading: 'Avatar',
          level: 3,
          source: 'packages/ui/src/avatar/types.ts',
          interfaces: ['AvatarProps'],
        },
        {
          heading: 'AvatarGroup',
          level: 3,
          source: 'packages/ui/src/avatar/types.ts',
          interfaces: ['AvatarGroupProps'],
        },
      ],
      eventSections: [
        {
          heading: 'Avatar',
          level: 3,
          rows: ['onClick', 'onMouseEnter', 'onMouseLeave'],
        },
      ],
      eventGroups: [
        {
          name: 'Avatar',
          items: [
            event('click', '[event: MouseEvent | KeyboardEvent]', '点击或键盘激活头像'),
            event('mouseenter', '[event: MouseEvent]', '指针进入头像'),
            event('mouseleave', '[event: MouseEvent]', '指针离开头像'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Avatar',
          items: [
            slot('default', '{}', '头像内容'),
            slot('hoverMask', '{}', '悬停覆盖层'),
            slot('bottomSlot', '{ config: AvatarBottomSlot }', '底部附加内容'),
            slot('topSlot', '{ config: AvatarTopSlot }', '顶部附加内容'),
          ],
        },
        {
          name: 'AvatarGroup',
          items: [
            slot('default', '{}', 'Avatar 子组件'),
            slot('more', '{ restNumber: number; restAvatars: VNode[] }', '自定义剩余头像内容'),
          ],
        },
      ],
      textRewrites: [
        [
          'Avatar 支持 `onClick`、`onMouseEnter`、`onMouseLeave`。其中 `hover` 状态下可以通过 `hoverMask` 属性传入覆盖层的内容。覆盖层无默认样式。',
          'Avatar 支持 `click`、`mouseenter`、`mouseleave` 事件。悬停覆盖层可通过 `#hoverMask` 插槽或 `hoverMask` 属性传入，覆盖层无默认样式。',
        ],
        [
          '可以通过 `renderMore` 自定义 more 标签。',
          '可以通过 `#more` 插槽或 `renderMore` 属性自定义 more 标签。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/badge',
    {
      sources: ['packages/ui/src/badge/types.ts', 'packages/ui/src/badge/index.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/badge/types.ts',
          interfaces: ['BadgeProps'],
        },
      ],
      eventGroups: [
        {
          name: 'Badge',
          items: [
            event('click', '[event: MouseEvent]', '点击徽标'),
            event('mouseenter', '[event: MouseEvent]', '指针进入徽标'),
            event('mouseleave', '[event: MouseEvent]', '指针离开徽标'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Badge',
          items: [slot('default', '{}', '徽标基底内容'), slot('count', '{}', '徽标内容')],
        },
      ],
      textRewrites: [['## API参考', '## API 参考']],
    },
  ],
  [
    '/zh-CN/show/tag',
    {
      sources: ['packages/ui/src/tag/types.ts', 'packages/ui/src/tag/index.ts'],
      propSections: [
        {
          heading: 'Tag',
          level: 3,
          source: 'packages/ui/src/tag/types.ts',
          interfaces: ['TagProps'],
        },
        {
          heading: 'TagGroup',
          level: 3,
          source: 'packages/ui/src/tag/types.ts',
          interfaces: ['TagGroupProps'],
        },
        {
          heading: 'SplitTagGroup',
          level: 3,
          source: 'packages/ui/src/tag/types.ts',
          interfaces: ['SplitTagGroupProps'],
        },
      ],
      models: ['`v-model:visible` 对应标签的可见状态。'],
      eventSections: [
        { heading: 'Tag', level: 3, rows: ['onClick', 'onClose'] },
        { heading: 'TagGroup', level: 3, rows: ['onTagClose'] },
      ],
      eventGroups: [
        {
          name: 'Tag',
          items: [
            event('click', '[event: MouseEvent | KeyboardEvent]', '点击或键盘激活标签'),
            event(
              'close',
              '[content: VNodeChild, event: MouseEvent | KeyboardEvent, tagKey: string | number | undefined]',
              '关闭标签',
            ),
            event('keydown', '[event: KeyboardEvent]', '标签触发键盘事件'),
            event('mouseenter', '[event: MouseEvent]', '指针进入标签'),
          ],
        },
        {
          name: 'TagGroup',
          items: [
            event('plusNMouseenter', '[event: MouseEvent]', '指针进入 +N 标签'),
            event(
              'tagClose',
              '[content: VNodeChild, event: MouseEvent | KeyboardEvent, tagKey: string | number | undefined]',
              '关闭标签组中的标签',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Tag',
          items: [
            slot('default', '{}', '标签内容'),
            slot('prefixIcon', '{}', '前缀图标'),
            slot('suffixIcon', '{}', '后缀图标'),
          ],
        },
        {
          name: 'SplitTagGroup',
          items: [slot('default', '{}', 'Tag 子组件')],
        },
      ],
      textRewrites: [
        ['## API参考', '## API 参考'],
        [
          '可以通过添加 `closable` 属性将其变为可关闭标签，此时点击 x 关闭会触发 onClose 事件，在 onClose 中阻止默认事件可以使其点击后依然显示不隐藏',
          '添加 `closable` 属性可显示关闭按钮；点击按钮会触发 `close` 事件，在事件中调用 `preventDefault()` 可阻止标签隐藏。',
        ],
        [
          '如果 TagGroup 中的标签可删除，用户需要在 `onTagClose` 中处理传递给 TagGroup 的 `tagList`。',
          '如果 TagGroup 中的标签可删除，需要监听 `tagClose` 事件并更新传给 TagGroup 的 `tagList`。',
        ],
        [
          '使用了 `onClick` 属性时，键盘用户可以通过 `Enter` 键激活此 `Tag`',
          '监听 `click` 事件时，键盘用户可以通过 `Enter` 键激活此 `Tag`',
        ],
        [
          '| size | 标签的尺寸，可选 `small`、 `large` | string | `small` | |',
          '| size | 标签的尺寸，可选 `small`、 `default`、 `large` | string | `default` | |',
        ],
        [
          '| tagKey | React 需要的 key，作为每个标签的唯一标识，不允许重复 | string | number | |',
          '| tagKey | 标签的唯一标识，不允许重复 | string \\| number | | |',
        ],
      ],
    },
  ],
  [
    '/zh-CN/basic/divider',
    {
      sources: ['packages/ui/src/divider/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/divider/types.ts',
          interfaces: ['DividerProps'],
        },
      ],
      slotGroups: [
        {
          name: 'Divider',
          items: [slot('default', '{}', '分割线中的内容')],
        },
      ],
      textRewrites: [['## API参考', '## API 参考']],
    },
  ],
  [
    '/zh-CN/basic/space',
    {
      sources: ['packages/ui/src/space/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/space/types.ts',
          interfaces: ['SpaceProps'],
        },
      ],
      usageNotes: [
        '`spacing` 数组依次表示水平、垂直间距。',
        '`wrap` 只在水平方向生效；`vertical=true` 时不会换行。',
      ],
      slotGroups: [
        {
          name: 'Space',
          items: [slot('default', '{}', '需要排列的内容')],
        },
      ],
      textRewrites: [['## API参考', '## API 参考']],
    },
  ],
  [
    '/zh-CN/show/highlight',
    {
      sources: ['packages/ui/src/highlight/types.ts'],
      propSections: [
        {
          heading: 'Highlight',
          level: 3,
          source: 'packages/ui/src/highlight/types.ts',
          interfaces: ['HighlightProps'],
        },
      ],
      textRewrites: [
        ['| sourceString | 源文本 | string | |', "| sourceString | 源文本 | string | `''` |"],
        [
          '| caseSensitive | 是否大小写敏感 | false | - |',
          '| caseSensitive | 是否大小写敏感 | boolean | false |',
        ],
        [
          '| autoEscape | 是否自动转义 | true | - |',
          '| autoEscape | 是否自动转义 | boolean | true |',
        ],
      ],
    },
  ],
  [
    '/zh-CN/plus/codehighlight',
    {
      sources: ['packages/ui/src/code-highlight/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/code-highlight/types.ts',
          interfaces: ['CodeHighlightProps'],
          descriptions: { class: 'Vue 原生类名' },
        },
      ],
      usageNotes: [
        '默认内置 JavaScript、CSS、类 C、HTML、SVG 语法；其他语言需由使用者显式引入对应的 Prism 语言模块。',
        '组件支持浏览器原生选择与复制，不提供内置复制按钮或复制事件。',
      ],
      textRewrites: [
        ['### API', '## API 参考'],
        ['`defaultTheme={false}`', '`:default-theme="false"`'],
      ],
    },
  ],
  [
    '/zh-CN/navigation/backtop',
    {
      sources: ['packages/ui/src/back-top/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/back-top/types.ts',
          interfaces: ['BackTopProps'],
        },
      ],
      eventSections: [{ heading: 'API 参考', level: 2, rows: ['onClick'] }],
      eventGroups: [
        {
          name: 'BackTop',
          items: [event('click', '[event: MouseEvent]', '点击回到顶部按钮时触发')],
        },
      ],
      slotGroups: [
        {
          name: 'BackTop',
          items: [slot('default', '{}', '自定义回到顶部按钮')],
        },
      ],
    },
  ],
  [
    '/zh-CN/basic/icon',
    {
      sources: [
        'packages/ui/src/icon/index.ts',
        'packages/icons/src/components/Icon.ts',
        'packages/icons/src/index.ts',
      ],
      propSections: [
        {
          heading: 'Icon',
          level: 3,
          source: 'packages/icons/src/components/Icon.ts',
          interfaces: ['IconProps'],
          descriptions: {
            prefixCls: '样式类名前缀',
            type: '图标类型；用于类型 class 与默认 aria-label',
          },
          defaults: { prefixCls: '`semi`', spin: 'false' },
        },
      ],
      usageNotes: [
        '`class`、`style`、ARIA 属性和原生事件监听器通过 attrs 传给根 span。',
        '组件 ref 暴露只读 `element`，指向根 `HTMLSpanElement`；`convertIcon` 由 `@aifuxi/semi-icons-vue` 导出。',
      ],
      eventSections: [
        {
          heading: 'Icon',
          level: 3,
          rows: [
            'onClick',
            'onMouseDown',
            'onMouseEnter',
            'onMouseLeave',
            'onMouseMove',
            'onMouseUp',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Icon 原生监听器',
          items: [
            event('click', '[event: MouseEvent]', '点击图标'),
            event('mousedown / mouseup', '[event: MouseEvent]', '按下或抬起鼠标按钮'),
            event('mouseenter / mouseleave / mousemove', '[event: MouseEvent]', '鼠标指针事件'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Icon',
          items: [slot('default', '{}', '自定义 SVG 内容；对应程序化 `svg` prop')],
        },
      ],
      textRewrites: [
        ['## API参考', '## API 参考'],
        ['### 使用svgr将svg文件转成ReactComponent', '### 使用 SVG 自定义图标'],
        [
          '如果 Semi 提供的图标不足以满足业务需求，你也可以通过@svgr/webpack引入自定义图标，并以React组件形式使用',
          '如果内置图标不足以满足业务需求，可以把自定义 SVG 封装为 Vue 组件，并通过 Icon 默认插槽传入。',
        ],
        [
          '<DemoBlock id="zh-CN-basic-icon-9" title="使用svgr将svg文件转成ReactComponent" kind="code" />',
          '<DemoBlock id="zh-CN-basic-icon-9" title="使用 SVG 自定义图标" kind="code" />',
        ],
      ],
    },
  ],
  [
    '/zh-CN/plus/lottie',
    {
      sources: ['packages/ui/src/lottie/types.ts', 'packages/ui/src/lottie/index.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/lottie/types.ts',
          interfaces: ['LottieProps'],
          descriptions: {
            width: '内部动画容器宽度',
            height: '内部动画容器高度',
            class: 'Vue 原生类名',
          },
        },
      ],
      usageNotes: [
        '`getAnimationInstance` 与 `getLottie` 是实例通知 callback props，不是组件事件。',
        'SSR 仅输出空的内部容器；`lottie-web` 在客户端挂载后加载并在卸载时销毁。',
      ],
      methodGroups: [
        {
          name: 'Lottie',
          items: [method('getLottie', '() => LottiePlayer', '返回全局 lottie-web 播放器对象')],
        },
      ],
      textRewrites: [
        ['- 更易和 React 项目结合使用', '- 更易和 Vue 项目结合使用'],
        ['使用 `getLottie` Props 获取全局 lottie', '使用 `getLottie` prop 获取全局 lottie'],
        ['### API', '## API 参考'],
      ],
    },
  ],
  [
    '/zh-CN/other/locale',
    {
      sources: ['packages/ui/src/locale/types.ts', 'packages/ui/src/locale/index.ts'],
      propSections: [
        {
          heading: 'LocaleProvider',
          level: 3,
          source: 'packages/ui/src/locale/types.ts',
          interfaces: ['LocaleProviderProps'],
          descriptions: { locale: '注入子树的语言数据' },
          defaults: { locale: '`zh_CN`' },
        },
        {
          heading: 'LocaleConsumer',
          level: 3,
          source: 'packages/ui/src/locale/types.ts',
          interfaces: ['LocaleConsumerProps'],
          descriptions: { componentName: '读取语言数据的组件键名' },
        },
      ],
      usageNotes: [
        'LocaleConsumer 优先读取 ConfigProvider 的 locale，其次读取最近的 LocaleProvider，最后回退到 `zh_CN`。',
        'Provider 与 Consumer 都不增加 DOM；57 个语言源从 `@aifuxi/semi-ui-vue/locale/source/*` 导入。',
      ],
      slotGroups: [
        {
          name: 'LocaleProvider',
          items: [slot('default', '{}', '使用该语言数据的组件子树')],
        },
        {
          name: 'LocaleConsumer',
          items: [
            slot(
              'default',
              '{ localeData, localeCode, dateFnsLocale, currency }',
              '读取指定组件的语言数据',
            ),
          ],
        },
      ],
      textRewrites: [
        [
          'LocaleProvider 使用了 React 的 context 上下文特性，你只需要在应用外围包裹一次即可全局生效',
          'LocaleProvider 使用 Vue provide/inject 向组件子树提供语言数据，在应用外围包裹一次即可生效。',
        ],
        [
          '当你的自定义组件，也希望消费 Semi LocaleProvider Context 中的 localeCode 或者读取具体某个组件的 i18n 文本 localeData时，你可以使用 LocaleConsumer 进行获取；',
          '自定义组件需要读取 localeCode 或具体组件的 i18n 文本 localeData 时，可以通过 LocaleConsumer 的默认作用域插槽获取。',
        ],
        [
          '<DemoBlock id="zh-CN-other-locale-4" title="支持多语言的组件" kind="live" />',
          '<DemoBlock id="zh-CN-other-locale-4" title="支持多语言的组件" kind="live" />\n\n## API 参考\n\n### LocaleProvider\n\n| 属性 | 说明 | 类型 | 默认值 |\n| --- | --- | --- | --- |\n\n### LocaleConsumer\n\n| 属性 | 说明 | 类型 | 默认值 |\n| --- | --- | --- | --- |',
        ],
      ],
    },
  ],
  [
    '/zh-CN/plus/markdownrender',
    {
      sources: [
        'packages/ui/src/markdown-render/types.ts',
        'packages/ui/src/markdown-render/index.ts',
      ],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/markdown-render/types.ts',
          interfaces: ['MarkdownRenderProps'],
          descriptions: { class: 'Vue 原生类名' },
          defaults: {
            format: '`mdx`',
            rehypePlugins: '`[]`',
            remarkGfm: 'true',
            remarkPlugins: '`[]`',
          },
        },
      ],
      usageNotes: [
        '`components` 的值为 Vue `Component` 或原生标签名，并与内置元素映射浅合并。',
        '内置映射可从 `MarkdownRender.defaultComponents` 或具名导出 `markdownRenderDefaultComponents` 读取。',
        'SSR 只输出空根容器，Markdown/MDX 在客户端挂载后异步求值。',
      ],
      textRewrites: [
        [
          'MDX 是在 Markdown 基础上，允许引入 JSX 实现更加复杂定制化的文档撰写与展示需求。',
          'MDX 在 Markdown 基础上允许使用组件标签，实现更复杂的文档撰写与展示需求。',
        ],
        [
          '注意：MarkdownRender 组件 依赖 `jsx/run-time`，搭配使用 React 版本需 > 16.14.0',
          'MarkdownRender 内置面向 Vue 的 MDX runtime 适配，无需额外配置运行时。',
        ],
        [
          '注意因为 `<` `{` 等符号是合法的 JSX 符号会被判定为代码，无法直接渲染，需要使用 `\\` 转义，如果你只需要渲染纯 Markdown，参考下方仅渲染 Markdown 一节。',
          '注意 `<`、`{` 等符号在 MDX 中具有语法含义；作为普通文本时需要使用 `\\` 转义。只渲染纯 Markdown 时可参考下方“仅纯 Markdown”。',
        ],
        [
          '通过传入自定义组件到 `components` Props，能够实现在 Markdown 中直接书写 JSX，组件会被渲染到最终页面上，支持 JS 事件。',
          '通过 `components` prop 传入 Vue 组件，即可在 MDX 中使用组件标签，并保留 Vue 事件监听。',
        ],
        [
          '当你渲染的 Markdown 仅仅是纯 markdown，不包含任何 JSX 代码时，可传入 `format="md"` 来开启仅 Markdown 模式，在这种模式下无需转义特殊字符',
          '当内容是纯 Markdown、不包含组件标签或 MDX 表达式时，可传入 `format="md"` 开启仅 Markdown 模式，此时无需转义特殊字符。',
        ],
        [
          '只需向 `components` props 中传入你的渲染组件覆盖即可',
          '只需通过 `components` prop 传入 Vue 组件覆盖即可。',
        ],
        ['### API', '## API 参考'],
      ],
    },
  ],
  [
    '/zh-CN/feedback/spin',
    {
      sources: ['packages/ui/src/spin/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/spin/types.ts',
          interfaces: ['SpinProps'],
          descriptions: { class: 'Vue 原生类名', className: '样式类名' },
        },
      ],
      usageNotes: [
        '`indicator` 与 `tip` 同时支持 VNode prop；模板中优先使用同名插槽，插槽内容优先于 prop。',
      ],
      slotGroups: [
        {
          name: 'Spin',
          items: [
            slot('default', '{}', '被加载器包裹的内容'),
            slot('indicator', '{}', '自定义加载指示符'),
            slot('tip', '{}', '自定义加载说明'),
          ],
        },
      ],
    },
  ],
  [
    '/zh-CN/show/collapsible',
    {
      sources: ['packages/ui/src/collapsible/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/collapsible/types.ts',
          interfaces: ['CollapsibleProps'],
          descriptions: { class: 'Vue 原生类名' },
        },
      ],
      usageNotes: [
        '`isOpen` 是单向受控 prop；组件不提供 `v-model`，由调用方更新展开状态。',
        '`lazyRender=true` 需配合 `keepDOM`：首次关闭时不挂载内容，打开后保留 DOM。',
      ],
      eventSections: [{ heading: 'API 参考', level: 2, rows: ['onMotionEnd'] }],
      eventGroups: [
        {
          name: 'Collapsible',
          items: [event('motionEnd', '[]', '展开或折叠过渡完成后触发')],
        },
      ],
      slotGroups: [
        {
          name: 'Collapsible',
          items: [slot('default', '{}', '展开或折叠的内容')],
        },
      ],
      textRewrites: [['`id` props', '`id` prop']],
    },
  ],
  [
    '/zh-CN/basic/grid',
    {
      sources: ['packages/ui/src/grid/types.ts'],
      propSections: [
        {
          heading: 'Row',
          level: 3,
          source: 'packages/ui/src/grid/types.ts',
          interfaces: ['RowProps'],
          descriptions: { prefixCls: '样式类名前缀' },
          defaults: { gutter: '0', prefixCls: '`semi`' },
        },
        {
          heading: 'Col',
          level: 3,
          source: 'packages/ui/src/grid/types.ts',
          interfaces: ['ColSize', 'ColProps'],
          descriptions: { prefixCls: '样式类名前缀' },
          defaults: { prefixCls: '`semi`' },
        },
      ],
      usageNotes: [
        'Row 的默认插槽放置 Col；Col 的默认插槽放置列内容。',
        '`gutter` 支持数值、六断点对象，或按“水平、垂直”排列的二元组；二元组两项也可分别使用断点对象。',
        '`align` 与 `justify` 仅在 `type="flex"` 时生效。',
      ],
      slotGroups: [
        {
          name: 'Row',
          items: [slot('default', '{}', 'Col 子组件')],
        },
        {
          name: 'Col',
          items: [slot('default', '{}', '列内容')],
        },
      ],
    },
  ],
  [
    '/zh-CN/other/configprovider',
    {
      sources: [
        'packages/ui/src/config-provider/types.ts',
        'packages/ui/src/config-provider/index.ts',
      ],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/config-provider/types.ts',
          interfaces: ['ConfigProviderProps'],
          defaults: {
            direction: '`ltr`',
            getPopupContainer: '—',
            locale: '`zh_CN`',
            responsiveObserve: 'false',
            responsiveMap: '`ConfigProvider.defaultResponsiveMap`',
          },
        },
      ],
      usageNotes: [
        'ConfigProvider 通过 Vue `provide/inject` 向组件子树提供配置。',
        'ConfigConsumer 的默认作用域插槽接收 `ConfigContextValue`；`onBreakpoint` 是上下文订阅函数，不是组件事件。',
        '默认断点可从 `ConfigProvider.defaultResponsiveMap` 读取；组件默认 props 可通过 `semiGlobal.config.overrideDefaultProps` 覆盖。',
      ],
      slotGroups: [
        {
          name: 'ConfigProvider',
          items: [slot('default', '{}', '使用全局配置的组件子树')],
        },
        {
          name: 'ConfigConsumer',
          items: [
            slot(
              'default',
              '{ direction, timeZone, locale, getPopupContainer, responsiveObserve, responsiveMap, onBreakpoint, screens }',
              '读取当前全局配置',
            ),
          ],
        },
      ],
      textRewrites: [
        [
          'ConfigProvider 借助 React Context 机制实现，因此它能影响 React 节点树中的子组件',
          'ConfigProvider 通过 Vue provide/inject 实现，因此它能影响 Vue 组件树中的子组件。',
        ],
        [
          '- ConfigProvider中没有提供全局自定义prefix classname的功能，有类似需求如何实现（例如SDK中使用了Semi，期望打包的dom样式不带.semi-xx前缀，以免被宿主的全局 CSS 影响）？',
          '- ConfigProvider 不提供全局 `prefixCls`。本项目固定保留 `.semi-*` / `--semi-*` 兼容契约；需要隔离时请在业务作用域中覆盖样式。',
        ],
        [
          ' - 由于 prefixCls 需要同时被组件层的 js/css 消费，Semi 将此开关放在了webpack plugin的配置项中，而不是作为ConfigProvider的配置项。',
          '',
        ],
        [' - 如果你使用webpack，请在`SemiWebpackPlugin`的参数中进行配置', ''],
      ],
    },
  ],
  [
    '/zh-CN/plus/hotkeys',
    {
      sources: ['packages/ui/src/hot-keys/types.ts', 'packages/ui/src/hot-keys/index.ts'],
      propSections: [
        {
          heading: 'HotKeys',
          level: 3,
          source: 'packages/ui/src/hot-keys/types.ts',
          interfaces: ['HotKeysProps'],
          descriptions: {
            class: 'Vue 原生类名',
            content: '覆盖键帽显示文本，不改变实际组合',
            hotKeys: '合法组合键；恰好一个普通键',
            mergeMetaCtrl: 'v2.102.0 兼容 prop；固定 Foundation 中为 no-op',
          },
          defaults: {
            content: '`hotKeys`',
            getListenerTarget: '`document.body`',
            mergeMetaCtrl: 'false',
            preventDefault: 'false',
          },
        },
      ],
      eventSections: [{ heading: 'HotKeys', level: 3, rows: ['onClick', 'onHotKey'] }],
      eventGroups: [
        {
          name: 'HotKeys',
          items: [
            event('click', '[event: MouseEvent]', '点击快捷键展示内容时触发'),
            event('hotKey', '[event: KeyboardEvent]', '匹配快捷键组合时触发'),
          ],
        },
      ],
      usageNotes: [
        '通过 `@hot-key` 监听快捷键，通过 `@click` 监听点击；`getListenerTarget` 是配置监听目标的 prop。',
        '快捷键常量可从 `HotKeys.Keys` 或具名导出 `HOT_KEYS` 读取。',
      ],
      slotGroups: [
        {
          name: 'HotKeys',
          items: [slot('default', '{}', '覆盖默认快捷键展示内容')],
        },
      ],
      textRewrites: [
        [
          '基本使用，通过`hotKeys`传入快捷键组合，通过 `onHotKey` 绑定快捷键处理函数，作出响应动作。',
          '基本使用，通过 `hotKeys` 传入快捷键组合，通过 `@hot-key` 监听快捷键并作出响应。',
        ],
        ['通过`render`传入代替渲染的元素', '通过默认插槽传入自定义展示内容'],
      ],
    },
  ],
  [
    '/zh-CN/show/empty',
    {
      sources: ['packages/ui/src/empty/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/empty/types.ts',
          interfaces: ['EmptyProps'],
          descriptions: { class: 'Vue 原生类名', className: '样式类名' },
          defaults: { layout: '`vertical`' },
        },
      ],
      usageNotes: [
        '`image`、`darkModeImage`、`title`、`description` 同时支持 VNode prop 和同名插槽，插槽内容优先。',
        '默认插槽渲染在底部操作区。',
      ],
      slotGroups: [
        {
          name: 'Empty',
          items: [
            slot('default', '{}', '底部操作区'),
            slot('darkModeImage', '{}', '暗色模式占位图'),
            slot('description', '{}', '内容描述'),
            slot('image', '{}', '占位图'),
            slot('title', '{}', '标题'),
          ],
        },
      ],
      textRewrites: [
        ['@douyinfe/semi-illustrations', '@aifuxi/semi-illustrations-vue'],
        [
          '通过 `children` 可以实现自定义的描述内容。',
          '通过默认插槽可以自定义底部操作内容，描述内容使用 `description` prop 或同名插槽。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/plus/audioPlayer',
    {
      sources: ['packages/ui/src/audio-player/types.ts', 'packages/ui/src/audio-player/index.ts'],
      propSections: [
        {
          heading: 'AudioPlayer',
          level: 3,
          source: 'packages/ui/src/audio-player/types.ts',
          interfaces: ['AudioPlayerProps'],
          descriptions: { class: 'Vue 原生类名', className: '样式类名' },
          defaults: {
            autoPlay: 'false',
            showToolbar: 'true',
            skipDuration: '10',
            theme: '`dark`',
          },
        },
        {
          heading: 'AudioInfo',
          level: 3,
          source: 'packages/ui/src/audio-player/types.ts',
          interfaces: ['AudioInfo'],
        },
      ],
      usageNotes: [
        '播放进度、音量、倍速和曲目索引由组件内部与浏览器原生媒体事件管理；组件不宣声 emits。',
        'SSR 只输出静态结构；媒体方法需在 mounted/hydration 后通过模板 ref 调用。',
      ],
      instanceMethodGroups: [
        {
          name: 'AudioPlayer ref',
          items: [
            method(
              'element',
              'Readonly<{ value: HTMLAudioElement | null }>',
              '原生 audio 元素的只读引用',
            ),
          ],
        },
      ],
    },
  ],
  [
    '/zh-CN/basic/layout',
    {
      sources: ['packages/ui/src/layout/types.ts', 'packages/ui/src/layout/index.ts'],
      propSections: [
        {
          heading: 'Layout',
          level: 3,
          source: 'packages/ui/src/layout/types.ts',
          interfaces: ['LayoutProps'],
          descriptions: {
            hasSider: '预先声明子树含 Sider，常用于 SSR',
            prefixCls: '样式类名前缀',
            tagName: '根语义标签',
          },
          defaults: { prefixCls: '`semi-layout`', tagName: '`section`' },
        },
        {
          heading: 'LayoutHeader / LayoutContent / LayoutFooter',
          level: 3,
          source: 'packages/ui/src/layout/types.ts',
          interfaces: ['LayoutSectionProps'],
          descriptions: { prefixCls: '样式类名前缀', tagName: '根语义标签' },
          defaults: { prefixCls: '`semi-layout`', tagName: '`header` / `main` / `footer`' },
        },
        {
          heading: 'Layout.Sider',
          level: 3,
          source: 'packages/ui/src/layout/types.ts',
          interfaces: ['LayoutSiderProps'],
          descriptions: {
            breakpoint: '需监听的响应式断点',
            prefixCls: '样式类名前缀',
          },
          defaults: { breakpoint: '`[]`', prefixCls: '`semi-layout`' },
        },
      ],
      eventSections: [{ heading: 'Layout.Sider', level: 3, rows: ['onBreakpoint'] }],
      eventGroups: [
        {
          name: 'LayoutSider',
          items: [
            event(
              'breakpoint',
              '[screen: LayoutBreakpoint, match: boolean]',
              '初始匹配和媒体查询变化时触发',
            ),
          ],
        },
      ],
      slotGroups: [
        { name: 'Layout', items: [slot('default', '{}', '布局子树')] },
        { name: 'LayoutHeader', items: [slot('default', '{}', '页头内容')] },
        { name: 'LayoutContent', items: [slot('default', '{}', '主内容')] },
        { name: 'LayoutFooter', items: [slot('default', '{}', '页脚内容')] },
        { name: 'LayoutSider', items: [slot('default', '{}', '侧边栏内容')] },
      ],
      textRewrites: [
        [
          '> `Layout.Header` `Layout.Footer` `Layout.Content` API 与 `Layout` 相同',
          '`LayoutHeader`、`LayoutContent`、`LayoutFooter` 共用下表的 Vue props。',
        ],
        [
          '| role | [role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) 属性, 提升可访问性 >=2.3.0 | string | - |',
          '| role | [role](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/Roles) 属性, 提升可访问性 >=2.3.0 | string | - |\n\n### LayoutHeader / LayoutContent / LayoutFooter\n\n| 属性 | 说明 | 类型 | 默认值 |\n| --- | --- | --- | --- |',
        ],
        [
          '可以通过设置 `breakpoint` 属性设置断点，通过 `onBreakpoint` 调用回调函数。',
          '可以通过 `breakpoint` prop 设置断点，通过 `@breakpoint` 监听初始匹配和后续变化。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/descriptions',
    {
      sources: ['packages/ui/src/descriptions/types.ts', 'packages/ui/src/descriptions/index.ts'],
      propSections: [
        {
          heading: 'Descriptions',
          level: 3,
          source: 'packages/ui/src/descriptions/types.ts',
          interfaces: ['DescriptionsProps'],
          descriptions: { class: 'Vue 原生类名', className: '样式类名' },
          defaults: {
            align: '`center`',
            column: '3',
            layout: '`vertical`',
            row: 'false',
            size: '`medium`',
          },
        },
        {
          heading: 'DataItem',
          level: 3,
          source: 'packages/ui/src/descriptions/types.ts',
          interfaces: ['DescriptionsDataItem'],
          descriptions: {
            class: 'Item 样式类名',
            className: 'Item 样式类名',
            style: 'Item 内联样式',
          },
          defaults: { hidden: 'false', span: '1' },
        },
        {
          heading: 'DescriptionItem',
          level: 3,
          source: 'packages/ui/src/descriptions/types.ts',
          interfaces: ['DescriptionsItemProps'],
          descriptions: { class: 'Vue 原生类名', className: 'Item 样式类名' },
          defaults: { hidden: 'false', span: '1' },
        },
      ],
      usageNotes: [
        '非空 `data` 优先于默认插槽；空数组回退到声明式 `DescriptionsItem`。',
        '`DescriptionsItem` 同时作为 `Descriptions.Item` 静态成员和具名导出提供。',
      ],
      slotGroups: [
        {
          name: 'Descriptions',
          items: [slot('default', '{}', 'DescriptionsItem 子组件')],
        },
        {
          name: 'DescriptionsItem',
          items: [slot('default', '{}', '属性值'), slot('key', '{}', '键值，优先于 itemKey prop')],
        },
      ],
      textRewrites: [
        [
          'key、value 均支持 ReactNode 类型，你可以传入字符串或更高自由度的 ReactNode 自由定制渲染效果',
          'key、value 均支持 `VNodeChild`；value 还可使用在渲染时调用的函数。',
        ],
        ['### JSX 写法', '### 声明式子组件'],
        [
          '<DemoBlock id="zh-CN-show-descriptions-4" title="JSX 写法" kind="live" />',
          '<DemoBlock id="zh-CN-show-descriptions-4" title="声明式子组件" kind="live" />',
        ],
        [
          '除了通过 props.data 声明数据外，还可以通过 Children JSX 写法声明数据（在 v1.17.0 版本后支持）',
          '除了通过 `data` prop 声明数据外，还可以在默认插槽中声明 `DescriptionsItem`。',
        ],
        ['也可以配合 JSX 写法使用：', '也可以配合 `DescriptionsItem` 使用：'],
      ],
    },
  ],
  [
    '/zh-CN/feedback/banner',
    {
      sources: ['packages/ui/src/banner/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/banner/types.ts',
          interfaces: ['BannerProps'],
          descriptions: { class: 'Vue 原生类名', className: '样式类名' },
          defaults: { bordered: 'false', fullMode: 'true', type: '`info`' },
        },
      ],
      usageNotes: [
        '`title`、`description`、`icon`、`closeIcon` 同时支持 VNode prop 和同名插槽，插槽优先。',
        '组件没有受控 visible API；关闭后会移除自身 DOM，需由调用方重新挂载。',
      ],
      eventSections: [{ heading: 'API 参考', level: 2, rows: ['onClose'] }],
      eventGroups: [
        {
          name: 'Banner',
          items: [event('close', '[event: MouseEvent]', '关闭按钮激活时触发，随后移除 Banner')],
        },
      ],
      slotGroups: [
        {
          name: 'Banner',
          items: [
            slot('default', '{}', '底部额外内容'),
            slot('closeIcon', '{}', '关闭图标'),
            slot('description', '{}', '描述内容'),
            slot('icon', '{}', '类型图标'),
            slot('title', '{}', '标题'),
          ],
        },
      ],
      textRewrites: [
        ['## API参考', '## API 参考'],
        ['可以通过 children 自定义其他渲染内容。', '可以通过默认插槽自定义底部额外内容。'],
      ],
    },
  ],
  [
    '/zh-CN/show/timeline',
    {
      sources: ['packages/ui/src/timeline/types.ts', 'packages/ui/src/timeline/index.ts'],
      propSections: [
        {
          heading: 'Timeline',
          level: 3,
          source: 'packages/ui/src/timeline/types.ts',
          interfaces: ['TimelineProps'],
          descriptions: {
            ariaLabel: '`aria-label` 的类型化 Vue 映射',
            class: 'Vue 原生类名',
            className: '样式类名',
          },
          defaults: { mode: '`left`' },
        },
        {
          heading: 'Timeline.Item',
          level: 3,
          source: 'packages/ui/src/timeline/types.ts',
          interfaces: ['TimelineItemProps'],
          descriptions: { class: 'Vue 原生类名', className: '样式类名' },
          defaults: { time: "`''`", type: '`default`' },
        },
      ],
      usageNotes: [
        '非空 `dataSource` 优先于默认插槽；空数组回退到声明式 `TimelineItem`。',
        '`TimelineData.onClick` 是数据配置中的真实 callback prop；声明式 `TimelineItem` 使用 `@click`。',
        '`TimelineItem` 同时作为 `Timeline.Item` 静态成员和具名导出提供。',
      ],
      eventSections: [{ heading: 'Timeline.Item', level: 3, rows: ['onClick'] }],
      eventGroups: [
        {
          name: 'TimelineItem',
          items: [event('click', '[event: MouseEvent]', '点击整个时间轴项时触发')],
        },
      ],
      slotGroups: [
        {
          name: 'Timeline',
          items: [slot('default', '{}', 'TimelineItem 子组件')],
        },
        {
          name: 'TimelineItem',
          items: [
            slot('default', '{}', '时间轴项内容'),
            slot('dot', '{}', '自定义时间轴节点'),
            slot('extra', '{}', '辅助内容'),
            slot('time', '{}', '时间内容'),
          ],
        },
      ],
      textRewrites: [
        ['### TimeLine', '### Timeline'],
        ['### TimeLine.Item', '### Timeline.Item'],
        ['TimeLine', 'Timeline'],
        [
          '通过设置 `children` 的样式可以自定义节点样式。',
          '可以通过默认插槽内容的样式自定义节点。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/feedback/skeleton',
    {
      sources: ['packages/ui/src/skeleton/types.ts', 'packages/ui/src/skeleton/index.ts'],
      propSections: [
        {
          heading: 'Skeleton',
          level: 3,
          source: 'packages/ui/src/skeleton/types.ts',
          interfaces: ['SkeletonProps'],
          descriptions: { class: 'Vue 原生类名', className: '样式类名' },
          defaults: { active: 'false', loading: 'true' },
        },
        {
          heading: 'Skeleton.Avatar',
          level: 3,
          source: 'packages/ui/src/skeleton/types.ts',
          interfaces: ['SkeletonBasicProps', 'SkeletonAvatarProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            prefixCls: '样式类名前缀',
          },
          defaults: { prefixCls: '`semi-skeleton`', shape: '`circle`', size: '`medium`' },
        },
        {
          heading: 'Skeleton.Paragraph',
          level: 3,
          source: 'packages/ui/src/skeleton/types.ts',
          interfaces: ['SkeletonBasicProps', 'SkeletonParagraphProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            prefixCls: '样式类名前缀',
          },
          defaults: { prefixCls: '`semi-skeleton`', rows: '4' },
        },
      ],
      usageNotes: [
        '`SkeletonButton`、`SkeletonImage`、`SkeletonTitle` 只使用 `SkeletonBasicProps`；`SkeletonAvatar` 和 `SkeletonParagraph` 分别在此基础上增加自有 props。',
        '`loading` 是单向 prop，不映射为 `v-model`；为 false 时只渲染默认插槽。',
        '`placeholder` 同时支持 VNode prop 和同名插槽，插槽优先。',
      ],
      slotGroups: [
        {
          name: 'Skeleton',
          items: [
            slot('default', '{}', '加载完成后的内容'),
            slot('placeholder', '{}', '加载时的占位内容'),
          ],
        },
      ],
      textRewrites: [
        [
          '> `Skeleton.Image`，`Skeleton.Title`，`Skeleton.Button` 大部分API 与 `Skeleton.Avatar` 相同。其中 shape 仅 `Skeleton.Avatar支持`',
          '> `Skeleton.Image`、`Skeleton.Title`、`Skeleton.Button` 使用公共 item props；`size` 和 `shape` 仅 `Skeleton.Avatar` 支持。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/overflowlist',
    {
      sources: ['packages/ui/src/overflow-list/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          sources: [
            {
              source: 'packages/ui/src/overflow-list/types.ts',
              interfaces: ['OverflowListProps'],
              omit: [
                'items',
                'collapseFrom',
                'minVisibleItems',
                'threshold',
                'wrapperClassName',
                'wrapperStyle',
                'overflowRenderDirection',
              ],
            },
          ],
          aliases: { class: 'className' },
          descriptions: { class: 'Vue 原生类名', className: '样式类名' },
          defaults: { renderMode: '`collapse`' },
        },
        {
          heading: "renderMode='collapse'",
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/overflow-list/types.ts',
              interfaces: ['OverflowListProps'],
              omit: [
                'renderMode',
                'class',
                'className',
                'style',
                'wrapperClassName',
                'wrapperStyle',
                'itemKey',
                'threshold',
                'overflowRenderDirection',
              ],
            },
          ],
          defaults: { collapseFrom: '`end`', minVisibleItems: '0' },
        },
        {
          heading: "renderMode='scroll'",
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/overflow-list/types.ts',
              interfaces: ['OverflowListProps'],
              omit: [
                'renderMode',
                'class',
                'className',
                'style',
                'collapseFrom',
                'minVisibleItems',
                'itemKey',
              ],
            },
          ],
          defaults: { overflowRenderDirection: '`both`', threshold: '0.75' },
        },
      ],
      usageNotes: [
        '`visibleItem` 和 `overflow` 是作用域插槽，不再使用上游 renderer props。',
        '`itemKey` 同时支持固定键和取键函数；滚动模式的 item 仍需提供稳定 key。',
      ],
      eventSections: [
        { heading: "renderMode='collapse'", level: 3, rows: ['onOverflow'] },
        {
          heading: "renderMode='scroll'",
          level: 3,
          rows: ['onIntersect', 'onVisibleStateChange'],
        },
      ],
      eventGroups: [
        {
          name: 'OverflowList',
          items: [
            event('overflow', '[items: OverflowItem[]]', '折叠项集合变化'),
            event(
              'intersect',
              '[entries: Record<string, IntersectionObserverEntry>]',
              '滚动项相交状态变化',
            ),
            event(
              'visibleStateChange',
              '[visibleState: Map<string, boolean>]',
              '滚动项可见状态变化',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'OverflowList',
          items: [
            slot('visibleItem', '{ item, index }', '渲染可见项'),
            slot('overflow', '{ items, position }', '渲染起始或末尾的折叠项'),
          ],
        },
      ],
      textRewrites: [
        [
          '`collapse` 模式下支持 collapseFrom 设置折叠方向。',
          '`collapse` 模式下支持 `collapseFrom` 设置折叠方向。',
        ],
        [
          '`collapse` 模式下支持 minVisibleItems 设置最小展示的数目。',
          '`collapse` 模式下支持 `minVisibleItems` 设置最小展示数目。',
        ],
        ['如果需要 scrollIntoView', '如果需要 `scrollIntoView`'],
      ],
    },
  ],
  [
    '/zh-CN/feedback/progress',
    {
      sources: ['packages/ui/src/progress/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/progress/types.ts',
          interfaces: ['ProgressProps'],
          aliases: {
            ariaLabel: 'aria-label',
            ariaLabelledby: 'aria-labelledby',
            ariaValuetext: 'aria-valuetext',
            class: 'className',
          },
          descriptions: {
            ariaLabel: '`aria-label` 的类型化 Vue 映射',
            ariaLabelledby: '`aria-labelledby` 的类型化 Vue 映射',
            ariaValuetext: '`aria-valuetext` 的类型化 Vue 映射',
            class: 'Vue 原生类名',
            className: '样式类名',
            motion: '是否启用进度变化动画，或提供动画配置',
          },
          defaults: {
            direction: '`horizontal`',
            format: '`${percent}%`',
            motion: 'true',
            percent: '0',
            showInfo: 'false',
            size: '`default`',
            strokeGradient: 'false',
            strokeLinecap: '`round`',
            strokeWidth: '4',
            type: '`line`',
          },
        },
      ],
      usageNotes: [
        '`format` 是保留的内容格式化 callback prop；也可使用 `#format` 作用域插槽，插槽优先。',
        '`stroke` 数组按 percent 选择颜色；启用 `strokeGradient` 后补齐颜色区间。',
      ],
      slotGroups: [
        {
          name: 'Progress',
          items: [slot('format', '{ percent }', '自定义进度文本内容')],
        },
      ],
    },
  ],
  [
    '/zh-CN/plus/dragMove',
    {
      sources: ['packages/ui/src/drag-move/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/drag-move/types.ts',
          interfaces: ['DragMoveProps'],
          defaults: { allowInputDrag: 'false', positionStrategy: '`absolute`' },
        },
      ],
      usageNotes: [
        '`allowMove`、`constrainer`、`customMove` 和 `handler` 是拖拽配置 callback props，不转换为 emits。',
        '默认插槽应提供单个可接收 attrs 和 DOM 事件的根元素。',
      ],
      eventSections: [
        {
          heading: 'API',
          level: 3,
          rows: [
            'onMouseDown',
            'onMouseMove',
            'onMouseUp',
            'onTouchCancel',
            'onTouchEnd',
            'onTouchMove',
            'onTouchStart',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'DragMove',
          items: [
            event('mouseDown', '[event: MouseEvent]', '鼠标拖拽开始'),
            event('mouseMove', '[event: MouseEvent]', '鼠标拖拽移动'),
            event('mouseUp', '[event: MouseEvent]', '鼠标拖拽结束'),
            event('touchStart', '[event: TouchEvent]', '触摸拖拽开始'),
            event('touchMove', '[event: TouchEvent]', '触摸拖拽移动'),
            event('touchEnd', '[event: TouchEvent]', '触摸拖拽结束'),
            event('touchCancel', '[event: TouchEvent]', '触摸拖拽取消'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'DragMove',
          items: [slot('default', '{}', '可拖拽的单个根元素')],
        },
      ],
      textRewrites: [
        ['### API', '## API 参考'],
        [
          '2. DragMove 需要将 DOM 事件监听器应用到 children 中，如果子元素是自定义的组件，你需要确保它能将属性传递至底层的 DOM 元素。支持以下类型的 children：',
          '2. DragMove 会把 DOM 事件监听器合并到默认插槽的根元素；使用自定义组件时，需要将 attrs 透传到底层 DOM 元素。支持以下内容：',
        ],
        [
          '1. Class Component，不强制绑定ref，但需要确保 props 可被透传至真实的 DOM 节点上',
          '1. 能够透传 attrs，并最终渲染为单个 DOM 根节点的 Vue 组件',
        ],
        [
          '2. 使用 forwardRef 包裹后的函数式组件，将 props 与 ref 透传到 children 内真实的 DOM 节点上',
          '2. 能够把 attrs 和事件监听器传递给原生元素的函数式组件',
        ],
        ['3. 真实 DOM 节点, 如 span，div，p...', '3. 原生 DOM 元素，例如 `span`、`div`、`p`'],
      ],
    },
  ],
  [
    '/zh-CN/basic/floatbutton',
    {
      sources: ['packages/ui/src/float-button/types.ts'],
      propSections: [
        {
          heading: 'FloatButton',
          level: 3,
          source: 'packages/ui/src/float-button/types.ts',
          interfaces: ['FloatButtonProps'],
          defaults: {
            colorful: 'false',
            disabled: 'false',
            shape: '`round`',
            size: '`default`',
          },
        },
        {
          heading: 'FloatButtonBadgeProps',
          level: 3,
          source: 'packages/ui/src/float-button/types.ts',
          interfaces: ['FloatButtonBadgeProps'],
          descriptions: {
            className: '徽章根元素类名',
            count: '徽章内容',
            countClassName: '徽章内容类名',
            countStyle: '徽章内容备用样式',
            dot: '是否显示为小圆点',
            onClick: '徽章点击 callback',
            onMouseEnter: '指针移入徽章 callback',
            onMouseLeave: '指针移出徽章 callback',
            overflowCount: '数字上限，超出后显示加号',
            position: '徽章位置',
            style: '徽章内容样式，优先于 countStyle',
            theme: '徽章主题',
            type: '徽章类型',
          },
          defaults: {
            dot: 'false',
            position: '`rightTop`',
            theme: '`solid`',
            type: '`primary`',
          },
        },
        {
          heading: 'FloatButtonGroupItem',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/float-button/types.ts',
              interfaces: ['FloatButtonProps', 'FloatButtonGroupItem'],
            },
          ],
          defaults: {
            colorful: 'false',
            disabled: 'false',
            shape: '`round`',
            size: '`default`',
          },
        },
        {
          heading: 'FloatButtonGroup',
          level: 3,
          source: 'packages/ui/src/float-button/types.ts',
          interfaces: ['FloatButtonGroupProps'],
          defaults: { disabled: 'false' },
        },
      ],
      usageNotes: [
        '`badge` 使用 `FloatButtonBadgeProps`；其中 `onClick`、`onMouseEnter`、`onMouseLeave` 是嵌套配置的真实 callback props。',
        '`FloatButtonGroupItem` 继承全部 `FloatButtonProps`，并增加 `value` 和 `content`。',
        '`icon` 和 `content` 可传 VNode；Button 的 `#icon`、Group 的 `#item` 插槽优先。',
      ],
      eventSections: [
        { heading: 'FloatButton', level: 3, rows: ['onClick'] },
        { heading: 'FloatButtonGroup', level: 3, rows: ['onClick'] },
      ],
      eventGroups: [
        {
          name: 'FloatButton',
          items: [event('click', '[event: MouseEvent]', '未禁用时点击按钮触发')],
        },
        {
          name: 'FloatButtonGroup',
          items: [event('click', '[value: string, event: MouseEvent]', '点击组内子项时触发')],
        },
      ],
      slotGroups: [
        {
          name: 'FloatButton',
          items: [slot('icon', '{}', '按钮图标，优先于 icon prop')],
        },
        {
          name: 'FloatButtonGroup',
          items: [slot('item', '{ item, index }', '自定义组内子项内容')],
        },
      ],
      textRewrites: [
        ['## API参考', '## API 参考'],
        [
          '### FloatButtonGroupItem\n\n在 FloatButtonProps 基础上增加以下参数',
          '### FloatButtonBadgeProps\n\n`badge` prop 的配置项。\n\n| 属性 | 说明 | 类型 | 默认值 |\n| --- | --- | --- | --- |\n\n### FloatButtonGroupItem\n\n在 `FloatButtonProps` 基础上增加以下参数。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/pincode',
    {
      sources: ['packages/ui/src/pin-code/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/pin-code/types.ts',
          interfaces: ['PinCodeProps'],
          descriptions: { modelValue: '`v-model` 绑定值', value: '兼容受控值' },
          defaults: {
            autoFocus: 'true',
            count: '6',
            disabled: 'false',
            format: '`number`',
            size: '`default`',
          },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定。',
      ],
      usageNotes: [
        '`format` 的函数形式是逐字符校验 callback prop，不转换为事件。',
        '`focus(index)` 和 `blur(index)` 的 index 从 0 开始。',
      ],
      eventSections: [{ heading: 'API 参考', level: 2, rows: ['onChange', 'onComplete'] }],
      eventGroups: [
        {
          name: 'PinCode',
          items: [
            event('change', '[value: string]', '任一输入格的值变化'),
            event('complete', '[value: string]', '全部输入格填写完成'),
            event('update:modelValue', '[value: string]', '更新默认 v-model'),
            event('update:value', '[value: string]', '更新兼容 value 绑定'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'PinCodeExposed',
          items: [
            method('focus', '(index: number) => void', '聚焦指定序号的输入格'),
            method('blur', '(index: number) => void', '让指定序号的输入格失焦'),
          ],
        },
      ],
      textRewrites: [
        [
          '使用 value 传入验证码字符串，配合 onChange 受控使用',
          '使用 `v-model` 双向绑定验证码字符串，也可使用兼容的 `v-model:value`。',
        ],
        ['使用 Ref 上方法 focus 与 blur', '使用模板 ref 上的 `focus` 与 `blur` 方法'],
        ['## Methods', '## 实例方法'],
        [
          '| 属性 | 说明 |\n| ----- | ---------------------------- |\n| focus | 聚焦，入参为验证码第几位 |\n| blur | 移出焦点，入参为验证码第几位 | string |',
          '| 方法 | 签名 | 说明 |\n| --- | --- | --- |\n| focus | `(index: number) => void` | 聚焦指定序号的输入格 |\n| blur | `(index: number) => void` | 让指定序号的输入格失焦 |',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/cropper',
    {
      sources: ['packages/ui/src/cropper/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/cropper/types.ts',
          interfaces: ['CropperProps'],
          aliases: { class: 'className', cropperBoxCls: 'cropperBoxClassName' },
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            cropperBoxCls: '`cropperBoxClassName` 的兼容别名',
            preview: '返回实时预览容器的函数',
          },
          defaults: {
            defaultAspectRatio: '1',
            fill: '`rgba(0, 0, 0, 0)`',
            maxZoom: '3',
            minZoom: '0.1',
            shape: '`rect`',
            showResizeBox: 'true',
            zoomStep: '0.1',
          },
        },
      ],
      models: ['`v-model:zoom` 对应 `zoom` 与 `update:zoom`；`rotate` 是单向 prop。'],
      usageNotes: [
        '`preview` 是返回预览容器的真实 callback prop，不转换为事件。',
        '`cropperBoxCls` 是 `cropperBoxClassName` 的兼容别名，前者优先。',
      ],
      eventSections: [{ heading: 'API', level: 3, rows: ['onZoomChange'] }],
      eventGroups: [
        {
          name: 'Cropper',
          items: [
            event('zoomChange', '[zoom: number]', '缩放比例变化'),
            event('update:zoom', '[zoom: number]', '更新 v-model:zoom'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'CropperMethods',
          items: [method('getCropperCanvas', '() => HTMLCanvasElement', '获取裁剪结果 canvas')],
        },
      ],
      textRewrites: [
        ['### API', '## API 参考'],
        [
          '通过 `rotate` 和 `zoom` 控制图片旋转和缩放, 可通过 `onZoomChange` 拿到最新的 `zoom` 值。',
          '通过 `rotate` 和 `zoom` 控制图片旋转和缩放；可监听 `zoomChange` 事件获取最新的 `zoom` 值，也可使用 `v-model:zoom`。',
        ],
        ['### Methods', '### 实例方法'],
        [
          '| Name | Description |\n|---------|--------------|\n| getCropperCanvas | 获取裁剪图片的 canvas |',
          '| 方法 | 签名 | 说明 |\n| --- | --- | --- |\n| getCropperCanvas | `() => HTMLCanvasElement` | 获取裁剪图片的 canvas |',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/scrolllist',
    {
      sources: ['packages/ui/src/scroll-list/types.ts', 'packages/ui/src/scroll-list/index.ts'],
      propSections: [
        {
          heading: 'ScrollList',
          level: 3,
          source: 'packages/ui/src/scroll-list/types.ts',
          interfaces: ['ScrollListProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            prefixCls: '样式类名前缀',
          },
          defaults: {
            bodyHeight: '—',
            className: '—',
            footer: '—',
            header: '—',
            prefixCls: '`semi-scrolllist`',
            style: '—',
          },
        },
        {
          heading: 'ScrollItem',
          level: 3,
          source: 'packages/ui/src/scroll-list/types.ts',
          interfaces: ['ScrollItemProps'],
          aliases: { ariaLabel: 'aria-label' },
          descriptions: {
            ariaLabel: '`aria-label` 的类型化 Vue 映射',
            class: 'Vue 原生类名',
            className: '样式类名',
          },
          defaults: {
            cycled: 'false',
            list: '[]',
            mode: '`wheel`',
            motion: 'true',
            selectedIndex: '0',
            transform: '—',
          },
        },
        {
          heading: 'ItemData',
          level: 4,
          source: 'packages/ui/src/scroll-list/types.ts',
          interfaces: ['ScrollItemData'],
          defaults: { transform: '—' },
        },
      ],
      usageNotes: [
        '`ScrollItem` 同时作为 `ScrollList.Item` 静态成员和具名导出提供。',
        '`ScrollList` 的 header、footer 同时支持 VNode prop 和同名插槽，插槽优先。',
        '`ScrollItem.transform` 与 `ItemData.transform` 是显示值转换 callback props；ItemData 中的配置优先。',
      ],
      eventSections: [{ heading: 'ScrollItem', level: 3, rows: ['onSelect'] }],
      eventGroups: [
        {
          name: 'ScrollItem',
          items: [event('select', '[data: ScrollItemSelectData]', '点击或滚动选中可用项时触发')],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'ScrollItemExposed',
          items: [
            method(
              'scrollToCenter',
              '(selectedNode?: HTMLElement, scrollWrapper?: HTMLElement, duration?: number) => void',
              '将指定节点滚动到容器中心',
            ),
            method(
              'scrollToIndex',
              '(selectedIndex?: number, duration?: number) => void',
              '滚动到指定索引',
            ),
            method(
              'scrollToNode',
              '(node: HTMLElement, duration?: number) => void',
              '滚动到指定节点',
            ),
            method(
              'scrollToPos',
              '(targetTop: number, duration?: number) => void',
              '滚动到指定纵向位置',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'ScrollList',
          items: [
            slot('default', '{}', 'ScrollItem 子组件'),
            slot('header', '{}', '列表头部内容'),
            slot('footer', '{}', '列表底部内容'),
          ],
        },
      ],
    },
  ],
  [
    '/zh-CN/feedback/feedback',
    {
      sources: [
        'packages/ui/src/feedback/types.ts',
        'packages/ui/src/modal/types.ts',
        'packages/ui/src/side-sheet/types.ts',
      ],
      propSections: [
        {
          heading: 'FeedbackProps',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/modal/types.ts',
              interfaces: ['ModalProps'],
              omit: [
                'cancelButtonProps',
                'class',
                'className',
                'footer',
                'onCancel',
                'onOk',
                'okButtonProps',
              ],
            },
            {
              source: 'packages/ui/src/side-sheet/types.ts',
              interfaces: ['SideSheetProps'],
              omit: [
                'cancelButtonProps',
                'class',
                'className',
                'footer',
                'onCancel',
                'onOk',
                'okButtonProps',
              ],
            },
            {
              source: 'packages/ui/src/feedback/types.ts',
              interfaces: ['FeedbackProps'],
            },
          ],
          descriptions: {
            cancelButtonProps: '取消按钮配置；其中事件字段是嵌套 callback props',
            checkboxGroupProps: '多选配置；onChange 是嵌套 callback prop',
            class: 'Vue 原生类名',
            className: '样式类名',
            mode: '展示容器类型',
            okButtonProps: '提交按钮配置；其中事件字段是嵌套 callback props',
            onCancel: '取消操作 callback，可返回 Promise',
            onOk: '提交操作 callback，可返回 Promise',
            onValueChange: '反馈值变化 callback',
            radioGroupProps: '单选配置；onChange 是嵌套 callback prop',
            renderContent: '内容转换 callback；content 插槽优先',
            textAreaProps: '文本输入配置；onChange 是嵌套 callback prop',
            type: '反馈输入类型',
          },
          defaults: { mode: '`popup`', onValueChange: '—', type: '`emoji`' },
        },
      ],
      models: ['`v-model:visible` 对应继承的 `visible` 与 `update:visible`。'],
      usageNotes: [
        '`onOk`、`onCancel`、`onValueChange` 是组件控制流程使用的真实 callback props，不转换为 emits。',
        '`textAreaProps`、`radioGroupProps`、`checkboxGroupProps` 和按钮配置中的 `onXxx` 是嵌套配置 callback props。',
        '`content` 插槽优先于 `renderContent`；`header` 插槽仅在 modal 模式生效。',
        '其余容器 props 继承自 `ModalProps` 与 `SideSheetProps`，按 mode 转发。',
      ],
      eventGroups: [
        {
          name: 'Feedback',
          items: [event('update:visible', '[visible: boolean]', '更新 v-model:visible')],
        },
      ],
      slotGroups: [
        {
          name: 'Feedback',
          items: [
            slot('default', '{}', '默认反馈内容'),
            slot('content', '{ content }', '转换默认反馈内容'),
            slot('title', '{}', '标题'),
            slot('header', '{}', 'modal 模式头部'),
            slot('footer', '{}', '底部操作区'),
            slot('closeIcon', '{}', '关闭图标'),
          ],
        },
      ],
      textRewrites: [
        [
          '通过 `visible` 设置是否显示。默认反馈展示内容是 emoji 形式。 可通过 `onValueChange` 获取当前选择的内容。',
          '通过 `v-model:visible` 控制是否显示。默认反馈内容是 emoji 形式；可通过 `onValueChange` callback 获取当前选择。',
        ],
        [
          '设置 `type` 为 `custom` 可获得多选形式的 feedback，可通过 `renderContent` 设置反馈的内容。使用自定义反馈时候，需自行控制提交按钮的禁用与否状态，用户可通过 `okButtonProps` 设置。',
          '设置 `type` 为 `custom` 可展示自定义反馈内容，可通过 `#content` 插槽或 `renderContent` prop 转换内容。使用自定义反馈时，需通过 `okButtonProps` 自行控制提交按钮状态。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/colorpicker',
    {
      sources: ['packages/ui/src/color-picker/types.ts', 'packages/ui/src/color-picker/index.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/color-picker/types.ts',
          interfaces: ['ColorPickerProps'],
          descriptions: {
            bottomSlot: '底部 VNode 内容；bottom 插槽优先',
            class: 'Vue 原生类名',
            className: '样式类名',
            modelValue: '`v-model` 绑定值',
            topSlot: '顶部 VNode 内容；top 插槽优先',
            value: '兼容受控值',
          },
          defaults: {
            alpha: 'true',
            defaultFormat: '`hex`',
            defaultValue: '`#39c5bb` 对应的 ColorValue',
            eyeDropper: 'true',
            height: '280',
            popoverProps: '{}',
            usePopover: 'false',
            width: '280',
          },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定。',
      ],
      usageNotes: [
        '`popoverProps` 是传给 Popover 的嵌套配置，其中回调字段保持 callback prop 语义。',
        '`topSlot`、`bottomSlot` 保留 VNode prop 入口；同名 Vue 插槽优先。',
        '默认插槽只在 `usePopover` 为 true 时作为触发元素。',
      ],
      eventSections: [{ heading: 'API 参考', level: 3, rows: ['onChange'] }],
      eventGroups: [
        {
          name: 'ColorPicker',
          items: [
            event('change', '[value: ColorValue]', '用户选择的颜色变化'),
            event('update:modelValue', '[value: ColorValue]', '更新默认 v-model'),
            event('update:value', '[value: ColorValue]', '更新兼容 value 绑定'),
          ],
        },
      ],
      methodGroups: [
        {
          name: 'ColorPicker',
          items: [
            method(
              'ColorPicker.colorStringToValue',
              '(raw: string) => ColorValue',
              '将常见颜色字符串转换为 ColorValue；也可直接导入同名函数',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'ColorPicker',
          items: [
            slot('default', '{}', 'Popover 模式触发元素'),
            slot('top', '{}', '面板顶部额外内容'),
            slot('bottom', '{}', '面板底部额外内容'),
          ],
        },
      ],
      textRewrites: [
        ['### API 参考', '## API 参考'],
        [
          '在进行各种颜色表示格式之间相互转换时，部分格式之间存在理论误差，因此 onChange 返回给你的值是同时包含了 hsva hex rgba 三种格式的色值的对象。',
          '在不同颜色格式之间转换时可能存在理论误差，因此 `change` 事件返回同时包含 hsva、hex、rgba 三种格式的 `ColorValue`。',
        ],
        [
          '你传入的 defaultValue(非受控) 和 value(受控) 也应当是同样包含三种格式的对象。',
          '`defaultValue` 与 `v-model` / `v-model:value` 也应使用同时包含三种格式的 `ColorValue`。',
        ],
        ['通过传入 value 来受控使用', '使用 `v-model` 双向绑定，也可使用兼容的 `v-model:value`。'],
        [
          '使用 `topSlot` 和 `bottomSlot` 在顶部和底部渲染额外元素',
          '使用 `#top` 和 `#bottom` 插槽在顶部和底部渲染额外内容；也保留同名 VNode props。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/slider',
    {
      sources: ['packages/ui/src/slider/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/slider/types.ts',
          interfaces: ['SliderProps'],
          aliases: {
            ariaLabel: 'aria-label',
            ariaLabelledby: 'aria-labelledby',
            ariaValueText: 'aria-valuetext',
          },
          descriptions: {
            ariaLabel: '`aria-label` 的类型化 Vue 映射',
            ariaLabelledby: '`aria-labelledby` 的类型化 Vue 映射',
            ariaValueText: '`aria-valuetext` 的类型化 Vue 映射',
            className: '样式类名',
            modelValue: '`v-model` 绑定值',
            value: '兼容受控值',
          },
          defaults: {
            disabled: 'false',
            included: 'true',
            max: '100',
            min: '0',
            range: 'false',
            showArrow: 'true',
            showBoundary: 'false',
            showMarkLabel: 'true',
            step: '1',
            tipFormatter: '`value => value`',
            tooltipOnMark: 'false',
            vertical: 'false',
            verticalReverse: 'false',
          },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定。',
      ],
      usageNotes: [
        '`tipFormatter` 与 `getAriaValueText` 是格式化 callback props，不转换为事件。',
        '`SliderValue` 在普通模式为 number，在 range 模式为 number[]。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: ['onAfterChange', 'onChange', 'onMouseUp'],
        },
      ],
      eventGroups: [
        {
          name: 'Slider',
          items: [
            event('change', '[value: SliderValue]', '滑块值变化'),
            event('afterChange', '[value: SliderValue]', '一次拖动或键盘操作结束'),
            event('mouseUp', '[event: MouseEvent]', '鼠标松开滑块'),
            event('update:modelValue', '[value: SliderValue]', '更新默认 v-model'),
            event('update:value', '[value: SliderValue]', '更新兼容 value 绑定'),
          ],
        },
      ],
      textRewrites: [
        ['## API参考', '## API 参考'],
        ['`tipFormatter={null}`', '`:tip-formatter="null"`'],
        [
          '配合 onChange 可以实现动态的分段背景效果',
          '配合 `change` 事件可以实现动态的分段背景效果',
        ],
        [
          '滑块位置即 `Slider` 的值由 value 控制，配合 onChange 使用。',
          '使用 `v-model` 控制滑块值，也可使用兼容的 `v-model:value`。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/sidesheet',
    {
      sources: ['packages/ui/src/side-sheet/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/side-sheet/types.ts',
          interfaces: ['SideSheetProps'],
          descriptions: {
            'aria-label': '对话框的可访问名称',
            afterVisibleChange: '显隐动画完成 callback；同时触发同名事件',
            class: 'Vue 原生类名',
            className: '样式类名',
            closeIcon: '关闭图标 VNode；closeIcon 插槽优先',
            footer: '底部 VNode；footer 插槽优先',
            title: '标题 VNode；title 插槽优先',
          },
          defaults: {
            canVerticalSetWidth: 'false',
            closable: 'true',
            closeOnEsc: 'false',
            disableScroll: 'true',
            keepDOM: 'false',
            mask: 'true',
            maskClosable: 'true',
            motion: 'true',
            placement: '`right`',
            size: '`small`',
            visible: 'false',
            zIndex: '1000',
          },
        },
      ],
      models: ['`v-model:visible` 对应 `visible` 与 `update:visible`。'],
      usageNotes: [
        '`getPopupContainer` 返回 Portal 容器；不传时渲染到 document.body。',
        '`afterVisibleChange` 保留 callback prop，并同时提供同名 Vue 事件。',
        '`title`、`footer`、`closeIcon` 保留 VNode prop 入口；同名插槽优先。',
      ],
      eventSections: [{ heading: 'API 参考', level: 2, rows: ['onCancel'] }],
      eventGroups: [
        {
          name: 'SideSheet',
          items: [
            event(
              'cancel',
              '[event: MouseEvent | KeyboardEvent]',
              '点击关闭、遮罩或按 Escape 时触发',
            ),
            event('afterVisibleChange', '[visible: boolean]', '显隐动画完成'),
            event('update:visible', '[visible: boolean]', '关闭时更新 v-model:visible'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'SideSheet',
          items: [
            slot('default', '{}', '面板主体内容'),
            slot('title', '{}', '面板标题'),
            slot('footer', '{}', '底部操作区'),
            slot('closeIcon', '{}', '关闭图标'),
          ],
        },
      ],
      textRewrites: [
        ["`width={900}` / `width={'800px'}`", '`:width="900"` / `width="800px"`'],
        ['`mask={false}`', '`:mask="false"`'],
        ['`disableScroll={false}`', '`:disable-scroll="false"`'],
        ['visible={visible} onCancel={change}', 'v-model:visible="visible" @cancel="change"'],
      ],
    },
  ],
  [
    '/zh-CN/show/collapse',
    {
      sources: ['packages/ui/src/collapse/types.ts', 'packages/ui/src/collapse/index.ts'],
      propSections: [
        {
          heading: 'Collapse',
          level: 3,
          source: 'packages/ui/src/collapse/types.ts',
          interfaces: ['CollapseProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            activeKey: '`v-model:activeKey` 绑定值',
            collapseIcon: '折叠图标 VNode；collapseIcon 插槽优先',
            expandIcon: '展开图标 VNode；expandIcon 插槽优先',
          },
          defaults: {
            accordion: 'false',
            clickHeaderToExpand: 'true',
            collapseIcon: '内置 `IconChevronUp`',
            expandIcon: '内置 `IconChevronDown`',
            expandIconPosition: '`right`',
            keepDOM: 'false',
            lazyRender: 'false',
            motion: 'true',
          },
        },
        {
          heading: 'Collapse.Panel',
          level: 3,
          source: 'packages/ui/src/collapse/types.ts',
          interfaces: ['CollapsePanelProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            extra: '右上角辅助 VNode；extra 插槽优先',
            header: '面板头 VNode；header 插槽优先',
          },
          defaults: { disabled: 'false', showArrow: 'true' },
        },
      ],
      models: ['`v-model:activeKey` 对应 `activeKey` 与 `update:activeKey`。'],
      usageNotes: [
        '`Collapse.Panel` 同时作为 `Collapse.Panel` 静态成员和 `CollapsePanel` 具名导出提供。',
        '`expandIcon`、`collapseIcon`、Panel 的 `header` 与 `extra` 均保留 VNode prop；同名插槽优先。',
      ],
      eventSections: [
        { heading: 'Collapse', level: 3, rows: ['onChange'] },
        { heading: 'Collapse.Panel', level: 3, rows: ['onMotionEnd'] },
      ],
      eventGroups: [
        {
          name: 'Collapse',
          items: [
            event('change', '[activeKey: CollapseActiveKey, event: MouseEvent]', '展开项变化'),
            event('update:activeKey', '[activeKey: CollapseActiveKey]', '更新 v-model:activeKey'),
          ],
        },
        {
          name: 'CollapsePanel',
          items: [event('motionEnd', '[]', '面板展开或收起动画结束')],
        },
      ],
      slotGroups: [
        {
          name: 'Collapse',
          items: [
            slot('default', '{}', 'CollapsePanel 子组件'),
            slot('expandIcon', '{}', '展开图标'),
            slot('collapseIcon', '{}', '折叠图标'),
          ],
        },
        {
          name: 'CollapsePanel',
          items: [
            slot('default', '{}', '面板内容'),
            slot('header', '{}', '面板头'),
            slot('extra', '{}', '右上角辅助内容；header 为字符串时生效'),
          ],
        },
      ],
      textRewrites: [
        [
          '**仅在 header 为 string 时生效， 如果 header 为 ReactNode 会包含 extra 所在的区域，可以自行渲染**',
          '**`#extra` 仅在 header 为字符串时单独渲染；自定义 `#header` 时可自行组织辅助区域。**',
        ],
        [
          '可以在自定义元素的 onClick 事件回调中，阻止事件冒泡至 Collapse.Header 即可。若自定义元素未提供 event 对象，再包裹一层 div，于 div onClick 中阻止冒泡亦可。',
          '可以在自定义元素的 `@click` 监听器中阻止事件冒泡至 Collapse header；必要时可外包一层 div 处理 `@click`。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/carousel',
    {
      sources: ['packages/ui/src/carousel/types.ts'],
      propSections: [
        {
          heading: 'Carousel',
          level: 3,
          source: 'packages/ui/src/carousel/types.ts',
          interfaces: ['CarouselProps'],
          descriptions: {
            activeIndex: '受控索引',
            arrowProps: '左右箭头的嵌套配置；具名插槽优先',
            class: 'Vue 原生类名',
            className: '样式类名',
          },
          defaults: {
            animation: '`slide`',
            arrowType: '`always`',
            autoPlay: 'true',
            defaultActiveIndex: '0',
            indicatorPosition: '`center`',
            indicatorSize: '`small`',
            indicatorType: '`dot`',
            showArrow: 'true',
            showIndicator: 'true',
            slideDirection: '`left`',
            speed: '300',
            theme: '`light`',
            trigger: '`click`',
          },
        },
        {
          heading: 'ArrowButton',
          level: 3,
          source: 'packages/ui/src/carousel/types.ts',
          interfaces: ['CarouselArrowButton'],
          descriptions: {
            children: '箭头 VNode 内容；leftArrow / rightArrow 插槽优先',
            props: '箭头 div 的 Vue HTMLAttributes 与扩展属性',
          },
        },
      ],
      usageNotes: [
        '`activeIndex` 是单向受控 prop；索引变化通过 `change` 事件通知。',
        '`arrowProps.leftArrow/rightArrow.children` 是公开兼容配置，不是组件 children；具名插槽优先。',
        '默认插槽中的每个根 VNode 作为一个轮播项。',
      ],
      eventSections: [{ heading: 'Carousel', level: 3, rows: ['onChange'] }],
      eventGroups: [
        {
          name: 'Carousel',
          items: [event('change', '[activeIndex: number, preIndex: number]', '轮播索引变化')],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'CarouselMethods',
          items: [
            method('play', '() => void', '开始自动播放'),
            method('stop', '() => void', '停止自动播放'),
            method('goTo', '(targetIndex: number) => void', '切换到指定索引'),
            method('prev', '() => void', '切换到上一项'),
            method('next', '() => void', '切换到下一项'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Carousel',
          items: [
            slot('default', '{}', '轮播项列表'),
            slot('leftArrow', '{}', '上一项箭头内容'),
            slot('rightArrow', '{}', '下一项箭头内容'),
          ],
        },
      ],
      textRewrites: [
        ['### API 参考', '## API 参考'],
        ['**Carousel**', '### Carousel'],
        ['**ArrowButton**', '### ArrowButton'],
        [
          '通过 arrowProps 属性定制箭头样式和点击事件',
          '通过 `arrowProps` 定制箭头属性，也可使用 `#leftArrow` 与 `#rightArrow` 插槽定制内容。',
        ],
        ['## Methods', '## 实例方法'],
        [
          '绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互',
          '通过模板 ref 调用以下实例方法。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/plus/videoPlayer',
    {
      sources: ['packages/ui/src/video-player/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/video-player/types.ts',
          interfaces: ['VideoPlayerProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            defaultPlaybackRate: '初始播放速率',
            defaultQuality: '初始清晰度',
            defaultRoute: '初始线路',
            playbackRateList: '播放速率选项',
          },
          defaults: {
            autoPlay: 'false',
            clickToPlay: 'true',
            controlsList:
              '`play, next, time, volume, playbackRate, quality, route, mirror, fullscreen, pictureInPicture`',
            defaultPlaybackRate: '1',
            loop: 'false',
            muted: 'false',
            playbackRateList: '`2, 1.5, 1.25, 1, 0.75`',
            seekTime: '10',
            theme: '`dark`',
            volume: '100',
          },
        },
        {
          heading: 'Marker',
          level: 4,
          source: 'packages/ui/src/video-player/types.ts',
          interfaces: ['VideoPlayerMarker'],
        },
      ],
      usageNotes: [
        '模板 ref 暴露只读 `element: Ref<HTMLVideoElement | null>`，用于访问原生 video 元素。',
        '`qualityList` 与 `routeList` 只描述选项；监听对应事件后由调用方更新 src。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: [
            'onPause',
            'onPlay',
            'onQualityChange',
            'onRateChange',
            'onRouteChange',
            'onVolumeChange',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'VideoPlayer',
          items: [
            event('pause', '[]', '视频暂停'),
            event('play', '[]', '视频播放'),
            event('qualityChange', '[quality: string]', '清晰度选项变化'),
            event('rateChange', '[rate: number]', '播放速率变化'),
            event('routeChange', '[route: string]', '线路选项变化'),
            event('volumeChange', '[volume: number]', '音量变化'),
          ],
        },
      ],
      textRewrites: [
        ['### API', '## API 参考'],
        ['### 使用 ref 控制', '### 使用模板 ref 控制'],
        [
          '通过 `ref` 获取原生 video 元素，可以实现更灵活的控制，例如多个视频同步播放/暂停',
          '通过模板 ref 的 `element` 获取原生 video 元素，可以实现多个视频同步播放或暂停。',
        ],
        [
          '通过 `qualityList` 设置清晰度选择列表，`defaultQuality` 设置初始选择的清晰度，`onQualityChange` 设置点击后更新的 `src` 逻辑。',
          '通过 `qualityList` 设置清晰度列表，`defaultQuality` 设置初始值，并监听 `qualityChange` 事件更新 `src`。',
        ],
        [
          '线路切换同理，通过 `routeList` 设置清晰度选择列表，`defaultRoute` 设置初始选择的线路，`onRouteChange` 设置点击后更新的 `src` 逻辑。',
          '线路切换同理：通过 `routeList` 设置线路列表、`defaultRoute` 设置初始值，并监听 `routeChange` 事件更新 `src`。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/userGuide',
    {
      sources: ['packages/ui/src/user-guide/types.ts', 'packages/ui/src/button/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/user-guide/types.ts',
          interfaces: ['UserGuideProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            current: '`v-model:current` 绑定的步骤索引',
            nextButtonProps: '下一步按钮配置；onClick 是嵌套 callback prop',
            prevButtonProps: '上一步按钮配置；onClick 是嵌套 callback prop',
            visible: '是否显示；单向受控 prop',
          },
          defaults: {
            current: '0',
            mask: 'true',
            mode: '`popup`',
            position: '`bottom`',
            showPrevButton: 'true',
            showSkipButton: 'true',
            spotlightPadding: '5',
            steps: '[]',
            theme: '`default`',
            visible: 'false',
            zIndex: '1030',
          },
        },
        {
          heading: 'Steps.Step',
          level: 3,
          source: 'packages/ui/src/user-guide/types.ts',
          interfaces: ['UserGuideStepItem'],
          descriptions: {
            cover: '封面 VNode；cover 插槽优先',
            description: '描述 VNode；description 插槽优先',
            title: '标题 VNode；title 插槽优先',
          },
          defaults: { showArrow: 'true' },
        },
      ],
      models: ['`v-model:current` 对应 `current` 与 `update:current`；`visible` 是单向受控 prop。'],
      usageNotes: [
        '`nextButtonProps` 与 `prevButtonProps` 继承 ButtonProps；其中 `onClick` 是嵌套 callback prop。',
        '`steps[].target` 可传 Element 或返回 Element 的函数；Portal 容器由 `getPopupContainer` 指定。',
        '步骤中的 cover、title、description 保留 VNode 配置；同名作用域插槽优先。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: ['onChange', 'onFinish', 'onNext', 'onPrev', 'onSkip'],
        },
      ],
      eventGroups: [
        {
          name: 'UserGuide',
          items: [
            event('change', '[current: number]', '步骤索引变化'),
            event('next', '[current: number]', '点击下一步后触发'),
            event('prev', '[current: number]', '点击上一步后触发'),
            event('finish', '[]', '完成全部步骤'),
            event('skip', '[]', '跳过引导'),
            event('update:current', '[current: number]', '更新 v-model:current'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'UserGuide',
          items: [
            slot('cover', '{ current, index, step }', '当前步骤封面'),
            slot('title', '{ current, index, step }', '当前步骤标题'),
            slot('description', '{ current, index, step }', '当前步骤描述'),
          ],
        },
      ],
      textRewrites: [
        ['## API 参考\n\n---', '## API 参考\n\n'],
        ['通过 `current` 属性设置当前引导步骤。', '通过 `v-model:current` 双向绑定当前引导步骤。'],
      ],
    },
  ],
  [
    '/zh-CN/feedback/popconfirm',
    {
      sources: [
        'packages/ui/src/popconfirm/types.ts',
        'packages/ui/src/popover/types.ts',
        'packages/ui/src/tooltip/types.ts',
      ],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          sources: [
            {
              source: 'packages/ui/src/tooltip/types.ts',
              interfaces: ['TooltipProps'],
              omit: [
                'class',
                'content',
                'position',
                'prefixCls',
                'role',
                'showArrow',
                'style',
                'trigger',
                'zIndex',
              ],
            },
            {
              source: 'packages/ui/src/popover/types.ts',
              interfaces: ['PopoverProps'],
              omit: [
                'class',
                'className',
                'content',
                'position',
                'prefixCls',
                'style',
                'trigger',
                'zIndex',
              ],
            },
            {
              source: 'packages/ui/src/popconfirm/types.ts',
              interfaces: ['PopconfirmProps'],
            },
          ],
          descriptions: {
            cancelButtonProps: '取消按钮配置；autoFocus 与嵌套 onClick callback 可用',
            class: 'Vue 原生类名',
            className: '样式类名',
            content: '内容 VNode；content 作用域插槽优先',
            icon: '图标 VNode；icon 插槽优先',
            okButtonProps: '确认按钮配置；autoFocus 与嵌套 onClick callback 可用',
            title: '标题 VNode；title 插槽优先',
            visible: '`v-model:visible` 绑定值',
          },
          defaults: {
            cancelType: '`tertiary`',
            defaultVisible: 'false',
            disabled: 'false',
            motion: 'true',
            okType: '`primary`',
            position: '`bottomLeft`（RTL 为 `bottomRight`）',
            showArrow: 'false',
            showCloseIcon: 'true',
            stopPropagation: 'true',
            trigger: '`click`（受控时为 `custom`）',
            visible: 'false',
            zIndex: '1030',
          },
        },
      ],
      models: ['`v-model:visible` 对应 `visible` 与 `update:visible`。'],
      usageNotes: [
        '未重写的浮层属性继承自 Popover / Tooltip；Portal 容器由 `getPopupContainer` 指定。',
        '`confirm` 与 `cancel` 监听器可返回 Promise；pending 时按钮进入 loading，resolve 后关闭，reject 时保持打开。',
        '`cancelButtonProps`、`okButtonProps` 中的 `onClick` 是嵌套 callback prop。',
        '`content`、`icon`、`title` 保留 VNode prop 入口；同名插槽优先。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: ['onConfirm', 'onCancel', 'onClickOutSide', 'onEscKeyDown', 'onVisibleChange'],
        },
      ],
      eventGroups: [
        {
          name: 'Popconfirm',
          items: [
            event('confirm', '[event: MouseEvent]', '点击确认；监听器可返回 Promise'),
            event('cancel', '[event: MouseEvent]', '点击取消或关闭；监听器可返回 Promise'),
            event('clickOutside', '[event: MouseEvent]', '点击触发元素和浮层以外区域'),
            event('escKeydown', '[event: KeyboardEvent]', '按下 Escape'),
            event('visibleChange', '[visible: boolean]', '浮层显隐变化'),
            event('update:visible', '[visible: boolean]', '更新 v-model:visible'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Popconfirm',
          items: [
            slot('default', '{}', '触发元素'),
            slot('content', '{ initialFocusRef }', '确认框内容'),
            slot('icon', '{}', '提示图标'),
            slot('title', '{}', '确认框标题'),
          ],
        },
      ],
      textRewrites: [
        [
          'Popconfirm 底层基于 Tooltip 封装，Children 支持类型同 Tooltip，注意事项详情可查阅',
          'Popconfirm 底层基于 Tooltip 封装，默认插槽触发元素的支持类型同 Tooltip，注意事项详情可查阅',
        ],
        [
          'onOk、onCancel 可以通过 return Promise 实现点击后延时关闭 （v2.19后支持）',
          '`confirm`、`cancel` 事件监听器可以返回 Promise，实现点击后延时关闭（v2.19 后支持）。',
        ],
        [
          'onCancel、onOk 被触发时，对应的 Button 会自动切换为 loading: true, promise solve 会关闭气泡确认框， promise reject时气泡依然保留，同时 button loading 自动切换为 false',
          '事件触发后对应按钮会自动进入 loading；Promise resolve 后关闭气泡确认框，reject 时保持打开并结束 loading。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/card',
    {
      sources: ['packages/ui/src/card/types.ts', 'packages/ui/src/card/index.ts'],
      propSections: [
        {
          heading: 'Card',
          level: 3,
          source: 'packages/ui/src/card/types.ts',
          interfaces: ['CardProps'],
          descriptions: {
            actions: '操作 VNode 数组；actions 插槽优先',
            class: 'Vue 原生类名',
            className: '样式类名',
            cover: '封面 VNode；cover 插槽优先',
            footer: '页脚 VNode；footer 插槽优先',
            header: '头部 VNode；header 插槽优先',
            headerExtraContent: '标题右侧 VNode；headerExtraContent 插槽优先',
            title: '标题 VNode；title 插槽优先',
          },
          defaults: { bordered: 'true', footerLine: 'false', headerLine: 'true', loading: 'false' },
        },
        {
          heading: 'CardGroup',
          level: 3,
          source: 'packages/ui/src/card/types.ts',
          interfaces: ['CardGroupProps'],
          descriptions: { class: 'Vue 原生类名', className: '样式类名' },
          defaults: { spacing: '16' },
        },
        {
          heading: 'Card.Meta',
          level: 3,
          source: 'packages/ui/src/card/types.ts',
          interfaces: ['CardMetaProps'],
          descriptions: {
            avatar: '头像 VNode；avatar 插槽优先',
            class: 'Vue 原生类名',
            className: '样式类名',
            description: '描述 VNode；description 插槽优先',
            title: '标题 VNode；title 插槽优先',
          },
        },
      ],
      usageNotes: [
        '`Card.Meta` 同时作为 `Card.Meta` 静态成员和 `CardMeta` 具名导出；`CardGroup` 为具名导出。',
        'Card 与 CardMeta 的内容均保留 VNode prop；同名插槽优先。',
        '`CardGroup type="grid"` 时忽略 spacing 并使用网格布局。',
      ],
      slotGroups: [
        {
          name: 'Card',
          items: [
            slot('default', '{}', '卡片主体内容'),
            slot('actions', '{}', '内容区底部操作组'),
            slot('cover', '{}', '卡片封面'),
            slot('footer', '{}', '卡片页脚'),
            slot('header', '{}', '完整自定义头部'),
            slot('headerExtraContent', '{}', '标题右侧额外内容'),
            slot('title', '{}', '卡片标题'),
          ],
        },
        {
          name: 'CardMeta',
          items: [
            slot('avatar', '{}', '头像'),
            slot('description', '{}', '描述'),
            slot('title', '{}', '标题'),
          ],
        },
        {
          name: 'CardGroup',
          items: [slot('default', '{}', 'Card 子组件')],
        },
      ],
      textRewrites: [
        ['### API 参考', '## API 参考'],
        ['**Card**', '### Card'],
        ['**CardGroup**', '### CardGroup'],
        ['**Card.Meta**', '### Card.Meta'],
        [
          '`actions` 接收 ReactNode 数组，元素间将以 12px 的水平间距展示于内容区底部。',
          '`actions` prop 接收 VNode 数组，也可使用 `#actions` 插槽；元素间以 12px 的水平间距展示。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/rating',
    {
      sources: ['packages/ui/src/rating/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/rating/types.ts',
          interfaces: ['RatingProps'],
          aliases: {
            ariaDescribedby: 'aria-describedby',
            ariaErrormessage: 'aria-errormessage',
            ariaInvalid: 'aria-invalid',
            ariaLabel: 'aria-label',
            ariaLabelledby: 'aria-labelledby',
            ariaRequired: 'aria-required',
          },
          descriptions: {
            ariaDescribedby: '`aria-describedby` 的类型化 Vue 映射',
            ariaErrormessage: '`aria-errormessage` 的类型化 Vue 映射',
            ariaInvalid: '`aria-invalid` 的类型化 Vue 映射',
            ariaLabel: '`aria-label` 的类型化 Vue 映射',
            ariaLabelledby: '`aria-labelledby` 的类型化 Vue 映射',
            ariaRequired: '`aria-required` 的类型化 Vue 映射',
            character: '评分字符 VNode；character 插槽优先',
            className: '样式类名',
            modelValue: '`v-model` 绑定值',
            value: '兼容受控值',
          },
          defaults: {
            allowClear: 'true',
            allowHalf: 'false',
            autoFocus: 'false',
            count: '5',
            defaultValue: '0',
            disabled: 'false',
            prefixCls: '`semi-rating`',
            size: '`default`',
            tabIndex: '-1',
          },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定。',
      ],
      usageNotes: [
        '`character` 保留 VNode prop；character 插槽优先。',
        '`preventScroll` 同时作用于自动聚焦、键盘移动和公开 focus() 方法。',
        '方向键按 allowHalf 决定以 1 或 0.5 递增；RTL 下水平方向相反。',
        '`click` 保留在导出的 RatingEmits 兼容类型中；固定基线运行时不额外触发，请监听 `change`。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: ['onBlur', 'onChange', 'onFocus', 'onHoverChange', 'onKeyDown'],
        },
      ],
      eventGroups: [
        {
          name: 'Rating',
          items: [
            event('blur', '[event: FocusEvent]', '评分组件失焦'),
            event('change', '[value: number]', '评分值变化'),
            event(
              'click',
              '[event: MouseEvent | KeyboardEvent, index: number]',
              '兼容类型成员；固定基线运行时不额外触发',
            ),
            event('focus', '[event: FocusEvent]', '评分组件聚焦'),
            event('hoverChange', '[value: number | undefined]', '悬浮评分值变化'),
            event('keyDown', '[event: KeyboardEvent]', '方向键调整评分'),
            event('update:modelValue', '[value: number]', '更新默认 v-model'),
            event('update:value', '[value: number]', '更新兼容 value 绑定'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'RatingExposed',
          items: [
            method('focus', '() => void', '聚焦评分组件'),
            method('blur', '() => void', '让评分组件失焦'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Rating',
          items: [slot('character', '{}', '自定义评分字符')],
        },
      ],
      textRewrites: [['## API参考', '## API 参考']],
    },
  ],
  [
    '/zh-CN/show/calendar',
    {
      sources: ['packages/ui/src/calendar/types.ts'],
      propSections: [
        {
          heading: 'Calendar',
          level: 3,
          source: 'packages/ui/src/calendar/types.ts',
          interfaces: ['CalendarProps'],
          descriptions: {
            className: '样式类名',
            displayValue: '展示日期',
            events: '待渲染的 CalendarEvent 列表',
            header: '头部 VNode；header 插槽优先',
            range: 'range 模式的左闭右开日期范围',
            style: '内联样式',
            weekStartsOn: '每周第一天；0 为周日，1 为周一，依此类推',
          },
          defaults: {
            displayValue: '组件实例创建时的当前日期',
            events: '[]',
            height: '600',
            markWeekend: 'false',
            minEventHeight: 'Number.MIN_SAFE_INTEGER',
            mode: '`week`',
            range: '[]',
            scrollTop: '400',
            showCurrTime: 'true',
            weekStartsOn: '0',
          },
        },
        {
          heading: 'Event Object',
          level: 3,
          source: 'packages/ui/src/calendar/types.ts',
          interfaces: ['CalendarEvent'],
          descriptions: {
            allDay: '全天事件',
            content: '事件内容 VNode；event 插槽优先',
            end: '事件结束时间',
            key: '唯一事件 key',
            start: '事件开始时间',
          },
          defaults: { allDay: 'false' },
        },
      ],
      usageNotes: [
        '`day`、`week`、`month`、`range` 由 Calendar 内部视图实现，不作为公开子组件导出。',
        '`header` 与 `events[].content` 保留 VNode prop；对应 header、event 插槽优先。',
        '`range` 左闭右开；`weekStartsOn` 对周视图和月视图生效。',
      ],
      eventSections: [
        {
          heading: 'Calendar',
          level: 3,
          rows: ['onClick', 'onClose', 'onMoreClick'],
        },
      ],
      eventGroups: [
        {
          name: 'Calendar',
          items: [
            event('click', '[event: MouseEvent, date: Date]', '点击日期格'),
            event('close', '[event: MouseEvent]', '关闭月视图事件列表'),
            event(
              'moreClick',
              '[event: MouseEvent, date: Date, remaining: number]',
              '点击月视图“还有几项”',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Calendar',
          items: [
            slot('allDayEvents', '{ events: CalendarEvent[] }', '顶部全天事件区'),
            slot('dateDisplay', '{ date: Date }', '日期文案'),
            slot('dateGrid', '{ date: Date, dateString: string }', '日期单元格或日期列'),
            slot('event', '{ event: CalendarEvent }', '单个事件内容'),
            slot('header', '{}', '日历头部'),
            slot('timeDisplay', '{ time: number }', '日、周、范围视图的时间轴文案'),
          ],
        },
      ],
      textRewrites: [
        [
          '通过 `events` 传入需要渲染的事件，`events` 是一个由 event objects 组成的数组，具体形式请参考 events API。',
          '通过 `events` 传入需要渲染的 `CalendarEvent` 数组，具体形式请参考 Event Object API。',
        ],
        [
          '`events` 是一个 event object 组成的数组，event object 约定格式如下：',
          '`events` 是一个 `CalendarEvent` 数组，成员格式如下：',
        ],
        [
          '通过 dateGridRender 可以自定义渲染日期单元格/列。需要使用绝对定位。',
          '通过 `#dateGrid="{ dateString, date }"` 作用域插槽自定义日期单元格或日期列，内容需要使用绝对定位。',
        ],
        [
          '可以通过 dateGridRender 自定义单元格的背景，月视图的文字 zIndex 默认为 3，如需完全覆盖单元格可以设置更大的 zIndex 来实现。',
          '可以通过 `#dateGrid` 插槽自定义单元格背景。月视图文字的 zIndex 默认为 3，如需完全覆盖单元格，可设置更大的 zIndex。',
        ],
        [
          '可以通过 renderDateDisplay 自定义日期文案。',
          '可以通过 `#dateDisplay="{ date }"` 作用域插槽自定义日期文案。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/list',
    {
      sources: ['packages/ui/src/list/types.ts', 'packages/ui/src/grid/types.ts'],
      propSections: [
        {
          heading: 'List',
          level: 3,
          source: 'packages/ui/src/list/types.ts',
          interfaces: ['ListProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            dataSource: '只读列表数据源',
            emptyContent: '空态 VNode；emptyContent 插槽优先',
            footer: '列表底部 VNode；footer 插槽优先',
            header: '列表头部 VNode；header 插槽优先',
            loadMore: '根节点底部的加载更多 VNode；loadMore 插槽优先',
            renderItem: '数据项渲染 callback；item 插槽优先',
          },
          defaults: {
            bordered: 'false',
            layout: '`vertical`',
            loading: 'false',
            size: '`default`',
            split: 'true',
          },
        },
        {
          heading: 'List grid props',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/grid/types.ts',
              interfaces: ['RowProps'],
              omit: ['prefixCls'],
            },
            {
              source: 'packages/ui/src/grid/types.ts',
              interfaces: ['ColSize', 'ColProps'],
              omit: ['prefixCls'],
            },
          ],
          descriptions: {
            align: '行内项目的垂直对齐方式',
            justify: '行内项目的水平排列方式',
            offset: '左侧间隔格数',
            order: '栅格顺序',
            pull: '向左移动格数',
            push: '向右移动格数',
            type: '行布局类型',
          },
          defaults: { gutter: '0', type: '`flex`' },
        },
        {
          heading: 'List.Item',
          level: 3,
          source: 'packages/ui/src/list/types.ts',
          interfaces: ['ListItemProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            extra: '附加内容 VNode；extra 插槽优先',
            header: '头部内容 VNode；header 插槽优先',
            main: '主体内容 VNode；main 插槽优先',
          },
          defaults: { align: '`flex-start`' },
        },
      ],
      usageNotes: [
        '`List.Item` 同时作为静态成员和 `ListItem` 具名导出；SFC 模板推荐使用 `ListItem`。',
        '`renderItem` 是保留的 callback prop；typed `#item="{ item, index }"` 插槽存在时优先。',
        'header、footer、loadMore、emptyContent 与 ListItem 的 header、main、extra 都支持同名插槽，插槽优先。',
        '`loading` 只控制列表加载态；分页由外部 Pagination 组合，不是 List prop。',
      ],
      eventSections: [
        { heading: 'List', level: 3, rows: ['onClick', 'onRightClick'] },
        { heading: 'List.Item', level: 3, rows: ['onClick', 'onRightClick'] },
      ],
      eventGroups: [
        {
          name: 'List',
          items: [
            event('click', '[event: MouseEvent]', '列表项未监听同名事件时，由 List 接收点击'),
            event(
              'rightClick',
              '[event: MouseEvent]',
              '列表项未监听同名事件时，由 List 接收右键点击',
            ),
          ],
        },
        {
          name: 'ListItem',
          items: [
            event('click', '[event: MouseEvent]', '点击列表项'),
            event('rightClick', '[event: MouseEvent]', '右键点击列表项'),
            event('mouseEnter', '[event: MouseEvent]', '指针进入列表项'),
            event('mouseLeave', '[event: MouseEvent]', '指针离开列表项'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'List',
          items: [
            slot('default', '{}', '声明式 ListItem 子组件'),
            slot('emptyContent', '{}', '空态内容'),
            slot('footer', '{}', '列表底部'),
            slot('header', '{}', '列表头部'),
            slot('item', '{ item, index }', '逐项渲染 dataSource'),
            slot('loadMore', '{}', '加载更多内容'),
          ],
        },
        {
          name: 'ListItem',
          items: [
            slot('default', '{}', '列表项内容'),
            slot('extra', '{}', '附加内容'),
            slot('header', '{}', '头部内容'),
            slot('main', '{}', '主体内容'),
          ],
        },
      ],
      textRewrites: [
        [
          '可以通过集成 [react-infinite-scroller](https://github.com/CassetteRocks/react-infinite-scroller) 来实现滚动加载的列表。',
          '可以结合滚动事件与分批加载实现滚动加载列表。',
        ],
        [
          '可以通过集成 [react-virtualized](https://github.com/bvaughn/react-virtualized) 实现滚动加载无限长列表，带有虚拟化（virtualization）功能，能够提高数据量大时候长列表的性能。',
          '可以结合虚拟列表实现无限长列表，在数据量较大时减少实际渲染的列表项。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/plus/jsonviewer',
    {
      sources: ['packages/ui/src/json-viewer/types.ts', 'packages/ui/src/json-viewer/index.ts'],
      propSections: [
        {
          heading: 'JsonViewer',
          level: 3,
          source: 'packages/ui/src/json-viewer/types.ts',
          interfaces: ['JsonViewerProps'],
          descriptions: {
            class: 'Vue 原生类名',
            className: '样式类名',
            limitSearchButtonBounds: '是否将搜索按钮拖动范围限制在组件容器内',
            options: '编辑器配置',
            renderSearchButton: '搜索按钮渲染 callback；优先于 searchButton 插槽',
            renderTooltip: '悬浮提示 callback；固定 v2.102.0 运行时未订阅 hoverNode',
            showSearch: '是否显示搜索入口',
            style: '内联样式',
            value: '`v-model:value` 绑定的 JSON 字符串',
          },
          defaults: {
            height: '400',
            limitSearchButtonBounds: 'false',
            options: '`{ readOnly: false, autoWrap: true }`',
            showSearch: 'true',
            value: "`''`",
            width: '400',
          },
        },
        {
          heading: 'JsonViewerOptions',
          level: 3,
          source: 'packages/ui/src/json-viewer/types.ts',
          interfaces: ['JsonViewerOptions'],
          descriptions: {
            completionOptions: '静态补全项配置',
            prefixCls: '样式类名前缀',
          },
          defaults: { autoWrap: 'true', readOnly: 'false' },
        },
      ],
      models: ['`v-model:value` 对应 `value` 与 `update:value`。'],
      usageNotes: [
        '`value` 更新会重建内部编辑器；编辑内容时依次触发 `change` 与 `update:value`。',
        '`renderSearchButton` 是保留的 callback prop；未提供时可使用 `#searchButton` 作用域插槽。',
        '`SearchControls.onXxx` 是传给渲染 callback / 插槽的控制器方法，不是组件事件。',
        '`options.customRenderRule[].match/render` 与 `renderTooltip` 是嵌套或顶层 callback props；`renderTooltip` 在固定 v2.102.0 中保持兼容 no-op。',
      ],
      eventSections: [{ heading: 'JsonViewer', level: 3, rows: ['onChange'] }],
      eventGroups: [
        {
          name: 'JsonViewer',
          items: [
            event('change', '[value: string]', '编辑器内容变化'),
            event('update:value', '[value: string]', '更新 v-model:value'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'JsonViewerExposed',
          items: [
            method('getValue', '() => string', '获取当前值'),
            method('format', '() => void', '格式化当前内容'),
            method(
              'search',
              '(text: string, caseSensitive?: boolean, wholeWord?: boolean, regex?: boolean) => void',
              '搜索文本',
            ),
            method(
              'getSearchResults',
              '() => JsonViewerSearchResult[] | undefined',
              '获取当前搜索结果',
            ),
            method('prevSearch', '(step?: number) => void', '导航到上一个搜索结果'),
            method('nextSearch', '(step?: number) => void', '导航到下一个搜索结果'),
            method('replace', '(text: string) => void', '替换当前搜索匹配项'),
            method('replaceAll', '(text: string) => void', '替换全部搜索匹配项'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'JsonViewer',
          items: [
            slot(
              'searchButton',
              '{ defaultSearchButton: VNodeChild, controls: JsonViewerSearchControls }',
              '自定义搜索按钮',
            ),
          ],
        },
      ],
      textRewrites: [
        [
          '注意：JsonViewer 为非受控组件，若传入 value 属性为受控属性即React State，不建议在 onChange 中修改 value 属性即setState操作。若需要获取组件的值，可以通过 ref 获取，具体可参考 [Methods](#Methods)。',
          'JsonViewer 内部编辑器保持非受控；`value` prop 更新时会重建编辑器。可通过 `v-model:value` 同步编辑结果，或使用模板 ref 调用实例方法。',
        ],
        ['设置固定行高（单位：px, 默认 18）', '设置固定行高（单位：px，默认 20）'],
        ['(content: string) => VNodeChild', '(content: string) => VNodeChild 或 HTMLElement'],
        [
          '通过 `renderSearchButton` 属性，你可以自定义搜索按钮的渲染方式，实现固定位置、自定义样式等需求。',
          '可通过 `renderSearchButton` callback prop 或 `#searchButton` 作用域插槽自定义搜索按钮，实现固定位置或自定义样式。',
        ],
        [
          '可以通过 `ref` 调用组件实例上绑定的方法，实现某些特殊交互。',
          '可以通过模板 ref 调用公开实例方法。',
        ],
        [
          'https://github.com/aifuxi/semi-ui-vue/blob/main/packages/semi-ui/jsonViewer/_story/jsonViewer.stories.jsx',
          'https://github.com/aifuxi/semi-ui-vue/blob/main/apps/storybook-vue/src/stories/json-viewer.stories.ts',
        ],
        ['ReactMonacoEditor', 'MonacoEditor'],
      ],
    },
  ],
  [
    '/zh-CN/input/inputnumber',
    {
      sources: ['packages/ui/src/input-number/types.ts', 'packages/ui/src/input/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          sources: [
            {
              source: 'packages/ui/src/input/types.ts',
              interfaces: ['InputProps'],
              omit: ['className', 'defaultValue', 'modelValue', 'suffix', 'value'],
            },
            {
              source: 'packages/ui/src/input-number/types.ts',
              interfaces: ['InputNumberProps'],
            },
          ],
          aliases: {
            ariaDescribedby: 'aria-describedby',
            ariaErrormessage: 'aria-errormessage',
            ariaInvalid: 'aria-invalid',
            ariaLabel: 'aria-label',
            ariaLabelledby: 'aria-labelledby',
            ariaRequired: 'aria-required',
          },
          descriptions: {
            addonAfter: '后置标签 VNode；addonAfter 插槽优先',
            addonBefore: '前置标签 VNode；addonBefore 插槽优先',
            ariaDescribedby: '`aria-describedby` 的类型化 Vue 映射',
            ariaErrormessage: '`aria-errormessage` 的类型化 Vue 映射',
            ariaInvalid: '`aria-invalid` 的类型化 Vue 映射',
            ariaLabel: '`aria-label` 的类型化 Vue 映射',
            ariaLabelledby: '`aria-labelledby` 的类型化 Vue 映射',
            ariaRequired: '`aria-required` 的类型化 Vue 映射',
            autofocus: '兼容上游命名的自动聚焦开关',
            autoFocus: 'Vue 公共类型保留的自动聚焦开关',
            className: '样式类名',
            clearIcon: '清除图标 VNode；clearIcon 插槽优先',
            defaultCurrency: 'currency=true 时使用的默认货币代码',
            defaultValue: '非受控初始值',
            insetLabel: '内嵌标签 VNode；insetLabel 插槽优先',
            modelValue: '默认 v-model 绑定值',
            prefix: '前缀 VNode；prefix 插槽优先',
            suffix: '后缀 VNode；suffix 插槽优先',
            value: '兼容受控值',
          },
          defaults: {
            autofocus: 'false',
            borderless: 'false',
            composition: 'false',
            disabled: 'false',
            hideButtons: 'false',
            hideSuffix: 'false',
            innerButtons: 'false',
            keepFocus: 'false',
            max: 'Infinity',
            min: '-Infinity',
            pressInterval: '250',
            pressTimeout: '250',
            readonly: 'false',
            shiftStep: '10',
            showClear: 'false',
            showCurrencySymbol: 'true',
            size: '`default`',
            step: '1',
            validateStatus: '`default`',
          },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定，两个值同时存在时 `value` 优先。',
      ],
      usageNotes: [
        '`formatter`、`parser` 与 `getValueLength` 是保留的 callback props，不是组件事件。',
        'addonBefore、addonAfter、clearIcon、insetLabel、prefix、suffix 同时支持 VNode prop 和同名插槽，插槽优先。',
        '模板 ref 还公开只读 `input: HTMLInputElement | null`。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: [
            'onBlur',
            'onChange',
            'onDownClick',
            'onFocus',
            'onKeyDown',
            'onNumberChange',
            'onUpClick',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'InputNumber',
          items: [
            event('blur', '[event: FocusEvent]', '输入框失焦'),
            event('change', '[value: InputNumberValue, event?: Event | null]', '输入值变化'),
            event('downClick', '[value: string, event: MouseEvent]', '点击向下步进按钮'),
            event('focus', '[event: FocusEvent]', '输入框聚焦'),
            event('keydown', '[event: KeyboardEvent]', '输入框键盘事件'),
            event('numberChange', '[value: number, event?: Event | null]', '解析后的数字变化'),
            event('upClick', '[value: string, event: MouseEvent]', '点击向上步进按钮'),
            event('update:modelValue', '[value: InputNumberValue]', '更新默认 v-model'),
            event('update:value', '[value: InputNumberValue]', '更新兼容 value 绑定'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'InputNumberExposed',
          items: [
            method('focus', '() => void', '聚焦输入框'),
            method('blur', '() => void', '让输入框失焦'),
            method('select', '() => void', '选中输入框内容'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'InputNumber',
          items: [
            slot('addonAfter', '{}', '后置标签'),
            slot('addonBefore', '{}', '前置标签'),
            slot('clearIcon', '{}', '清除图标'),
            slot('insetLabel', '{}', '内嵌标签'),
            slot('prefix', '{}', '输入框前缀'),
            slot('suffix', '{}', '输入框后缀'),
          ],
        },
      ],
      textRewrites: [
        [
          '搭配 formatter 和 onNumberChange（**>=v1.9.0**） 可以实现纯数字输入框。',
          '搭配 `formatter` 和 `numberChange` 事件（**>=v1.9.0**）可以实现纯数字输入框。',
        ],
        ['国际化模式下通过 currency={true} 开启', '国际化模式下通过 `:currency="true"` 开启'],
        [
          '绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互',
          '可通过模板 ref 调用公开实例方法。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/basic/typography',
    {
      sources: ['packages/ui/src/typography/types.ts', 'packages/ui/src/typography/index.ts'],
      propSections: [
        {
          heading: 'Typography.Text',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/typography/types.ts',
              interfaces: ['TypographyBaseProps'],
              omit: ['spacing', 'weight'],
            },
            {
              source: 'packages/ui/src/typography/types.ts',
              interfaces: ['TextProps'],
            },
          ],
          descriptions: {
            component: '自定义根元素或 Vue 组件',
            copyable: '复制配置；内部 onCopy 是嵌套 callback prop',
            ellipsis: '省略配置；内部 onExpand 是嵌套 callback prop',
            icon: '前缀 VNode；icon 插槽优先',
          },
        },
        {
          heading: 'Typography.Title',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/typography/types.ts',
              interfaces: ['TypographyBaseProps'],
              omit: ['icon', 'size', 'spacing'],
            },
            {
              source: 'packages/ui/src/typography/types.ts',
              interfaces: ['TitleProps'],
            },
          ],
          descriptions: {
            component: '自定义根元素或 Vue 组件；默认由 heading 决定',
            copyable: '复制配置；内部 onCopy 是嵌套 callback prop',
            ellipsis: '省略配置；内部 onExpand 是嵌套 callback prop',
          },
        },
        {
          heading: 'Typography.Paragraph',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/typography/types.ts',
              interfaces: ['TypographyBaseProps'],
              omit: ['icon', 'weight'],
            },
            {
              source: 'packages/ui/src/typography/types.ts',
              interfaces: ['ParagraphProps'],
            },
          ],
          descriptions: {
            component: '自定义根元素或 Vue 组件',
            copyable: '复制配置；内部 onCopy 是嵌套 callback prop',
            ellipsis: '省略配置；内部 onExpand 是嵌套 callback prop',
          },
        },
        {
          heading: 'Typography.Numeral',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/typography/types.ts',
              interfaces: ['TypographyBaseProps'],
              omit: ['ellipsis', 'spacing'],
            },
            {
              source: 'packages/ui/src/typography/types.ts',
              interfaces: ['NumeralProps'],
            },
          ],
          descriptions: {
            component: '自定义根元素或 Vue 组件',
            copyable: '复制配置；内部 onCopy 是嵌套 callback prop',
            icon: '前缀 VNode；icon 插槽优先',
            parser: '数值文本解析 callback prop',
          },
        },
        {
          heading: 'Ellipsis Config',
          level: 3,
          source: 'packages/ui/src/typography/types.ts',
          interfaces: ['TypographyEllipsis'],
          descriptions: {
            onExpand: '展开或收起 callback prop；组件同时触发 expand 事件',
            showTooltip: '是否展示 Tooltip/Popover 及其配置；tooltip 插槽可自定义内容',
          },
          defaults: {
            collapseText: '启用折叠时使用 Locale 文案',
            collapsible: 'false',
            expandText: '启用展开时使用 Locale 文案',
            expandable: 'false',
            pos: '`end`',
            rows: '1',
            showTooltip: 'false',
            suffix: "`''`",
          },
        },
        {
          heading: 'Copyable Config',
          level: 3,
          source: 'packages/ui/src/typography/types.ts',
          interfaces: ['TypographyCopyableConfig'],
          descriptions: {
            copyTip: '复制操作提示 VNode',
            duration: '复制成功状态持续秒数',
            icon: '自定义复制 VNode；copyIcon 插槽优先',
            onCopy: '复制完成 callback prop；组件同时触发 copy 事件',
            render: '复制操作渲染 callback prop；copyIcon 插槽可替代',
            successTip: '复制成功提示 VNode；copied 插槽优先',
          },
          defaults: { duration: '3' },
        },
      ],
      usageNotes: [
        '`Typography` 是默认导出容器，默认渲染 article；Text、Title、Paragraph、Numeral 同时作为静态成员和具名导出，SFC 模板推荐使用具名导出。',
        '`ellipsis.onExpand`、`copyable.onCopy`、`copyable.render` 与 `Numeral.parser` 是保留的嵌套 callback props，不是组件事件。',
        '默认插槽提供正文；icon、copyIcon、copied、tooltip 插槽分别覆盖前缀、复制图标、复制成功内容和省略浮层内容。',
      ],
      eventGroups: [
        {
          name: 'Text / Title / Paragraph / Numeral',
          items: [
            event(
              'copy',
              '[event: MouseEvent | KeyboardEvent, content: string, result: boolean]',
              '复制操作完成',
            ),
            event(
              'expand',
              '[expanded: boolean, event: MouseEvent | KeyboardEvent]',
              '省略内容展开或收起',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Typography',
          items: [slot('default', '{}', '排版容器内容')],
        },
        {
          name: 'Text / Numeral',
          items: [
            slot('default', '{}', '正文内容'),
            slot('icon', '{}', '前缀图标'),
            slot(
              'copyIcon',
              '{ copied: boolean, copy: (event: MouseEvent | KeyboardEvent) => void }',
              '复制操作图标',
            ),
            slot('copied', '{}', '复制成功内容'),
            slot('tooltip', '{ content: string }', '省略内容浮层'),
          ],
        },
        {
          name: 'Title / Paragraph',
          items: [
            slot('default', '{}', '正文内容'),
            slot(
              'copyIcon',
              '{ copied: boolean, copy: (event: MouseEvent | KeyboardEvent) => void }',
              '复制操作图标',
            ),
            slot('copied', '{}', '复制成功内容'),
            slot('tooltip', '{ content: string }', '省略内容浮层'),
          ],
        },
      ],
      textRewrites: [
        ['## API参考', '## API 参考'],
        [
          '当 copyable 配置为 true时，默认复制内容为 children 本身，注意，此时 children 只支持 string类型传入',
          '当 copyable 配置为 true 时，默认复制内容为默认插槽的文本。',
        ],
        [
          '当 copyable 配置为 object 时，可通过 `copyable.content` 指定复制至粘贴板的内容，与 children 不再强关联， 此时 children 将不再限定类型，但 `copyable.content` 仍需要为 string',
          '当 copyable 配置为对象时，可通过 `copyable.content` 指定复制内容；默认插槽可使用任意 VNode，但 `copyable.content` 仍须为 string。',
        ],
        [
          '1. ellipsis 仅支持纯文本的截断，不支持 reactNode 等复杂类型，请确保 children 传入内容类型为 string',
          '1. ellipsis 仅支持纯文本截断，不支持复杂 VNode，请确保默认插槽提供可提取的文本内容。',
        ],
        [
          '通常来说，CSS 截断性能优于 JS 截断。在 children、 容器尺寸不变的情况下，CSS 截断只涉及 1~2 次计算，js 截断可能涉及多次计算。',
          '通常来说，CSS 截断性能优于 JS 截断。在默认插槽内容、容器尺寸不变时，CSS 截断只涉及 1~2 次计算，JS 截断可能涉及多次计算。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/basic/resizable',
    {
      sources: ['packages/ui/src/resizable/types.ts', 'packages/ui/src/resizable/index.ts'],
      propSections: [
        {
          heading: 'Resizable',
          level: 3,
          source: 'packages/ui/src/resizable/types.ts',
          interfaces: ['ResizableProps'],
          descriptions: {
            beforeResizeStart: '开始调整前的 guard callback；返回 false 可取消本次调整',
            boundElement: '限制可伸缩范围的 parent、window 或 HTMLElement',
            defaultSize: '非受控初始宽高',
            enable: '各方向开关；false 关闭全部手柄',
            handleClass: '各方向手柄类名',
            handleNode: '各方向手柄 VNode；对应 handle-* 插槽优先',
            handleStyle: '各方向手柄样式',
            size: '`v-model:size` 绑定的受控宽高',
          },
          defaults: {
            boundsByDirection: 'false',
            enable: '{}',
            grid: '[1, 1]',
            lockAspectRatio: 'false',
            lockAspectRatioExtraHeight: '0',
            lockAspectRatioExtraWidth: '0',
            ratio: '1',
            scale: '1',
            snapGap: '0',
          },
        },
        {
          heading: 'ResizeGroup',
          level: 3,
          source: 'packages/ui/src/resizable/types.ts',
          interfaces: ['ResizeGroupProps'],
          defaults: { direction: '`horizontal`' },
        },
        {
          heading: 'ResizeHandler',
          level: 3,
          sources: [
            {
              source: 'packages/ui/src/resizable/types.ts',
              interfaces: ['ResizeGroupProps'],
              omit: ['direction'],
            },
          ],
        },
        {
          heading: 'ResizeItem',
          level: 3,
          source: 'packages/ui/src/resizable/types.ts',
          interfaces: ['ResizeItemProps'],
        },
      ],
      models: ['`v-model:size` 对应 `size` 与 `update:size`。'],
      usageNotes: [
        'Resizable、ResizeGroup、ResizeItem、ResizeHandler 均为具名导出；组合模式按 Item / Handler / Item 顺序放入 ResizeGroup 默认插槽。',
        '`beforeResizeStart` 是保留的 guard callback prop；resizeStart、change、resizeEnd 是组件事件。',
        'class 与 style 作为 Vue 原生 attributes 透传，不是四个组件的声明式 props。',
        'ResizeHandler 由所在 ResizeGroup 提供方向，不公开独立 props 或事件。',
      ],
      eventSections: [
        {
          heading: 'Resizable',
          level: 3,
          rows: ['onChange', 'onResizeStart', 'onResizeEnd'],
        },
        {
          heading: 'ResizeItem',
          level: 3,
          rows: ['onChange', 'onResizeStart', 'onResizeEnd'],
        },
      ],
      eventGroups: [
        {
          name: 'Resizable',
          items: [
            event(
              'resizeStart',
              '[event: ResizeStartPointer, direction: ResizeDirection]',
              '开始调整尺寸',
            ),
            event(
              'change',
              '[size: ResizeSize, event: ResizeStartPointer | ResizeMoveEvent, direction: ResizeDirection]',
              '调整过程中的尺寸变化',
            ),
            event(
              'resizeEnd',
              '[size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection]',
              '结束调整尺寸',
            ),
            event('update:size', '[size: ResizeSize]', '更新 v-model:size'),
          ],
        },
        {
          name: 'ResizeItem',
          items: [
            event(
              'resizeStart',
              '[event: ResizeStartPointer, direction: ResizeDirection]',
              '所在分隔条开始拖动',
            ),
            event(
              'change',
              '[size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection]',
              '组合项尺寸变化',
            ),
            event(
              'resizeEnd',
              '[size: ResizeSize, event: ResizeMoveEvent, direction: ResizeDirection]',
              '所在分隔条结束拖动',
            ),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Resizable',
          items: [
            slot('default', '{}', '可伸缩内容'),
            slot('handle-top', '{}', '顶部手柄'),
            slot('handle-right', '{}', '右侧手柄'),
            slot('handle-bottom', '{}', '底部手柄'),
            slot('handle-left', '{}', '左侧手柄'),
            slot('handle-topRight', '{}', '右上手柄'),
            slot('handle-bottomRight', '{}', '右下手柄'),
            slot('handle-bottomLeft', '{}', '左下手柄'),
            slot('handle-topLeft', '{}', '左上手柄'),
          ],
        },
        { name: 'ResizeGroup', items: [slot('default', '{}', '组合子项')] },
        { name: 'ResizeItem', items: [slot('default', '{}', '组合项内容')] },
        { name: 'ResizeHandler', items: [slot('default', '{}', '自定义分隔条')] },
      ],
      textRewrites: [
        [
          '通过`defaultSize`设置初始大小，可以通过`onResizeStart`、`onChange`、`onResizeEnd`设置拖拽的回调',
          '通过 `defaultSize` 设置初始大小，并监听 `resizeStart`、`change`、`resizeEnd` 事件。',
        ],
        [
          '通过`direction`设置伸缩方向，可选值为`horizontal`和`vertical` 支持`onResizeStart`、`onChange`、`onResizeEnd`回调，支持`min`、`max`设置最大最小宽高',
          '通过 `direction` 设置伸缩方向，可选 `horizontal` 或 `vertical`；可监听 `resizeStart`、`change`、`resizeEnd` 事件，并通过 `min`、`max` 设置尺寸范围。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/ai/aiChatDialogue',
    {
      sources: [
        'packages/ui/src/ai-chat-dialogue/types.ts',
        'packages/ui/src/ai-chat-dialogue/index.ts',
      ],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/ai-chat-dialogue/types.ts',
          interfaces: ['AIChatDialogueProps'],
          descriptions: {
            class: 'Vue class 入口',
            dialogueRenderConfig: '各对话区块的渲染 callback 配置；同名插槽优先',
            messageEditRender: '消息编辑渲染 callback prop；message-edit 插槽优先',
            renderDialogueContentItem: '按消息类型配置内容渲染 callback',
            renderHintBox: '提示项渲染 callback prop；hint 插槽优先',
          },
          defaults: {
            align: '`leftRight`',
            chats: '[]',
            disabledFileItemClick: 'false',
            escapeHtml: 'true',
            hints: '[]',
            mode: '`bubble`',
            selecting: 'false',
            showReference: 'false',
            showReset: 'true',
          },
        },
        {
          heading: 'RoleConfig',
          level: 3,
          source: 'packages/ui/src/ai-chat-dialogue/types.ts',
          interfaces: ['AIChatDialogueRoleConfig'],
        },
        {
          heading: 'MetaData',
          level: 3,
          source: 'packages/ui/src/ai-chat-dialogue/types.ts',
          interfaces: ['AIChatDialogueMetadata'],
          descriptions: { avatar: '头像地址或 VNode' },
        },
        {
          heading: 'Message',
          level: 3,
          source: 'packages/ui/src/ai-chat-dialogue/types.ts',
          interfaces: ['AIChatDialogueMessage'],
          descriptions: {
            dislike: '是否已提交负向反馈',
            editing: '消息是否处于编辑状态',
            like: '是否已提交正向反馈',
            output_text: 'Response API 聚合文本',
            references: '消息引用列表',
            updatedAt: '更新时间',
          },
        },
        {
          heading: 'Reference',
          level: 3,
          source: 'packages/ui/src/ai-chat-dialogue/types.ts',
          interfaces: ['Reference'],
        },
      ],
      models: [
        '`v-model:chats` 对应 `chats` 与 `update:chats`；列表变更时同时触发 `chats-change`。',
      ],
      usageNotes: [
        '`dialogueRenderConfig`、`renderDialogueContentItem`、`renderHintBox` 与 `messageEditRender` 是保留的 callback props，不是组件事件。',
        'Reasoning、Step、Annotation 与 defaultComponents.code 同时作为静态成员提供；Reasoning、Step、Annotation、Code 也可使用具名导出。',
        'Reasoning 接受 `status/summary/content/markdownRenderProps/completedText/thinkingText`；Step 接受 `steps`；Annotation 接受 `annotation/maxCount/description/annotationText`。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: [
            'onAnnotationClick',
            'onChatsChange',
            'onFileClick',
            'onHintClick',
            'onImageClick',
            'onMessageBadFeedback',
            'onMessageCopy',
            'onMessageDelete',
            'onMessageEdit',
            'onMessageGoodFeedback',
            'onMessageReset',
            'onMessageShare',
            'onReferenceClick',
            'onSelect',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'AIChatDialogue',
          items: [
            event('update:chats', '[chats: Message[]]', '更新 chats 绑定'),
            event('chats-change', '[chats: Message[]]', '对话消息列表变化'),
            event('select', '[selectedIds: string[]]', '选择项变化'),
            event('annotation-click', '[annotation: Annotation[]]', '点击注释资料'),
            event('file-click', '[file: InputFile]', '点击附件文件'),
            event('image-click', '[image: InputImage]', '点击图片'),
            event('hint-click', '[hint: string]', '点击提示词'),
            event('reference-click', '[reference: Reference]', '点击引用'),
            event('message-bad-feedback', '[message: Message]', '提交消息负向反馈'),
            event('message-copy', '[message: Message]', '复制消息'),
            event('message-delete', '[message: Message]', '删除消息'),
            event('message-edit', '[message: Message]', '编辑消息'),
            event('message-good-feedback', '[message: Message]', '提交消息正向反馈'),
            event('message-reset', '[message: Message]', '重置消息'),
            event('message-share', '[message: Message]', '分享消息'),
          ],
        },
        {
          name: 'AIChatDialogueAnnotation',
          items: [event('click', '[annotation: Annotation[]]', '点击注释资料')],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'AIChatDialogueExpose',
          items: [
            method('selectAll', '() => void', '全选所有消息'),
            method('deselectAll', '() => void', '取消全选所有消息'),
            method('scrollToBottom', '(animation?: boolean) => void', '滚动到列表底部'),
            method('scrollToTop', '(animation?: boolean) => void', '滚动到列表顶部'),
            method('getContainerElement', '() => HTMLDivElement | null', '获取滚动容器'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'AIChatDialogue',
          items: [
            slot('dialogue-avatar', 'RenderAvatarProps', '自定义头像'),
            slot('dialogue-title', 'RenderTitleProps', '自定义标题'),
            slot('dialogue-content', 'RenderContentProps', '自定义消息内容'),
            slot('dialogue-action', 'RenderActionProps', '自定义操作区'),
            slot('full-dialogue', 'RenderFullDialogueProps', '自定义完整对话项'),
            slot(
              'hint',
              '{ content: string, index: number, onHintClick: () => void }',
              '自定义提示项',
            ),
            slot('message-edit', '{ value: unknown }', '自定义消息编辑器'),
          ],
        },
        {
          name: 'AIChatDialogueReasoning',
          items: [slot('default', '{ raw: string, status?: string }', '自定义思考内容')],
        },
      ],
      textRewrites: [
        ['{ code: React.ComponentType }', '{ code: Component }'],
        [
          '通过设置 `chats` 和 `onChatsChange` 实现基础对话显示和交互。',
          '通过 `v-model:chats` 实现基础对话显示和交互。',
        ],
        [
          '`showReference` 配置当前消息是否显示可被引用样式, `onReferenceClick` 配置引用按钮点击回调。',
          '`showReference` 配置当前消息是否显示可被引用样式，并通过 `reference-click` 事件监听引用按钮点击。',
        ],
        ['并触发 `onHintClick` 回调。', '并触发 `hint-click` 事件。'],
        [
          '通过 `renderHintBox` 可自定义提示区域内容， 参数如下',
          '通过 `hint` 插槽可自定义提示区域内容；迁移代码也可继续使用 `renderHintBox` callback prop。',
        ],
        [
          '通过 `chatBoxRenderConfig` 传入自定义渲染配置, chatBoxRenderConfig 类型如下',
          '通过 `dialogueRenderConfig` 传入自定义渲染配置，或使用对应作用域插槽。',
        ],
        [
          '自定义渲染头像和标题，可通过 `renderChatBoxAvatar` 和 `renderChatBoxTitle` 实现。',
          '自定义渲染头像和标题，可使用 `dialogue-avatar` 和 `dialogue-title` 插槽。',
        ],
        [
          '绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互',
          '可通过模板 ref 调用公开实例方法。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/taginput',
    {
      sources: ['packages/ui/src/tag-input/types.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/tag-input/types.ts',
          interfaces: ['TagInputProps'],
          descriptions: {
            ariaLabel: '根元素 aria-label',
            clearIcon: '清除图标 VNode；clearIcon 插槽优先',
            inputValue: '受控输入内容，可通过 v-model:inputValue 绑定',
            insetLabel: '内嵌标签 VNode；insetLabel 插槽优先',
            insetLabelId: '内嵌标签元素 id',
            modelValue: '默认 v-model 标签数组',
            prefix: '前缀 VNode；prefix 插槽优先',
            renderTagItem: '标签渲染 callback prop；tag 插槽优先',
            split: '自定义批量输入切分 callback prop',
            suffix: '后缀 VNode；suffix 插槽优先',
            value: '兼容受控标签数组',
          },
          defaults: {
            addOnBlur: 'false',
            allowDuplicates: 'true',
            autoFocus: 'false',
            defaultValue: '[]',
            disabled: 'false',
            draggable: 'false',
            expandRestTagsOnClick: 'true',
            placeholder: "`''`",
            separator: "`','`",
            showClear: 'false',
            showContentTooltip: 'true',
            showRestTagsPopover: 'true',
            size: '`default`',
            validateStatus: '`default`',
          },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定，两个值同时存在时 `modelValue` 优先。',
        '`v-model:inputValue` 对应受控输入内容与 `update:inputValue`。',
      ],
      usageNotes: [
        '`renderTagItem` 与 `split` 是保留的 callback props，不是组件事件。',
        'clearIcon、insetLabel、prefix、suffix 同时支持 VNode prop 和同名插槽；tag 插槽提供 Vue 原生标签渲染入口，插槽优先。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: [
            'onAdd',
            'onBlur',
            'onChange',
            'onExceed',
            'onFocus',
            'onInputChange',
            'onInputExceed',
            'onKeyDown',
            'onRemove',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'TagInput',
          items: [
            event('add', '[addedValue: string[]]', '添加标签'),
            event('blur', '[event: FocusEvent]', '输入框失焦'),
            event('change', '[value: string[]]', '标签数组变化'),
            event('exceed', '[value: string[]]', '标签数量超过 max'),
            event('focus', '[event: FocusEvent]', '输入框聚焦'),
            event('inputChange', '[value: string, event: Event]', '输入内容变化'),
            event('inputExceed', '[value: string]', '输入内容超过 maxLength'),
            event('keyDown', '[event: KeyboardEvent]', '输入框键盘事件'),
            event('remove', '[removedValue: string, index: number]', '移除标签'),
            event('update:inputValue', '[value: string]', '更新输入内容绑定'),
            event('update:modelValue', '[value: string[]]', '更新默认 v-model'),
            event('update:value', '[value: string[]]', '更新兼容 value 绑定'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'TagInputExposed',
          items: [
            method('focus', '() => void', '聚焦输入框'),
            method('blur', '() => void', '让输入框失焦'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'TagInput',
          items: [
            slot('clearIcon', '{}', '清除图标'),
            slot('insetLabel', '{}', '内嵌标签'),
            slot('prefix', '{}', '输入框前缀'),
            slot('suffix', '{}', '输入框后缀'),
            slot('tag', '{ value: string, index: number, close: () => void }', '自定义标签内容'),
          ],
        },
      ],
      textRewrites: [
        [
          '当前输入框，配合 onInputChange 实现受控',
          '当前输入框内容，可通过 `v-model:inputValue` 受控',
        ],
        ['当前标签，配合 onChange 实现受控', '当前标签数组，可通过 `v-model` 受控'],
        ['触发 `onExceed()` 回调', '触发 `exceed` 事件'],
        ['触发 `onInputExceed()` 回调', '触发 `inputExceed` 事件'],
        [
          '可使用 `value` 设置标签内容，并配合 `onChange` 实现标签内容受控。',
          '可使用 `v-model` 双向绑定标签内容。',
        ],
        [
          '可使用 `inputValue` 设置输入框内容，并配合 `onInputChange` 实现输入内容受控。',
          '可使用 `v-model:inputValue` 双向绑定输入框内容。',
        ],
        [
          '可以使用 `renderTagItem` 自定义标签渲染。 `renderTagItem(value: string, index: number, onClose: function ) => VNodeChild` 第三个参数 `onClose` 于 2.23.0 版本开始提供。',
          '优先使用 `tag` 作用域插槽自定义标签渲染；迁移代码也可继续使用 `renderTagItem(value, index, close)` callback prop。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/transfer',
    {
      sources: ['packages/ui/src/transfer/types.ts'],
      propSections: [
        {
          heading: 'Transfer Props',
          level: 3,
          source: 'packages/ui/src/transfer/types.ts',
          interfaces: ['TransferProps'],
          descriptions: {
            emptyContent: '左右面板与搜索空状态内容；同名插槽优先',
            filter: '是否显示搜索框，或自定义筛选 callback prop',
            inputProps: '搜索框 Input 配置；内部接管 value 与 change 绑定',
            modelValue: '默认 v-model 已选值',
            renderSelectedHeader: '右侧头部渲染 callback prop；selectedHeader 插槽优先',
            renderSelectedItem: '右侧条目渲染 callback prop；selectedItem 插槽优先',
            renderSelectedPanel: '右侧面板渲染 callback prop；selectedPanel 插槽优先',
            renderSourceHeader: '左侧头部渲染 callback prop；sourceHeader 插槽优先',
            renderSourceItem: '左侧条目渲染 callback prop；sourceItem 插槽优先',
            renderSourcePanel: '左侧面板渲染 callback prop；sourcePanel 插槽优先',
            value: '兼容受控已选值',
          },
          defaults: {
            dataSource: '[]',
            defaultValue: '[]',
            disabled: 'false',
            draggable: 'false',
            emptyContent: '{}',
            filter: 'true',
            loading: 'false',
            showPath: 'false',
            type: '`list`',
          },
        },
        {
          heading: 'Item Interface',
          level: 3,
          source: 'packages/ui/src/transfer/types.ts',
          interfaces: ['TransferDataItem'],
        },
        {
          heading: 'GroupItem Interface',
          level: 3,
          source: 'packages/ui/src/transfer/types.ts',
          interfaces: ['TransferGroupItem'],
        },
        {
          heading: 'TreeItem Interface',
          level: 3,
          source: 'packages/ui/src/transfer/types.ts',
          interfaces: ['TransferTreeItem'],
        },
        {
          heading: 'VirtualizeProps Interface',
          level: 3,
          source: 'packages/ui/src/transfer/types.ts',
          interfaces: ['TransferVirtualizeProps'],
        },
        {
          heading: 'PaginationProps Interface',
          level: 3,
          source: 'packages/ui/src/transfer/types.ts',
          interfaces: ['TransferPaginationProps'],
          descriptions: { onPageChange: '页码变化 callback prop，不是 Transfer 事件' },
          defaults: { defaultCurrentPage: '1', pageSize: '10' },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定，两个值同时存在时 `modelValue` 优先。',
      ],
      usageNotes: [
        '`filter` 函数、`pagination.onPageChange` 与六个 `renderXxx` 是保留的 callback props，不是组件事件。',
        '六个渲染 callback 都有同名 scoped slot；emptyLeft、emptyRight、emptySearch 插槽分别覆盖三种空状态。',
      ],
      eventSections: [
        {
          heading: 'Transfer Props',
          level: 3,
          rows: ['onChange', 'onDeselect', 'onSearch', 'onSelect'],
        },
      ],
      eventGroups: [
        {
          name: 'Transfer',
          items: [
            event(
              'change',
              '[values: TransferPrimitive[], items: TransferDataItem[]]',
              '已选值变化',
            ),
            event('select', '[item: TransferDataItem]', '勾选条目'),
            event('deselect', '[item: TransferDataItem]', '取消勾选条目'),
            event('search', '[input: string]', '搜索输入变化'),
            event('update:modelValue', '[values: TransferPrimitive[]]', '更新默认 v-model'),
            event('update:value', '[values: TransferPrimitive[]]', '更新兼容 value 绑定'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'TransferExposed',
          items: [method('search', '(value: string) => void', '更新搜索值且不触发 search 事件')],
        },
      ],
      slotGroups: [
        {
          name: 'Transfer',
          items: [
            slot('sourceItem', 'TransferSourceItemProps', '左侧候选条目'),
            slot('selectedItem', 'TransferSelectedItemProps', '右侧已选条目'),
            slot('sourcePanel', 'TransferSourcePanelProps', '完整左侧面板'),
            slot('selectedPanel', 'TransferSelectedPanelProps', '完整右侧面板'),
            slot('sourceHeader', 'TransferSourceHeaderProps', '左侧面板头部'),
            slot('selectedHeader', 'TransferSelectedHeaderProps', '右侧面板头部'),
            slot('emptyLeft', '{}', '左侧无数据内容'),
            slot('emptyRight', '{}', '右侧无数据内容'),
            slot('emptySearch', '{}', '无搜索结果内容'),
          ],
        },
      ],
      textRewrites: [
        ['GroupItem继承Item的所有属性', 'GroupItem 是分组容器，不继承 Item 属性。'],
        [
          '但你需要自行实现拖拽逻辑，你可以借助社区中拖拽类工具库 [dnd-kit](https://github.com/clauderic/dnd-kit) 或者 [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc)，快速实现功能。关于两者选型，这是我们的一些建议',
          '但你需要自行实现拖拽逻辑；Vue 自定义面板可使用浏览器原生 HTML5 drag events 或 Vue 拖拽库。',
        ],
        [
          '- 两者均由同一作者维护， dnd-kit 是 react-sortable-hoc 的接任产品\n- react-sortable-hoc 的 API 设计更加高内聚，在简单场景上代码更加简洁。但它强依赖了 findDOMNode API，在未来的 React 版本中会被废弃。同时该库最近两年已经处于不维护的状态。\n- dnd-kit 相对而言，有一定上手门槛，但它的自由度更高，扩展性更强，并且仍处于维护状态。我们更推荐使用\n\n更多 DIff 信息可查阅 [react-sortable-hoc](https://github.com/clauderic/react-sortable-hoc) 的 Github 主页',
          '',
        ],
        [
          '另外，要支持拖拽排序，你需要在拖拽排序结束后，将 oldIndex、newIndex 作为入参，调用 onSortEnd',
          '拖拽排序结束后，将 `oldIndex`、`newIndex` 传给自定义面板作用域中的 `onSortEnd`。',
        ],
        ['使用 react-sortable-hoc 的示例：', '自定义面板需自行完成拖拽交互。'],
        [
          '使用 dnd-kit 的示例如下，需要用到的核心依赖有 @dnd-kit/sortable， @dnd-kit/core，其中核心 hooks 为 useSortable，使用说明如下',
          '自定义拖拽实现应在排序结束后回传最终索引。',
        ],
        [
          '绑定在组件实例上的方法，可以通过 ref 调用实现某些特殊交互',
          '可通过模板 ref 调用公开实例方法。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/input/autocomplete',
    {
      sources: ['packages/ui/src/auto-complete/types.ts', 'packages/ui/src/auto-complete/index.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/auto-complete/types.ts',
          interfaces: ['AutoCompleteProps'],
          descriptions: {
            ariaDescribedby: '输入框 aria-describedby',
            ariaErrormessage: '输入框 aria-errormessage',
            ariaInvalid: '输入框 aria-invalid；error 校验状态会强制为 true',
            ariaLabel: '输入框 aria-label',
            ariaLabelledby: '输入框 aria-labelledby',
            ariaRequired: '输入框 aria-required',
            class: 'Vue class 入口',
            dropdownMatchSelectWidth: '下拉菜单最小宽度是否匹配触发器',
            id: '触发器 id',
            insetLabel: '内嵌标签 VNode；insetLabel 插槽优先',
            insetLabelId: '内嵌标签元素 id',
            modelValue: '默认 v-model 值',
            mouseEnterDelay: '浮层鼠标进入延时，单位毫秒',
            mouseLeaveDelay: '浮层鼠标离开延时，单位毫秒',
            onChangeWithObject: 'change 事件是否返回完整选项对象',
            renderItem: '候选项渲染 callback prop；option 插槽优先',
            renderSelectedItem: '选中项文本渲染 callback prop',
            stopPropagation: '浮层事件是否停止冒泡',
            value: '兼容受控值，可通过 v-model:value 绑定',
          },
          defaults: {
            autoAdjustOverflow: 'true',
            autoFocus: 'false',
            data: '[]',
            defaultActiveFirstOption: 'false',
            defaultOpen: 'false',
            disabled: 'false',
            dropdownMatchSelectWidth: 'true',
            emptyContent: 'null',
            loading: 'false',
            maxHeight: '300',
            motion: 'true',
            mouseEnterDelay: '0',
            mouseLeaveDelay: '0',
            onChangeWithObject: 'false',
            onSelectWithObject: 'false',
            position: '`bottomLeft`',
            showClear: 'false',
            size: '`default`',
            stopPropagation: 'true',
            validateStatus: '`default`',
            zIndex: '1030',
          },
        },
      ],
      models: [
        '`v-model` 对应 `modelValue` 与 `update:modelValue`；兼容入口 `value` 可通过 `v-model:value` 绑定，两个值同时存在时 `modelValue` 优先。',
      ],
      usageNotes: [
        '`renderItem` 与 `renderSelectedItem` 是保留的 callback props，不是组件事件。',
        'clearIcon、emptyContent、insetLabel、prefix、suffix 同时支持 VNode prop 和同名插槽；option 与 trigger 提供 Vue 原生作用域插槽。',
        'AutoComplete.Option 同时作为静态成员和 `AutoCompleteOption` 具名导出。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: ['onBlur', 'onChange', 'onFocus', 'onKeyDown', 'onSearch', 'onSelect'],
        },
      ],
      eventGroups: [
        {
          name: 'AutoComplete',
          items: [
            event('blur', '[event: FocusEvent]', '输入框失焦'),
            event('change', '[value: AutoCompletePrimitive]', '输入值或选中项变化'),
            event('clear', '[]', '清除输入值'),
            event('dropdownVisibleChange', '[visible: boolean]', '下拉菜单显隐变化'),
            event('focus', '[event: FocusEvent]', '输入框聚焦'),
            event('keydown', '[event: KeyboardEvent]', '输入框键盘事件'),
            event('search', '[value: string]', '搜索输入变化'),
            event('select', '[value: AutoCompletePrimitive | AutoCompleteDataItem]', '选择候选项'),
            event('update:modelValue', '[value: AutoCompletePrimitive]', '更新默认 v-model'),
            event('update:value', '[value: AutoCompletePrimitive]', '更新兼容 value 绑定'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'AutoCompleteExposed',
          items: [
            method('close', '() => void', '关闭下拉菜单'),
            method('focus', '() => void', '聚焦输入框'),
            method('open', '() => void', '打开下拉菜单'),
            method('search', '(value: string) => void', '更新搜索输入'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'AutoComplete',
          items: [
            slot('clearIcon', '{}', '清除图标'),
            slot('emptyContent', '{}', '无候选项内容'),
            slot('insetLabel', '{}', '内嵌标签'),
            slot('option', 'AutoCompleteOptionSlotProps', '自定义候选项'),
            slot('prefix', '{}', '输入框前缀'),
            slot('suffix', '{}', '输入框后缀'),
            slot('trigger', 'AutoCompleteTriggerSlotProps', '自定义完整触发器'),
          ],
        },
      ],
      textRewrites: [
        [
          '通过 onSearch 监听用户输入，将输入建议通过更新 props.data 传入。通过 onChange 保持受控，当输入框变化/选中输入项时会触发 onChange',
          '通过 `search` 事件监听用户输入并更新 `data`，使用 `v-model` 保持受控；输入或选中候选项时会触发 `change` 事件。',
        ],
        [
          '从 onSearch 中获取用户输入值，动态更新 data 值',
          '从 `search` 事件获取用户输入值，动态更新 `data`。',
        ],
        [
          '通过 renderItem 可以自定义候选项的渲染',
          '优先使用 `option` 作用域插槽自定义候选项；迁移代码也可继续使用 `renderItem` callback prop。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/plus/chat',
    {
      sources: ['packages/ui/src/chat/types.ts', 'packages/ui/src/chat/index.ts'],
      propSections: [
        {
          heading: 'API 参考',
          level: 2,
          source: 'packages/ui/src/chat/types.ts',
          interfaces: ['ChatProps'],
          descriptions: {
            bottomSlot: '底部 VNode；bottom 插槽优先',
            chatBoxRenderConfig: '会话框各区域的渲染 callback 配置；同名插槽优先',
            class: 'Vue class 入口',
            customMarkDownComponents: '传给 MarkdownRender 的自定义 Vue 组件映射',
            renderDivider: '分割线渲染 callback prop；divider 插槽优先',
            renderHintBox: '提示项渲染 callback prop；hint 插槽优先',
            renderInputArea: '输入区渲染 callback prop；input-area 插槽优先',
            topSlot: '顶部 VNode；top 插槽优先',
          },
          defaults: {
            align: '`leftRight`',
            chats: '[]',
            enableUpload: 'true',
            escapeHtml: 'true',
            hints: '[]',
            mode: '`bubble`',
            sendHotKey: '`enter`',
            showClearContext: 'false',
            showStopGenerate: 'false',
          },
        },
        {
          heading: 'RoleConfig',
          level: 3,
          source: 'packages/ui/src/chat/types.ts',
          interfaces: ['ChatRoleConfig'],
        },
        {
          heading: 'Metadata',
          level: 3,
          source: 'packages/ui/src/chat/types.ts',
          interfaces: ['ChatRoleMetadata'],
          descriptions: { avatar: '头像地址或 VNode' },
        },
        {
          heading: 'Message',
          level: 3,
          source: 'packages/ui/src/chat/types.ts',
          interfaces: ['ChatMessage'],
          descriptions: {
            dislike: '是否已提交负向反馈',
            like: '是否已提交正向反馈',
          },
          defaults: { content: '—', status: '`complete`' },
        },
      ],
      models: [
        '`v-model:chats` 对应 `chats` 与 `update:chats`；列表变更时同时触发 `chats-change`。',
      ],
      usageNotes: [
        '`chatBoxRenderConfig`、`renderDivider`、`renderHintBox` 与 `renderInputArea` 是保留的 callback props，不是组件事件。',
        'topSlot、bottomSlot 兼容 VNode prop；Vue 代码优先使用 top、bottom 及其他作用域插槽。',
        '`enableUpload` 对象可分别控制 pasteUpload、dragUpload、clickUpload；`uploadProps` 与 `uploadTipProps` 继续作为嵌套配置传入。',
      ],
      eventSections: [
        {
          heading: 'API 参考',
          level: 2,
          rows: [
            'onChatsChange',
            'onClear',
            'onHintClick',
            'onInputChange',
            'onMessageBadFeedback',
            'onMessageCopy',
            'onMessageDelete',
            'onMessageGoodFeedback',
            'onMessageReset',
            'onMessageSend',
            'onStopGenerator',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Chat',
          items: [
            event('update:chats', '[chats: ChatMessage[]]', '更新 chats 绑定'),
            event('chats-change', '[chats: ChatMessage[]]', '对话消息列表变化'),
            event('message-delete', '[message?: ChatMessage]', '删除消息'),
            event('message-reset', '[message?: ChatMessage]', '重置消息'),
            event('message-copy', '[message?: ChatMessage]', '复制消息'),
            event('message-good-feedback', '[message?: ChatMessage]', '提交消息正向反馈'),
            event('message-bad-feedback', '[message?: ChatMessage]', '提交消息负向反馈'),
            event('message-send', '[content: string, attachment: UploadFileItem[]]', '发送消息'),
            event('input-change', '[payload: ChatInputChangePayload]', '输入内容或附件变化'),
            event('hint-click', '[hint: string]', '点击提示词'),
            event('clear', '[]', '清除上下文'),
            event('stop-generator', '[event?: Event]', '停止生成'),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'ChatExposed',
          items: [
            method('resetMessage', '() => void', '重置最后一条消息'),
            method('clearContext', '() => void', '清除上下文'),
            method('scrollToBottom', '(animation?: boolean) => void', '滚动到列表底部'),
            method(
              'sendMessage',
              '(content: string, attachment?: UploadFileItem[]) => void',
              '发送消息',
            ),
            method('getContainerElement', '() => HTMLDivElement | null', '获取滚动容器'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Chat',
          items: [
            slot('top', '{}', '顶部内容'),
            slot('bottom', '{}', '底部内容'),
            slot(
              'hint',
              '{ content: string, index: number, onHintClick: () => void }',
              '自定义提示项',
            ),
            slot('divider', '{ message: ChatMessage }', '自定义分割线'),
            slot('input-area', 'ChatRenderInputAreaProps', '自定义输入区'),
            slot('chat-box-title', 'ChatRenderTitleProps', '自定义会话标题'),
            slot('chat-box-avatar', 'ChatRenderAvatarProps', '自定义会话头像'),
            slot('chat-box-content', 'ChatRenderContentProps', '自定义会话内容'),
            slot('chat-box-action', 'ChatRenderActionProps', '自定义会话操作区'),
            slot('chat-box', 'ChatRenderFullBoxProps', '自定义完整会话项'),
          ],
        },
      ],
      textRewrites: [
        ['### API', '## API 参考'],
        ['#### RoleConfig', '### RoleConfig'],
        ['#### Metadata', '### Metadata'],
        ['#### Message', '### Message'],
        ['#### Content', '### Content'],
        ['#### Methods', '### Methods'],
        [
          '也可通过 JSX 实现更加复杂定制化的文档撰写与展示需求。',
          '也可通过 Vue 组件映射实现更复杂的文档撰写与展示需求。',
        ],
        [
          '通过设置 `chats` 和 `onChatsChange`，`onMessageSend` 实现基础对话显示和交互。',
          '通过 `v-model:chats` 展示并更新对话列表，通过 `message-send` 事件处理消息发送。',
        ],
        [
          '`showStopGenerate` 参数可用于设置是否展示停止生成按钮，默认为 `false`。 可以在 `onStopGenerator` 中处理停止生成逻辑。',
          '`showStopGenerate` 可设置是否展示停止生成按钮，默认为 `false`；通过 `stop-generator` 事件处理停止生成逻辑。',
        ],
        [
          '也可以通过 ref 调用 `clearContext` 方法清除上下文。',
          '也可以通过模板 ref 调用 `clearContext` 方法清除上下文。',
        ],
        [
          '自定义渲染头像和标题，可通过 `renderChatBoxAvatar` 和 `renderChatBoxTitle` 实现。',
          '自定义头像和标题优先使用 `chat-box-avatar` 与 `chat-box-title` 插槽；迁移代码也可继续使用对应 callback。',
        ],
        [
          '鼠标移动到会话上，即可显示会话操作区，通过 `renderChatBoxAction` 自定义渲染操作区',
          '鼠标移动到会话上即可显示操作区；优先使用 `chat-box-action` 插槽自定义，迁移代码也可继续使用 `renderChatBoxAction` callback prop。',
        ],
        [
          '通过 `renderChatBoxContent` 自定义操作区域',
          '优先使用 `chat-box-content` 插槽自定义会话内容，迁移代码也可继续使用 `renderChatBoxContent` callback prop。',
        ],
        [
          '使用 `renderFullChatBox` 自定义渲染整个会话框',
          '优先使用 `chat-box` 插槽自定义完整会话项，迁移代码也可继续使用 `renderFullChatBox` callback prop。',
        ],
        [
          '可通过 `renderInputArea` 自定义渲染输入框，参数如下',
          '优先使用 `input-area` 作用域插槽自定义输入区，迁移代码也可继续使用 `renderInputArea` callback prop。',
        ],
        [
          '通过 `hints` 可设置提示区域内容, 点击提示内容后，提示内容将成为新的用户输入内容，并触发 `onHintClick` 回调。',
          '通过 `hints` 设置提示区域内容；点击提示项后会触发 `hint-click` 事件。',
        ],
        [
          '通过 `renderHintBox` 自定义提示区域内容， 参数如下',
          '优先使用 `hint` 作用域插槽自定义提示项；迁移代码也可继续使用 `renderHintBox` callback prop。',
        ],
        [
          '| scrollToBottom(animation: boolean) | 滚动到最底部, animation 为 true，则有动画，反之无动画 |',
          '| scrollToBottom(animation?: boolean) | 滚动到最底部，animation 为 true 时使用动画 |',
        ],
        [
          '| sendMessage(content: string, attachment: FileItem[]) |发送消息 |',
          '| sendMessage(content: string, attachment?: UploadFileItem[]) | 发送消息 |\n| getContainerElement | 获取滚动容器 |',
        ],
      ],
    },
  ],
  [
    '/zh-CN/show/image',
    {
      sources: ['packages/ui/src/image/types.ts', 'packages/ui/src/image/index.ts'],
      propSections: [
        {
          heading: 'Image',
          level: 3,
          source: 'packages/ui/src/image/types.ts',
          interfaces: ['ImageProps'],
          descriptions: {
            class: 'Vue class 入口',
            fallback: '加载失败内容；fallback 插槽优先',
            placeholder: '加载中内容；placeholder 插槽优先',
            preview: '是否启用预览，或传入 ImagePreviewOptions',
            setDownloadName: '下载文件名 callback prop',
          },
          defaults: { preview: 'true' },
        },
        {
          heading: 'ImagePreview',
          level: 3,
          source: 'packages/ui/src/image/types.ts',
          interfaces: ['ImagePreviewProps'],
          descriptions: {
            class: 'Vue class 入口',
            currentIndex: '当前图片下标，可通过 v-model:currentIndex 绑定',
            renderCloseIcon: '关闭图标渲染 callback prop；closeIcon 插槽优先',
            renderHeader: '顶部信息渲染 callback prop；header 插槽优先',
            renderLeftIcon: '向左图标渲染 callback prop；leftIcon 插槽优先',
            renderPreviewMenu: '底部菜单渲染 callback prop；previewMenu 插槽优先',
            renderRightIcon: '向右图标渲染 callback prop；rightIcon 插槽优先',
            setDownloadName: '下载文件名 callback prop',
            visible: '预览可见性，可通过 v-model:visible 绑定',
          },
          defaults: {
            closable: 'true',
            closeOnEsc: 'true',
            defaultCurrentIndex: '0',
            defaultVisible: 'false',
            disableDownload: 'false',
            infinite: 'false',
            lazyLoad: 'true',
            lazyLoadMargin: '`0px 100px 100px 0px`',
            maskClosable: 'true',
            maxZoom: '5',
            minZoom: '0.1',
            preLoad: 'true',
            preLoadGap: '2',
            showTooltip: 'false',
            src: '[]',
            viewerVisibleDelay: '10000',
            zIndex: '1070',
            zoomStep: '0.1',
          },
        },
        {
          heading: 'MenuProps',
          level: 3,
          source: 'packages/ui/src/image/types.ts',
          interfaces: ['ImagePreviewMenuProps'],
        },
      ],
      models: [
        '`ImagePreview` 的 `v-model:visible` 对应 `visible` 与 `update:visible`。',
        '`ImagePreview` 的 `v-model:currentIndex` 对应 `currentIndex` 与 `update:currentIndex`。',
      ],
      usageNotes: [
        '`Image` 继续透传未占用的原生 img 属性；fallback、placeholder 同时支持 VNode prop 与同名插槽。',
        '`Image.preview` 对象中的 onChange、onClose、onDownload、onDownloadError、onNext、onPrev、onRatioChange、onRotateLeft、onVisibleChange、onZoomIn、onZoomOut 是嵌套 callback 配置，不是 Image 组件事件。',
        '`ImagePreview` 的五个 renderXxx 与 `setDownloadName` 是保留的 callback props；同名插槽优先。预览层通过 Teleport 挂载到 getPopupContainer 或 document.body。',
      ],
      eventSections: [
        {
          heading: 'Image',
          level: 3,
          rows: ['onClick', 'onError', 'onLoad'],
        },
        {
          heading: 'ImagePreview',
          level: 3,
          rows: [
            'onChange',
            'onClose',
            'onDownload',
            'onDownloadError',
            'onNext',
            'onPrev',
            'onRotateLeft',
            'onVisibleChange',
            'onZoomIn',
            'onZoomOut',
          ],
        },
      ],
      eventGroups: [
        {
          name: 'Image',
          items: [
            event('click', '[event: MouseEvent]', '点击图片'),
            event('error', '[event: Event]', '图片加载失败'),
            event('load', '[event: Event]', '图片加载成功'),
          ],
        },
        {
          name: 'ImagePreview',
          items: [
            event('change', '[index: number]', '当前图片变化'),
            event('close', '[]', '关闭预览'),
            event('download', '[src: string, index: number]', '下载图片'),
            event('downloadError', '[src: string]', '图片下载失败'),
            event('next', '[index: number]', '切换到下一张'),
            event('prev', '[index: number]', '切换到上一张'),
            event('ratioChange', '[type: ImageRatioType]', '显示比例变化'),
            event('rotateLeft', '[angle: number]', '图片旋转'),
            event('update:currentIndex', '[index: number]', '更新当前图片下标绑定'),
            event('update:visible', '[visible: boolean]', '更新预览可见性绑定'),
            event('visibleChange', '[visible: boolean]', '预览可见性变化'),
            event('zoomIn', '[zoom: number]', '图片放大'),
            event('zoomOut', '[zoom: number]', '图片缩小'),
          ],
        },
      ],
      slotGroups: [
        {
          name: 'Image',
          items: [slot('fallback', '{}', '加载失败内容'), slot('placeholder', '{}', '加载中内容')],
        },
        {
          name: 'ImagePreview',
          items: [
            slot('closeIcon', '{}', '关闭图标'),
            slot('default', '{}', 'Image 子组件或其他内容'),
            slot('header', '{ title: VNodeChild }', '预览顶部信息'),
            slot('leftIcon', '{ index: number }', '向左切换图标'),
            slot('previewMenu', 'ImagePreviewMenuProps', '预览底部菜单'),
            slot('rightIcon', '{ index: number }', '向右切换图标'),
          ],
        },
      ],
      textRewrites: [
        [
          '预览组件 ImagePreview 可以单独使用，通过 `visible` 和 `onVisibleChange` 控制是否预览，通过 `src` 传入可以预览的图片',
          'ImagePreview 可单独使用，通过 `v-model:visible` 控制预览显隐，并通过 `src` 传入图片列表。',
        ],
        [
          '可以使用 `renderPreviewMenu` 自定义预览底部操作区域',
          '优先使用 `previewMenu` 作用域插槽自定义预览底部操作区，迁移代码也可继续使用 `renderPreviewMenu` callback prop。',
        ],
        [
          '如果想基于默认底部操作区域自定义预览底部操作区域， 可以通过 renderPreviewMenu 的 menuItems 获取默认的 VNodeChild, menuItems 是一个 VNodeChild 数组，顺序和默认底部操作栏功能区域内容顺序一致，menuItems 参数从 v2.40.0 开始支持',
          '基于默认底部操作区扩展时，可从 `previewMenu` 插槽参数的 `menuItems` 获取默认 VNodeChild 数组；该参数自 v2.40.0 起支持。',
        ],
        [
          '通过 `renderHeader` 可以自定义预览顶部展示区',
          '优先使用 `header` 作用域插槽自定义预览顶部展示区，迁移代码也可继续使用 `renderHeader` callback prop。',
        ],
      ],
    },
  ],
  [
    '/zh-CN/ai/aiChatInput',
    {
      sources: ['packages/ui/src/ai-chat-input/types.ts', 'packages/ui/src/ai-chat-input/index.ts'],
      propSections: [
        {
          heading: 'AIChatInput',
          level: 3,
          source: 'packages/ui/src/ai-chat-input/types.ts',
          interfaces: ['AIChatInputProps'],
          descriptions: {
            class: 'Vue class 入口',
            immediatelyRender: '兼容 prop；Vue Tiptap 仅在 mounted 后创建编辑器',
            keepSkillAfterSend: '生成态清空内容时是否保留当前技能',
            placeholder: '输入框占位符或 Tiptap placeholder callback',
            renderActionArea: '操作区渲染 callback prop；action 插槽优先',
            renderConfigureArea: '配置区渲染 callback prop；configure 插槽优先',
            renderReference: '引用项渲染 callback prop；reference 插槽优先',
            renderSkillItem: '技能项渲染 callback prop；skill 插槽优先',
            renderSuggestionItem: '建议项渲染 callback prop；suggestion 插槽优先',
            renderTemplate: '模板渲染 callback prop；template 插槽优先',
            renderTopSlot: '顶部区域渲染 callback prop；top 插槽优先',
            renderUploadButton: '上传按钮渲染 callback prop；uploadButton 插槽优先',
            transformer: '自定义 Tiptap 节点转换 callback 映射',
          },
          defaults: {
            canSend: '由输入内容、附件和引用决定',
            clearContentOnGenerating: 'true',
            dropdownMatchTriggerWidth: 'true',
            generating: 'false',
            keepSkillAfterSend: 'false',
            round: 'true',
            sendHotKey: '`enter`',
            showPlaceholderWhenSkillOnly: 'false',
            showReference: 'true',
            showTemplateButton: 'false',
            showUploadButton: 'true',
            showUploadFile: 'true',
            topSlotPosition: '`top`',
          },
        },
      ],
      usageNotes: [
        'renderReference、renderUploadButton、renderTopSlot、renderConfigureArea、renderActionArea、renderSuggestionItem、renderSkillItem 与 renderTemplate 是保留的迁移 callback props；Vue 代码优先使用对应作用域插槽。',
        '`placeholder` 函数、`transformer` 映射以及 uploadProps、popoverProps、uploadTipProps 内部函数均为配置 callback，不是组件事件。',
        '`AIChatInput.Configure` 提供 Item、Button、Mcp、RadioButton、Select 静态成员；配置容器的 `value` 可通过 `v-model:value` 绑定。',
      ],
      eventSections: [
        {
          heading: 'AIChatInput',
          level: 3,
          rows: [
            'onBlur',
            'onConfigureChange',
            'onContentChange',
            'onFocus',
            'onMessageSend',
            'onPaste',
            'onReferenceClick',
            'onReferenceDelete',
            'onSkillChange',
            'onStopGenerate',
            'onSuggestClick',
            'onTemplateVisibleChange',
            'onUploadChange',
          ],
        },
        { heading: 'Configure.Mcp', level: 3, rows: ['onConfigureButtonClick'] },
      ],
      eventGroups: [
        {
          name: 'AIChatInput',
          items: [
            event('contentChange', '[contents: AIChatInputContent[]]', '富文本内容变化'),
            event('focus / blur', '[event: FocusEvent]', '富文本编辑器聚焦或失焦'),
            event('paste', '[event: ClipboardEvent]', '富文本编辑器发生粘贴'),
            event('referenceDelete', '[reference: Reference]', '删除引用'),
            event('referenceClick', '[reference: Reference]', '点击引用'),
            event('uploadChange', '[payload: UploadChangePayload]', '附件列表变化'),
            event('messageSend', '[content: MessageContent]', '发送消息'),
            event('stopGenerate', '[]', '停止生成'),
            event(
              'configureChange',
              '[value: LeftMenuChangeProps, changedValue?: LeftMenuChangeProps]',
              '配置值变化',
            ),
            event('suggestClick', '[suggestion: Suggestion]', '选择建议项'),
            event('skillChange', '[skill: Skill | undefined]', '技能变化'),
            event('templateVisibleChange', '[visible: boolean]', '模板面板显隐变化'),
          ],
        },
        {
          name: 'AIChatInput.Configure',
          items: [
            event(
              'change',
              '[value: LeftMenuChangeProps, changedValue?: LeftMenuChangeProps]',
              '配置值变化',
            ),
            event('update:value', '[value: LeftMenuChangeProps]', '更新 value 绑定'),
          ],
        },
        {
          name: 'AIChatInput.Configure.Mcp',
          items: [event('configureButtonClick', '[]', '点击 MCP 配置按钮')],
        },
      ],
      methodGroups: [
        {
          name: '包导出',
          items: [
            method(
              'getConfigureItem',
              '(component: Component, options?: AIChatInputGetConfigureItemOptions) => AIChatInputConfigureItemComponent',
              '将自定义 Vue 组件接入 Configure 状态',
            ),
          ],
        },
        {
          name: 'AIChatInput 静态成员',
          items: [
            method(
              'getCustomSlotAttribute',
              '() => Record<string, unknown>',
              '返回自定义 Tiptap slot 节点属性',
            ),
          ],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'AIChatInputExposed',
          items: [
            method('changeTemplateVisible', '(visible: boolean) => void', '切换模板面板'),
            method('deleteContent', '(content: AIChatInputContent) => void', '删除富文本内容项'),
            method('deleteUploadFile', '(item: Attachment) => void', '删除附件'),
            method(
              'focusEditor',
              "(pos?: Parameters<Editor['commands']['focus']>[0]) => void",
              '聚焦编辑器',
            ),
            method('getEditor', '() => Editor | undefined', '获取 Tiptap Editor'),
            method('setContent', '(content: TiptapContent) => void', '设置编辑器内容'),
            method('setContentWhileSaveTool', '(content: string) => void', '保留技能并设置内容'),
          ],
        },
        {
          name: 'AIChatInputConfigureExposed',
          items: [method('getConfigureValue', '() => LeftMenuChangeProps', '获取当前配置值')],
        },
      ],
      slotGroups: [
        {
          name: 'AIChatInput',
          items: [
            slot('reference', '{ reference: Reference }', '自定义引用项'),
            slot('uploadButton', 'RenderUploadButtonProps', '自定义上传按钮'),
            slot('top', 'RenderTopSlotProps', '自定义顶部区域'),
            slot('configure', '{ className: string }', '自定义配置区'),
            slot('action', 'ActionAreaProps', '自定义操作区'),
            slot('suggestion', 'RenderSuggestionItemProps', '自定义建议项'),
            slot('skill', 'RenderSkillItemProps', '自定义技能项'),
            slot(
              'template',
              '{ skill: Skill | undefined; onTemplateClick(content: string): void }',
              '自定义模板面板',
            ),
          ],
        },
        {
          name: 'AIChatInput.Configure.Item',
          items: [
            slot('default', '{ value: unknown; onChange(value: unknown): void }', '自定义配置控件'),
          ],
        },
      ],
      textRewrites: [
        ['`onUploadChange` 获取文件上传变化', '`upload-change` 事件获取文件上传变化'],
        [
          '`onContentChange` 输入框内容变化时的回调函数，参数为当前输入框的内容',
          '`content-change` 事件在输入框内容变化时返回当前富文本内容',
        ],
        ['会触发 `onMessageSend` 回调函数', '会触发 `message-send` 事件'],
        [
          '用户可在 `onMessageSend` 中根据判断是否设置 `generating`',
          '用户可在 `message-send` 监听器中按需设置 `generating`',
        ],
        [
          '会触发 `onStopGenerate` 回调函数，用户可在该回调函数中处理停止生成的逻辑',
          '会触发 `stop-generate` 事件，用户可在监听器中处理停止生成逻辑',
        ],
        ['可以通过 ref 方法', '可以通过模板 ref 的公开方法'],
        [
          '`renderReference` 自定义单个引用内容的渲染。',
          '`reference` 作用域插槽自定义单个引用内容；迁移代码也可继续使用 `renderReference` callback prop。',
        ],
        ['`onReferenceDelete` 处理引用内容的删除。', '`reference-delete` 事件处理引用内容的删除。'],
        ['`onReferenceClick` 处理引用内容的点击。', '`reference-click` 事件处理引用内容的点击。'],
        [
          '可通过 `renderConfigureArea` API 自定义输入框的操作按钮。',
          '可通过 `configure` 插槽自定义输入框的配置区；迁移代码也可继续使用 `renderConfigureArea` callback prop。',
        ],
        [
          '通过 `onConfigureChange` API 监听配置项的变化',
          '通过 `configure-change` 事件监听配置项的变化',
        ],
        [
          '通过 `renderActionArea` API 自定义操作区域',
          '通过 `action` 作用域插槽自定义操作区域；迁移代码也可继续使用 `renderActionArea` callback prop',
        ],
        [
          '通过 `renderSuggestionItem` API 自定义建议列表的展示。',
          '通过 `suggestion` 作用域插槽自定义建议项；迁移代码也可继续使用 `renderSuggestionItem` callback prop。',
        ],
        [
          '用户可以通过 `renderTemplate`API 自定义模版的展示。',
          '用户可以通过 `template` 作用域插槽自定义模板展示；迁移代码也可继续使用 `renderTemplate` callback prop。',
        ],
        [
          '用户可以通过 `renderTopSlot` API 自定义渲染顶部区域',
          '用户可以通过 `top` 作用域插槽自定义顶部区域；迁移代码也可继续使用 `renderTopSlot` callback prop',
        ],
        ['在 `onContentChange` 中得到的该节点数据', '在 `content-change` 事件中得到的该节点数据'],
      ],
    },
  ],
  [
    '/zh-CN/ai/sidebar',
    {
      sources: ['packages/ui/src/sidebar/types.ts', 'packages/ui/src/sidebar/index.ts'],
      propSections: [
        {
          heading: 'Container',
          level: 3,
          source: 'packages/ui/src/sidebar/types.ts',
          interfaces: ['SidebarContainerProps'],
          descriptions: {
            ...sidebarContainerDescriptions,
          },
          defaults: { ...sidebarContainerDefaults },
        },
        {
          heading: 'MCPConfigure',
          level: 3,
          sources: [
            { source: 'packages/ui/src/sidebar/types.ts', interfaces: ['SidebarContainerProps'] },
            {
              source: 'packages/ui/src/sidebar/types.ts',
              interfaces: ['SidebarMCPConfigureContentProps'],
            },
          ],
          descriptions: {
            ...sidebarContainerDescriptions,
            renderItem: 'MCP 项渲染 callback prop；item 插槽优先',
          },
          defaults: { ...sidebarContainerDefaults },
        },
        {
          heading: 'SidebarMCPOption',
          level: 4,
          source: 'packages/ui/src/sidebar/types.ts',
          interfaces: ['SidebarMCPOption'],
        },
        {
          heading: 'Annotation',
          level: 3,
          sources: [
            { source: 'packages/ui/src/sidebar/types.ts', interfaces: ['SidebarContainerProps'] },
            {
              source: 'packages/ui/src/sidebar/types.ts',
              interfaces: ['SidebarAnnotationContentProps'],
            },
          ],
          descriptions: {
            ...sidebarContainerDescriptions,
            renderItem: '参考来源渲染 callback prop；item 插槽优先',
          },
          defaults: { ...sidebarContainerDefaults },
        },
        {
          heading: 'AnnotationItem',
          level: 4,
          source: 'packages/ui/src/sidebar/types.ts',
          interfaces: ['SidebarAnnotationItem'],
          descriptions: {
            onClick: '数据项点击 callback；未提供 Annotation click 监听器时使用',
          },
        },
        {
          heading: 'Sidebar',
          level: 3,
          sources: [
            { source: 'packages/ui/src/sidebar/types.ts', interfaces: ['SidebarContainerProps'] },
            { source: 'packages/ui/src/sidebar/types.ts', interfaces: ['SidebarProps'] },
          ],
          descriptions: {
            ...sidebarContainerDescriptions,
            activeKey: '当前导航项',
            detailContent: '内置 code/file 详情数据',
            fileEditable: '文件详情是否可编辑',
            imgUploadProps: '文件详情中的图片上传配置',
            mode: '主视图、代码、文件或自定义详情模式',
            options: '主视图导航项',
            renderDetailContent: '详情区渲染 callback prop；detail-content 插槽优先',
            renderDetailHeader: '详情头渲染 callback prop；detail-header 插槽优先',
            renderMainContent: '主内容渲染 callback prop；main-content 插槽优先',
            renderOptionItem: '导航项渲染 callback prop；option 插槽优先',
          },
          defaults: { ...sidebarContainerDefaults, fileEditable: 'true', mode: '`main`' },
        },
        {
          heading: 'Code',
          level: 3,
          sources: [
            { source: 'packages/ui/src/sidebar/types.ts', interfaces: ['SidebarCollapseProps'] },
            { source: 'packages/ui/src/sidebar/types.ts', interfaces: ['SidebarCodeContentProps'] },
          ],
          descriptions: { class: 'Vue class 入口' },
        },
        {
          heading: 'CodeItemProps',
          level: 4,
          source: 'packages/ui/src/sidebar/types.ts',
          interfaces: ['SidebarCodeItemProps'],
          descriptions: {
            codeHighlightProps: 'CodeHighlight 配置',
            content: '代码或 JSON 内容',
            isJson: '是否使用 JsonViewer 展示',
            jsonViewerProps: 'JsonViewer 配置',
            key: '唯一标识',
            language: '代码语言',
            name: '展示名称',
          },
        },
        {
          heading: 'FileContent',
          level: 4,
          sources: [
            { source: 'packages/ui/src/sidebar/types.ts', interfaces: ['SidebarCollapseProps'] },
            { source: 'packages/ui/src/sidebar/types.ts', interfaces: ['SidebarFileContentProps'] },
          ],
          descriptions: { class: 'Vue class 入口' },
        },
        {
          heading: 'FileItemProps',
          level: 4,
          source: 'packages/ui/src/sidebar/types.ts',
          interfaces: ['SidebarFileItemProps'],
          descriptions: {
            class: 'Vue class 入口',
            content: '富文本 HTML 内容',
            editable: '是否允许编辑',
            extensions: '附加 Tiptap extensions',
            imgUploadProps: '富文本图片上传配置',
            key: '唯一标识',
            name: '展示名称',
            style: '自定义内联样式',
          },
          defaults: { editable: 'true' },
        },
      ],
      usageNotes: [
        'renderHeader、renderOptionItem、renderMainContent、renderDetailHeader、renderDetailContent 与各 renderItem 是保留的迁移 callback props；Vue 代码优先使用对应插槽。',
        '`containerRef`、MCP filter、SidebarImageUploadOptions.getUploadImageSrc 与 SidebarAnnotationItem.onClick 是真实 callback props，不是组件事件。',
        'Sidebar 提供 Container、CodeContent、CodeItem、FileContent、FileItem 静态成员；Annotation 提供 AnnotationContent 静态成员，MCPConfigure 作为具名组件导出。',
      ],
      eventSections: [
        { heading: 'Container', level: 3, rows: ['afterVisibleChange', 'onCancel'] },
        {
          heading: 'MCPConfigure',
          level: 3,
          rows: [
            'afterVisibleChange',
            'onAddClick',
            'onCancel',
            'onConfigureClick',
            'onEditClick',
            'onSearch',
            'onStatusChange',
          ],
        },
        {
          heading: 'Annotation',
          level: 3,
          rows: ['afterVisibleChange', 'onCancel', 'onChange', 'onClick'],
        },
        {
          heading: 'Sidebar',
          level: 3,
          rows: [
            'afterVisibleChange',
            'onActiveOptionChange',
            'onBackWard',
            'onCancel',
            'onDetailContentCopy',
            'onFileContentChange',
          ],
        },
        { heading: 'Code', level: 3, rows: ['onChange', 'onExpand'] },
        { heading: 'FileContent', level: 4, rows: ['onChange', 'onExpand'] },
        { heading: 'FileItemProps', level: 4, rows: ['onContentChange'] },
      ],
      eventGroups: [
        {
          name: 'Sidebar.Container',
          items: [
            event('cancel', '[event: MouseEvent | KeyboardEvent]', '点击关闭或按下 Escape'),
            event('after-visible-change', '[visible: boolean]', '显隐动画完成'),
          ],
        },
        {
          name: 'MCPConfigure',
          items: [
            event('cancel', '[event: MouseEvent | KeyboardEvent]', '点击关闭或按下 Escape'),
            event('after-visible-change', '[visible: boolean]', '显隐动画完成'),
            event(
              'status-change',
              '[options: SidebarMCPOption[], custom: boolean]',
              'MCP 状态变化',
            ),
            event('search', '[inputValue: string, custom: boolean]', '搜索输入变化'),
            event('add-click', '[event: MouseEvent]', '点击新增'),
            event('configure-click', '[event: MouseEvent, option: SidebarMCPOption]', '点击配置'),
            event('edit-click', '[event: MouseEvent, option: SidebarMCPOption]', '点击编辑'),
          ],
        },
        {
          name: 'Annotation',
          items: [
            event('cancel', '[event: MouseEvent | KeyboardEvent]', '点击关闭或按下 Escape'),
            event('after-visible-change', '[visible: boolean]', '显隐动画完成'),
            event('change', '[activeKey: SidebarActiveKey]', '展开项变化'),
            event('click', '[event: MouseEvent, item: SidebarAnnotationItem]', '点击参考来源'),
          ],
        },
        {
          name: 'Sidebar',
          items: [
            event('cancel', '[event: MouseEvent | KeyboardEvent]', '点击关闭或按下 Escape'),
            event('after-visible-change', '[visible: boolean]', '显隐动画完成'),
            event('active-option-change', '[event: MouseEvent, activeKey: string]', '导航项变化'),
            event('file-content-change', '[content: string]', '详情文件内容变化'),
            event('back-ward', '[event: MouseEvent, mode: SidebarMode]', '返回主视图'),
            event(
              'detail-content-copy',
              '[event: MouseEvent, content: string, result: boolean]',
              '复制详情内容',
            ),
          ],
        },
        {
          name: 'Sidebar.CodeContent',
          items: [
            event('change', '[activeKey: SidebarActiveKey]', '展开项变化'),
            event(
              'expand',
              "[event: MouseEvent, code: SidebarCodeItemProps, mode: 'code']",
              '打开代码详情',
            ),
          ],
        },
        {
          name: 'Sidebar.FileContent',
          items: [
            event('change', '[activeKey: SidebarActiveKey]', '展开项变化'),
            event(
              'expand',
              "[event: MouseEvent, file: SidebarFileItemProps, mode: 'file']",
              '打开文件详情',
            ),
          ],
        },
        {
          name: 'Sidebar.FileItem',
          items: [event('content-change', '[content: string]', '富文本内容变化')],
        },
      ],
      instanceMethodGroups: [
        {
          name: 'SidebarContainerExposed',
          items: [method('getContainerElement', '() => HTMLDivElement | null', '获取容器元素')],
        },
      ],
      slotGroups: [
        {
          name: 'Sidebar.Container',
          items: [
            slot('default', '{}', '容器内容'),
            slot('title', '{}', '标题内容'),
            slot('header', '{}', '完整自定义头部'),
          ],
        },
        {
          name: 'Sidebar',
          items: [
            slot('title', '{}', '主视图标题'),
            slot('option', '{ option: SidebarOption; onChange(event, activeKey): void }', '导航项'),
            slot('main-content', '{ activeKey?: string }', '主视图内容'),
            slot(
              'detail-header',
              "{ mode: SidebarMode; detailContent: SidebarProps['detailContent'] }",
              '详情头部',
            ),
            slot('detail-content', '{ mode: SidebarMode }', '详情内容'),
          ],
        },
        {
          name: 'Annotation.AnnotationContent',
          items: [slot('item', '{ annotation: SidebarAnnotationItem }', '参考来源项')],
        },
        {
          name: 'MCPConfigureContent',
          items: [slot('item', '{ option: SidebarMCPOption; custom: boolean }', 'MCP 配置项')],
        },
      ],
      textRewrites: [
        [
          '`visible` 配置 `onCancel` 使用控制显示和隐藏',
          '`visible` 控制显示状态，`cancel` 事件处理关闭请求',
        ],
        ['使用 `onCancel` 监听用户的关闭行为', '监听 `cancel` 事件处理用户关闭行为'],
        [
          '使用 `onStatusChange` 自定义处理 MCP 工具的启用/关闭',
          '监听 `status-change` 事件处理 MCP 工具的启用/关闭',
        ],
        [
          '使用 `onAddClick` 处理自定义 MCP 页的点击添加按钮后的操作',
          '监听 `add-click` 事件处理自定义 MCP 页的新增操作',
        ],
        [
          '可通过 `onConfigureClick` 监听内置 MCP 工具的配置，通过 `onEditClick` 监听自定义 MCP 工具的配置',
          '通过 `configure-click` 监听内置 MCP 工具配置，通过 `edit-click` 监听自定义 MCP 工具配置',
        ],
        ['MCPReactOption', 'SidebarMCPOption'],
        [
          '`activeKey`配合 `onChange` 管理当前展开的项',
          '`activeKey` 配合 `change` 事件管理当前展开项',
        ],
        [
          '可通过 `renderMainContent` 传入渲染函数。',
          '可通过 `main-content` 作用域插槽提供主视图内容；迁移代码也可继续使用 `renderMainContent` callback prop。',
        ],
        [
          '则通过 `renderDetailContent` 自行处理渲染即可。',
          '则通过 `detail-content` 作用域插槽自行处理；迁移代码也可继续使用 `renderDetailContent` callback prop。',
        ],
        ["name | 名称 | string | -'\n| style | 自定义内联样式 | StyleValue | - |", ''],
      ],
    },
  ],
]);
