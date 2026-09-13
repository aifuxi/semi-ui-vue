import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/FormScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-form',
  title: 'Parity/form',
  parameters: { parityScenarioId: 'form' },
  render: renderScenario('form', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
