import { mount, type VueWrapper } from '@vue/test-utils';
import { afterEach, describe, expect, it } from 'vitest';
import { createSSRApp, h, nextTick, ref } from 'vue';
import { renderToString } from 'vue/server-renderer';

import { Modal } from './index';

/** 本文件挂载的宿主统一卸载，避免焦点陷阱和 Portal 泄漏到后续用例。 */
const wrappers: VueWrapper[] = [];
// 先销毁命令式弹窗，再卸载调用方，保持嵌套焦点的释放顺序。
afterEach(async () => {
  Modal.destroyAll();
  await nextTick();
  for (const wrapper of wrappers.splice(0)) wrapper.unmount();
  document.body.replaceChildren();
});

/** 按浏览器的 IDREF 规则解析名称与描述，同时确认引用没有指向其他弹窗。 */
function expectAssociations(expected: { title: string | null; body: string }[]): void {
  /** 包括 keepDOM 保留的隐藏实例，重复 ID 不能因不可见而被忽略。 */
  const dialogs = [...document.querySelectorAll('[role="dialog"]')];
  expect(dialogs).toHaveLength(expected.length);
  for (const [index, dialog] of dialogs.entries()) {
    /** 当前实例应当解析到的标准标题和正文。 */
    const content = expected[index]!;
    /** 标题缺省或自定义 header 时，不留下指向不存在节点的引用。 */
    const titleId = dialog.getAttribute('aria-labelledby');
    if (content.title === null) {
      expect(titleId).toBeNull();
    } else {
      expect(titleId).toBeTruthy();
      /** getElementById 会暴露重复 ID 引用到第一个实例的问题。 */
      const title = document.getElementById(titleId!);
      expect(title?.textContent).toBe(content.title);
      expect(dialog.contains(title)).toBe(true);
    }
    /** 正文即使没有标题也应关联到本实例。 */
    const bodyId = dialog.getAttribute('aria-describedby');
    expect(bodyId).toBeTruthy();
    /** 用全局解析验证 ID 的文档级唯一性，而非只在局部选择器中查找。 */
    const body = document.getElementById(bodyId!);
    expect(body?.textContent).toBe(content.body);
    expect(dialog.contains(body)).toBe(true);
  }
}

// 覆盖销毁重建与保留 DOM 两种关闭路径。
describe.each([false, true])('Modal 实例关联 keepDOM=%s', (keepDOM) => {
  // 外层、内层与同级弹窗共享一个 Vue app；按公开 visible 状态关闭并重开内层。
  it('嵌套和同级标题分别命名，内层重开后仍指向自身', async () => {
    /** 控制内层显示，不通过操作 DOM 伪造关闭状态。 */
    const innerVisible = ref(true);
    /** 外层标题更新也不能覆盖内层名称。 */
    const outerTitle = ref('详情外层');
    /** 使用真正嵌套的默认 slot，保持业务详情内打开确认框的调用结构。 */
    const wrapper = mount(
      {
        // 透过公开 Modal 渲染两个同级实例和一个嵌套实例。
        render: () => [
          h(
            Modal,
            { visible: true, motion: false, title: outerTitle.value, footer: null },
            {
              // 默认 slot 是外层正文与内层 Modal 的共同宿主。
              default: () => [
                '外层正文',
                h(
                  Modal,
                  {
                    visible: innerVisible.value,
                    motion: false,
                    keepDOM,
                    title: '操作确认',
                    footer: null,
                  },
                  {
                    // 内层正文通过 Portal 输出，不能被当成外层描述。
                    default: () => '内层正文',
                  },
                ),
              ],
            },
          ),
          h(
            Modal,
            { visible: true, motion: false, title: '同级弹窗', footer: null },
            {
              // 同级正文用于发现只对嵌套路径生效的局部修补。
              default: () => '同级正文',
            },
          ),
        ],
      },
      { attachTo: document.body },
    );
    wrappers.push(wrapper);
    await nextTick();
    /** Portal 的插入顺序由挂载顺序决定，按标题节点定位并逐一验证全局关联。 */
    const assertCurrent = () => {
      for (const dialog of document.querySelectorAll('[role="dialog"]')) {
        /** 标准标题与正文是当前实例的预期语义，ID 必须解析到同一节点。 */
        const title = dialog.querySelector('.semi-modal-title')!;
        expect(document.getElementById(dialog.getAttribute('aria-labelledby')!)).toBe(title);
        expect(document.getElementById(dialog.getAttribute('aria-describedby')!)).toBe(
          dialog.querySelector('.semi-modal-body'),
        );
      }
    };
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(3);
    assertCurrent();
    innerVisible.value = false;
    await nextTick();
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(keepDOM ? 3 : 2);
    assertCurrent();
    outerTitle.value = '更新后的详情';
    innerVisible.value = true;
    await nextTick();
    expect(document.querySelectorAll('[role="dialog"]')).toHaveLength(3);
    expect(document.querySelectorAll('.semi-modal-title')[0]?.textContent).toBe('更新后的详情');
    assertCurrent();
  });
});

