import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/SpinScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-spin',
  title: 'Parity/spin',
  parameters: { parityScenarioId: 'spin' },
  render: renderScenario('spin', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
