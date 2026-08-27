import 'normalize.css';
import 'typeface-inter';
import 'virtual:workspace-auto-complete-styles.css';
import 'virtual:workspace-button-styles.css';
import 'virtual:workspace-checkbox-styles.css';
import 'virtual:workspace-config-provider-styles.css';
import 'virtual:workspace-divider-styles.css';
import 'virtual:workspace-float-button-styles.css';
import 'virtual:workspace-grid-styles.css';
import 'virtual:workspace-icon-styles.css';
import 'virtual:workspace-input-styles.css';
import 'virtual:workspace-input-number-styles.css';
import 'virtual:workspace-layout-styles.css';
import 'virtual:workspace-resizable-styles.css';
import 'virtual:workspace-select-styles.css';
import 'virtual:workspace-space-styles.css';
import 'virtual:workspace-switch-styles.css';
import 'virtual:workspace-tooltip-styles.css';
import 'virtual:workspace-typography-styles.css';
import '@workspace/test-infra/harness.css';

import { createApp } from 'vue';
import { parseParityScenarioOptions } from '@workspace/test-infra';
import App from './App.vue';

const options = parseParityScenarioOptions(window.location.search);

document.documentElement.lang = options.locale;
document.documentElement.dir = options.direction;
document.body.setAttribute('theme-mode', options.theme);

createApp(App, { ...options }).mount('#app');
