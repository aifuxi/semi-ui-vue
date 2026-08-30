<script setup lang="ts">
import { computed } from 'vue';
import {
  getParityScenario,
  REFERENCE_BASELINE,
  type ParityScenarioOptions,
} from '@workspace/test-infra';
import AnchorScenario from './components/AnchorScenario.vue';
import AvatarScenario from './components/AvatarScenario.vue';
import BadgeScenario from './components/BadgeScenario.vue';
import CalendarScenario from './components/CalendarScenario.vue';
import CardScenario from './components/CardScenario.vue';
import CarouselScenario from './components/CarouselScenario.vue';
import CascaderScenario from './components/CascaderScenario.vue';
import CollapsibleScenario from './components/CollapsibleScenario.vue';
import CropperScenario from './components/CropperScenario.vue';
import DescriptionsScenario from './components/DescriptionsScenario.vue';
import DropdownScenario from './components/DropdownScenario.vue';
import EmptyScenario from './components/EmptyScenario.vue';
import HighlightScenario from './components/HighlightScenario.vue';
import ImageScenario from './components/ImageScenario.vue';
import ListScenario from './components/ListScenario.vue';
import ModalScenario from './components/ModalScenario.vue';
import OverflowListScenario from './components/OverflowListScenario.vue';
import PopoverScenario from './components/PopoverScenario.vue';
import ScrollListScenario from './components/ScrollListScenario.vue';
import SideSheetScenario from './components/SideSheetScenario.vue';
import TableScenario from './components/TableScenario.vue';
import TagScenario from './components/TagScenario.vue';
import TimelineScenario from './components/TimelineScenario.vue';
import BannerScenario from './components/BannerScenario.vue';
import NotificationScenario from './components/NotificationScenario.vue';
import PopconfirmScenario from './components/PopconfirmScenario.vue';
import ProgressScenario from './components/ProgressScenario.vue';
import SkeletonScenario from './components/SkeletonScenario.vue';
import SpinScenario from './components/SpinScenario.vue';
import ToastScenario from './components/ToastScenario.vue';
import IllustrationsScenario from './components/IllustrationsScenario.vue';
import BackTopScenario from './components/BackTopScenario.vue';
import BreadcrumbScenario from './components/BreadcrumbScenario.vue';
import AutoCompleteScenario from './components/AutoCompleteScenario.vue';
import ButtonTypesScenario from './components/ButtonTypesScenario.vue';
import ButtonContractScenario from './components/ButtonContractScenario.vue';
import CheckboxScenario from './components/CheckboxScenario.vue';
import ConfigProviderScenario from './components/ConfigProviderScenario.vue';
import DividerScenario from './components/DividerScenario.vue';
import FloatButtonScenario from './components/FloatButtonScenario.vue';
import GridScenario from './components/GridScenario.vue';
import IconScenario from './components/IconScenario.vue';
import LayoutScenario from './components/LayoutScenario.vue';
import InputScenario from './components/InputScenario.vue';
import InputNumberScenario from './components/InputNumberScenario.vue';
import PinCodeScenario from './components/PinCodeScenario.vue';
import PaginationScenario from './components/PaginationScenario.vue';
import RadioScenario from './components/RadioScenario.vue';
import RatingScenario from './components/RatingScenario.vue';
import ResizableScenario from './components/ResizableScenario.vue';
import SelectScenario from './components/SelectScenario.vue';
import SliderScenario from './components/SliderScenario.vue';
import SpaceScenario from './components/SpaceScenario.vue';
import StepsScenario from './components/StepsScenario.vue';
import TabsScenario from './components/TabsScenario.vue';
import TreeScenario from './components/TreeScenario.vue';
import TreeSelectScenario from './components/TreeSelectScenario.vue';
import SwitchScenario from './components/SwitchScenario.vue';
import TagInputScenario from './components/TagInputScenario.vue';
import TimePickerScenario from './components/TimePickerScenario.vue';
import TooltipScenario from './components/TooltipScenario.vue';
import TransferScenario from './components/TransferScenario.vue';
import UploadScenario from './components/UploadScenario.vue';
import NavigationScenario from './components/NavigationScenario.vue';
import TypographyScenario from './components/TypographyScenario.vue';
import HarnessCalibration from './components/HarnessCalibration.vue';
import UnavailableScenario from './components/UnavailableScenario.vue';

