import { flushPromises, mount } from '@vue/test-utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { h, nextTick } from 'vue';

import { Modal } from '../modal';
import { ImagePreview } from '../image';
import { Tooltip } from '../tooltip';
import { getTypographySignature, mirrorThemeScope, observeThemeChanges } from './theme-scope';

/** 每个用例释放自身订阅后移除临时 DOM，避免跨主题影响后续用例。 */
afterEach(() => {
  document.body.replaceChildren();
  vi.restoreAllMocks();
});

/** 创建真实局部主题元素；颜色继承由浏览器消费者测试覆盖。 */
function createScope(name: string, size: string): HTMLDivElement {
  /** 内联变量在 jsdom 中可直接读取，不依赖其尚未实现的 var() 布局计算。 */
  const scope = document.createElement('div');
  scope.dataset.semiTheme = name;
  scope.style.setProperty('--semi-font-size-regular', size);
  scope.style.setProperty('--semi-color-primary', 'red');
  scope.style.fontFamily = 'serif';
  scope.style.fontWeight = '500';
  return scope;
}

/** 这些测试验证主题传播的可观察 DOM 与通知边界，不复刻 CSS 变量求值逻辑。 */
describe('局部主题作用域', () => {
  /** 嵌套边界、动态取消及原始样式恢复属于 Portal 生命周期契约。 */
  it('镜像最近主题并跟随变更，退出主题后撤回覆盖且保留原宿主样式', async () => {
    /** 两层不同字号验证选择的是最近主题。 */
    const outer = createScope('outer', '18px');
    /** 嵌套主题提供比外层更近的局部覆盖。 */
    const inner = createScope('inner', '22px');
    /** 该节点作为订阅或触发源，其祖先决定主题来源。 */
    const source = document.createElement('button');
    /** 脱离源 DOM 的宿主用于观察镜像与清理结果。 */
    const target = document.createElement('div');
    target.style.zIndex = '1060';
    target.style.fontFamily = 'monospace';
    outer.append(inner);
    inner.append(source);
    document.body.append(outer, target);
    /** 镜像只写独立 Portal 宿主。 */
    const stop = mirrorThemeScope(source, target);
    try {
      expect(target.dataset.semiTheme).toBe('inner');
      expect(target.style.getPropertyValue('--semi-font-size-regular')).toBe('22px');
      expect(target.style.fontFamily).toBe('serif');
      expect(target.style.fontWeight).toBe('500');
      inner.style.setProperty('--semi-button-font-size', '24px');
      await flushPromises();
      expect(target.style.getPropertyValue('--semi-button-font-size')).toBe('24px');
      inner.removeAttribute('data-semi-theme');
      await flushPromises();
      expect(target.dataset.semiTheme).toBe('outer');
      expect(target.style.getPropertyValue('--semi-font-size-regular')).toBe('18px');
      expect(target.style.getPropertyValue('--semi-button-font-size')).toBe('');
      outer.removeAttribute('data-semi-theme');
      await flushPromises();
      expect(target.hasAttribute('data-semi-theme')).toBe(false);
      expect(target.style.getPropertyValue('--semi-font-size-regular')).toBe('');
      expect(target.style.fontFamily).toBe('monospace');
      expect(target.style.zIndex).toBe('1060');
    } finally {
      stop();
    }
  });

  /** 颜色从实际源节点读取，模式载体保留后代强制模式所需数据，布局始终隔离。 */
  it('镜像源节点的颜色和模式载体，动态撤回旧颜色且不传播布局', async () => {
    /** 局部主题边界继续决定排版来源。 */
    const scope = createScope('colors', '18px');
    /** jsdom 不继承自定义属性，因此显式在源节点设置浏览器计算后应有的颜色。 */
    const source = document.createElement('button');
    source.style.setProperty('--semi-brand-5', '1, 2, 3');
    source.style.setProperty('--semi-color-primary', 'rgb(1, 2, 3)');
    source.style.setProperty('--semi-ai-general-5', 'linear-gradient(red, blue)');
    source.style.setProperty('--semi-shadow-elevated', '0 0 1px black');
    source.style.setProperty('--semi-theme-dark-brand-5', '4, 5, 6');
    source.style.setProperty('--semi-theme-light-color-primary', 'rgb(1, 2, 3)');
    source.style.setProperty('--semi-border-radius-small', '20px');
    source.style.setProperty('--semi-theme-dark-border-radius-small', '30px');
    source.style.setProperty('--business-color', 'green');
    /** Portal 的原始颜色和位置属性均须在退出镜像后保留。 */
    const target = document.createElement('div');
    target.style.setProperty('--semi-color-primary', 'purple');
    target.style.zIndex = '1000';
    scope.append(source);
    document.body.append(scope, target);
    /** 对称释放覆盖和订阅，避免测试泄漏观察器。 */
    const stop = mirrorThemeScope(source, target);
    try {
      expect(target.style.getPropertyValue('--semi-brand-5')).toBe('1, 2, 3');
      expect(target.style.getPropertyValue('--semi-color-primary')).toBe('rgb(1, 2, 3)');
      expect(target.style.getPropertyValue('--semi-ai-general-5')).toBe(
        'linear-gradient(red, blue)',
      );
      expect(target.style.getPropertyValue('--semi-shadow-elevated')).toBe('0 0 1px black');
      expect(target.style.getPropertyValue('--semi-theme-dark-brand-5')).toBe('4, 5, 6');
      expect(target.style.getPropertyValue('--semi-theme-light-color-primary')).toBe(
        'rgb(1, 2, 3)',
      );
      expect(target.style.getPropertyValue('--semi-border-radius-small')).toBe('');
      expect(target.style.getPropertyValue('--semi-theme-dark-border-radius-small')).toBe('');
      expect(target.style.getPropertyValue('--business-color')).toBe('');
      source.style.setProperty('--semi-color-primary', 'rgb(4, 5, 6)');
      source.style.removeProperty('--semi-brand-5');
      await flushPromises();
      expect(target.style.getPropertyValue('--semi-color-primary')).toBe('rgb(4, 5, 6)');
      expect(target.style.getPropertyValue('--semi-brand-5')).toBe('');
      scope.removeAttribute('data-semi-theme');
      await flushPromises();
      expect(target.style.getPropertyValue('--semi-color-primary')).toBe('purple');
      expect(target.style.getPropertyValue('--semi-theme-dark-brand-5')).toBe('');
      expect(target.style.zIndex).toBe('1000');
    } finally {
      stop();
    }
  });

  /** Portal 不在原强制模式祖先内，需镜像最近有效模式并正确恢复宿主初始状态。 */
  it('镜像最近显式或强制模式，退出局部主题后恢复原属性和模式类', async () => {
    /** 外层显式深色与内部强制浅色构成有意的模式冲突。 */
    const scope = createScope('mode', '18px');
    scope.setAttribute('theme-mode', 'dark');
    /** 比主题边界更近的强制模式必须获胜。 */
    const force = document.createElement('div');
    force.classList.add('semi-always-light');
    /** 实际源节点位于强制模式子树中。 */
    const source = document.createElement('button');
    /** 原宿主状态在局部主题取消后完整恢复。 */
    const target = document.createElement('div');
    target.setAttribute('theme-mode', 'light');
    target.classList.add('business-portal', 'semi-always-dark');
    force.append(source);
    scope.append(force);
    document.body.append(scope, target);
    /** 对称释放覆盖和订阅。 */
    const stop = mirrorThemeScope(source, target);
    try {
      expect(target.getAttribute('theme-mode')).toBe('light');
      expect(target.classList.contains('semi-always-light')).toBe(true);
      expect(target.classList.contains('semi-always-dark')).toBe(false);
      force.classList.remove('semi-always-light');
      await flushPromises();
      expect(target.getAttribute('theme-mode')).toBe('dark');
      expect(target.classList.contains('semi-always-light')).toBe(false);
      expect(target.classList.contains('semi-always-dark')).toBe(false);
      force.setAttribute('theme-mode', 'light');
      await flushPromises();
      expect(target.getAttribute('theme-mode')).toBe('light');
      scope.removeAttribute('data-semi-theme');
      await flushPromises();
      expect(target.getAttribute('theme-mode')).toBe('light');
      expect(target.classList.contains('semi-always-dark')).toBe(true);
      expect(target.classList.contains('business-portal')).toBe(true);
    } finally {
      stop();
    }
  });

  /** 调用方可在镜像存活期间自行调整宿主，释放不应覆盖这类后续业务修改。 */
  it('释放模式镜像时保留宿主后续业务属性与强制类修改', () => {
    /** 主题初始显式模式使目标获得工具写入的 dark。 */
    const scope = createScope('ownership', '18px');
    scope.setAttribute('theme-mode', 'dark');
    /** 源和目标分属不同 DOM 子树。 */
    const source = document.createElement('button');
    /** 业务宿主的初始状态应与后续覆盖区分。 */
    const target = document.createElement('div');
    scope.append(source);
    document.body.append(scope, target);
    /** 保留释放函数以模拟调用方卸载弹层。 */
    const stop = mirrorThemeScope(source, target);
    target.setAttribute('theme-mode', 'light');
    target.dataset.semiTheme = 'business';
    target.classList.add('semi-always-dark');
    stop();
    expect(target.getAttribute('theme-mode')).toBe('light');
    expect(target.dataset.semiTheme).toBe('business');
    expect(target.classList.contains('semi-always-dark')).toBe(true);
  });

  /** 颜色属于视觉主题，不能单独改变用于省略布局的排版签名。 */
  it('纯颜色和模式载体更新不改变排版签名', () => {
    /** 根元素提供浏览器计算样式的稳定排版属性。 */
    const root = document.createElement('span');
    root.style.fontFamily = 'serif';
    root.style.fontSize = '14px';
    root.style.lineHeight = '20px';
    document.body.append(root);
    /** 只对比实际排版字段，不将颜色 token 加入测量条件。 */
    const original = getTypographySignature(root);
    root.style.color = 'red';
    root.style.setProperty('--semi-color-primary', 'green');
    root.style.setProperty('--semi-theme-dark-brand-5', '1, 2, 3');
    expect(getTypographySignature(root)).toBe(original);
  });

  /** 共享观察器只通知当前元素祖先的变化，并按字体、样式表分别标注失效原因。 */
  it('过滤兄弟主题变化，同时通知字体完成和样式表加载', async () => {
    /** 测试文档尚未实现 fonts，使用标准 EventTarget 模拟字体加载事件。 */
    const previousFonts = Object.getOwnPropertyDescriptor(document, 'fonts');
    const fonts = Object.assign(new EventTarget(), { ready: Promise.resolve() });
    Object.defineProperty(document, 'fonts', { value: fonts, configurable: true });
    /** 两个不相关的作用域共享同一个文档观察器。 */
    const first = createScope('first', '18px');
    /** 第二个局部主题用于验证兄弟隔离或节点重挂。 */
    const second = createScope('second', '22px');
    /** 该节点作为订阅或触发源，其祖先决定主题来源。 */
    const source = document.createElement('span');
    first.append(source);
    document.body.append(first, second);
    /** 记录共享观察器实际发出的失效原因。 */
    const changed = vi.fn();
    /** 保存订阅释放函数，确保断言失败时也能清理观察器。 */
    const stop = observeThemeChanges(source, changed);
    try {
      await flushPromises();
      expect(changed).toHaveBeenCalledWith('font');
      changed.mockClear();
      second.style.fontWeight = '800';
      await flushPromises();
      expect(changed).not.toHaveBeenCalled();
      first.classList.add('large');
      await flushPromises();
      expect(changed).toHaveBeenCalledWith('attributes');
      fonts.dispatchEvent(new Event('loadingdone'));
      expect(changed).toHaveBeenLastCalledWith('font');
      /** 捕获不冒泡的 link load，保证替换主题 CSS 后仍能重新测量。 */
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      document.head.append(link);
      await flushPromises();
      changed.mockClear();
      link.dispatchEvent(new Event('load'));
      expect(changed).toHaveBeenLastCalledWith('stylesheet');
      link.remove();
    } finally {
      stop();
      if (previousFonts) Object.defineProperty(document, 'fonts', previousFonts);
      else Reflect.deleteProperty(document, 'fonts');
    }
  });

  /** 强调子节点的主题字重可改变字宽而不改变父元素签名中的字重。 */
  it('排版签名包含实际强调字重', () => {
    /** 文本根节点的 computed style 参与排版签名。 */
    const root = document.createElement('span');
    /** 强调子节点可独立改变字重而不改变根样式。 */
    const strong = document.createElement('strong');
    strong.style.fontWeight = '600';
    root.append(strong);
    document.body.append(root);
    /** 保存变更前签名以判断实际排版是否失效。 */
    const original = getTypographySignature(root);
    strong.style.fontWeight = '800';
    expect(getTypographySignature(root)).not.toBe(original);
  });

  /** DOM 直接重挂不一定伴随 class/style 变化，仍须切换到新的祖先观察链。 */
  it('源节点重挂后跟随新主题，释放时保留宿主后续的业务覆盖', async () => {
    /** 第一个局部主题承载源节点的初始位置。 */
    const first = createScope('first', '18px');
    /** 第二个局部主题用于验证兄弟隔离或节点重挂。 */
    const second = createScope('second', '22px');
    /** 该节点作为订阅或触发源，其祖先决定主题来源。 */
    const source = document.createElement('button');
    /** 脱离源 DOM 的宿主用于观察镜像与清理结果。 */
    const target = document.createElement('div');
    first.append(source);
    document.body.append(first, second, target);
    /** 保存订阅释放函数，确保断言失败时也能清理观察器。 */
    const stop = mirrorThemeScope(source, target);
    try {
      second.append(source);
      await flushPromises();
      expect(target.dataset.semiTheme).toBe('second');
      expect(target.style.getPropertyValue('--semi-font-size-regular')).toBe('22px');
      second.style.setProperty('--semi-font-size-regular', '24px');
      await flushPromises();
      expect(target.style.getPropertyValue('--semi-font-size-regular')).toBe('24px');
      target.style.fontFamily = 'fantasy';
    } finally {
      stop();
    }
    expect(target.style.fontFamily).toBe('fantasy');
  });

  /** 默认 Tooltip 和显式容器必须遵循不同的主题来源。 */
  it('默认 Tooltip Portal 继承触发源主题，显式容器不覆盖自己的主题', async () => {
    /** 组件声明所在的局部主题，不等同于 Portal 物理容器。 */
    const scope = createScope('trigger', '18px');
    /** 外部显式挂载点拥有与声明位置不同的主题。 */
    const popup = createScope('popup', '22px');
    document.body.append(scope, popup);
    /** 真实组件挂载实例用于检查默认 Portal 并在结束时卸载。 */
    const wrapper = mount(Tooltip, {
      attachTo: scope,
      props: { visible: true, trigger: 'custom', motion: false, content: '主题提示' },
      /** 原生按钮提供实际的触发 DOM。 */
      slots: { default: () => h('button', '触发') },
    });
    /** 第二个组件实例验证显式容器优先的公开行为。 */
    const custom = mount(Tooltip, {
      attachTo: scope,
      props: {
        visible: true,
        trigger: 'custom',
        motion: false,
        content: '自定义容器',
        /** 显式容器使用其物理祖先主题，不继承触发源。 */
        getPopupContainer: () => popup,
      },
      /** 原生按钮同样位于触发源局部主题。 */
      slots: { default: () => h('button', '另一个触发') },
    });
    try {
      await nextTick();
      await flushPromises();
      /** 默认 body 宿主是观察主题跨边界传播的实际 DOM。 */
      const portal = document.body.querySelector<HTMLElement>(':scope > .semi-portal')!;
      expect(portal.dataset.semiTheme).toBe('trigger');
      expect(portal.style.getPropertyValue('--semi-font-size-regular')).toBe('18px');
      expect(
        popup
          .querySelector<HTMLElement>('.semi-portal')!
          .style.getPropertyValue('--semi-font-size-regular'),
      ).toBe('');
      scope.style.setProperty('--semi-font-size-regular', '20px');
      await flushPromises();
      expect(portal.style.getPropertyValue('--semi-font-size-regular')).toBe('20px');
    } finally {
      wrapper.unmount();
      custom.unmount();
    }
  });

  /** Modal 没有触发器，通过声明位置的 Teleport 锚点获得局部主题。 */
  it('声明式 Modal 默认 Portal 使用声明位置主题', async () => {
    /** 组件声明所在的局部主题，不等同于 Portal 物理容器。 */
    const scope = createScope('modal', '19px');
    document.body.append(scope);
    /** 真实组件挂载实例用于检查默认 Portal 并在结束时卸载。 */
    const wrapper = mount(Modal, {
      attachTo: scope,
      props: { visible: true, motion: false, title: '局部主题' },
    });
    try {
      await nextTick();
      await flushPromises();
      /** 默认 body 宿主是观察主题跨边界传播的实际 DOM。 */
      const portal = document.body.querySelector<HTMLElement>(':scope > .semi-portal')!;
      expect(portal.dataset.semiTheme).toBe('modal');
      expect(portal.style.getPropertyValue('--semi-font-size-regular')).toBe('19px');
    } finally {
      wrapper.unmount();
    }
  });

  /** 图片预览是最后一个独立 Teleport，需与普通浮层遵循同一主题来源规则。 */
  it('ImagePreview 默认宿主镜像局部主题，显式容器沿用物理祖先', async () => {
    /** 组件声明所在的局部主题，不等同于 Portal 物理容器。 */
    const scope = createScope('image', '19px');
    /** 外部显式挂载点拥有与声明位置不同的主题。 */
    const popup = createScope('image-popup', '23px');
    document.body.append(scope, popup);
    /** 无网络图片让用例只覆盖 Portal 生命周期。 */
    const src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg"/%3E';
    /** 真实组件挂载实例用于检查默认 Portal 并在结束时卸载。 */
    const wrapper = mount(ImagePreview, {
      attachTo: scope,
      props: { visible: true, src },
    });
    /** 第二个组件实例验证显式容器优先的公开行为。 */
    const custom = mount(ImagePreview, {
      attachTo: scope,
      props: {
        visible: true,
        src,
        /** 显式挂载点不接收声明位置镜像。 */
        getPopupContainer: () => popup,
      },
    });
    try {
      await nextTick();
      await flushPromises();
      /** 默认 body 宿主是观察主题跨边界传播的实际 DOM。 */
      const portal = document.body.querySelector<HTMLElement>(':scope > .semi-portal')!;
      expect(portal.dataset.semiTheme).toBe('image');
      expect(portal.style.getPropertyValue('--semi-font-size-regular')).toBe('19px');
      expect(
        popup.querySelector<HTMLElement>('.semi-portal')!.hasAttribute('data-semi-theme'),
      ).toBe(false);
      await wrapper.setProps({ visible: false });
      await flushPromises();
      expect(document.body.querySelector(':scope > .semi-portal')).toBeNull();
    } finally {
      wrapper.unmount();
      custom.unmount();
    }
  });
});
