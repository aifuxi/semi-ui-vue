import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/DividerScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-divider',
  title: 'Parity/divider',
  parameters: { parityScenarioId: 'divider' },
  render: renderScenario('divider', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
