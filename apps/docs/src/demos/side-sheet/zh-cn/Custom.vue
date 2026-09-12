<script setup lang="ts">
import { SideSheet } from '@aifuxi/semi-ui-vue/side-sheet';
import '@aifuxi/semi-theme-default/side-sheet.css';
import { Button } from '@aifuxi/semi-ui-vue/button';
import '@aifuxi/semi-theme-default/button.css';
import { Text, Title } from '@aifuxi/semi-ui-vue/typography';
import '@aifuxi/semi-theme-default/typography.css';
import {
  Form,
  FormDatePicker,
  FormRadioGroup,
  FormRadio,
  FormSelect,
} from '@aifuxi/semi-ui-vue/form';
import '@aifuxi/semi-theme-default/form.css';
import { SelectOption } from '@aifuxi/semi-ui-vue/select';
import '@aifuxi/semi-theme-default/select.css';
import { Banner } from '@aifuxi/semi-ui-vue/banner';
import '@aifuxi/semi-theme-default/banner.css';
import { shallowRef } from 'vue';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/radio.css';
const visible = shallowRef(false);
const createdAt = shallowRef<Date>();
function show() {
  createdAt.value = new Date();
  visible.value = true;
}
</script>
<template>
  <div>
    <Button @click="show">More Information</Button
    ><SideSheet
      v-model:visible="visible"
      :header-style="{ borderBottom: '1px solid var(--semi-color-border)' }"
      :body-style="{ borderBottom: '1px solid var(--semi-color-border)' }"
      :close-icon="null"
      @cancel="visible = false"
      ><template #title><Title :heading="4">创建资源包</Title></template
      ><template #footer
        ><div style="display: flex; justify-content: flex-end">
          <Button style="margin-right: 8px">重置</Button><Button theme="solid">提交</Button>
        </div></template
      ><Form
        ><FormDatePicker
          field="date"
          type="dateTime"
          :init-value="createdAt"
          style="width: 272px"
          :label="{ text: '创建时间', required: true }"
        /><FormRadioGroup field="type" label="目标操作系统" direction="horizontal" init-value="all"
          ><FormRadio value="all">全平台</FormRadio><FormRadio value="ios">iOS</FormRadio
          ><FormRadio value="android">Android</FormRadio
          ><FormRadio value="web">Web</FormRadio></FormRadioGroup
        ><FormRadioGroup field="origin" label="资源包来源" direction="horizontal" init-value="scm"
          ><FormRadio value="scm">从SCM上传</FormRadio
          ><FormRadio value="manual">手动上传</FormRadio></FormRadioGroup
        ><Banner :full-mode="false" :icon="null" type="warning" bordered
          ><template #description
            ><Text strong>当前部署环境：线上部署</Text><br /><Text
              >请选择正确的SCM构建产物，防止出现不符合预期的发布操作。</Text
            ></template
          ></Banner
        ><br /><FormSelect
          field="users"
          :label="{ text: '创建用户', required: true }"
          style="width: 560px"
          multiple
          :init-value="['1', '2', '3', '4']"
          ><SelectOption value="1">曲晨一</SelectOption><SelectOption value="2">夏可曼</SelectOption
          ><SelectOption value="3">曲晨三</SelectOption
          ><SelectOption value="4">蔡妍</SelectOption></FormSelect
        ></Form
      ></SideSheet
    >
  </div>
</template>
