import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/CardScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-card',
  title: 'Parity/card',
  parameters: { parityScenarioId: 'card' },
  render: renderScenario('card', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
