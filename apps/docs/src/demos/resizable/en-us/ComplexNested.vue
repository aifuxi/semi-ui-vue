<script setup lang="ts">
import { shallowRef } from 'vue';
import { ResizeGroup, ResizeItem, ResizeHandler } from '@aifuxi/semi-ui-vue/resizable';
import '@aifuxi/semi-theme-default/resizable.css';
const text = shallowRef('Drag to resize');
</script>
<template>
  <div :style="{ width: '1000px', height: '600px' }">
    <ResizeGroup direction="vertical">
      <ResizeItem :default-size="'80%'">
        <ResizeGroup direction="horizontal">
          <ResizeItem
            :style="{
              backgroundColor: 'rgba(var(--semi-grey-1), 1)',
              border: 'var(--semi-color-border) 1px solid',
            }"
            :default-size="'25%'"
            :min="'10%'"
            :max="'30%'"
          >
            <div :style="{ marginLeft: '20%' }">
              {{ text + ' min:10% max:30%' }}
            </div>
          </ResizeItem>
          <ResizeHandler></ResizeHandler>
          <ResizeItem
            :style="{ border: 'var(--semi-color-border) 1px solid' }"
            :default-size="'50%'"
          >
            <div :style="{ height: '100%' }">
              <ResizeGroup direction="vertical">
                <ResizeItem
                  :style="{
                    backgroundColor: 'rgba(var(--semi-grey-1), 1)',
                    border: 'var(--semi-color-border) 1px solid',
                  }"
                  :default-size="'33%'"
                  :min="'10%'"
                  @change="text = 'resizing'"
                  @resize-end="text = 'Drag to resize'"
                >
                  <div :style="{ marginLeft: '20%' }">
                    {{ text + ' min:10%' }}
                  </div>
                </ResizeItem>
                <ResizeHandler></ResizeHandler>
                <ResizeItem
                  :style="{
                    backgroundColor: 'rgba(var(--semi-grey-1), 1)',
                    border: 'var(--semi-color-border) 1px solid',
                  }"
                  :default-size="'33%'"
                  :min="'10%'"
                  :max="'40%'"
                >
                  <div :style="{ marginLeft: '20%' }">
                    {{ text + ' min:10% max:40%' }}
                  </div>
                </ResizeItem>
                <ResizeHandler></ResizeHandler>
                <ResizeItem
                  :style="{
                    backgroundColor: 'rgba(var(--semi-grey-1), 1)',
                    border: 'var(--semi-color-border) 1px solid',
                  }"
                >
                  <div :style="{ marginLeft: '20%' }">
                    {{ text }}
                  </div>
                </ResizeItem>
              </ResizeGroup>
            </div>
          </ResizeItem>
          <ResizeHandler></ResizeHandler>
          <ResizeItem
            :style="{
              backgroundColor: 'rgba(var(--semi-grey-1), 1)',
              border: 'var(--semi-color-border) 1px solid',
            }"
            :default-size="'1'"
            :max="'30%'"
          >
            <div :style="{ marginLeft: '20%' }">
              {{ text + ' max:30%' }}
            </div>
          </ResizeItem>
        </ResizeGroup>
      </ResizeItem>
      <ResizeHandler></ResizeHandler>
      <ResizeItem :default-size="'20%'" @change="text = 'resizing'">
        <ResizeGroup direction="horizontal">
          <ResizeItem
            :style="{
              backgroundColor: 'rgba(var(--semi-grey-1), 1)',
              border: 'var(--semi-color-border) 1px solid',
            }"
            :default-size="'50%'"
          >
            <div :style="{ marginLeft: '20%' }">
              {{ 'tab' }}
            </div>
          </ResizeItem>
          <ResizeHandler></ResizeHandler>
          <ResizeItem
            :style="{
              backgroundColor: 'rgba(var(--semi-grey-1), 1)',
              border: 'var(--semi-color-border) 1px solid',
            }"
            :default-size="'50%'"
          >
            <div :style="{ marginLeft: '20%' }">
              {{ 'content' }}
            </div>
          </ResizeItem>
        </ResizeGroup>
      </ResizeItem>
    </ResizeGroup>
  </div>
</template>
