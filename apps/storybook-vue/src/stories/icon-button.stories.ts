import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/IconButtonScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-icon-button',
  title: 'Parity/icon-button',
  parameters: { parityScenarioId: 'icon-button' },
  render: renderScenario('icon-button', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
