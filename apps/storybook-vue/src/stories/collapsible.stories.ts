import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/CollapsibleScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-collapsible',
  title: 'Parity/collapsible',
  parameters: { parityScenarioId: 'collapsible' },
  render: renderScenario('collapsible', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
