import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/SkeletonScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-skeleton',
  title: 'Parity/skeleton',
  parameters: { parityScenarioId: 'skeleton' },
  render: renderScenario('skeleton', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
