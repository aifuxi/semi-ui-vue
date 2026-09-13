import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/OverflowListScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-overflow-list',
  title: 'Parity/overflow-list',
  parameters: { parityScenarioId: 'overflow-list' },
  render: renderScenario('overflow-list', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
