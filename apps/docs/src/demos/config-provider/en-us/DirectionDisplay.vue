<script setup lang="ts">
import { Row } from '@aifuxi/semi-ui-vue/grid';
import { Timeline } from '@aifuxi/semi-ui-vue/timeline';
import { Popover } from '@aifuxi/semi-ui-vue/popover';
import { Tag } from '@aifuxi/semi-ui-vue/tag';
import { Tooltip } from '@aifuxi/semi-ui-vue/tooltip';
import { Badge } from '@aifuxi/semi-ui-vue/badge';
import { Avatar } from '@aifuxi/semi-ui-vue/avatar';
import { Rating } from '@aifuxi/semi-ui-vue/rating';
import '@aifuxi/semi-theme-default/grid.css';
import '@aifuxi/semi-theme-default/timeline.css';
import '@aifuxi/semi-theme-default/popover.css';
import '@aifuxi/semi-theme-default/tag.css';
import '@aifuxi/semi-theme-default/tooltip.css';
import '@aifuxi/semi-theme-default/badge.css';
import '@aifuxi/semi-theme-default/avatar.css';
import '@aifuxi/semi-theme-default/rating.css';
const titleStyle = { margin: '50px 0 16px 0' };
const rowStyle = { margin: '16px 10px' };
const badgeStyle = { width: '42px', height: '42px', borderRadius: '4px', display: 'inline-block' };
const tagStyle = { marginRight: '8px', marginBottom: '8px' };
</script>
<template>
  <Row>
    <h3 :style="titleStyle">Display</h3>
  </Row>

  <Row :style="rowStyle">
    <div :style="{ display: 'flex' }">
      <div :style="{ padding: '8px' }">
        <Badge :count="5" theme="solid">
          <Avatar color="blue" shape="square" :style="badgeStyle">XZ</Avatar>
        </Badge>
      </div>

      <div :style="{ padding: '8px' }">
        <Badge :count="5" theme="light">
          <Avatar color="cyan" shape="square" :style="badgeStyle">YB</Avatar>
        </Badge>
      </div>

      <div :style="{ padding: '8px' }">
        <Badge :count="5" theme="inverted">
          <Avatar color="indigo" shape="square" :style="badgeStyle">LX</Avatar>
        </Badge>
      </div>

      <div :style="{ padding: '8px' }">
        <Badge dot theme="solid">
          <Avatar color="light-blue" shape="square" :style="badgeStyle">YZ</Avatar>
        </Badge>
      </div>

      <div :style="{ padding: '8px' }">
        <Badge dot theme="light">
          <Avatar color="teal" shape="square" :style="badgeStyle">HW</Avatar>
        </Badge>
      </div>

      <div
        :style="{
          padding: '8px',
          borderRadius: '4px',
          backgroundColor: 'var(--semi-color-fill-0)',
        }"
      >
        <Badge dot theme="inverted">
          <Avatar color="green" shape="square" :style="badgeStyle">XM</Avatar>
        </Badge>
      </div>
    </div>

    <br />

    <div>
      <Tag color="grey" :style="tagStyle"> grey tag </Tag>

      <Tag color="blue" :style="tagStyle"> blue tag </Tag>

      <Tag color="blue" type="ghost" :style="tagStyle"> ghost tag </Tag>

      <Tag color="blue" type="solid" :style="tagStyle"> solid tag </Tag>

      <Tag color="red" :style="tagStyle"> red tag </Tag>

      <Tag color="green" :style="tagStyle"> green tag </Tag>

      <Tag color="orange" :style="tagStyle"> orange tag </Tag>

      <Tag color="teal" :style="tagStyle"> teal tag </Tag>

      <Tag color="violet" :style="tagStyle"> violet tag </Tag>

      <Tag color="white" :style="tagStyle"> white tag </Tag>
    </div>

    <br />

    <div :style="{ display: 'flex', alignItems: 'center' }">
      <Popover :content="'hi semi-design'" :style="{ padding: '8px' }"
        ><Tag :style="{ marginRight: '8px' }">I am Popover</Tag></Popover
      >

      <Tooltip :content="'hi semi-design'">
        <Tag :style="{ marginRight: '8px' }">I am Tooltip</Tag>
      </Tooltip>

      <Rating :default-value="3" size="small" :style="{ marginRight: '8px' }"></Rating>
    </div>

    <br />

    <Timeline>
      <Timeline.Item time="2019-07-14 10:35" type="ongoing">Under review</Timeline.Item>

      <Timeline.Item time="2019-06-13 16:17" type="success">Publish successfully</Timeline.Item>

      <Timeline.Item time="2019-05-14 18:34" type="error">Audit failure</Timeline.Item>
    </Timeline>
  </Row>
</template>
