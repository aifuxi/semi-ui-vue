<script setup lang="ts">
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { List, ListItem, type ListSize } from '@aifuxi/semi-ui-vue/list';

/** query 只影响专项视觉 review，不改变默认列表。 */
const reviewQuery = new URLSearchParams(window.location.search);
/** 三档尺寸需要分别观察正文、头像与操作行的垂直对齐。 */
const reviewSize = (
  ['small', 'default', 'large'].includes(reviewQuery.get('reviewSize') ?? '')
    ? reviewQuery.get('reviewSize')
    : undefined
) as ListSize | undefined;
/** 独立观察 loading 遮罩和 empty 文案。 */
const reviewState = reviewQuery.get('reviewState');

const people = [
  { name: 'Alice', role: 'Designer', initials: 'AL', color: 'blue' as const },
  { name: 'Bob', role: 'Engineer', initials: 'BO', color: 'green' as const },
];
</script>

<template>
  <div class="list-scenario" data-testid="list-vue">
    <section data-parity-target="list-basic">
      <List
        :data-source="reviewState === 'empty' ? [] : people"
        :size="reviewSize ?? 'default'"
        :loading="reviewState === 'loading'"
        bordered
      >
        <template #header>团队成员</template>
        <template #item="{ item }">
          <ListItem>
            <template #header
              ><Avatar :color="item.color">{{ item.initials }}</Avatar></template
            >
            <template #main>
              <div class="list-scenario__main">
                <strong>{{ item.name }}</strong
                ><span>{{ item.role }}</span>
              </div>
            </template>
            <template #extra><Button theme="borderless">详情</Button></template>
          </ListItem>
        </template>
        <template #footer>共 2 位成员</template>
      </List>
    </section>
    <section data-parity-target="list-horizontal">
      <List layout="horizontal" :size="reviewSize ?? 'small'">
        <ListItem
          ><span class="list-scenario__pill list-scenario__pill--a" aria-label="文档" /></ListItem
        ><ListItem
          ><span class="list-scenario__pill list-scenario__pill--b" aria-label="组件" /></ListItem
        ><ListItem
          ><span class="list-scenario__pill list-scenario__pill--c" aria-label="主题"
        /></ListItem>
      </List>
    </section>
    <section data-parity-target="list-grid">
      <List :data-source="people" :size="reviewSize ?? 'default'" :grid="{ gutter: 12, span: 12 }">
        <template #item="{ item }"
          ><ListItem>{{ item.name }} · {{ item.role }}</ListItem></template
        >
      </List>
    </section>
  </div>
</template>
