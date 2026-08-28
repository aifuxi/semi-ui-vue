import React from 'react';
import {
  getParityScenario,
  REFERENCE_BASELINE,
  type ParityScenarioOptions,
} from '@workspace/test-infra';
import { AnchorScenario } from './scenarios/AnchorScenario';
import { BackTopScenario } from './scenarios/BackTopScenario';
import { BreadcrumbScenario } from './scenarios/BreadcrumbScenario';
import { AutoCompleteScenario } from './scenarios/AutoCompleteScenario';
import { ButtonTypesScenario } from './scenarios/ButtonTypesScenario';
import { ButtonContractScenario } from './scenarios/ButtonContractScenario';
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
import { SwitchScenario } from './scenarios/SwitchScenario';
import { TagInputScenario } from './scenarios/TagInputScenario';
import { TimePickerScenario } from './scenarios/TimePickerScenario';
import { TooltipScenario } from './scenarios/TooltipScenario';
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
        {scenario.id === 'back-top' ? <BackTopScenario direction={options.direction} /> : null}
        {scenario.id === 'breadcrumb' ? <BreadcrumbScenario direction={options.direction} /> : null}
        {scenario.id === 'auto-complete' ? <AutoCompleteScenario /> : null}
        {scenario.id === 'button-types' ? <ButtonTypesScenario /> : null}
        {scenario.id === 'button-contract' ? <ButtonContractScenario /> : null}
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
        {scenario.id === 'switch' ? <SwitchScenario /> : null}
        {scenario.id === 'tag-input' ? <TagInputScenario /> : null}
        {scenario.id === 'time-picker' ? <TimePickerScenario /> : null}
        {scenario.id === 'tooltip' ? <TooltipScenario /> : null}
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
