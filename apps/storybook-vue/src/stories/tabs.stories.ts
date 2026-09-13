import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TabsScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-tabs',
  title: 'Parity/tabs',
  parameters: { parityScenarioId: 'tabs' },
  render: renderScenario('tabs', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
