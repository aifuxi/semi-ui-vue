import { createApp } from 'vue';
import App from './App.vue';
import '@aifuxi/semi-theme-default/index.css';
import './studio.css';

// 消费编译后的公开主题；工作台不使用 Sass 或主题构建插件。
createApp(App).mount('#app');
