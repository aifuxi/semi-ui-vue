import type { ParityScenarioId } from '@workspace/test-infra';

/** CSF meta.id is independent of translated titles and Storybook's generated names. */
export function storybookStoryId(scenarioId: ParityScenarioId): string {
  return `parity-${scenarioId}--scenario`;
}
