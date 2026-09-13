import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/JsonViewerScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-json-viewer',
  title: 'Parity/json-viewer',
  parameters: { parityScenarioId: 'json-viewer' },
  render: renderScenario('json-viewer', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
