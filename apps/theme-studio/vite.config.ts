import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// 相对资源地址配合 hash 路由，可部署到独立域名或任意静态子目录。
export default defineConfig({ base: './', plugins: [vue()] });
