import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/CascaderScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-cascader',
  title: 'Parity/cascader',
  parameters: { parityScenarioId: 'cascader' },
  render: renderScenario('cascader', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
