import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/PopoverScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-popover',
  title: 'Parity/popover',
  parameters: { parityScenarioId: 'popover' },
  render: renderScenario('popover', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
