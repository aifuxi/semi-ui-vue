import { createApp } from 'vue';
import App from './App.vue';
import '@aifuxi/semi-theme-default/index.css';
import './studio.css';
// 迭鹿字体由锁定版本随应用本地部署，仅在预览选择对应字体时使用。
import '@fontsource-variable/space-grotesk/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@fontsource-variable/jetbrains-mono/wght-italic.css';

// 消费编译后的公开主题；工作台不使用 Sass 或主题构建插件。
createApp(App).mount('#app');
