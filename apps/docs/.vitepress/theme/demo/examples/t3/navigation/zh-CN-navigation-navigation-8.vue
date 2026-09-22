<script setup lang="ts">
import { Layout } from '@aifuxi/semi-ui-vue/layout';
import { Breadcrumb } from '@aifuxi/semi-ui-vue/breadcrumb';
import { Skeleton } from '@aifuxi/semi-ui-vue/skeleton';
import TopHeader from './CombinedTopHeader.vue';
import LeftNav from './CombinedLeftNav.vue';
import FooterContent from './CombinedFooterContent.vue';
import { LocaleProvider } from '@aifuxi/semi-ui-vue/locale';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/navigation.css';
import '@aifuxi/semi-theme-default/layout.css';
import '@aifuxi/semi-theme-default/breadcrumb.css';
import '@aifuxi/semi-theme-default/skeleton.css';
</script>
<template>
  <LocaleProvider :locale="locale">
    <Layout :style="{ border: '1px solid var(--semi-color-border)' }">
      <TopHeader></TopHeader>
      <Layout>
        <Layout.Sider :style="{ backgroundColor: 'var(--semi-color-bg-1)' }">
          <LeftNav></LeftNav>
        </Layout.Sider>
        <Layout.Content
          :style="{
            padding: '24px',
            backgroundColor: 'var(--semi-color-bg-0)',
          }"
        >
          <Breadcrumb
            :style="{
              marginBottom: '24px',
            }"
            :routes="['首页', '当这个页面标题很长时需要省略', '上一页', '详情页']"
          ></Breadcrumb>
          <div
            :style="{
              borderRadius: '10px',
              border: '1px solid var(--semi-color-border)',
              height: '376px',
              padding: '32px',
            }"
          >
            <Skeleton :loading="true">
              <p>Hi, Bytedance dance dance.</p>
              <p>Hi, Bytedance dance dance.</p>
              <template #placeholder><Skeleton.Paragraph :rows="2"></Skeleton.Paragraph></template>
            </Skeleton>
          </div>
        </Layout.Content>
      </Layout>
      <Layout.Footer
        :style="{
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px',
          color: 'var(--semi-color-text-2)',
          backgroundColor: 'rgba(var(--semi-grey-0), 1)',
        }"
      >
        <FooterContent></FooterContent>
      </Layout.Footer>
    </Layout>
  </LocaleProvider>
</template>
