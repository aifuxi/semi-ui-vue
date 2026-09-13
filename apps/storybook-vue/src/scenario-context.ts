import { h, type Component } from 'vue';
import type { StoryFn } from '@storybook/vue3-vite';
import {
  getParityScenarioRuntimeProps,
  type ParityScenarioId,
  type ParityScenarioOptions,
} from '@workspace/test-infra';

export function scenarioOptions(
  scenarioId: ParityScenarioId,
  globals: Record<string, unknown>,
): ParityScenarioOptions {
  return {
    scenarioId,
    theme: globals.theme === 'dark' ? 'dark' : 'light',
    direction: globals.direction === 'rtl' ? 'rtl' : 'ltr',
    locale: globals.locale === 'en-US' ? 'en-US' : 'zh-CN',
  };
}

/** Keep framework-specific props out of the shared scenario's data and expectations. */
export function renderScenario(scenarioId: ParityScenarioId, component: Component): StoryFn {
  return (_args, context) => ({
    setup() {
      return () =>
        h(component, getParityScenarioRuntimeProps(scenarioOptions(scenarioId, context.globals)));
    },
  });
}
