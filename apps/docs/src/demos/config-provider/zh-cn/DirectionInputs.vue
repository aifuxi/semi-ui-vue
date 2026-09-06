<script setup lang="ts">
import { Row } from '@aifuxi/semi-ui-vue/grid';
import { Col } from '@aifuxi/semi-ui-vue/grid';
import { DatePicker } from '@aifuxi/semi-ui-vue/date-picker';
import { TimePicker } from '@aifuxi/semi-ui-vue/time-picker';
import { Cascader } from '@aifuxi/semi-ui-vue/cascader';
import { Radio } from '@aifuxi/semi-ui-vue/radio';
import { Select } from '@aifuxi/semi-ui-vue/select';
import { Input } from '@aifuxi/semi-ui-vue/input';
import { Typography } from '@aifuxi/semi-ui-vue/typography';
import { TextArea } from '@aifuxi/semi-ui-vue/input';
import { Checkbox } from '@aifuxi/semi-ui-vue/checkbox';
import { Switch } from '@aifuxi/semi-ui-vue/switch';
import '@aifuxi/semi-theme-default/grid.css';
import '@aifuxi/semi-theme-default/date-picker.css';
import '@aifuxi/semi-theme-default/time-picker.css';
import '@aifuxi/semi-theme-default/cascader.css';
import '@aifuxi/semi-theme-default/radio.css';
import '@aifuxi/semi-theme-default/select.css';
import '@aifuxi/semi-theme-default/input.css';
import '@aifuxi/semi-theme-default/typography.css';
import '@aifuxi/semi-theme-default/checkbox.css';
import '@aifuxi/semi-theme-default/switch.css';
const flexStyle = { display: 'flex', marginBottom: '32px', flexWrap: 'wrap' } as const;
const titleStyle = { margin: '50px 0 16px 0' };
const rowStyle = { margin: '16px 10px' };
const treeData = [
  {
    label: '浙江省',
    value: 'zhejiang',
    children: [
      {
        label: '杭州市',
        value: 'hangzhou',
        children: [
          {
            label: '西湖区',
            value: 'xihu',
          },
          {
            label: '萧山区',
            value: 'xiaoshan',
          },
          {
            label: '临安区',
            value: 'linan',
          },
        ],
      },
      {
        label: '宁波市',
        value: 'ningbo',
        children: [
          {
            label: '海曙区',
            value: 'haishu',
          },
          {
            label: '江北区',
            value: 'jiangbei',
          },
        ],
      },
    ],
  },
];
</script>
<template>
  <Row>
    <h3 :style="titleStyle">Input</h3>
  </Row>

  <Row :style="rowStyle" :gutter="16">
    <Col :span="12">
      <Input placeholder="输入框"></Input>

      <br />
      <br />

      <Input disabled placeholder="输入框"></Input>

      <br />
      <br />

      <Input prefix="Prefix" show-clear></Input>

      <br />
      <br />

      <Input show-clear
        ><template #suffix
          ><Typography.Text strong type="secondary" :style="{ margin: '0 8px' }"
            >Suffix</Typography.Text
          ></template
        ></Input
      >

      <br />
      <br />

      <TextArea placeholder="文本框" :max-count="100"></TextArea>

      <br />
      <br />

      <div :style="flexStyle">
        <Switch :style="{ marginRight: '8px' }" :default-checked="true"></Switch>

        <Switch :style="{ marginRight: '8px' }"></Switch>

        <Switch disabled :default-checked="true" :style="{ marginRight: '8px' }"></Switch>
      </div>

      <div :style="flexStyle">
        <Checkbox :style="{ marginRight: '8px' }" default-checked>多选框</Checkbox>

        <Checkbox :style="{ marginRight: '8px' }" disabled default-checked>禁用的多选框</Checkbox>

        <Checkbox :style="{ marginRight: '8px' }">禁用的多选框</Checkbox>
      </div>

      <div :style="{ ...flexStyle, marginBottom: '0px' }">
        <Radio :style="{ marginRight: '8px' }" default-checked>单选框</Radio>

        <Radio :style="{ marginRight: '8px' }" disabled default-checked>禁用的单选框</Radio>

        <Radio :style="{ marginRight: '8px' }">禁用的单选框</Radio>
      </div>
    </Col>

    <Col :span="12">
      <DatePicker
        :style="{ width: '100%' }"
        @change="(date: unknown, dateString: unknown) => console.log(dateString)"
      ></DatePicker>

      <br />
      <br />

      <TimePicker :style="{ width: '100%' }"></TimePicker>

      <br />
      <br />

      <Select :style="{ width: '100%' }" placeholder="选择器-单选">
        <Select.Option value="abc">抖音</Select.Option>

        <Select.Option value="hotsoon">火山</Select.Option>

        <Select.Option value="pipixia" disabled>皮皮虾</Select.Option>

        <Select.Option value="xigua">西瓜视频</Select.Option>
      </Select>

      <br />
      <br />

      <Select disabled :style="{ width: '100%' }" placeholder="选择器-禁用">
        <Select.Option value="abc">抖音</Select.Option>

        <Select.Option value="hotsoon">火山</Select.Option>

        <Select.Option value="pipixia" disabled>皮皮虾</Select.Option>

        <Select.Option value="xigua">西瓜视频</Select.Option>
      </Select>

      <br />
      <br />

      <Select multiple :style="{ width: '100%' }" placeholder="选择器-多选">
        <Select.Option value="abc">抖音</Select.Option>

        <Select.Option value="hotsoon">火山</Select.Option>

        <Select.Option value="pipixia" disabled>皮皮虾</Select.Option>

        <Select.Option value="xigua">西瓜视频</Select.Option>
      </Select>

      <br />
      <br />

      <Cascader
        :style="{ width: '100%' }"
        :tree-data="treeData"
        placeholder="级联选择器"
      ></Cascader>
    </Col>
  </Row>
</template>
