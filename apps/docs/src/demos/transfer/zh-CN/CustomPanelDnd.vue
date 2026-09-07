<script setup lang="ts">
import { shallowRef } from 'vue';
import {
  Transfer,
  type TransferPrimitive,
  type TransferResolvedDataItem,
  type TransferSelectedPanelProps,
} from '@aifuxi/semi-ui-vue/transfer';
import { Input } from '@aifuxi/semi-ui-vue/input';
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { IconSearch, IconHandle } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/transfer.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/spin.css';
import '@aifuxi/semi-theme-default/button.css';

const dataSource = Array.from({ length: 100 }, (_, i) => ({
  label: `海底捞门店 ${i}`,
  value: i,
  disabled: false,
  key: `key-${i}`,
}));

function handleChange(values: TransferPrimitive[]) {
  console.log(values);
}

const activeKey = shallowRef<TransferPrimitive | null>(null);

function clearDrag() {
  activeKey.value = null;
  keyboardIndex.value = null;
}

function startDrag(event: DragEvent, item: TransferResolvedDataItem) {
  activeKey.value = item.key;
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/plain', String(item.key));
    const row = (event.currentTarget as HTMLElement).closest<HTMLElement>('.panel-item');
    if (row) event.dataTransfer.setDragImage(row, 8, row.offsetHeight / 2);
  }
}

function dropItem(item: TransferResolvedDataItem, panel: TransferSelectedPanelProps) {
  const oldIndex = panel.selectedData.findIndex((entry) => entry.key === activeKey.value);
  const newIndex = panel.selectedData.findIndex((entry) => entry.key === item.key);
  clearDrag();
  if (oldIndex >= 0 && newIndex >= 0 && oldIndex !== newIndex) {
    panel.onSortEnd({ oldIndex, newIndex });
  }
}

const keyboardIndex = shallowRef<number | null>(null);

function handleSortKey(
  event: KeyboardEvent,
  item: TransferResolvedDataItem,
  panel: TransferSelectedPanelProps,
) {
  if (event.key === 'Escape') {
    clearDrag();
    return;
  }
  if (event.key === ' ' || event.key === 'Enter') {
    event.preventDefault();
    if (keyboardIndex.value === null) {
      activeKey.value = item.key;
      keyboardIndex.value = panel.selectedData.findIndex((entry) => entry.key === item.key);
    } else {
      const target = panel.selectedData[keyboardIndex.value];
      if (target) dropItem(target, panel);
    }
    return;
  }
  if (keyboardIndex.value !== null && (event.key === 'ArrowUp' || event.key === 'ArrowDown')) {
    event.preventDefault();
    keyboardIndex.value = Math.max(
      0,
      Math.min(
        panel.selectedData.length - 1,
        keyboardIndex.value + (event.key === 'ArrowUp' ? -1 : 1),
      ),
    );
  }
}
</script>

