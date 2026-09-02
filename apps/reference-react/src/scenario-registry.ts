import React, { type ComponentType, type LazyExoticComponent } from 'react';
import type { ParityScenarioId, ParityScenarioRuntimeProps } from '@workspace/test-infra';

export type ReactScenarioComponent = ComponentType<ParityScenarioRuntimeProps>;
export type ReactScenarioModule = Record<string, unknown>;
type ReactScenarioLoader = () => Promise<ReactScenarioModule>;

const scenarioLoaders = import.meta.glob<ReactScenarioModule>('./scenarios/*Scenario.tsx');
const lazyComponents = new Map<ParityScenarioId, LazyExoticComponent<ReactScenarioComponent>>();

async function loadAfterFontsReady(loader: ReactScenarioLoader): Promise<ReactScenarioModule> {
  const modulePromise = loader();
  if (typeof document !== 'undefined') await document.fonts.ready;
  return modulePromise;
}

export function scenarioIdFromModulePath(path: string): ParityScenarioId {
  const basename = path.match(/\/([^/]+)Scenario\.(?:tsx|vue)$/)?.[1];
  if (!basename) throw new Error(`无法从场景模块路径解析 id：${path}`);
  return basename
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase() as ParityScenarioId;
}

function componentNameFromModulePath(path: string): string {
  const basename = path.match(/\/([^/]+Scenario)\.tsx$/)?.[1];
  if (!basename) throw new Error(`无法从 React 场景模块路径解析组件名：${path}`);
  return basename;
}

export function resolveReactScenarioComponent(
  path: string,
  module: ReactScenarioModule,
): ReactScenarioComponent {
  const componentName = componentNameFromModulePath(path);
  const component = module[componentName];
  if (typeof component !== 'function' && typeof component !== 'object') {
    throw new Error(`${path} 未导出 ${componentName}`);
  }
  return component as ReactScenarioComponent;
}

export function resolveEagerReactScenarioComponent(
  scenarioId: ParityScenarioId,
  modules: Record<string, ReactScenarioModule>,
): ReactScenarioComponent | undefined {
  const entry = Object.entries(modules).find(
    ([path]) => scenarioIdFromModulePath(path) === scenarioId,
  );
  return entry ? resolveReactScenarioComponent(entry[0], entry[1]) : undefined;
}

export function getLazyReactScenarioComponent(
  scenarioId: ParityScenarioId,
): LazyExoticComponent<ReactScenarioComponent> | undefined {
  const cached = lazyComponents.get(scenarioId);
  if (cached) return cached;

  const entry = Object.entries(scenarioLoaders).find(
    ([path]) => scenarioIdFromModulePath(path) === scenarioId,
  ) as [string, ReactScenarioLoader] | undefined;
  if (!entry) return undefined;

  const component = React.lazy(async () => ({
    default: resolveReactScenarioComponent(entry[0], await loadAfterFontsReady(entry[1])),
  }));
  lazyComponents.set(scenarioId, component);
  return component;
}
