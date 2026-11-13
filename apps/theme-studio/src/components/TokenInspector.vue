<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Button, ColorPicker, Input, Select, type ColorValue } from '@aifuxi/semi-ui-vue';
import { IconRefresh } from '@aifuxi/semi-icons-vue';
import { tokens } from '../token-catalog';
import { useStudio } from '../studio';
import { contrastRatio, swatchColor, resolveToken } from '../token-utils';

/** 检查器只编辑当前完整名称对应的变量。 */
const studio = useStudio();
/** 导航和搜索不会丢掉当前选择。 */
const token = computed(() =>
  tokens.find(
    /** 精确名称与导入校验共用同一目录。 */
    (item) => item.name === studio.selection.name,
  ),
);
/** 未提交输入与合法主题分开，错误不会污染预览。 */
const draft = ref('');
/** 字段错误只属于当前变量。 */
const error = ref('');
/** 对比度检查默认采用白色背景，允许切换为黑色。 */
const contrastBackground = ref('white');
/** 每次重播只重建动效样例，不重建整个预览主题。 */
const replay = ref(0);
// 模式、复原或撤销会更新草稿，清除上一项的错误。
watch(
  /** 当前值变化也需同步，例如通过撤销恢复同一变量。 */
  () => (token.value ? `${token.value.name}\n${studio.tokenValue(token.value)}` : ''),
  /** 当前主题是草稿同步的唯一合法来源。 */
  () => {
    draft.value = token.value ? studio.tokenValue(token.value) : '';
    error.value = '';
  },
  { immediate: true },
);
/** 色样已将基础通道和语义引用解析成完整 CSS 颜色。 */
const color = computed(() => (token.value ? swatchColor(studio, token.value) : ''));
/** 公开颜色选择器仅处理可解析的纯色，渐变仍可用 CSS 文本编辑。 */
const picker = computed(() => {
  if (!token.value || token.value.kind !== 'color' || !/^(?:#|rgba?\()/.test(color.value))
    return null;
  return ColorPicker.colorStringToValue(color.value);
});
/** 可引用项按颜色或同类别筛选，排除当前变量。 */
const references = computed(() =>
  tokens
    .filter(
      /** 跨类别颜色引用允许语义色引用基础 RGB 通道。 */
      (item) =>
        item.name !== token.value?.name &&
        (item.kind === 'color'
          ? token.value?.kind === 'color'
          : item.category === token.value?.category),
    )
    .map(
      /** 下拉保留完整 CSS 名称供用户判断引用目标。 */
      (item) => ({ label: item.name, value: item.name }),
    ),
);
/** 反向引用帮助用户判断本次修改的影响。 */
const dependents = computed(() =>
  token.value
    ? tokens.filter(
        /** 只统计实际有效文档中的显式引用。 */
        (item) => studio.tokenValue(item).includes(`var(${token.value!.name})`),
      )
    : [],
);
/** WCAG 数值仅在颜色可解析时出现。 */
const ratio = computed(() => contrastRatio(color.value, contrastBackground.value === 'black'));
/** 私有适配变量明确列出实际选择器，帮助判断此次编辑影响哪些组件。 */
const impact = computed(() =>
  token.value?.bindings?.length
    ? token.value.bindings
        .map(
          /** 每个映射单独对应主题边界内的一类真实组件节点。 */
          (binding) => binding.selector,
        )
        .join('、')
    : token.value?.source === 'studio'
      ? '自定义布局变量'
      : '继承此变量的组件',
);
/** 动效示例分别使用当前时长、延迟、插值或变换，不将旋转值当成时长。 */
const motionStyle = computed(() => {
  if (!token.value) return {};
  /** 600ms 仅为插值/变换演示的播放周期，不写入主题默认值。 */
  const value = resolveToken(studio, token.value);
  return token.value.name.includes('transform')
    ? { transform: value, animation: 'none' }
    : {
        animationDuration: token.value.name.includes('duration') ? value : '600ms',
        animationDelay: token.value.name.includes('delay') ? value : '0ms',
        animationTimingFunction: token.value.name.includes('function') ? value : 'ease-in-out',
      };
});
/** 提交单项编辑，失败保留输入并显示具体原因。 */
function apply(): void {
  if (!token.value) return;
  try {
    studio.setToken(token.value, draft.value);
    error.value = '';
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '变量值无效。';
  }
}
/** 复原与直接编辑使用相同错误区域；失败时保留当前合法覆盖。 */
function reset(): void {
  if (!token.value) return;
  try {
    studio.resetToken(token.value);
    error.value = '';
  } catch (cause) {
    error.value = cause instanceof Error ? cause.message : '无法恢复此变量。';
  }
}
/** 选择引用后保存原表达式，而非固化解析后的色值。 */
function reference(value: unknown): void {
  if (typeof value !== 'string') return;
  /** 基础色阶是 RGB 通道，引用为颜色时必须包装成 rgba 表达式。 */
  const target = tokens.find(
    /** 选项仅来自当前目录。 */
    (item) => item.name === value,
  );
  draft.value = target?.channels
    ? `rgba(var(${value})${target.alphaChannel ? '' : ', 1'})`
    : `var(${value})`;
  apply();
}
/** 基础通道与普通颜色分别序列化，保持公开变量值的原始格式。 */
function pick(value: ColorValue): void {
  draft.value = token.value?.channels
    ? `${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}${token.value.alphaChannel ? `, ${value.rgba.a}` : ''}`
    : value.rgba.a < 1
      ? `rgba(${value.rgba.r}, ${value.rgba.g}, ${value.rgba.b}, ${value.rgba.a})`
      : value.hex;
  apply();
}
</script>

<template>
  <section v-if="token" class="token-inspector" aria-label="变量检查器">
    <div class="inspector-title">
      <h2>{{ token.label }}</h2>
      <Button
        size="small"
        type="tertiary"
        aria-label="恢复当前变量默认值"
        :disabled="!(token.name in studio.overrides[studio.global.mode])"
        @click="reset"
        ><template #icon><IconRefresh /></template
      ></Button>
    </div>
    <code class="selected-token-name">{{ token.name }}</code>
    <div v-if="token.kind === 'color'" class="color-sample" :style="{ background: color }">
      <span>{{ color }}</span>
    </div>
    <div v-else-if="token.category === 'radius'" class="property-preview">
      <div class="radius-example" :style="{ borderRadius: resolveToken(studio, token) }" />
    </div>
    <div v-else-if="token.category === 'shadow'" class="property-preview">
      <div class="shadow-example" :style="{ boxShadow: resolveToken(studio, token) }" />
    </div>
    <div v-else-if="token.category === 'spacing'" class="property-preview">
      <div class="spacing-example" :style="{ gap: resolveToken(studio, token) }">
        <span /><span /><span />
      </div>
    </div>
    <p v-else-if="token.bindings?.[0]?.property === 'transition'" class="field-help">
      在预览区悬浮或聚焦控件，查看过渡。
    </p>
    <div v-else-if="token.category === 'motion'" class="property-preview">
      <div :key="replay" class="motion-example" :style="motionStyle" />
      <Button size="small" @click="replay++">重播动效</Button>
    </div>
    <label class="inspector-field"
      >{{ token.channels ? (token.alphaChannel ? 'RGBA 通道' : 'RGB 通道') : 'CSS 变量值' }}
      <div class="value-input">
        <ColorPicker
          v-if="picker"
          :value="picker"
          :alpha="!token.channels || token.alphaChannel === true"
          :eye-dropper="false"
          use-popover
          @change="pick"
          ><Button aria-label="当前变量颜色选择器" class="color-trigger"
            ><span :style="{ background: color }" /></Button></ColorPicker
        ><Input
          v-model="draft"
          aria-label="CSS 变量值"
          :validate-status="error ? 'error' : 'default'"
          @enter-press="apply"
        /></div
    ></label>
    <p v-if="error" class="field-error" role="alert">{{ error }}</p>
    <div class="inspector-apply">
      <Button theme="solid" @click="apply">应用变量</Button
      ><span>{{ studio.global.mode === 'dark' ? '深色模式' : '浅色模式' }}</span>
    </div>
    <label v-if="!token.channels" class="inspector-field"
      ><span id="reference-label">引用其他变量</span
      ><Select
        aria-labelledby="reference-label"
        placeholder="选择 CSS 变量"
        filter
        :option-list="references"
        :motion="false"
        @change="reference"
    /></label>
    <dl class="token-details">
      <div>
        <dt>默认值</dt>
        <dd>
          <code>{{
            studio.global.mode === 'dark'
              ? (token.darkValue ?? token.defaultValue)
              : token.defaultValue
          }}</code>
        </dd>
      </div>
      <div>
        <dt>影响范围</dt>
        <dd>
          {{ impact }}
        </dd>
      </div>
    </dl>
    <section
      v-if="token.kind === 'color' && ratio !== null"
      class="contrast-panel"
      aria-label="颜色对比度检查"
    >
      <div class="inspector-title">
        <h3>对比度检查</h3>
        <Select
          v-model="contrastBackground"
          aria-label="对比背景"
          size="small"
          :option-list="[
            { label: '白色背景', value: 'white' },
            { label: '黑色背景', value: 'black' },
          ]"
          :motion="false"
        />
      </div>
      <div
        class="contrast-example"
        :style="{ color, background: contrastBackground === 'black' ? '#000' : '#fff' }"
      >
        Theme Studio · Aa
      </div>
      <div class="contrast-result">
        <strong>{{ ratio.toFixed(2) }} : 1</strong
        ><span :class="ratio >= 4.5 ? 'pass' : 'fail'">{{
          ratio >= 4.5 ? 'AA 正文通过' : ratio >= 3 ? '仅大字与 UI 通过' : '对比度不足'
        }}</span>
      </div>
      <p class="field-help">WCAG 2 · 正文至少 4.5:1，大字及 UI 至少 3:1。</p>
    </section>
    <section v-if="dependents.length" class="reference-panel">
      <h3>引用此变量 · {{ dependents.length }}</h3>
      <button
        v-for="item in dependents"
        :key="item.name"
        @click="studio.selection.name = item.name"
      >
        {{ item.name }}
      </button>
    </section>
  </section>
</template>
