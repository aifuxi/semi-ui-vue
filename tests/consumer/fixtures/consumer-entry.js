import { createApp, h, ref } from 'vue';
import { Button, CodeHighlight, Input, Select } from '@aifuxi/semi-ui-vue';
import { JsonViewer } from '@aifuxi/semi-ui-vue/json-viewer';

const input = ref('Initial');
const selected = ref('first');
createApp({
  render: () =>
    h('main', [
      h(
        Button,
        {
          onClick: () => {
            input.value = 'Clicked';
          },
        },
        () => 'Packed button',
      ),
      h(Input, {
        value: input.value,
        'aria-label': 'Packed input',
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
        onChange: (value) => {
          selected.value = value;
        },
      }),
      h('output', { id: 'packed-state' }, input.value + ':' + selected.value),
      h(CodeHighlight, { code: 'const ready = true;\nready();', language: 'javascript' }),
      h(JsonViewer, { value: '{"name":"Semi"}', width: 600, height: 160 }),
    ]),
}).mount('#app');
