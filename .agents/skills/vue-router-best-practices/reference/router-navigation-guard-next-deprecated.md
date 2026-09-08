---
title: 普通导航守卫优先 return，保留有效 next 语义
impact: HIGH
impactDescription: next 漏调用、重复调用或与 return 混用会造成导航挂起、重复跳转或错误
type: gotcha
tags: [vue3, vue-router, navigation-guards, migration, async]
---

# 普通导航守卫优先 return，保留有效 next 语义

Vue Router 官方指南仍说明可选第三参数 `next` 可用。本仓库 Nuxt 依赖的 Router `5.3.1` 在类型中将它标记为 `@deprecated`，开发环境执行时会给出 `VUE_ROUTER_R0025` 诊断，但仍保留执行语义。新增普通守卫、或修复相关分支错误时，优先采用 return 形式；弃用提示不意味着现有导航已经失败，也不要求默认删除所有调用。

本文件保留原路径供已有技能链接使用；路径中的 `deprecated` 不构成当前 API 已删除或需要全库迁移的证据。

## 按症状修复

- 导航挂起：检查声明第三参数的守卫是否有分支既没有调用 `next`，也没有通过异常结束。
- 重复导航或警告：检查重定向后是否继续执行另一个 `next`；每次正常执行路径只能完成一次。
- 异步校验后结果异常：等待校验结果，不在同一守卫混用 `next` 与 return 路由值来控制导航。
- 登录重定向循环：检查目标页是否被同一鉴权条件再次拦截；为公开入口建立明确的放行条件。

## return 形式

以下示例假设应用已经提供 `router` 与 `checkAccess`。Nuxt middleware 应保留现有框架 API，不直接把该全局注册示例粘入页面。

```typescript
router.beforeEach(async (to) => {
  if (to.name === 'Login') return;

  const allowed = await checkAccess(to);
  if (!allowed) {
    return { name: 'Login', query: { redirect: to.fullPath } };
  }
});
```

普通守卫返回 `undefined` 或 `true` 放行，返回 `false` 取消，返回路由位置重定向。异常可 `throw` 交由 `router.onError` 处理；不要吞掉异常后意外放行。已知业务拒绝与意外错误的处理按应用契约决定。

## 保留 next 时

正确的已有守卫可以在当前维护范围内保留，但会有上述弃用提示。正常分支调用一次 `next` 并及时结束；异步异常进入既有错误处理路径。

```typescript
router.beforeEach((to, from, next) => {
  if (to.name !== 'Login' && !isAuthenticated()) {
    next({ name: 'Login' });
    return;
  }

  next();
});
```

`beforeRouteEnter` 的 `next(vm => ...)` 还承担导航确认后访问组件实例的语义，不能机械替换成 return 回调。维护既有 Options API 代码时保留此语义；本仓库新增组件仍遵守 Composition API 基线，不为演示该回调引入 Options API。

## 验证与证据

按改动覆盖放行、取消、重定向、异步拒绝与异常等实际分支，断言最终 route、导航结果和可见页面，不以私有守卫计数作为唯一证据。参数更新与路由组件复用仍需读取对应症状参考；内存路由可以验证导航决策，组件实例、焦点和 Nuxt SSR/hydration 需要相应组件或浏览器场景。

版本来源见 [lockfile](../../../../pnpm-lock.yaml) 中 Nuxt `4.5.2` 的 `vue-router: 5.3.1` 依赖，以及任务环境实际安装的 Router 类型与实现。后续版本变化时重新核对所使用的 API，不把这份记录当作永久兼容保证。

## 参考

- [Vue Router Navigation Guards](https://router.vuejs.org/guide/advanced/navigation-guards.html)
- [Vue Router 5 Migration](https://router.vuejs.org/guide/migration/v4-to-v5.html)
