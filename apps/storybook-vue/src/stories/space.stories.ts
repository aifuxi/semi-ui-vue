import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/SpaceScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-space',
  title: 'Parity/space',
  parameters: { parityScenarioId: 'space' },
  render: renderScenario('space', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
