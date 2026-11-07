<script setup lang="ts">
import { computed } from 'vue';
import { Input, Switch, Button } from '@aifuxi/semi-ui-vue';
import { IconSearch, IconLayers } from '@aifuxi/semi-icons-vue';
import { categories, globalTokens } from '../token-catalog';
import { useStudio } from '../studio';
import { swatchColor } from '../token-utils';

/** 浏览器与检查器共用主题状态，不创建重复主题副本。 */
const studio = useStudio();
/** 分类名称来自目录，局部主题使用独立配置面板。 */
const title = computed(
  () =>
    categories.find(
      /** 根据已选分类读取中文标题。 */
      (item) => item.value === studio.settings.category,
    )?.label ?? '局部主题',
);
/** 搜索同时匹配中文含义和变量全名；已修改筛选只检查当前模式。 */
const filtered = computed(() =>
  globalTokens.filter(
    /** 导航、搜索和改动筛选共同约束列表。 */
    (token) =>
      token.category === studio.settings.category &&
      `${token.name} ${token.label}`
        .toLowerCase()
        .includes(studio.selection.search.toLowerCase()) &&
      (!studio.selection.modifiedOnly || token.name in studio.overrides[studio.global.mode]),
  ),
);
/** 基础色阶按色相成组，保留每一级可聚焦的独立按钮。 */
const palettes = computed(() => {
  /** 保留目录顺序而不按颜色值重新排序。 */
  const groups = new Map<string, typeof filtered.value>();
  for (const token of filtered.value) {
    /** 非数值后缀如 black/white 仍拥有独立分组。 */
    const group = token.name.startsWith('--dielu-brand-')
      ? '迭鹿品牌原色'
      : token.name.replace('--dielu-color-', '迭鹿 · ').replace('--semi-', '').replace(/-\d$/, '');
    groups.set(group, [...(groups.get(group) ?? []), token]);
  }
  return [...groups];
});
</script>

<template>
  <section class="token-browser" aria-label="设计变量列表">
    <div class="section-heading">
      <h1>{{ title }}</h1>
      <span>{{ filtered.length }} 个变量</span>
    </div>
    <div class="token-search">
      <Input
        v-model="studio.selection.search"
        aria-label="搜索设计变量"
        placeholder="搜索名称或 CSS 变量"
        ><template #prefix><IconSearch /></template
      ></Input>
      <label class="modified-filter"
        >仅已修改<Switch
          v-model="studio.selection.modifiedOnly"
          size="small"
          aria-label="仅显示已修改变量"
      /></label>
    </div>
    <div v-if="studio.settings.category === 'palette'" class="palette-list">
      <div v-for="[name, colors] in palettes" :key="name" class="palette-group">
        <div class="palette-group-heading">
          <strong>{{ name }}</strong
          ><span>{{ colors.length }} 色阶</span>
        </div>
        <div class="color-scale">
          <button
            v-for="token in colors"
            :key="token.name"
            :aria-label="token.name"
            :aria-pressed="studio.selection.name === token.name"
            :class="{ selected: studio.selection.name === token.name }"
            :style="{ background: swatchColor(studio, token) }"
            @click="studio.selection.name = token.name"
          >
            <span>{{ token.name.split('-').at(-1) }}</span>
          </button>
        </div>
      </div>
    </div>
    <div v-else class="variable-list">
      <button
        v-for="token in filtered"
        :key="token.name"
        class="variable-row"
        :class="{ selected: studio.selection.name === token.name }"
        :aria-pressed="studio.selection.name === token.name"
        :aria-label="token.name"
        @click="studio.selection.name = token.name"
      >
        <span
          v-if="token.kind === 'color'"
          class="token-swatch"
          :style="{ background: swatchColor(studio, token) }"
        />
        <span
          v-else-if="token.category === 'radius'"
          class="radius-swatch"
          :style="{ borderRadius: studio.tokenValue(token) }"
        />
        <span v-else class="token-type"
          ><IconLayers v-if="token.category === 'shadow'" /><template v-else>{{
            token.category === 'typography' ? 'Aa' : token.category === 'motion' ? 'ms' : 'px'
          }}</template></span
        >
        <span class="variable-name"
          ><strong>{{ token.label }}</strong
          ><code>{{ token.name }}</code></span
        >
        <span class="variable-value">{{ studio.tokenValue(token) }}</span>
        <span
          v-if="token.name in studio.overrides[studio.global.mode]"
          class="changed-dot"
          aria-label="已修改"
        />
      </button>
    </div>
    <div v-if="!filtered.length" class="empty-state">
      <strong>没有匹配的变量</strong>
      <p>尝试其他名称，或关闭“仅已修改”。</p>
      <Button
        @click="
          studio.selection.search = '';
          studio.selection.modifiedOnly = false;
        "
        >清除筛选</Button
      >
    </div>
  </section>
</template>
