import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ScrollListScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-scroll-list',
  title: 'Parity/scroll-list',
  parameters: { parityScenarioId: 'scroll-list' },
  render: renderScenario('scroll-list', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
