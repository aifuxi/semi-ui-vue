<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import {
  Layout,
  LayoutHeader,
  LayoutFooter,
  LayoutContent,
  LayoutSider,
} from '@aifuxi/semi-ui-vue/layout';
import '@aifuxi/semi-theme-default/layout.css';
import { Breadcrumb } from '@aifuxi/semi-ui-vue/breadcrumb';
import '@aifuxi/semi-theme-default/breadcrumb.css';
import { Nav, NavItem } from '@aifuxi/semi-ui-vue/navigation';
import '@aifuxi/semi-theme-default/navigation.css';
import { Skeleton, SkeletonParagraph } from '@aifuxi/semi-ui-vue/skeleton';
import '@aifuxi/semi-theme-default/skeleton.css';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/avatar.css';
import enUS from '@aifuxi/semi-ui-vue/locale/source/en_US';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import {
  IconBell,
  IconHelpCircle,
  IconHistogram,
  IconHome,
  IconInfoCircle,
  IconLive,
  IconSetting,
} from '@aifuxi/semi-icons-vue';
const routes = ['Home', 'Page Section', 'Pagge Ssection', 'Detail'];
</script>

<template>
  <ConfigProvider :locale="enUS">
    <Layout style="border: 1px solid var(--semi-color-border)">
      <LayoutSider class="layout-sider"
        ><Nav
          style="max-width: 220px; height: 100%"
          :default-selected-keys="['Home']"
          :footer="{ collapseButton: true }"
          ><Nav.Header text="Webcast"
            ><template #logo><IconInfoCircle style="font-size: 36px" /></template></Nav.Header
          ><NavItem item-key="Home" text="Home"
            ><template #icon><IconHome size="large" /></template
          ></NavItem>
          <NavItem item-key="Histogram" text="Histogram"
            ><template #icon><IconHistogram size="large" /></template
          ></NavItem>
          <NavItem item-key="Live" text="Live"
            ><template #icon><IconLive size="large" /></template
          ></NavItem>
          <NavItem item-key="Setting" text="Setting"
            ><template #icon><IconSetting size="large" /></template
          ></NavItem> </Nav></LayoutSider
      ><Layout
        ><LayoutHeader class="layout-header"
          ><Nav mode="horizontal"
            ><template #footer
              ><Button theme="borderless" class="header-action" aria-label="Notifications"
                ><template #icon><IconBell size="large" /></template
              ></Button>
              <Button theme="borderless" class="header-action" aria-label="Help"
                ><template #icon><IconHelpCircle size="large" /></template
              ></Button>
              <Avatar color="orange" size="small">YJ</Avatar></template
            ></Nav
          ></LayoutHeader
        ><LayoutContent class="layout-content">
          <Breadcrumb style="margin-bottom: 24px" :routes="routes" />
          <div class="skeleton-content">
            <Skeleton loading>
              <template #placeholder><SkeletonParagraph :rows="2" /></template>
              <p>Hi, welcome to the workspace.</p>
              <p>Hi, welcome to the workspace.</p>
            </Skeleton>
          </div> </LayoutContent
        ><LayoutFooter class="layout-footer">
          <span class="footer-brand"
            ><IconInfoCircle size="large" style="margin-right: 8px" /><span
              >Copyright © aifuxi. All Rights Reserved.</span
            ></span
          >
          <span><span style="margin-right: 24px">Customer Service</span><span>Feedback</span></span>
        </LayoutFooter></Layout
      >
    </Layout>
  </ConfigProvider>
</template>

<style scoped>
.layout-header,
.layout-sider {
  background-color: var(--semi-color-bg-1);
}
.header-action {
  color: var(--semi-color-text-2);
  margin-right: 12px;
}
.layout-content {
  padding: 24px;
  background-color: var(--semi-color-bg-0);
}
.skeleton-content {
  border-radius: 10px;
  border: 1px solid var(--semi-color-border);
  height: 376px;
  padding: 32px;
}
.layout-footer {
  display: flex;
  justify-content: space-between;
  padding: 20px;
  color: var(--semi-color-text-2);
  background-color: rgba(var(--semi-grey-0), 1);
}
.footer-brand {
  display: flex;
  align-items: center;
}
</style>
