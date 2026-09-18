import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ProgressScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-progress',
  title: 'Parity/progress',
  parameters: { parityScenarioId: 'progress' },
  render: renderScenario('progress', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
