import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/PopconfirmScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-popconfirm',
  title: 'Parity/popconfirm',
  parameters: { parityScenarioId: 'popconfirm' },
  render: renderScenario('popconfirm', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
