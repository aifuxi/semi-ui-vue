<script setup lang="ts">
import { AutoComplete } from '@aifuxi/semi-ui-vue/auto-complete';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/auto-complete.css';
import '@aifuxi/semi-theme-default/avatar.css';
import { IconSearch } from '@aifuxi/semi-icons-vue';
import { shallowRef } from 'vue';
import type {
  AutoCompleteOptionRuntime,
  AutoCompleteDataItem,
} from '@aifuxi/semi-ui-vue/auto-complete';
import type { AvatarColor } from '@aifuxi/semi-ui-vue/avatar';
interface Person extends AutoCompleteDataItem {
  name: string;
  email: string;
  abbr: string;
  color: AvatarColor;
}
const people: Person[] = [
  { name: 'Xia', email: 'xiakeman@example.com', abbr: 'XK', color: 'amber' },
  { name: 'Shen', email: 'shenyue@example.com', abbr: 'SY', color: 'indigo' },
  { name: 'Qu', email: 'quchenyi@example.com', abbr: 'CY', color: 'blue' },
  { name: 'Wen', email: 'wenjiamao@example.com', abbr: 'JM', color: 'cyan' },
];
const options = shallowRef<Person[]>([]);
function search(input: string) {
  options.value = input
    ? people.map((item) => ({ ...item, value: item.name, label: item.email }))
    : [];
}
function person(option: AutoCompleteOptionRuntime): Person {
  return people.find((item) => item.name === option.name) ?? people[0]!;
}
function selected(option: AutoCompleteOptionRuntime) {
  return String(option.email ?? '');
}
</script>
<template>
  <AutoComplete
    :data="options"
    :style="{ width: '250px' }"
    :render-selected-item="selected"
    @search="search"
    @select="console.log"
    ><template #prefix><IconSearch /></template
    ><template #option="{ option }"
      ><Avatar :color="person(option).color" size="small">{{ person(option).abbr }}</Avatar>
      <div style="margin-left: 4px">
        <div style="font-size: 14px; margin-left: 4px">{{ person(option).name }}</div>
        <div style="margin-left: 4px">{{ person(option).email }}</div>
      </div></template
    ></AutoComplete
  >
</template>
