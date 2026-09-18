import type { Meta, StoryObj } from '@storybook/vue3-vite';
import ScenarioComponent from '../scenarios/TypographyScenario.vue';
import { renderScenario } from '../scenario-context';

const meta = {
  id: 'parity-typography',
  title: 'Parity/typography',
  parameters: { parityScenarioId: 'typography' },
  render: renderScenario('typography', ScenarioComponent),
} satisfies Meta;

export default meta;
export const Scenario: StoryObj<typeof meta> = {};
