export const NPM_REGISTRY = 'https://registry.npmjs.org/';
export const NPM_USERNAME = 'aifuxi';
export const REPOSITORY = Object.freeze({
  owner: 'aifuxi',
  name: 'semi-ui-vue',
  url: 'git+https://github.com/aifuxi/semi-ui-vue.git',
});

export const publicPackages = Object.freeze([
  Object.freeze({
    directory: 'theme-default',
    name: '@aifuxi/semi-theme-default',
    type: 'style',
  }),
  Object.freeze({
    directory: 'icons',
    name: '@aifuxi/semi-icons-vue',
    type: 'javascript',
  }),
  Object.freeze({
    directory: 'icons-lab',
    name: '@aifuxi/semi-icons-lab-vue',
    type: 'javascript',
  }),
  Object.freeze({
    directory: 'illustrations',
    name: '@aifuxi/semi-illustrations-vue',
    type: 'javascript',
  }),
  Object.freeze({
    directory: 'ui',
    name: '@aifuxi/semi-ui-vue',
    type: 'javascript',
  }),
]);

export function distTagForVersion(version) {
  return version.includes('-') ? 'next' : 'latest';
}
