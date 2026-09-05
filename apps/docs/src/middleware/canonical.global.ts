import { defineNuxtRouteMiddleware, navigateTo } from '#imports';
import { canonicalPath, localeFromPath } from '../data/docs';

export default defineNuxtRouteMiddleware((to) => {
  const canonical = canonicalPath(to.path);
  const target = /^\/(?:zh-cn\/|en-us\/)?$/.test(canonical)
    ? `/${localeFromPath(to.path).toLowerCase()}/start/introduction/`
    : canonical;
  if (target !== to.path)
    return navigateTo(
      { path: target, query: to.query, hash: to.hash },
      { redirectCode: 301, replace: true },
    );
});
