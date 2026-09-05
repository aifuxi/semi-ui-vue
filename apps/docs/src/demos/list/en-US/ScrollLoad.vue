<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { List, ListItem } from '@aifuxi/semi-ui-vue/list';
import '@aifuxi/semi-theme-default/list.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import '@aifuxi/semi-theme-default/spin.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
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
  <ConfigProvider :locale="enUS"
    ><div
      class="light-scrollbar"
      style="
        height: 420px;
        overflow: auto;
        border: 1px solid var(--semi-color-border);
        padding: 10px;
      "
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
                  Life's but a walking shadow, a poor player, that struts and frets his hour upon
                  the stage, and then is heard no more; it is a tale told by an idiot, full of sound
                  and fury, signifying nothing.
                </p>
              </div></template
            ></ListItem
          ></template
        ><template #loadMore
          ><div v-if="loading" style="text-align: center"><Spin /></div>
          <div v-else-if="gated &amp;&amp; !noMore" style="text-align: center; margin-top: 12px">
            <Button @click="fetchData">Show more</Button>
          </div></template
        ></List
      >
    </div></ConfigProvider
  >
</template>
