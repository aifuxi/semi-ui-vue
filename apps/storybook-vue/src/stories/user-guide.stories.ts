import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/UserGuideScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-user-guide',
  title: 'Parity/user-guide',
  parameters: { parityScenarioId: 'user-guide' },
  render: renderScenario('user-guide', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
