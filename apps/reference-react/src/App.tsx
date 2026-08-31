import React from 'react';
import {
  getParityScenario,
  REFERENCE_BASELINE,
  type ParityScenarioOptions,
} from '@workspace/test-infra';
import { AnchorScenario } from './scenarios/AnchorScenario';
import { AvatarScenario } from './scenarios/AvatarScenario';
import { BadgeScenario } from './scenarios/BadgeScenario';
import { CalendarScenario } from './scenarios/CalendarScenario';
import { CardScenario } from './scenarios/CardScenario';
import { CarouselScenario } from './scenarios/CarouselScenario';
import { CascaderScenario } from './scenarios/CascaderScenario';
import { CollapseScenario } from './scenarios/CollapseScenario';
import { CodeHighlightScenario } from './scenarios/CodeHighlightScenario';
import { CollapsibleScenario } from './scenarios/CollapsibleScenario';
import { ColorPickerScenario } from './scenarios/ColorPickerScenario';
import { DatePickerScenario } from './scenarios/DatePickerScenario';
import { FormScenario } from './scenarios/FormScenario';
import { CropperScenario } from './scenarios/CropperScenario';
import { DescriptionsScenario } from './scenarios/DescriptionsScenario';
import { DropdownScenario } from './scenarios/DropdownScenario';
import { DragMoveScenario } from './scenarios/DragMoveScenario';
import { HotKeysScenario } from './scenarios/HotKeysScenario';
import { LottieScenario } from './scenarios/LottieScenario';
import { LocaleScenario } from './scenarios/LocaleScenario';
import { AudioPlayerScenario } from './scenarios/AudioPlayerScenario';
import { VideoPlayerScenario } from './scenarios/VideoPlayerScenario';
import { EmptyScenario } from './scenarios/EmptyScenario';
import { HighlightScenario } from './scenarios/HighlightScenario';
import { ImageScenario } from './scenarios/ImageScenario';
import { ListScenario } from './scenarios/ListScenario';
import { ModalScenario } from './scenarios/ModalScenario';
import { OverflowListScenario } from './scenarios/OverflowListScenario';
import { PopoverScenario } from './scenarios/PopoverScenario';
import { ScrollListScenario } from './scenarios/ScrollListScenario';
import { SideSheetScenario } from './scenarios/SideSheetScenario';
import { TableScenario } from './scenarios/TableScenario';
import { TagScenario } from './scenarios/TagScenario';
import { TimelineScenario } from './scenarios/TimelineScenario';
import { BannerScenario } from './scenarios/BannerScenario';
import { FeedbackScenario } from './scenarios/FeedbackScenario';
import { NotificationScenario } from './scenarios/NotificationScenario';
import { PopconfirmScenario } from './scenarios/PopconfirmScenario';
import { ProgressScenario } from './scenarios/ProgressScenario';
import { SkeletonScenario } from './scenarios/SkeletonScenario';
import { SpinScenario } from './scenarios/SpinScenario';
import { ToastScenario } from './scenarios/ToastScenario';
import { IllustrationsScenario } from './scenarios/IllustrationsScenario';
import { BackTopScenario } from './scenarios/BackTopScenario';
import { BreadcrumbScenario } from './scenarios/BreadcrumbScenario';
import { AutoCompleteScenario } from './scenarios/AutoCompleteScenario';
import { ButtonTypesScenario } from './scenarios/ButtonTypesScenario';
import { ButtonContractScenario } from './scenarios/ButtonContractScenario';
import { IconButtonScenario } from './scenarios/IconButtonScenario';
import { CheckboxScenario } from './scenarios/CheckboxScenario';
import { ConfigProviderScenario } from './scenarios/ConfigProviderScenario';
import { DividerScenario } from './scenarios/DividerScenario';
import { FloatButtonScenario } from './scenarios/FloatButtonScenario';
import { GridScenario } from './scenarios/GridScenario';
import { IconScenario } from './scenarios/IconScenario';
import { LayoutScenario } from './scenarios/LayoutScenario';
import { InputScenario } from './scenarios/InputScenario';
import { InputNumberScenario } from './scenarios/InputNumberScenario';
import { PinCodeScenario } from './scenarios/PinCodeScenario';
import { PaginationScenario } from './scenarios/PaginationScenario';
import { RadioScenario } from './scenarios/RadioScenario';
import { RatingScenario } from './scenarios/RatingScenario';
import { ResizableScenario } from './scenarios/ResizableScenario';
import { SelectScenario } from './scenarios/SelectScenario';
import { SliderScenario } from './scenarios/SliderScenario';
import { SpaceScenario } from './scenarios/SpaceScenario';
import { StepsScenario } from './scenarios/StepsScenario';
import { TabsScenario } from './scenarios/TabsScenario';
import { TreeScenario } from './scenarios/TreeScenario';
import { TreeSelectScenario } from './scenarios/TreeSelectScenario';
import { SwitchScenario } from './scenarios/SwitchScenario';
import { TagInputScenario } from './scenarios/TagInputScenario';
import { TimePickerScenario } from './scenarios/TimePickerScenario';
import { TooltipScenario } from './scenarios/TooltipScenario';
import { TransferScenario } from './scenarios/TransferScenario';
import { UploadScenario } from './scenarios/UploadScenario';
import { NavigationScenario } from './scenarios/NavigationScenario';
import { TypographyScenario } from './scenarios/TypographyScenario';

