<script setup lang="ts">
import { InputNumber, Select, Switch } from '@aifuxi/semi-ui-vue';
import { useStudio } from '../studio';
import BrandEditor from './BrandEditor.vue';
import TypographyEditor from './TypographyEditor.vue';

/** 全局与组件编辑使用独立面板，状态在路由切换时继续保留。 */
defineProps<{ route: string }>();
/** 面板共享同一会话，不访问文档站状态。 */
const studio = useStudio();
/** 首期组件级排版限定在公开变量已支持的 Button，其他组件消费共享主题。 */
const components = [{ label: 'Button 按钮', value: 'button' }];
</script>

<template>
  <aside class="studio-editor" aria-label="主题编辑面板">
    <template v-if="route === 'components'">
      <div class="panel-heading">
        <span class="section-number">02</span>
        <h2>组件样式</h2>
      </div>
      <p class="field-help">使用公开组件变量覆盖共享排版，颜色继续继承所属主题。</p>
      <label
        ><span id="component-label">当前组件</span
        ><Select
          v-model="studio.settings.component"
          aria-labelledby="component-label"
          :option-list="components"
          :motion="false"
      /></label>
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
      <p class="field-help">仅作用于预览操作按钮。字号不会改变按钮的点击区域。</p>
    </template>
    <template v-else>
      <div class="panel-heading">
        <span class="section-number">01</span>
        <h2>
          {{
            studio.settings.category === 'local'
              ? '局部主题'
              : studio.settings.category === 'typography'
                ? '字体排版'
                : '品牌颜色'
          }}
        </h2>
      </div>
      <template v-if="studio.settings.category === 'color'">
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
        <div class="token-list">
          <div><code>primary</code><span>主要操作</span></div>
          <div><code>link</code><span>链接文字</span></div>
          <div><code>focus-border</code><span>焦点边框</span></div>
          <div><code>info → blue</code><span>保留独立信息蓝</span></div>
        </div>
      </template>
      <TypographyEditor
        v-else-if="studio.settings.category === 'typography'"
        :value="studio.global.typography"
        label="全局"
        @change="Object.assign(studio.global.typography, $event)"
      />
      <template v-else>
        <div class="setting-row">
          <span>启用独立局部边界</span
          ><Switch v-model="studio.settings.localEnabled" aria-label="启用独立局部边界" />
        </div>
        <p class="field-help">关闭后继承外层颜色、排版和模式，打开的默认弹层也会跟随。</p>
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
    </template>
  </aside>
</template>
