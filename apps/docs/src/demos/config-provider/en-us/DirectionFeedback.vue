<script setup lang="ts">
import { Button } from '@aifuxi/semi-ui-vue/button';
import { Row } from '@aifuxi/semi-ui-vue/grid';
import { Notification } from '@aifuxi/semi-ui-vue/notification';
import { Modal } from '@aifuxi/semi-ui-vue/modal';
import { Spin } from '@aifuxi/semi-ui-vue/spin';
import { Toast } from '@aifuxi/semi-ui-vue/toast';
import { IconVigoLogo } from '@aifuxi/semi-icons-vue';
import '@aifuxi/semi-theme-default/button.css';
import '@aifuxi/semi-theme-default/grid.css';
import '@aifuxi/semi-theme-default/notification.css';
import '@aifuxi/semi-theme-default/modal.css';
import '@aifuxi/semi-theme-default/spin.css';
import '@aifuxi/semi-theme-default/toast.css';
const titleStyle = { margin: '50px 0 16px 0' };
const rowStyle = { margin: '16px 10px' };
const tagStyle = { marginRight: '8px', marginBottom: '8px' };
const buttonStyle = tagStyle;
import { computed, h } from 'vue';
const props = defineProps<{ direction?: 'ltr' | 'rtl' }>();
const options = computed(() => ({
  title: 'Hi,Bytedance',
  content: 'ies dance dance dance',
  duration: 3,
  direction: props.direction,
}));
</script>
<template>
  <Row>
    <h3 :style="titleStyle">Feedback</h3>
  </Row>

  <Row :style="rowStyle">
    <Button type="primary" :style="buttonStyle" @click="Notification.success(options)"
      >Notification of success information</Button
    >

    <Button :style="buttonStyle" @click="Notification.info(options)"
      >Notification of prompt information</Button
    >

    <Button type="warning" :style="buttonStyle" @click="Notification.warning(options)"
      >Notification of warning information</Button
    >

    <Button type="danger" :style="buttonStyle" @click="Notification.error(options)"
      >Notification of failure information</Button
    >

    <Button
      :style="buttonStyle"
      :ghost="false"
      @click="Notification.info({ ...options, icon: h(IconVigoLogo) })"
      ><template #icon><IconVigoLogo></IconVigoLogo></template
    ></Button>

    <Button
      :style="buttonStyle"
      :ghost="false"
      @click="
        Notification.info({ ...options, icon: h(IconVigoLogo, { style: { color: 'pink' } }) })
      "
      ><template #icon><IconVigoLogo></IconVigoLogo></template
    ></Button>

    <br />

    <Button type="primary" :style="buttonStyle" @click="Modal.success(options)"
      >Modal of success information</Button
    >

    <Button :style="buttonStyle" @click="Modal.info(options)">Modal of prompt information</Button>

    <Button type="warning" :style="buttonStyle" @click="Modal.warning(options)"
      >Modal of warning information</Button
    >

    <Button type="danger" :style="buttonStyle" @click="Modal.error(options)"
      >Modal of failure information</Button
    >

    <br />

    <Button type="primary" :style="buttonStyle" @click="Toast.success(options)"
      >Toast of success information</Button
    >

    <Button :style="buttonStyle" @click="Toast.info(options)">Toast of prompt information</Button>

    <Button type="warning" :style="buttonStyle" @click="Toast.warning(options)"
      >Toast of waning information</Button
    >

    <Button type="danger" :style="buttonStyle" @click="Toast.error(options)"
      >Toast of failure information</Button
    >

    <br />
    <br />

    <Spin tip="I am loading...">
      <div
        :style="{
          backgroundColor: 'var(--semi-color-primary-light-default',
          border: '1px solid var(--semi-color-primary)',
          borderRadius: '4px',
          padding: '16px 10px',
        }"
      >
        <p>Here are some texts.</p>

        <p>And more texts on the way.</p>
      </div>
    </Spin>
  </Row>
</template>
