import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TimelineScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-timeline',
  title: 'Parity/timeline',
  parameters: { parityScenarioId: 'timeline' },
  render: renderScenario('timeline', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
