<script setup lang="ts">
import { ref } from 'vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Layout } from '@aifuxi/semi-ui-vue/layout';
import { Breadcrumb } from '@aifuxi/semi-ui-vue/breadcrumb';
import LocalHeader from './LocalHeader.vue';
import LocalSider from './LocalSider.vue';
import LocalFooter from './LocalFooter.vue';
import LocalNavigation from './LocalNavigation.vue';
import LocalDisplay from './LocalDisplay.vue';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/layout.css';
import '@aifuxi/semi-theme-default/breadcrumb.css';
const mode = ref('semi-always-dark');
function switchMode() {
  mode.value = mode.value === 'semi-always-dark' ? 'semi-always-light' : 'semi-always-dark';
}
</script>
<template>
  <LocaleProvider :locale="locale">
    <Button :style="{ marginBottom: '4px' }" @click="switchMode">Switch Content Mode</Button>
    <Layout :style="{ border: '1px solid var(--semi-color-border)' }">
      <LocalHeader />
      <Layout>
        <Layout.Sider :style="{ backgroundColor: 'var(--semi-color-bg-1)' }"
          ><LocalSider
        /></Layout.Sider>
        <Layout.Content
          :class="mode"
          :style="{ padding: '24px', backgroundColor: 'var(--semi-color-bg-1)' }"
        >
          <Breadcrumb
            :style="{ marginBottom: '24px' }"
            :routes="['首页', '当这个页面标题很长时需要省略', '上一页', '详情页']"
          />
          <div
            :style="{
              borderRadius: '10px',
              border: '1px solid var(--semi-color-border)',
              height: '700px',
              padding: '32px',
            }"
          >
            <LocalNavigation /><LocalDisplay />
          </div>
        </Layout.Content>
      </Layout>
      <LocalFooter />
    </Layout>
  </LocaleProvider>
</template>
