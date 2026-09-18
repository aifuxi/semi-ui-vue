import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/EmptyScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-empty',
  title: 'Parity/empty',
  parameters: { parityScenarioId: 'empty' },
  render: renderScenario('empty', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