<template>
  <Transfer
    class="component-transfer-demo-custom-panel"
    :data-source="dataSource"
    :default-value="[2, 4]"
    @change="handleChange"
  >
    <template #sourcePanel="sourcePanel">
      <section class="source-panel">
        <div class="panel-header sp-font">门店列表</div>
        <div class="panel-main">
          <Input
            :value="sourcePanel.inputValue"
            :style="{ width: '454px', margin: '12px 14px' }"
            show-clear
            @change="sourcePanel.onSearch"
          >
            <template #prefix><IconSearch /></template>
          </Input>
          <div class="panel-controls sp-font">
            <span>待选门店: {{ sourcePanel.filterData.length }}</span>
            <Button theme="borderless" size="small" @click="sourcePanel.onAllClick">
              {{ sourcePanel.allChecked ? '取消全选' : '全选' }}
            </Button>
          </div>
          <div class="panel-list">
            <Spin v-if="sourcePanel.loading" loading />
            <div v-else-if="sourcePanel.noMatch" class="empty sp-font">
              {{ sourcePanel.inputValue ? '无搜索结果' : '暂无内容' }}
            </div>
            <template v-else>
              <div
                v-for="item in sourcePanel.filterData"
                :key="item.key"
                class="semi-transfer-item panel-item"
              >
                <div class="panel-item-main" style="flex-grow: 1">
                  <p>{{ item.label }}</p>
                  <Button
                    theme="borderless"
                    type="primary"
                    class="panel-item-remove"
                    size="small"
                    @click="sourcePanel.onSelectOrRemove(item)"
                    >{{ sourcePanel.selectedItems.has(item.key) ? '删除' : '添加' }}</Button
                  >
                </div>
              </div>
            </template>
          </div>
        </div>
      </section>
    </template>
    <template #selectedPanel="selectedPanel">
      <section class="selected-panel">
        <div class="panel-header sp-font">
          <div>已选同步门店: {{ selectedPanel.selectedData.length }}</div>
          <Button theme="borderless" type="primary" size="small" @click="selectedPanel.onClear"
            >清空
          </Button>
        </div>
        <div class="panel-main" style="display: block">
          <div v-if="!selectedPanel.selectedData.length" class="empty sp-font">
            暂无数据，请从左侧筛选
          </div>
          <template v-else>
            <div class="sortable-list">
              <div
                v-for="(item, index) in selectedPanel.selectedData"
                :key="item.key"
                class="sortable-item"
                :style="{
                  opacity: activeKey === item.key && keyboardIndex === null ? 0 : undefined,
                }"
                :class="{ 'keyboard-target': keyboardIndex === index }"
                @dragover.prevent
                @drop.prevent="dropItem(item, selectedPanel)"
              >
                <div class="semi-transfer-item panel-item">
                  <span
                    class="pane-item-drag-handler"
                    draggable="true"
                    aria-label="拖拽排序"
                    role="button"
                    tabindex="0"
                    :aria-pressed="activeKey === item.key"
                    @keydown="handleSortKey($event, item, selectedPanel)"
                    @dragstart="startDrag($event, item)"
                    @dragend="clearDrag"
                    ><IconHandle
                  /></span>
                  <div class="panel-item-main" style="flex-grow: 1">
                    <p>{{ item.label }}</p>
                    <Button
                      theme="borderless"
                      type="primary"
                      class="panel-item-remove"
                      size="small"
                      @click="selectedPanel.onRemove(item)"
                      >删除</Button
                    >
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </section>
    </template>
  </Transfer>
</template>

<style scoped>
.sp-font {
  color: rgba(var(--semi-grey-9), 1);
  font-size: 12px;
  font-weight: 500;
  line-height: 20px;
}

.empty {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-item {
  flex-shrink: 0;
  height: 56px;
  border-radius: 4px;
  padding: 8px 12px;
  flex-wrap: wrap;
  background-color: rgba(22, 24, 35, 0.03);
}

.panel-item-main {
  flex-grow: 1;
}

.panel-item p {
  margin: 0 12px;
  flex-basis: 100%;
}

.panel-item .panel-item-remove {
  cursor: pointer;
  color: var(--semi-color-primary);
}

.panel-header {
  padding: 10px 12px;
  border: 1px solid rgba(22, 24, 35, 0.16);
  border-radius: 4px 4px 0 0;
  height: 38px;
  box-sizing: border-box;
  background-color: var(--semi-color-tertiary-light-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.panel-header .clear {
  cursor: pointer;
  color: var(--semi-color-primary);
}

.source-panel {
  display: flex;
  flex-direction: column;
  width: 482px;
  height: 353px;
  margin-right: 16px;
}

.source-panel .panel-main {
  border: 1px solid var(--semi-color-border);
  border-top: none;
}

.source-panel .panel-main .panel-list {
  display: flex;
  flex-wrap: wrap;
  row-gap: 8px;
  column-gap: 8px;
  overflow-y: auto;
  height: 214px;
  margin-left: 12px;
  margin-right: 12px;
  padding-bottom: 8px;
}

.source-panel .panel-controls {
  margin: 10px 12px;
  font-size: 12px;
  line-height: 20px;
}

.source-panel .panel-controls .semi-button {
  margin-left: 8px;
  font-size: 12px;
}

.source-panel .panel-item {
  width: 176px;
}

.selected-panel {
  width: 200px;
  height: 353px;
}

.selected-panel .panel-main {
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  padding: 12px;
  border: 1px solid var(--semi-color-border);
  border-top: none;
  height: 323px;
  box-sizing: border-box;
  row-gap: 8px;
}

.pane-item-drag-handler {
  cursor: grab;
  line-height: 0;
}

.pane-item-drag-handler:active {
  cursor: grabbing;
}

.sortable-list {
  overflow: auto;
  display: flex;
  flex-direction: column;
  row-gap: 8px;
}

.keyboard-target {
  outline: 1px solid var(--semi-color-primary);
}
</style>
