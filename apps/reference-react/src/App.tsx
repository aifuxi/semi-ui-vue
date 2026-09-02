import React, { Suspense, type ComponentType } from 'react';
import {
  getParityScenario,
  getParityScenarioRuntimeProps,
  REFERENCE_BASELINE,
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

        {ScenarioComponent && (scenarioComponent || scenario.id === 'harness-calibration') ? (
          <ScenarioComponent {...runtimeProps} />
        ) : ScenarioComponent ? (
          <Suspense fallback={<span data-parity-scenario-loading>场景加载中</span>}>
            <ScenarioComponent {...runtimeProps} />
          </Suspense>
        ) : null}
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
