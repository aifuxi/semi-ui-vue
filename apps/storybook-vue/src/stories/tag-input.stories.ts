import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TagInputScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-tag-input',
  title: 'Parity/tag-input',
  parameters: { parityScenarioId: 'tag-input' },
  render: renderScenario('tag-input', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
