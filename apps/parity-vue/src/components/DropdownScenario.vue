<script setup lang="ts">
import { onMounted, shallowRef, useTemplateRef } from 'vue';
import { Dropdown } from '@aifuxi/semi-ui-vue/dropdown';

const ready = shallowRef(false);
const status = shallowRef('等待操作');
const portalHost = useTemplateRef<HTMLDivElement>('portalHost');

onMounted(() => {
  ready.value = true;
});

function getPopupContainer(): HTMLElement {
  return portalHost.value!;
}
</script>

<template>
  <div class="dropdown-scenario" data-testid="dropdown-vue">
    <div ref="portalHost" class="dropdown-scenario__stage">
      <template v-if="ready">
        <Dropdown
          class="dropdown-scenario__static-wrapper"
          content-class-name="dropdown-parity-menu"
          :get-popup-container="getPopupContainer"
          :motion="false"
          position="bottomLeft"
          show-tick
          trigger="custom"
          visible
          wrapper-id="dropdown-static-vue"
        >
          <button class="dropdown-scenario__trigger" data-parity-target="dropdown-trigger">
            文件操作
          </button>
          <template #content>
            <Dropdown.Menu>
              <Dropdown.Title>常用操作</Dropdown.Title>
              <Dropdown.Item active type="primary" @click="status = '已选择：编辑'">
                编辑
              </Dropdown.Item>
              <Dropdown.Item>复制链接</Dropdown.Item>
              <Dropdown.Divider />
              <Dropdown.Item disabled type="danger">删除</Dropdown.Item>
            </Dropdown.Menu>
          </template>
        </Dropdown>

        <Dropdown
          class="dropdown-scenario__interactive-wrapper"
          content-class-name="dropdown-interactive-menu"
          :get-popup-container="getPopupContainer"
          :motion="false"
          position="bottomRight"
          trigger="click"
          wrapper-id="dropdown-interactive-vue"
        >
          <button class="dropdown-scenario__trigger" data-action="open-dropdown">键盘菜单</button>
          <template #content>
            <Dropdown.Menu>
              <Dropdown.Item disabled>不可用</Dropdown.Item>
              <Dropdown.Item @click="status = '已选择：Alpha'">Alpha</Dropdown.Item>
              <Dropdown.Item @click="status = '已选择：Beta'">Beta</Dropdown.Item>
            </Dropdown.Menu>
          </template>
        </Dropdown>
      </template>
    </div>
    <output aria-live="polite">{{ status }}</output>
  </div>
</template>