const props = withDefaults(defineProps<Partial<ParityScenarioOptions>>(), {
  scenarioId: 'harness-calibration',
  theme: 'light',
  direction: 'ltr',
  locale: 'zh-CN',
});

const scenario = computed(() => getParityScenario(props.scenarioId));
</script>

<template>
  <main
    :class="['workspace-shell', { 'semi-rtl': props.direction === 'rtl' }]"
    data-parity-framework="vue"
    :data-parity-scenario="scenario.id"
    :data-reference-status="scenario.referenceStatus"
    :data-vue-status="scenario.vueStatus"
    :dir="props.direction"
  >
    <header class="workspace-header">
      <p class="workspace-shell__eyebrow">Vue parity target</p>
      <h1>Semi UI Vue 对照工作台</h1>
      <p>
        当前固定参考版本为
        <code>{{ REFERENCE_BASELINE.tag }}</code>
        ，Vue 场景只在实现和证据齐全后进入可比较状态。
      </p>
    </header>

    <section class="scenario-panel" aria-labelledby="scenario-title">
      <div class="scenario-panel__heading">
        <div>
          <p class="scenario-panel__id">{{ scenario.id }}</p>
          <h2 id="scenario-title">{{ scenario.title }}</h2>
        </div>
        <span class="scenario-status" :data-status="scenario.vueStatus">
          Vue {{ scenario.vueStatus }}
        </span>
      </div>
      <p class="scenario-panel__description">{{ scenario.description }}</p>

      <HarnessCalibration v-if="scenario.id === 'harness-calibration'" />
      <AnchorScenario v-else-if="scenario.id === 'anchor'" :direction="props.direction" />
      <AvatarScenario v-else-if="scenario.id === 'avatar'" />
      <BadgeScenario v-else-if="scenario.id === 'badge'" :direction="props.direction" />
      <CalendarScenario
        v-else-if="scenario.id === 'calendar'"
        :direction="props.direction"
        :locale="props.locale"
      />
      <CardScenario v-else-if="scenario.id === 'card'" />
      <CarouselScenario v-else-if="scenario.id === 'carousel'" />
      <CascaderScenario
        v-else-if="scenario.id === 'cascader'"
        :direction="props.direction"
        :locale="props.locale"
      />
      <CollapsibleScenario v-else-if="scenario.id === 'collapsible'" />
      <CropperScenario v-else-if="scenario.id === 'cropper'" />
      <DescriptionsScenario v-else-if="scenario.id === 'descriptions'" />
      <DropdownScenario v-else-if="scenario.id === 'dropdown'" />
      <EmptyScenario v-else-if="scenario.id === 'empty'" />
      <HighlightScenario v-else-if="scenario.id === 'highlight'" />
      <ImageScenario v-else-if="scenario.id === 'image'" />
      <ListScenario v-else-if="scenario.id === 'list'" />
      <ModalScenario v-else-if="scenario.id === 'modal'" :direction="props.direction" />
      <OverflowListScenario v-else-if="scenario.id === 'overflow-list'" />
      <PopoverScenario v-else-if="scenario.id === 'popover'" :direction="props.direction" />
      <ScrollListScenario v-else-if="scenario.id === 'scroll-list'" />
      <SideSheetScenario v-else-if="scenario.id === 'side-sheet'" :direction="props.direction" />
      <TableScenario v-else-if="scenario.id === 'table'" :direction="props.direction" />
      <TagScenario v-else-if="scenario.id === 'tag'" />
      <TimelineScenario v-else-if="scenario.id === 'timeline'" />
      <BannerScenario v-else-if="scenario.id === 'banner'" />
      <NotificationScenario
        v-else-if="scenario.id === 'notification'"
        :direction="props.direction"
      />
      <PopconfirmScenario v-else-if="scenario.id === 'popconfirm'" :direction="props.direction" />
      <ProgressScenario v-else-if="scenario.id === 'progress'" />
      <SkeletonScenario v-else-if="scenario.id === 'skeleton'" />
      <SpinScenario v-else-if="scenario.id === 'spin'" />
      <ToastScenario v-else-if="scenario.id === 'toast'" :direction="props.direction" />
      <IllustrationsScenario v-else-if="scenario.id === 'illustrations'" />
      <BackTopScenario v-else-if="scenario.id === 'back-top'" :direction="props.direction" />
      <BreadcrumbScenario v-else-if="scenario.id === 'breadcrumb'" :direction="props.direction" />
      <AutoCompleteScenario v-else-if="scenario.id === 'auto-complete'" />
      <ButtonTypesScenario v-else-if="scenario.id === 'button-types'" />
      <ButtonContractScenario v-else-if="scenario.id === 'button-contract'" />
      <CheckboxScenario v-else-if="scenario.id === 'checkbox'" />
      <ConfigProviderScenario v-else-if="scenario.id === 'config-provider'" />
      <DividerScenario v-else-if="scenario.id === 'divider'" />
      <FloatButtonScenario v-else-if="scenario.id === 'float-button'" />
      <GridScenario v-else-if="scenario.id === 'grid'" />
      <IconScenario v-else-if="scenario.id === 'icon'" />
      <LayoutScenario v-else-if="scenario.id === 'layout'" />
      <InputScenario v-else-if="scenario.id === 'input'" />
      <InputNumberScenario v-else-if="scenario.id === 'input-number'" />
      <PinCodeScenario v-else-if="scenario.id === 'pin-code'" />
      <PaginationScenario
        v-else-if="scenario.id === 'pagination'"
        :direction="props.direction"
        :locale="props.locale"
      />
      <RadioScenario v-else-if="scenario.id === 'radio'" />
      <RatingScenario v-else-if="scenario.id === 'rating'" />
      <ResizableScenario v-else-if="scenario.id === 'resizable'" />
      <SelectScenario v-else-if="scenario.id === 'select'" />
      <SliderScenario v-else-if="scenario.id === 'slider'" :direction="props.direction" />
      <SpaceScenario v-else-if="scenario.id === 'space'" />
      <StepsScenario v-else-if="scenario.id === 'steps'" />
      <TabsScenario v-else-if="scenario.id === 'tabs'" />
      <TreeScenario
        v-else-if="scenario.id === 'tree'"
        :direction="props.direction"
        :locale="props.locale"
      />
      <TreeSelectScenario
        v-else-if="scenario.id === 'tree-select'"
        :direction="props.direction"
        :locale="props.locale"
      />
      <SwitchScenario v-else-if="scenario.id === 'switch'" />
      <TagInputScenario v-else-if="scenario.id === 'tag-input'" />
      <TimePickerScenario v-else-if="scenario.id === 'time-picker'" />
      <TooltipScenario v-else-if="scenario.id === 'tooltip'" />
      <TransferScenario v-else-if="scenario.id === 'transfer'" />
      <UploadScenario v-else-if="scenario.id === 'upload'" />
      <NavigationScenario v-else-if="scenario.id === 'navigation'" />
      <TypographyScenario v-else-if="scenario.id === 'typography'" />
      <UnavailableScenario
        v-else
        :scenario-id="scenario.id"
        :reference-source="scenario.referenceSource"
      />
    </section>

    <dl class="runtime-evidence" aria-label="Vue 对照状态">
      <div>
        <dt>commit</dt>
        <dd>{{ REFERENCE_BASELINE.commit }}</dd>
      </div>
      <div>
        <dt>source</dt>
        <dd data-testid="reference-source">{{ scenario.referenceSource ?? 'shared harness' }}</dd>
      </div>
    </dl>
  </main>
</template>
