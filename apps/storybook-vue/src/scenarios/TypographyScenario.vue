<script setup lang="ts">
import { shallowRef } from 'vue';
import { Numeral, Paragraph, Text, Title } from '@aifuxi/semi-ui-vue/typography';
const query = new URLSearchParams(typeof window === 'undefined' ? '' : window.location.search);
const tipMode = query.get('typographyTip');
/** 额外排版维度只在审查时显示，默认验收场景保持原样。 */
const review = query.has('reviewTypography');
const headings = [1, 2, 3, 4, 5, 6] as const;
const weights = ['light', 'regular', 'medium', 'semibold', 'bold'] as const;
const wide = shallowRef(false);
const textMounted = shallowRef(true);
const tipOptions = tipMode
  ? {
      type: tipMode,
      opts: {
        getPopupContainer: () => document.getElementById('typography-tip-container')!,
        ...(query.has('arrow') ? { showArrow: query.get('arrow') === 'true' } : {}),
      },
    }
  : true;
</script>

<template>
  <div class="typography-scenario" data-testid="typography-vue">
    <section v-if="review" class="typography-scenario__section" aria-label="完整排版审查">
      <Title v-for="heading in headings" :key="heading" :heading="heading" style="margin: 0"
        >Heading {{ heading }} 标题</Title
      >
      <Title v-for="weight in weights" :key="weight" :heading="6" :weight="weight" style="margin: 0"
        >{{ weight }} 字重</Title
      >
      <Text size="small">Small 小号文本</Text>
      <Text size="normal">Normal 正常文本</Text>
      <div style="font-size: 20px; line-height: 32px">
        <Text size="inherit">Inherit 继承文本</Text>
      </div>
      <Text mark>Mark 标记</Text><Text code>Code 代码</Text><Text strong>Strong 加粗</Text
      ><Text underline>Underline 下划线</Text><Text delete>Delete 删除线</Text
      ><Text disabled>Disabled 禁用</Text>
      <Paragraph :ellipsis="{ rows: 2, expandable: true }" style="width: 260px"
        >这是一段用于检查两行省略和展开状态的长文本。Typography provides readable rhythm and
        consistent hierarchy across product content. 展开后应显示完整内容。</Paragraph
      >
    </section>
    <section class="typography-scenario__section" aria-label="标题层级">
      <Title :heading="2" style="margin: 0px" data-parity-target="typography-title">
        Typography 版式
      </Title>
      <Title
        :heading="4"
        type="secondary"
        weight="semibold"
        style="margin: 0px"
        data-parity-target="typography-subtitle"
      >
        Semi Design v2.102.0
      </Title>
    </section>

    <section class="typography-scenario__section" aria-label="文本类型与装饰">
      <div class="typography-scenario__types">
        <Text type="primary">Primary</Text>
        <Text type="secondary">Secondary</Text>
        <Text type="tertiary">Tertiary</Text>
        <Text type="quaternary">Quaternary</Text>
        <Text type="warning">Warning</Text>
        <Text type="danger">Danger</Text>
        <Text type="success">Success</Text>
      </div>
      <Text mark code strong underline delete data-parity-target="typography-decorated">
        Decorated text
      </Text>
    </section>

    <section class="typography-scenario__section" aria-label="段落与链接">
      <Paragraph spacing="extended" style="margin: 0px" data-parity-target="typography-paragraph">
        Typography provides consistent hierarchy, color, spacing and readable rhythm for product
        content.
      </Paragraph>
      <Text :link="{ href: '#typography' }" underline data-parity-target="typography-link">
        Read typography guidance
      </Text>
      <Text disabled link data-parity-target="typography-disabled-link">Disabled link</Text>
    </section>

    <section class="typography-scenario__section" aria-label="截断与提示">
      <template v-if="tipMode">
        <div id="typography-tip-container" style="position: relative" />
        <button @click="wide = !wide">Toggle width</button>
        <button @click="textMounted = !textMounted">Toggle text</button>
      </template>
      <Text
        v-if="textMounted"
        :ellipsis="{ showTooltip: tipOptions }"
        :style="{ width: wide ? '900px' : '180px' }"
        data-parity-target="typography-css-ellipsis"
        >Typography ellipsis tooltip contains the complete original content.</Text
      >
      <Paragraph
        :ellipsis="{
          rows: 1,
          expandable: true,
          collapsible: true,
          expandText: '展开',
          collapseText: '收起',
        }"
        style="margin: 0px; width: 260px"
        data-parity-target="typography-js-ellipsis"
        >Expandable typography content keeps keyboard and collapse behavior aligned.</Paragraph
      >
    </section>

    <section class="typography-scenario__section" aria-label="数值与复制">
      <Numeral rule="bytes-binary" :precision="2" data-parity-target="typography-numeral">
        1536
      </Numeral>
      <Text copyable data-parity-target="typography-copyable">Copy typography token</Text>
    </section>
  </div>
</template>
