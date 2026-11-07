import { mount } from '@vue/test-utils';
import { describe, expect, it } from 'vitest';
import { Tree } from './index';

/** 虚拟 viewport 的测量结果不能替代包装层初始 CSS 长度契约。 */
describe('Tree 虚拟包装层高度', () => {
  it.each([
    [180, '180px'],
    ['70%', '70%'],
    ['calc(100% - 8px)', 'calc(100% - 8px)'],
    [undefined, '100%'],
  ] as const)('height=%s 写入有效原生 style %s', (height, expected) => {
    /** 不依赖 ResizeObserver 完成，直接检查真实初始渲染的包装层。 */
    const wrapper = mount(Tree, {
      props: {
        treeData: [{ key: 'one', label: '节点' }],
        virtualize: { itemSize: 28, width: 360, ...(height === undefined ? {} : { height }) },
      },
    });
    expect((wrapper.get('.semi-tree-auto-wrapper').element as HTMLElement).style.height).toBe(
      expected,
    );
    wrapper.unmount();
  });
});
