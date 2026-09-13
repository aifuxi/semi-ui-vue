import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/HotKeysScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-hot-keys',
  title: 'Parity/hot-keys',
  parameters: { parityScenarioId: 'hot-keys' },
  render: renderScenario('hot-keys', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
