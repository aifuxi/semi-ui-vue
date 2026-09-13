import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ButtonContractScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-button-contract',
  title: 'Parity/button-contract',
  parameters: { parityScenarioId: 'button-contract' },
  render: renderScenario('button-contract', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
