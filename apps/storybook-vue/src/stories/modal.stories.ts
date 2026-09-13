import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/ModalScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-modal',
  title: 'Parity/modal',
  parameters: { parityScenarioId: 'modal' },
  render: renderScenario('modal', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
