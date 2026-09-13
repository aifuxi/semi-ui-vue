import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ConfigProviderScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-config-provider',
  title: 'Parity/config-provider',
  parameters: { parityScenarioId: 'config-provider' },
  render: renderScenario('config-provider', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
