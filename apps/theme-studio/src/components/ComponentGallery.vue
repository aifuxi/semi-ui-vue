<script setup lang="ts">
import { ref } from 'vue';
import {
  Button,
  Card,
  Checkbox,
  Input,
  Modal,
  Progress,
  Select,
  Switch,
  Table,
  Tag,
  Tooltip,
  Typography,
} from '@aifuxi/semi-ui-vue';
import { useStudio } from '../studio';

/** 场景只改变预览内容，编辑的变量始终属于同一主题。 */
defineProps<{ scene?: string | undefined; component?: string | undefined }>();
/** 预览表单与主题状态分开，保证组件仍可真实交互。 */
const text = ref('Theme Studio');
/** 下拉选项来自主题工作流自身，不包含作者或个人资料。 */
const option = ref('draft');
/** 示例开关用于检查启用状态。 */
const enabled = ref(true);
/** 勾选状态用于检查选中样式。 */
const checked = ref(true);
/** 模态框按组件正常生命周期进入默认 Portal。 */
const visible = ref(false);
/** 示范状态仅描述主题编辑工作流。 */
const options = [
  { label: '草稿', value: 'draft' },
  { label: '已保存', value: 'saved' },
];
/** 表格数据只展示主题相关内容。 */
const rows = [
  { key: '1', name: '品牌颜色', type: '颜色', state: '已编辑' },
  { key: '2', name: '基础排版', type: '排版', state: '默认' },
  { key: '3', name: '组件圆角', type: '形状', state: '默认' },
];
/** 不使用渲染回调，表格直接消费列定义。 */
const columns = [
  { title: '样式', dataIndex: 'name' },
  { title: '类别', dataIndex: 'type' },
  { title: '状态', dataIndex: 'state' },
];
/** 组件变量的消费边界由父主题提供。 */
const studio = useStudio();
/** 关闭默认模态框，并让组件清理 Portal。 */
function closeModal(): void {
  visible.value = false;
}
</script>

<template>
  <div class="component-gallery" data-testid="component-gallery">
    <section v-if="!component || component === 'button'" class="gallery-section">
      <h3>按钮</h3>
      <div class="component-example">
        <Button theme="solid">主要按钮</Button><Button>浅色按钮</Button
        ><Button theme="outline">描边按钮</Button><Button theme="borderless">文字按钮</Button
        ><Button disabled>禁用按钮</Button>
      </div>
      <div class="component-example">
        <Button type="secondary" theme="solid">次要按钮</Button
        ><Button type="warning" theme="solid">警示按钮</Button
        ><Button type="danger" theme="solid">危险按钮</Button>
      </div>
      <div class="component-example">
        <Button theme="solid" size="large">大尺寸</Button><Button theme="solid">默认尺寸</Button
        ><Button theme="solid" size="small">小尺寸</Button><Button loading>加载中</Button>
      </div>
    </section>
    <section
      v-if="(!component && scene !== 'table') || component === 'input' || component === 'select'"
      class="gallery-section"
    >
      <h3>{{ component === 'select' ? '选择器' : '输入与选择' }}</h3>
      <div class="gallery-form">
        <label v-if="component !== 'select'"
          >主题名称<Input v-model="text" aria-label="预览主题名称"
        /></label>
        <label v-if="component !== 'input'"
          ><span id="preview-state-label">主题状态</span
          ><Select
            v-model="option"
            aria-labelledby="preview-state-label"
            :option-list="options"
            :motion="false"
        /></label>
        <label v-if="component !== 'select'"
          >输入错误<Input
            value=""
            placeholder="请输入主题名称"
            validate-status="error"
            aria-label="预览错误输入"
        /></label>
        <label v-if="component !== 'input'"
          >禁用状态<Select
            value="draft"
            :option-list="options"
            disabled
            aria-label="预览禁用选择器"
        /></label>
      </div>
      <div class="component-example">
        <Checkbox v-model="checked">保存当前模式</Checkbox
        ><Switch v-model="enabled" aria-label="预览启用主题" />
      </div>
    </section>
    <section v-if="!component || component === 'tag'" class="gallery-section">
      <h3>标签与反馈</h3>
      <div class="component-example">
        <Tag color="blue">颜色</Tag><Tag color="green">已保存</Tag><Tag color="orange">待调整</Tag
        ><Tag color="red">对比不足</Tag><Tag color="white" size="small">默认标签</Tag>
      </div>
      <Progress :percent="65" />
    </section>
    <section
      v-if="(!component && scene !== 'form') || component === 'table'"
      class="gallery-section"
    >
      <h3>样式列表</h3>
      <Table :columns="columns" :data-source="rows" :pagination="false" size="small" />
    </section>
    <section v-if="!component || component === 'card'" class="gallery-section">
      <h3>主题卡片</h3>
      <Card title="当前主题" shadows="always"
        ><Typography.Text>颜色、排版与组件样式实时同步。</Typography.Text
        ><template #footer
          ><Button theme="solid" @click="studio.save">保存主题草稿</Button></template
        ></Card
      >
    </section>
    <section v-if="component === 'modal' || component === 'tooltip'" class="gallery-section">
      <h3>{{ component === 'modal' ? '模态框' : '文字提示' }}</h3>
      <Tooltip v-if="component === 'tooltip'" content="当前主题的提示样式" :motion="false"
        ><Button>悬停查看提示</Button></Tooltip
      ><Button v-else theme="solid" @click="visible = true">预览模态框</Button
      ><Modal
        :visible="visible"
        title="保存主题"
        :motion="false"
        width="min(520px, calc(100vw - 32px))"
        @cancel="closeModal"
        @ok="closeModal"
        ><Typography.Text>当前预览使用正在编辑的主题样式。</Typography.Text></Modal
      >
    </section>
  </div>
</template>
