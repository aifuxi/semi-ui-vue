<script setup lang="ts">
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import { TagInput } from '@aifuxi/semi-ui-vue/tag-input';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/tag.css';
import '@aifuxi/semi-theme-default/tag-input.css';
import '@aifuxi/semi-theme-default/button.css';
import { IconClose, IconChevronDown } from '@aifuxi/semi-icons-vue';
import type { CascaderData } from '@aifuxi/semi-ui-vue/cascader';
const treeData: CascaderData[] = [
  {
    label: 'Asia',
    value: 'asia',
    children: [
      {
        label: 'China',
        value: 'china',
        children: [
          { label: 'Guangdong', value: 'guangdong' },
          { label: 'Beijing', value: 'beijing' },
          { label: 'Shanghai', value: 'shanghai' },
        ],
      },
      { label: 'Korea', value: 'korea', children: [{ label: 'Seoul', value: 'seoul' }] },
    ],
  },
];
function label(position: string) {
  let nodes = treeData;
  let current: CascaderData | undefined;
  for (const part of position.split('-')) {
    current = nodes[Number(part)];
    nodes = current?.children ?? [];
  }
  return String(current?.label ?? '');
}
function positions(value: string | Set<string> | undefined) {
  return value instanceof Set ? Array.from(value) : [];
}
</script>
<template>
  <div>
    <Cascader :tree-data="treeData" placeholder="Custom Trigger"
      ><template #trigger="{ value, placeholder, onClear }"
        ><Button theme="light" icon-position="right"
          ><template #icon
            ><IconClose v-if="value" @click.stop="onClear" /><IconChevronDown v-else /></template
          >{{ typeof value === 'string' && value.length ? label(value) : placeholder }}</Button
        ></template
      ></Cascader
    ><br /><Cascader
      multiple
      filter-tree-node
      :tree-data="treeData"
      style="width: 300px"
      placeholder="Custom Trigger"
      ><template #trigger="{ value, onSearch, onRemove }"
        ><TagInput :value="positions(value)" @input-change="onSearch"
          ><template #tag="{ value: position }"
            ><Tag
              :tag-key="position"
              closable
              style="margin-left: 2px"
              @close="onRemove(position)"
              >{{ label(position) }}</Tag
            ></template
          ></TagInput
        ></template
      ></Cascader
    >
  </div>
</template>
