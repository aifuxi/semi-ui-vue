/* eslint-disable vue/one-component-per-file -- convertIcon is the public component factory. */
import {
  computed,
  defineComponent,
  h,
  mergeProps,
  type CSSProperties,
  type Component,
  type ComponentPublicInstance,
  type DefineComponent,
  type PropType,
  type VNode,
} from 'vue';

export const ICON_SIZES = [
  'inherit',
  'extra-small',
  'small',
  'default',
  'large',
  'extra-large',
] as const;

export type IconSize = (typeof ICON_SIZES)[number];
export interface IconProps {
  prefixCls?: string;
  rotate?: number;
  size?: IconSize;
  spin?: boolean;
  type?: string;
}
export type IconSvgProps = Record<never, never>;
export type IconSvgRenderer = (props: IconSvgProps) => VNode;
export type SemiIconComponent = DefineComponent<IconProps> & { elementType: 'Icon' };

const Icon = defineComponent({
  name: 'Icon',
  inheritAttrs: false,
  props: {
    prefixCls: { type: String, default: 'semi' },
    rotate: { type: Number, default: undefined },
    size: { type: String as PropType<IconSize>, default: 'default' },
    spin: { type: Boolean, default: false },
    type: { type: String, default: undefined },
  },
  setup(props, { attrs, slots, expose }) {
    let rootElement: HTMLSpanElement | null = null;
    const element = computed(() => rootElement);
    expose({ element });

    return () => {
      const rotationStyle: CSSProperties =
        typeof props.rotate === 'number' && Number.isSafeInteger(props.rotate)
          ? { transform: `rotate(${props.rotate}deg)` }
          : {};
      const prefix = props.prefixCls;
      const rootProps = mergeProps(
        {
          role: 'img',
          'aria-label': props.type,
          class: [
            `${prefix}-icon`,
            props.size === 'inherit' ? null : `${prefix}-icon-${props.size}`,
            props.spin ? `${prefix}-icon-spinning` : null,
            props.type ? `${prefix}-icon-${props.type}` : null,
          ],
          style: rotationStyle,
        },
        attrs,
      );
      return h(
        'span',
        {
          ...rootProps,
          ref: (value: Element | ComponentPublicInstance | null) => {
            rootElement = value instanceof HTMLSpanElement ? value : null;
          },
        },
        slots.default?.(),
      );
    };
  },
}) as unknown as SemiIconComponent;

Icon.elementType = 'Icon';

export function convertIcon(renderSvg: IconSvgRenderer, iconType: string): SemiIconComponent {
  const component = defineComponent({
    name: iconType
      .split('_')
      .map((part) => `${part.charAt(0).toUpperCase()}${part.slice(1)}`)
      .join(''),
    inheritAttrs: false,
    props: {
      prefixCls: { type: String, default: undefined },
      rotate: { type: Number, default: undefined },
      size: { type: String as PropType<IconSize>, default: undefined },
      spin: { type: Boolean, default: false },
    },
    setup(props, { attrs, expose }) {
      let iconInstance: { element: Readonly<{ value: HTMLSpanElement | null }> } | null = null;
      const element = computed(() => iconInstance?.element.value ?? null);
      expose({ element });
      return () =>
        h(
          Icon as Component,
          {
            ...props,
            ...attrs,
            ref: (value: unknown) => {
              iconInstance = value as typeof iconInstance;
            },
            type: iconType,
          },
          { default: () => renderSvg({}) },
        );
    },
  }) as unknown as SemiIconComponent;
  component.elementType = 'Icon';
  return component;
}

export default Icon;
