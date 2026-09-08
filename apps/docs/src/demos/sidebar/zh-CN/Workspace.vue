<script setup lang="ts">
import { ref, shallowRef, h } from 'vue';
import {
  Sidebar,
  Annotation,
  type SidebarActiveKey,
  type SidebarMode,
  type SidebarCodeItemProps,
  type SidebarFileItemProps,
} from '@aifuxi/semi-ui-vue/sidebar';
import {
  IconSearch,
  IconBriefStroked,
  IconCodeStroked,
  IconModalStroked,
} from '@aifuxi/semi-icons-vue';
import { defaultCodes, defaultFiles, defaultInfo } from './workspaceData';
import { imgUploadProps } from './mockUpload';
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import locale from '@aifuxi/semi-ui-vue/locale/source/zh_CN';
import '@aifuxi/semi-theme-default/sidebar.css';
import '@aifuxi/semi-theme-default/code-highlight.css';
import '@aifuxi/semi-theme-default/json-viewer.css';
const mode = ref<SidebarMode>('main'),
  activeKey = ref('codePreview'),
  codeKey = ref<SidebarActiveKey>('code1'),
  fileKey = ref<SidebarActiveKey>('file1'),
  referKey = ref<SidebarActiveKey>('1');
const detail = shallowRef<SidebarCodeItemProps | SidebarFileItemProps>({}),
  copied = ref(false);
const files = shallowRef(defaultFiles.map((f) => ({ ...f })));
const options = [
  { icon: h(IconSearch), name: '查看搜索', key: 'searchResult' },
  { icon: h(IconBriefStroked), name: '文件预览', key: 'filePreview' },
  { icon: h(IconCodeStroked), name: '代码预览', key: 'codePreview' },
  { icon: h(IconModalStroked), name: '浏览器', key: 'network' },
];
function expand(
  _event: MouseEvent,
  content: SidebarCodeItemProps | SidebarFileItemProps,
  next: SidebarMode,
) {
  detail.value = { ...content };
  mode.value = next;
}
function back(_event: MouseEvent, next: SidebarMode): void {
  mode.value = next;
}
function updateFile(content: string) {
  detail.value = { ...detail.value, content };
  files.value = files.value.map((file) =>
    file.key === detail.value.key ? { ...file, content } : file,
  );
}
</script>
<template>
  <ConfigProvider :locale="locale"
    ><div
      style="
        display: flex;
        height: 800px;
        border: 1px solid var(--semi-color-border);
        border-radius: 8px;
        overflow: hidden;
        box-sizing: border-box;
      "
    >
      <div style="flex: 1; padding: 20px">工作区占位<output v-if="copied">已复制</output></div>
      <Sidebar
        :show-close="false"
        visible
        :motion="false"
        title="Agent 的工作空间"
        :mode="mode"
        :default-size="{ width: '60%' }"
        :active-key="activeKey"
        :options="options"
        :detail-content="detail"
        :img-upload-props="imgUploadProps"
        @active-option-change="(_event, key) => (activeKey = key)"
        @back-ward="back"
        @file-content-change="updateFile"
        @detail-content-copy="(_event, _content, success) => (copied = success)"
        ><template #main-content
          ><Annotation.AnnotationContent
            v-if="activeKey === 'searchResult'"
            :active-key="referKey"
            :info="defaultInfo"
            @change="referKey = $event" /><Sidebar.FileContent
            v-else-if="activeKey === 'filePreview'"
            :active-key="fileKey"
            :files="files"
            @expand="expand"
            @change="fileKey = $event" /><Sidebar.CodeContent
            v-else-if="activeKey === 'codePreview'"
            :active-key="codeKey"
            :codes="defaultCodes"
            @expand="expand"
            @change="codeKey = $event" /><img
            v-else
            alt="network"
            src="/demos/photo.svg"
            style="width: 100%" /></template
      ></Sidebar></div
  ></ConfigProvider>
</template>
