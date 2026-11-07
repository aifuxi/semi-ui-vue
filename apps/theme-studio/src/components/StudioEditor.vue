<script setup lang="ts">
import { computed } from 'vue';
import { Button, InputNumber, Switch } from '@aifuxi/semi-ui-vue';
import { useStudio } from '../studio';
import { componentTokens } from '../token-catalog';
import BrandEditor from './BrandEditor.vue';
import TypographyEditor from './TypographyEditor.vue';
import TokenInspector from './TokenInspector.vue';

/** 路由由外壳决定，变量与预览始终共用同一会话。 */
defineProps<{ route: string }>();
/** 检查器不接管外壳或全局页面主题。 */
const studio = useStudio();
/** 当前组件的变量列表只展示能作用于真实组件的属性。 */
const attributes = computed(() =>
  componentTokens.filter(
    /** 组件切换保留已编辑的其他组件变量。 */
    (token) => token.component === studio.settings.component,
  ),
);
</script>

<template>
  <aside class="studio-editor" aria-label="主题编辑面板">
    <section class="brand-settings">
      <div class="panel-heading"><h2>主题预设</h2></div>
      <Button @click="studio.applyDieluPreset">应用迭鹿预设</Button>
      <p class="field-help">仅应用品牌色与圆角，保留其他编辑。</p>
      <Button @click="studio.applyDieluForegroundPreset">应用排版与前景</Button>
      <p class="field-help">包含排版角色、组件文字与键盘轮廓，保留背景、填充和光晕。</p>
    </section>
    <template v-if="route === 'components'">
      <div class="panel-heading">
        <h2>组件属性</h2>
        <span>{{ attributes.length }} 项</span>
      </div>
      <div class="component-attributes">
        <button
          v-for="token in attributes"
          :key="token.name"
          :aria-label="`编辑${token.label}`"
          :aria-pressed="studio.selection.name === token.name"
          :class="{ selected: studio.selection.name === token.name }"
          @click="studio.selection.name = token.name"
        >
          <span>{{ token.label }}</span
          ><code>{{ studio.tokenValue(token) }}</code>
        </button>
      </div>
      <details v-if="studio.settings.component === 'button'" class="quick-settings" open>
        <summary>共享排版覆盖</summary>
        <div class="setting-row">
          <span>启用 Button 排版覆盖</span
          ><Switch v-model="studio.settings.componentEnabled" aria-label="启用 Button 排版覆盖" />
        </div>
        <div class="field-grid">
          <label
            >按钮字号<InputNumber
              v-model="studio.settings.buttonSize"
              aria-label="按钮字号"
              :min="10"
              :max="32"
              :disabled="!studio.settings.componentEnabled"
          /></label>
          <label
            >按钮字重<InputNumber
              v-model="studio.settings.buttonWeight"
              aria-label="按钮字重"
              :min="100"
              :max="900"
              :step="100"
              :disabled="!studio.settings.componentEnabled"
          /></label>
          <label
            >按钮行高<InputNumber
              v-model="studio.settings.buttonLineHeight"
              aria-label="按钮行高"
              :min="12"
              :max="48"
              :disabled="!studio.settings.componentEnabled"
          /></label>
        </div>
      </details>
    </template>
    <template v-else-if="studio.settings.category === 'local'">
      <div class="panel-heading"><h2>局部主题</h2></div>
      <div class="setting-row">
        <span>启用独立局部边界</span
        ><Switch v-model="studio.settings.localEnabled" aria-label="启用独立局部边界" />
      </div>
      <p class="field-help">关闭后，局部预览和弹层继承外层主题。</p>
      <div v-if="studio.settings.localEnabled" class="local-fields">
        <BrandEditor
          :theme="studio.local"
          label="局部"
          :allow-fixed="false"
          @change="Object.assign(studio.local, $event)"
        />
        <div class="setting-row">
          <span>局部深色模式</span
          ><Switch
            :checked="studio.local.mode === 'dark'"
            aria-label="局部深色模式"
            @change="studio.local.mode = $event ? 'dark' : 'light'"
          />
        </div>
        <TypographyEditor
          :value="studio.local.typography"
          label="局部"
          @change="Object.assign(studio.local.typography, $event)"
        />
      </div>
    </template>
    <template v-else>
      <section
        v-if="['color', 'palette'].includes(studio.settings.category)"
        class="brand-settings"
      >
        <div class="panel-heading"><h2>品牌颜色</h2></div>
        <BrandEditor
          :theme="studio.global"
          label="全局"
          @change="Object.assign(studio.global, $event)"
        />
        <div class="setting-row">
          <span>深色模式</span
          ><Switch
            :checked="studio.global.mode === 'dark'"
            aria-label="全局深色模式"
            @change="studio.global.mode = $event ? 'dark' : 'light'"
          />
        </div>
      </section>
      <details v-if="studio.settings.category === 'typography'" class="quick-settings" open>
        <summary>基础排版</summary>
        <TypographyEditor
          :value="studio.global.typography"
          label="全局"
          @change="Object.assign(studio.global.typography, $event)"
        />
      </details>
    </template>
    <TokenInspector
      v-if="studio.settings.category !== 'local' || route === 'components'"
      :key="studio.settings.revision"
    />
  </aside>
</template>
