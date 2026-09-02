import { defineAsyncComponent, markRaw, type Component } from 'vue';
import type { ParityScenarioId } from '@workspace/test-infra';

export interface VueScenarioModule {
  readonly default: Component;
}

const scenarioLoaders = import.meta.glob<VueScenarioModule>([
  './components/*Scenario.vue',
  '!./components/UnavailableScenario.vue',
]);
const asyncComponents = new Map<ParityScenarioId, Component>();

async function loadAfterFontsReady(loader: () => Promise<VueScenarioModule>): Promise<Component> {
  const modulePromise = loader();
  if (typeof document !== 'undefined') await document.fonts.ready;
  return (await modulePromise).default;
}

export function scenarioIdFromModulePath(path: string): ParityScenarioId {
  const basename = path.match(/\/([^/]+)Scenario\.(?:tsx|vue)$/)?.[1];
  if (!basename) throw new Error(`无法从场景模块路径解析 id：${path}`);
  return basename
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
    .toLowerCase() as ParityScenarioId;
}

export function resolveEagerVueScenarioComponent(
  scenarioId: ParityScenarioId,
  modules: Record<string, VueScenarioModule>,
): Component | undefined {
  const entry = Object.entries(modules).find(
    ([path]) => scenarioIdFromModulePath(path) === scenarioId,
  );
  return entry?.[1].default;
}

export function getAsyncVueScenarioComponent(scenarioId: ParityScenarioId): Component | undefined {
  const cached = asyncComponents.get(scenarioId);
  if (cached) return cached;

  const entry = Object.entries(scenarioLoaders).find(
    ([path]) => scenarioIdFromModulePath(path) === scenarioId,
  );
  if (!entry) return undefined;

  const component = markRaw(defineAsyncComponent(() => loadAfterFontsReady(entry[1])));
  asyncComponents.set(scenarioId, component);
  return component;
}
