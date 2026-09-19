import type { Theme } from 'vitepress';
import Layout from './Layout.vue';
import ComponentOverview from './components/ComponentOverview.vue';
import DemoBlock from './components/DemoBlock.vue';
import './styles/site.css';

export default {
  Layout,
  enhanceApp({ app }) {
    app.component('ComponentOverview', ComponentOverview);
    app.component('DemoBlock', DemoBlock);
  },
} satisfies Theme;
