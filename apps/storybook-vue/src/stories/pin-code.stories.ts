import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/PinCodeScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-pin-code',
  title: 'Parity/pin-code',
  parameters: { parityScenarioId: 'pin-code' },
  render: renderScenario('pin-code', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
