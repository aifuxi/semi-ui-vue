import 'normalize.css';
import 'typeface-inter';
import 'virtual:semi-reference-styles.css';
import '@workspace/test-infra/harness.css';

import React from 'react';
import ReactDOM from 'react-dom';
import { parseParityScenarioOptions } from '@workspace/test-infra';
import { App } from './App';

const options = parseParityScenarioOptions(window.location.search);

document.documentElement.lang = options.locale;
document.documentElement.dir = options.direction;
document.body.setAttribute('theme-mode', options.theme);

ReactDOM.render(<App {...options} />, document.getElementById('root'));
