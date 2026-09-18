import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TooltipScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-tooltip',
  title: 'Parity/tooltip',
  parameters: { parityScenarioId: 'tooltip' },
  render: renderScenario('tooltip', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
