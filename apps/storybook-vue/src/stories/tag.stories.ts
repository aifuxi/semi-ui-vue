import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TagScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-tag',
  title: 'Parity/tag',
  parameters: { parityScenarioId: 'tag' },
  render: renderScenario('tag', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
