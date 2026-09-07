<script setup lang="ts">
import { ConfigProvider } from '@aifuxi/semi-ui-vue/config-provider';
import '@aifuxi/semi-theme-default/config-provider.css';
import { Transfer, type TransferPrimitive } from '@aifuxi/semi-ui-vue/transfer';
import { Input } from '@aifuxi/semi-ui-vue/input';
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import { Button } from '@aifuxi/semi-ui-vue/button';
import { IconSearch } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/transfer.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/spin.css';
import '@aifuxi/semi-theme-default/button.css';

const dataSource = Array.from({ length: 100 }, (_, i) => ({
  label: `Hdl Store ${i}`,
  value: i,
  disabled: false,
  key: `key-${i}`,
}));

function handleChange(values: TransferPrimitive[]) {
  console.log(values);
}
</script>

<template>
  <ConfigProvider :locale="{ code: 'en-US' }">
    <Transfer
      class="component-transfer-demo-custom-panel"
      :data-source="dataSource"
      @change="handleChange"
    >
      <template #sourcePanel="sourcePanel">
        <section class="source-panel">
          <div class="panel-header sp-font">Store list</div>
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
              <span>Store to be selected: {{ sourcePanel.filterData.length }}</span>
              <Button theme="borderless" size="small" @click="sourcePanel.onAllClick">
                {{ sourcePanel.allChecked ? 'Unselect all' : 'Select all' }}
              </Button>
            </div>
            <div class="panel-list">
              <Spin v-if="sourcePanel.loading" loading />
              <div v-else-if="sourcePanel.noMatch" class="empty sp-font">
                {{ sourcePanel.inputValue ? 'No search results' : 'No content yet' }}
              </div>
              <template v-else>
                <div
                  v-for="item in sourcePanel.filterData"
                  :key="item.key"
                  class="semi-transfer-item panel-item"
                >
                  <p>{{ item.label }}</p>
                  <Button
                    theme="borderless"
                    type="primary"
                    class="panel-item-remove"
                    size="small"
                    @click="sourcePanel.onSelectOrRemove(item)"
                    >{{ sourcePanel.selectedItems.has(item.key) ? 'delete' : 'add' }}</Button
                  >
                </div>
              </template>
            </div>
          </div>
        </section>
      </template>
      <template #selectedPanel="selectedPanel">
        <section class="selected-panel">
          <div class="panel-header sp-font">
            <div>Selected: {{ selectedPanel.selectedData.length }}</div>
            <Button theme="borderless" type="primary" size="small" @click="selectedPanel.onClear"
              >Clear
            </Button>
          </div>
          <div class="panel-main">
            <div v-if="!selectedPanel.selectedData.length" class="empty sp-font">
              No data, please filter from the left
            </div>
            <template v-else>
              <div
                v-for="item in selectedPanel.selectedData"
                :key="item.key"
                class="semi-transfer-item panel-item"
              >
                <p>{{ item.label }}</p>
                <Button
                  theme="borderless"
                  type="primary"
                  class="panel-item-remove"
                  size="small"
                  @click="selectedPanel.onRemove(item)"
                  >delete</Button
                >
              </div>
            </template>
          </div>
        </section>
      </template>
    </Transfer>
  </ConfigProvider>
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
</style>
