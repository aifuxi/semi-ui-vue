import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/CodeHighlightScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-code-highlight',
  title: 'Parity/code-highlight',
  parameters: { parityScenarioId: 'code-highlight' },
  render: renderScenario('code-highlight', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
