import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/BannerScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-banner',
  title: 'Parity/banner',
  parameters: { parityScenarioId: 'banner' },
  render: renderScenario('banner', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
