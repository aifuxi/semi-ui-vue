import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/SwitchScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-switch',
  title: 'Parity/switch',
  parameters: { parityScenarioId: 'switch' },
  render: renderScenario('switch', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
