import 'normalize.css';
import 'typeface-inter';
import 'virtual:workspace-button-styles.css';
import '@workspace/test-infra/harness.css';

import { createApp } from 'vue';
import { parseParityScenarioOptions } from '@workspace/test-infra';
import App from './App.vue';

const options = parseParityScenarioOptions(window.location.search);

document.documentElement.lang = options.locale;
document.documentElement.dir = options.direction;
document.body.setAttribute('theme-mode', options.theme);

createApp(App, { ...options }).mount('#app');
