---
title: Teleported Content Requires Special Testing Approach
impact: MEDIUM
impactDescription: Vue Test Utils cannot find teleported content using standard wrapper.find() methods
type: gotcha
tags: [vue3, teleport, testing, vue-test-utils]
---

# Teleported Content Requires Special Testing Approach

**Impact: MEDIUM** - Vue Test Utils scopes queries to the mounted component. Teleported content renders outside the component's DOM tree, so `wrapper.find()` cannot locate it. This leads to failing tests and confusion.

## Task Checklist

- [ ] 验证 Portal 行为时保留真实 Teleport，在实际目标容器查询 DOM；目标可以是 document.body 或自定义容器
- [ ] 仅当单测目标与 Portal 无关、需要隔离子树时使用 stub；stub 通过不能证明真实容器、焦点或卸载行为
- [ ] `getComponent()` 可用于访问虚拟组件树，但不能替代实际目标容器中的 DOM 断言

本仓库的真实容器、焦点、定位、退出动画与重开/卸载证据复用 [Playwright Chromium 场景](testing-e2e-playwright-recommended.md)。下列 Vue Test Utils 示例用于说明查询范围和单测隔离，不代替浏览器主证据。

**Problem - Standard Testing Fails:**

```vue
<!-- Modal.vue -->
<template>
  <button @click="open = true">Open</button>
  <Teleport to="body">
    <div v-if="open" class="modal" data-testid="modal">
      <input type="text" data-testid="modal-input" />
    </div>
  </Teleport>
</template>
```

```ts
// Modal.spec.ts - BROKEN
import { mount } from '@vue/test-utils';
import Modal from './Modal.vue';

test('modal input exists', async () => {
  const wrapper = mount(Modal);
  await wrapper.find('button').trigger('click');

  // FAILS: Teleported content is not in wrapper's DOM tree
  expect(wrapper.find('[data-testid="modal-input"]').exists()).toBe(true);
});
```

**仅用于与 Portal 无关的单测隔离 - Stub Teleport:**

```ts
import { mount } from '@vue/test-utils';
import Modal from './Modal.vue';

test('modal input exists', async () => {
  const wrapper = mount(Modal, {
    global: {
      stubs: {
        // Stub teleport to render content inline
        Teleport: true,
      },
    },
  });

  await wrapper.find('button').trigger('click');

  // Works: Content renders inside wrapper
  expect(wrapper.find('[data-testid="modal-input"]').exists()).toBe(true);
});
```

**验证真实 Teleport 的 DOM 位置 - Query Document Body:**

```ts
import { mount } from '@vue/test-utils';
import Modal from './Modal.vue';

test('modal renders to body', async () => {
  const wrapper = mount(Modal, {
    attachTo: document.body, // 将宿主接入文档；Teleport 本身只要求目标存在
  });

  await wrapper.find('button').trigger('click');

  // Query the actual DOM
  const modal = document.querySelector('[data-testid="modal"]');
  expect(modal).toBeTruthy();

  const input = document.querySelector('[data-testid="modal-input"]');
  expect(input).toBeTruthy();

  // Cleanup
  wrapper.unmount();
});
```

**仅用于与 Portal 无关的单测隔离 - Custom Teleport Stub:**

```ts
import { mount, config } from '@vue/test-utils';
import { h, Teleport } from 'vue';
import Modal from './Modal.vue';

// Custom stub that renders content in a testable way
const TeleportStub = {
  setup(props, { slots }) {
    return () => h('div', { class: 'teleport-stub' }, slots.default?.());
  },
};

test('modal with custom stub', async () => {
  const wrapper = mount(Modal, {
    global: {
      stubs: {
        Teleport: TeleportStub,
      },
    },
  });

  await wrapper.find('button').trigger('click');

  // Content is inside .teleport-stub
  expect(wrapper.find('.teleport-stub [data-testid="modal-input"]').exists()).toBe(true);
});
```

## Testing Vue Final Modal and UI Libraries

Vue Final Modal 等库可能把内容 Teleport 到 wrapper 之外。先确认实际容器；下面的组件 stub 只适合不验证 Modal 行为的父组件单测，不能用来证明 Modal 的打开、焦点或 Portal 行为。

```ts
// Problem: Vue Final Modal teleports to body
import { VueFinalModal } from 'vue-final-modal';

test('modal content', async () => {
  const wrapper = mount(MyComponent, {
    global: {
      stubs: {
        // 仅隔离与当前父组件测试目标无关的 Modal 子树
        VueFinalModal: true,
      },
    },
  });
});
```

## E2E Testing (Cypress, Playwright)

E2E 测试在实际目标容器查询内容，并验证相关交互与清理；节点可见并不足以覆盖全部 Portal 行为。下方 Cypress 片段仅保留通用查询示意，本仓库沿用已有 Playwright Chromium 配置：

```ts
// Cypress
it('opens modal', () => {
  cy.visit('/page-with-modal');
  cy.get('button').click();

  // Works: Cypress queries the real DOM
  cy.get('[data-testid="modal"]').should('be.visible');
});
```

## Reference

- [Vue Test Utils - Teleport](https://test-utils.vuejs.org/guide/advanced/teleport)
- [Vue Test Utils - Stubs](https://test-utils.vuejs.org/guide/advanced/stubs-shallow-mount)
