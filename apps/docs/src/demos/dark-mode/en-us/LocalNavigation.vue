<script setup lang="ts">
import { Row } from '@aifuxi/semi-ui-vue/grid';
import { Steps } from '@aifuxi/semi-ui-vue/steps';
import { Pagination } from '@aifuxi/semi-ui-vue/pagination';
import { Nav } from '@aifuxi/semi-ui-vue/navigation';
import { IconEdit, IconCamera, IconList } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/grid.css';
import '@aifuxi/semi-theme-default/steps.css';
import '@aifuxi/semi-theme-default/pagination.css';
import '@aifuxi/semi-theme-default/navigation.css';
const rowStyle = { margin: '16px 10px' };
import { h, shallowRef } from 'vue';
const popupLayer = shallowRef<HTMLElement>();
const getPopupContainer = () => popupLayer.value!;
const navigationItems = [
  { itemKey: 'user', text: 'Option1', icon: h(IconEdit) },
  { itemKey: 'union', text: 'Option2', icon: h(IconCamera) },
  { itemKey: 'approve-management', text: 'Group3', icon: h(IconList), items: ['3-1', '3-2'] },
];
</script>
<template>
  <Row :style="rowStyle">
    <div id="popup-layer" ref="popupLayer"></div>

    <Nav
      :mode="'horizontal'"
      :items="navigationItems"
      :get-popup-container="getPopupContainer"
    ></Nav>

    <br />
    <br />

    <Pagination :total="80" show-size-changer></Pagination>

    <br />

    <Steps :current="1">
      <Steps.Step title="Finished" description="This is a description."></Steps.Step>

      <Steps.Step title="In Progress" description="This is a description."></Steps.Step>

      <Steps.Step title="Waiting" description="This is a description."></Steps.Step>
    </Steps>

    <br />

    <Steps :current="1" status="error">
      <Steps.Step title="Finished" description="This is a description"></Steps.Step>

      <Steps.Step title="In Process" description="This is a description"></Steps.Step>

      <Steps.Step title="Waiting" description="This is a description"></Steps.Step>
    </Steps>
  </Row>
</template>
