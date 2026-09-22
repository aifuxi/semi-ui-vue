<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import '@aifuxi/semi-theme-default/spin.css';
import { computed, onBeforeUnmount, onMounted, shallowRef } from 'vue';
interface Item {
  title: string;
  color: 'grey';
}
const data = Array.from({ length: 100 }, (_, index): Item => ({
  title: `Semi Design Title ${index}`,
  color: 'grey',
}));
const loaded = shallowRef<Item[]>([]);
const loading = shallowRef(false);
const noMore = shallowRef(false);
const batches = shallowRef(0);
let timer: ReturnType<typeof setTimeout> | undefined;
function fetchData() {
  if (loading.value || noMore.value) return;
  loading.value = true;
  timer = setTimeout(() => {
    const next = data.slice(loaded.value.length, loaded.value.length + 5);
    loaded.value = [...loaded.value, ...next];
    batches.value += 1;
    noMore.value = next.length === 0;
    loading.value = false;
  }, 1000);
}
onMounted(fetchData);
onBeforeUnmount(() => clearTimeout(timer));
const gated = computed(() => batches.value > 0 && batches.value % 4 === 0);
function onScroll(event: Event) {
  const target = event.currentTarget as HTMLElement;
  if (!gated.value && target.scrollHeight - target.scrollTop - target.clientHeight < 20)
    fetchData();
}
</script>

<template>
  <div
    class="light-scrollbar"
    style="height: 420px; overflow: auto; border: 1px solid var(--semi-color-border); padding: 10px"
    @scroll="onScroll"
  >
    <List :data-source="loaded"
      ><template #item="{ item }"
        ><ListItem
          ><template #header><Avatar :color="item.color">SE</Avatar></template
          ><template #main
            ><div>
              <span style="color: var(--semi-color-text-0); font-weight: 500">{{
                item.title
              }}</span>
              <p style="color: var(--semi-color-text-2); margin: 4px 0">
                Semi Design 是由抖音前端团队与 UED
                团队共同设计开发并维护的设计系统。设计系统包含设计语言以及一整套可复用的前端组件，帮助设计师与开发者更容易地打造高质量的、用户体验一致的、符合设计规范的
                Web 应用。
              </p>
            </div></template
          ></ListItem
        ></template
      ><template #loadMore
        ><div v-if="loading" style="text-align: center"><Spin /></div>
        <div v-else-if="gated &amp;&amp; !noMore" style="text-align: center; margin-top: 12px">
          <Button @click="fetchData">显示更多</Button>
        </div></template
      ></List
    >
  </div>
</template>
