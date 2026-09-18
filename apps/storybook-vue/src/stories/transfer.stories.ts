import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TransferScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-transfer',
  title: 'Parity/transfer',
  parameters: { parityScenarioId: 'transfer' },
  render: renderScenario('transfer', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
