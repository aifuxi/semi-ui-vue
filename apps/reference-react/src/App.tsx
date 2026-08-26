import React from 'react';
import {
  getParityScenario,
  REFERENCE_BASELINE,
  type ParityScenarioOptions,
} from '@workspace/test-infra';
import { ButtonTypesScenario } from './scenarios/ButtonTypesScenario';
import { ButtonContractScenario } from './scenarios/ButtonContractScenario';
import { DividerScenario } from './scenarios/DividerScenario';
import { FloatButtonScenario } from './scenarios/FloatButtonScenario';
import { GridScenario } from './scenarios/GridScenario';
import { IconScenario } from './scenarios/IconScenario';
import { LayoutScenario } from './scenarios/LayoutScenario';
import { SpaceScenario } from './scenarios/SpaceScenario';

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
        {scenario.id === 'button-types' ? <ButtonTypesScenario /> : null}
        {scenario.id === 'button-contract' ? <ButtonContractScenario /> : null}
        {scenario.id === 'divider' ? <DividerScenario /> : null}
        {scenario.id === 'float-button' ? <FloatButtonScenario /> : null}
        {scenario.id === 'grid' ? <GridScenario /> : null}
        {scenario.id === 'icon' ? <IconScenario /> : null}
        {scenario.id === 'layout' ? <LayoutScenario /> : null}
        {scenario.id === 'space' ? <SpaceScenario /> : null}
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
