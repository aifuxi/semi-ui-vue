import React, { Suspense, type ComponentType } from 'react';
import {
  getParityScenario,
  getParityScenarioRuntimeProps,
  type ParityScenarioOptions,
  type ParityScenarioRuntimeProps,
} from '@workspace/test-infra';
import { getLazyReactScenarioComponent } from './scenario-registry';

const DEFAULT_OPTIONS: ParityScenarioOptions = {
  scenarioId: 'harness-calibration',
  theme: 'light',
  direction: 'ltr',
  locale: 'zh-CN',
};

export type AppProps = Partial<ParityScenarioOptions> & {
  readonly scenarioComponent?: ComponentType<ParityScenarioRuntimeProps>;
};

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
  const { scenarioComponent, ...scenarioOptions } = props;
  const options = { ...DEFAULT_OPTIONS, ...scenarioOptions };
  const scenario = getParityScenario(options.scenarioId);
  const ScenarioComponent =
    scenarioComponent ??
    (scenario.id === 'harness-calibration'
      ? HarnessCalibration
      : getLazyReactScenarioComponent(options.scenarioId));
  const runtimeProps = getParityScenarioRuntimeProps(options);

  return (
    <main
      className={`workspace-shell${options.direction === 'rtl' ? ' semi-rtl' : ''}`}
      data-parity-framework="react"
      data-parity-scenario={scenario.id}
      data-reference-status={scenario.referenceStatus}
      data-vue-status={scenario.vueStatus}
      dir={options.direction}
    >
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

        {ScenarioComponent && (scenarioComponent || scenario.id === 'harness-calibration') ? (
          <ScenarioComponent {...runtimeProps} />
        ) : ScenarioComponent ? (
          <Suspense fallback={<span data-parity-scenario-loading>场景加载中</span>}>
            <ScenarioComponent {...runtimeProps} />
          </Suspense>
        ) : null}
      </section>

      <span hidden data-testid="reference-source">
        {scenario.referenceSource ?? 'shared harness'}
      </span>
    </main>
  );
}