// 静态方法创建独立 Vue app，不能假设 useId 在多个 app 间自动唯一。
it('标准 Modal 与多个命令式确认框并存时名称和描述不碰撞', async () => {
  /** 外层普通实例属于调用方 app。 */
  const wrapper = mount(Modal, {
    attachTo: document.body,
    props: { visible: true, motion: false, title: '详情外层', content: '外层正文' },
  });
  wrappers.push(wrapper);
  Modal.confirm({ title: '操作确认', content: '确认正文', motion: false });
  Modal.info({ title: '提示信息', content: '提示正文', motion: false });
  await nextTick();
  expectAssociations([
    { title: '详情外层', body: '外层正文' },
    { title: '操作确认', body: '确认正文' },
    { title: '提示信息', body: '提示正文' },
  ]);
});

// 不制造空标题；无标题与自定义 header 的正文仍然有有效描述引用。
it('无标题或自定义 header 时没有悬空的标题引用', async () => {
  /** 同一宿主同时渲染无标题与自定义 header 的公开组件。 */
  const wrapper = mount(
    {
      // 自定义 header 不约定用户节点的 ID，库只负责标准标题的命名。
      render: () => [
        h(Modal, { visible: true, motion: false, content: '无标题正文' }),
        h(Modal, {
          visible: true,
          motion: false,
          title: '被替换的标题',
          header: h('header', '自定义标题'),
          content: '自定义正文',
        }),
      ],
    },
    { attachTo: document.body },
  );
  wrappers.push(wrapper);
  await nextTick();
  expectAssociations([
    { title: null, body: '无标题正文' },
    { title: null, body: '自定义正文' },
  ]);
});

// SSR 与客户端使用相同实例 ID，Portal 迁移后仍应保持语义关联。
it('多个可见 Modal 的标题和正文 ID 在 hydration 前后保持一致', async () => {
  /** SSR 与客户端复用同一组件树，避免测试自行规定具体的 ID 字符串。 */
  const Host = {
    // 两个弹窗同时服务端渲染，再由客户端接管。
    render: () =>
      ['详情外层', '操作确认'].map(
        // 标题与正文均由公开 props 提供。
        (title) => h(Modal, { visible: true, motion: false, title, content: `${title}正文` }),
      ),
  };
  /** SSR HTML 容器在挂载后会将弹窗内容迁移到 body Portal。 */
  const container = document.createElement('div');
  container.innerHTML = await renderToString(h(Host));
  document.body.appendChild(container);
  /** 接管前记录 ID，后续只比较稳定性而不依赖 Vue 的编号格式。 */
  const serverIds = [...container.querySelectorAll('[role="dialog"]')].map(
    // 同时保存名称与描述引用，覆盖两种 IDREF。
    (dialog) => [dialog.getAttribute('aria-labelledby'), dialog.getAttribute('aria-describedby')],
  );
  /** hydrate 后卸载，避免 SSR 宿主遗留监听器。 */
  const app = createSSRApp(Host);
  try {
    app.mount(container);
    await nextTick();
    expectAssociations([
      { title: '详情外层', body: '详情外层正文' },
      { title: '操作确认', body: '操作确认正文' },
    ]);
    expect(
      [...document.querySelectorAll('[role="dialog"]')].map(
        // Portal 迁移不得重建或改变实例关联。
        (dialog) => [
          dialog.getAttribute('aria-labelledby'),
          dialog.getAttribute('aria-describedby'),
        ],
      ),
    ).toEqual(serverIds);
  } finally {
    app.unmount();
  }
});
