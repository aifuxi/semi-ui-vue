import { flushPromises, mount } from '@vue/test-utils';
import { h, type Component } from 'vue';
import { afterEach, describe, expect, it } from 'vitest';
import { ConfigProvider } from './index';
import { SideSheet } from '../side-sheet';
import { ImagePreview } from '../image';
import { Feedback } from '../feedback';

/** 本地图片排除网络与图片错误状态对预览挂载的影响。 */
const image =
  'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="80" height="60"/%3E';
/** 覆盖两个定位实现和直接复用 SideSheet 的 Feedback popup。 */
const cases: {
  name: string;
  component: Component;
  props: Record<string, unknown>;
  popup: string;
}[] = [
  {
    name: 'SideSheet',
    component: SideSheet,
    props: { motion: false },
    popup: '.semi-sidesheet-popup',
  },
  {
    name: 'Image.Preview',
    component: ImagePreview,
    props: { src: image },
    popup: '.semi-image-preview-popup',
  },
  {
    name: 'Feedback popup',
    component: Feedback,
    props: { mode: 'popup', motion: false },
    popup: '.semi-sidesheet-popup',
  },
];

// 各实例先卸载，再清理自己创建的 Portal 宿主，避免残留干扰下一条用例。
afterEach(() => document.body.replaceChildren());

// 相同公开调用分别覆盖仅继承 Provider 和组件自身显式指定容器。
describe.each(cases)('$name 容器定位边界', ({ component, props, popup }) => {
  for (const mode of ['provider', 'element', 'body']) {
    // 固定上游仅根据组件自身 getter 启用 popup，Provider 只改变 DOM 挂载点。
    it(`首次显示时保持挂载优先级与定位模式，mode=${mode}`, async () => {
      /** 模拟组织的稳定 relative 宿主。 */
      const providerHost = document.createElement('div');
      providerHost.style.position = 'relative';
      /** 组件参数应优先于 Provider，不得把两者的定位语义混合。 */
      const explicitHost = document.createElement('div');
      explicitHost.style.position = 'relative';
      document.body.append(providerHost, explicitHost);
      /** 固定 SideSheet/PreviewInner 与 Modal 不同：自身 getter 即使返回 body 也启用 popup。 */
      const explicit = mode !== 'provider';
      /** body 路径防止把 Modal 的非 body 判断错误复用到这两个组件。 */
      const explicitTarget = mode === 'body' ? document.body : explicitHost;
      /** 通过公开 Provider 与公开组件验证整条配置传递路径。 */
      const wrapper = mount(ConfigProvider, {
        attachTo: document.body,
        props: {
          /** 仅决定挂载归属，不请求容器内定位。 */
          getPopupContainer: () => providerHost,
        },
        slots: {
          /** 显式参数存在时，保持固定上游的局部定位。 */
          default: () =>
            h(component, {
              ...props,
              visible: true,
              ...(explicit
                ? { /** 显式局部定位宿主。 */ getPopupContainer: () => explicitTarget }
                : {}),
            }),
        },
      });
      try {
        await flushPromises();
        /** 验证真实 DOM 归属，防止用改挂 body 掩盖问题。 */
        const host = explicit ? explicitTarget : providerHost;
        /** Portal 内联样式与 popup class 共同决定固定主题中的定位行为。 */
        const portal = host.querySelector<HTMLElement>(':scope > .semi-portal');
        expect(portal).not.toBeNull();
        expect(portal!.style.position).toBe(explicit ? 'static' : '');
        expect(Boolean(portal!.querySelector(popup))).toBe(explicit);
        expect((explicit ? providerHost : explicitHost).querySelector('.semi-portal')).toBeNull();
      } finally {
        wrapper.unmount();
      }
    });
  }
});
