import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/DescriptionsScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-descriptions',
  title: 'Parity/descriptions',
  parameters: { parityScenarioId: 'descriptions' },
  render: renderScenario('descriptions', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
