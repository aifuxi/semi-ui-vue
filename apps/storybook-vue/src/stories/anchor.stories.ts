import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/AnchorScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-anchor',
  title: 'Parity/anchor',
  parameters: { parityScenarioId: 'anchor' },
  render: renderScenario('anchor', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
