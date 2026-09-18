import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/LocaleScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-locale',
  title: 'Parity/locale',
  parameters: { parityScenarioId: 'locale' },
  render: renderScenario('locale', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
