<script setup lang="ts">
import { Select } from '@aifuxi/semi-ui-vue/select';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/avatar.css';
const list = [
  { name: '夏可漫', email: 'xiakeman@example.com', avatar: '/demos/photo.svg' },
  { name: '申悦', email: 'shenyue@example.com', avatar: '/demos/one.svg' },
  { name: '曲晨一', email: 'quchenyi@example.com', avatar: '/demos/two.svg' },
  { name: '文嘉茂', email: 'wenjiamao@example.com', avatar: '/demos/photo.svg' },
];
const shapes = ['circle', 'square'] as const;
</script>
<template>
  <div>
    <Select
      placeholder="请选择"
      style="width: 280px; height: 40px"
      default-value="申悦"
      @change="console.log"
      ><template #selectedItem="{ option }"
        ><div style="display: flex; align-items: center">
          <Avatar :src="String(option.avatar)" size="small" /><span style="margin-left: 8px">{{
            option.email
          }}</span>
        </div></template
      ><SelectOption
        v-for="item in list"
        :key="item.email"
        v-bind="item"
        :value="item.name"
        :label="item.name"
        show-tick
        style="display: flex; padding-left: 24px; padding-top: 10px; padding-bottom: 10px"
        ><Avatar size="small" :src="item.avatar" />
        <div style="margin-left: 8px">
          <div style="font-size: 14px">{{ item.name }}</div>
          <div
            style="
              color: var(--color-text-2);
              font-size: 12px;
              line-height: 16px;
              font-weight: normal;
            "
          >
            {{ item.email }}
          </div>
        </div></SelectOption
      ></Select
    ><Select
      v-for="shape in shapes"
      :key="shape"
      placeholder="请选择"
      :max-tag-count="2"
      style="width: 280px; margin-top: 20px"
      :default-value="['申悦', '曲晨一']"
      multiple
      @change="console.log"
      ><template #selectedItem="{ option }"
        ><span style="display: inline-flex; align-items: center"
          ><Avatar
            :src="String(option.avatar)"
            :shape="shape"
            size="extra-small"
            style="margin-right: 4px"
          />{{ option.name }}</span
        ></template
      ><SelectOption
        v-for="item in list"
        :key="item.email"
        v-bind="item"
        :value="item.name"
        :label="item.name"
        show-tick
        style="display: flex; padding-left: 24px; padding-top: 10px; padding-bottom: 10px"
        ><Avatar size="small" :src="item.avatar" />
        <div style="margin-left: 8px">
          <div style="font-size: 14px">{{ item.name }}</div>
          <div
            style="
              color: var(--color-text-2);
              font-size: 12px;
              line-height: 16px;
              font-weight: normal;
            "
          >
            {{ item.email }}
          </div>
        </div></SelectOption
      ></Select
    >
  </div>
</template>
