import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/IconScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-icon',
  title: 'Parity/icon',
  parameters: { parityScenarioId: 'icon' },
  render: renderScenario('icon', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