const DEFAULT_OPTIONS: ParityScenarioOptions = {
  scenarioId: 'harness-calibration',
  theme: 'light',
  direction: 'ltr',
  locale: 'zh-CN',
};

export type AppProps = Partial<ParityScenarioOptions>;

function HarnessCalibration(): React.ReactElement {
  return (
    <div className="visual-calibration" data-testid="visual-calibration" aria-hidden="true">
      <span className="visual-calibration__primary" />
      <span className="visual-calibration__success" />
      <span className="visual-calibration__warning" />
    </div>
  );
}

export function App(props: AppProps): React.ReactElement {
  const options = { ...DEFAULT_OPTIONS, ...props };
  const scenario = getParityScenario(options.scenarioId);

  return (
    <main
      className={`workspace-shell${options.direction === 'rtl' ? ' semi-rtl' : ''}`}
      data-parity-framework="react"
      data-parity-scenario={scenario.id}
      data-reference-status={scenario.referenceStatus}
      data-vue-status={scenario.vueStatus}
      dir={options.direction}
    >
      <header className="workspace-header">
        <p className="workspace-shell__eyebrow">React reference target</p>
        <h1>Semi Design React 参考工作台</h1>
        <p>
          当前固定参考版本为 <code>{REFERENCE_BASELINE.tag}</code>，场景直接编译本地只读源码。
        </p>
      </header>

      <section className="scenario-panel" aria-labelledby="scenario-title">
        <div className="scenario-panel__heading">
          <div>
            <p className="scenario-panel__id">{scenario.id}</p>
            <h2 id="scenario-title">{scenario.title}</h2>
          </div>
          <span className="scenario-status" data-status={scenario.referenceStatus}>
            React {scenario.referenceStatus}
          </span>
        </div>
        <p className="scenario-panel__description">{scenario.description}</p>

        {scenario.id === 'harness-calibration' ? <HarnessCalibration /> : null}
        {scenario.id === 'anchor' ? <AnchorScenario direction={options.direction} /> : null}
        {scenario.id === 'avatar' ? <AvatarScenario /> : null}
        {scenario.id === 'badge' ? <BadgeScenario direction={options.direction} /> : null}
        {scenario.id === 'calendar' ? (
          <CalendarScenario direction={options.direction} locale={options.locale} />
        ) : null}
        {scenario.id === 'card' ? <CardScenario /> : null}
        {scenario.id === 'carousel' ? <CarouselScenario /> : null}
        {scenario.id === 'cascader' ? (
          <CascaderScenario direction={options.direction} locale={options.locale} />
        ) : null}
        {scenario.id === 'collapse' ? <CollapseScenario /> : null}
        {scenario.id === 'code-highlight' ? <CodeHighlightScenario /> : null}
        {scenario.id === 'collapsible' ? <CollapsibleScenario /> : null}
        {scenario.id === 'color-picker' ? <ColorPickerScenario /> : null}
        {scenario.id === 'date-picker' ? (
          <DatePickerScenario direction={options.direction} />
        ) : null}
        {scenario.id === 'form' ? <FormScenario /> : null}
        {scenario.id === 'cropper' ? <CropperScenario /> : null}
        {scenario.id === 'descriptions' ? <DescriptionsScenario /> : null}
        {scenario.id === 'dropdown' ? <DropdownScenario /> : null}
        {scenario.id === 'drag-move' ? <DragMoveScenario /> : null}
        {scenario.id === 'hot-keys' ? <HotKeysScenario /> : null}
        {scenario.id === 'lottie' ? <LottieScenario /> : null}
        {scenario.id === 'locale' ? <LocaleScenario /> : null}
        {scenario.id === 'audio-player' ? (
          <AudioPlayerScenario
            direction={options.direction}
            locale={options.locale}
            theme={options.theme}
          />
        ) : null}
        {scenario.id === 'video-player' ? (
          <VideoPlayerScenario
            direction={options.direction}
            locale={options.locale}
            theme={options.theme}
          />
        ) : null}
        {scenario.id === 'empty' ? <EmptyScenario /> : null}
        {scenario.id === 'highlight' ? <HighlightScenario /> : null}
        {scenario.id === 'image' ? <ImageScenario /> : null}
        {scenario.id === 'list' ? <ListScenario /> : null}
        {scenario.id === 'modal' ? <ModalScenario direction={options.direction} /> : null}
        {scenario.id === 'overflow-list' ? <OverflowListScenario /> : null}
        {scenario.id === 'popover' ? <PopoverScenario direction={options.direction} /> : null}
        {scenario.id === 'scroll-list' ? <ScrollListScenario /> : null}
        {scenario.id === 'side-sheet' ? <SideSheetScenario direction={options.direction} /> : null}
        {scenario.id === 'table' ? <TableScenario direction={options.direction} /> : null}
        {scenario.id === 'tag' ? <TagScenario /> : null}
        {scenario.id === 'timeline' ? <TimelineScenario /> : null}
        {scenario.id === 'banner' ? <BannerScenario /> : null}
        {scenario.id === 'feedback' ? <FeedbackScenario direction={options.direction} /> : null}
        {scenario.id === 'notification' ? (
          <NotificationScenario direction={options.direction} />
        ) : null}
        {scenario.id === 'popconfirm' ? <PopconfirmScenario direction={options.direction} /> : null}
        {scenario.id === 'progress' ? <ProgressScenario /> : null}
        {scenario.id === 'skeleton' ? <SkeletonScenario /> : null}
        {scenario.id === 'spin' ? <SpinScenario /> : null}
        {scenario.id === 'toast' ? <ToastScenario direction={options.direction} /> : null}
        {scenario.id === 'illustrations' ? <IllustrationsScenario /> : null}
        {scenario.id === 'back-top' ? <BackTopScenario direction={options.direction} /> : null}
        {scenario.id === 'breadcrumb' ? <BreadcrumbScenario direction={options.direction} /> : null}
        {scenario.id === 'auto-complete' ? <AutoCompleteScenario /> : null}
        {scenario.id === 'button-types' ? <ButtonTypesScenario /> : null}
        {scenario.id === 'button-contract' ? <ButtonContractScenario /> : null}
        {scenario.id === 'icon-button' ? <IconButtonScenario /> : null}
        {scenario.id === 'checkbox' ? <CheckboxScenario /> : null}
        {scenario.id === 'config-provider' ? <ConfigProviderScenario /> : null}
        {scenario.id === 'divider' ? <DividerScenario /> : null}
        {scenario.id === 'float-button' ? <FloatButtonScenario /> : null}
        {scenario.id === 'grid' ? <GridScenario /> : null}
        {scenario.id === 'icon' ? <IconScenario /> : null}
        {scenario.id === 'layout' ? <LayoutScenario /> : null}
        {scenario.id === 'input' ? <InputScenario /> : null}
        {scenario.id === 'input-number' ? <InputNumberScenario /> : null}
        {scenario.id === 'pin-code' ? <PinCodeScenario /> : null}
        {scenario.id === 'pagination' ? (
          <PaginationScenario direction={options.direction} locale={options.locale} />
        ) : null}
        {scenario.id === 'radio' ? <RadioScenario /> : null}
        {scenario.id === 'rating' ? <RatingScenario /> : null}
        {scenario.id === 'resizable' ? <ResizableScenario /> : null}
        {scenario.id === 'select' ? <SelectScenario /> : null}
        {scenario.id === 'slider' ? <SliderScenario direction={options.direction} /> : null}
        {scenario.id === 'space' ? <SpaceScenario /> : null}
        {scenario.id === 'steps' ? <StepsScenario /> : null}
        {scenario.id === 'tabs' ? <TabsScenario /> : null}
        {scenario.id === 'tree' ? (
          <TreeScenario direction={options.direction} locale={options.locale} />
        ) : null}
        {scenario.id === 'tree-select' ? (
          <TreeSelectScenario direction={options.direction} locale={options.locale} />
        ) : null}
        {scenario.id === 'switch' ? <SwitchScenario /> : null}
        {scenario.id === 'tag-input' ? <TagInputScenario /> : null}
        {scenario.id === 'time-picker' ? <TimePickerScenario /> : null}
        {scenario.id === 'tooltip' ? <TooltipScenario /> : null}
        {scenario.id === 'transfer' ? <TransferScenario /> : null}
        {scenario.id === 'upload' ? <UploadScenario /> : null}
        {scenario.id === 'navigation' ? <NavigationScenario /> : null}
        {scenario.id === 'typography' ? <TypographyScenario /> : null}
      </section>

      <dl className="runtime-evidence" aria-label="参考运行时证据">
        <div>
          <dt>commit</dt>
          <dd>{REFERENCE_BASELINE.commit}</dd>
        </div>
        <div>
          <dt>source</dt>
          <dd data-testid="reference-source">{scenario.referenceSource ?? 'shared harness'}</dd>
        </div>
      </dl>
    </main>
  );
}
