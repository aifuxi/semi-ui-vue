/* eslint-disable vue/one-component-per-file -- convertIcon is the public component factory. */
import {
  cloneVNode,
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
  type VNodeChild,
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
export type IconFill = string | string[];

export interface IconProps {
  fill?: IconFill;
  prefixCls?: string;
  rotate?: number;
  size?: IconSize;
  spin?: boolean;
  svg?: VNodeChild;
  type?: string;
}

export interface IconSlots {
  default?: () => VNodeChild;
}

export interface IconSvgProps {
  fill?: IconFill | undefined;
}

export type IconSvgRenderer = (props: IconSvgProps) => VNode;

export interface IconExposed {
  element: Readonly<{ value: HTMLSpanElement | null }>;
}

export type SemiIconComponent = DefineComponent<IconProps> & {
  elementType: 'Icon';
};

function isSafeRotation(value: number | undefined): value is number {
  return typeof value === 'number' && Number.isSafeInteger(value);
}

function withFill(node: VNodeChild, fill: IconFill | undefined): VNodeChild {
  if (fill === undefined || !node || typeof node !== 'object' || !('__v_isVNode' in node)) {
    return node;
  }
  return cloneVNode(node as VNode, { fill });
}

const Icon = defineComponent({
  name: 'Icon',
  inheritAttrs: false,
  props: {
    fill: { type: [String, Array] as PropType<IconFill>, default: undefined },
    prefixCls: { type: String, default: 'semi' },
    rotate: { type: Number, default: undefined },
    size: { type: String as PropType<IconSize>, default: 'default' },
    spin: { type: Boolean, default: false },
    svg: {
      type: [String, Number, Boolean, Array, Object] as PropType<VNodeChild>,
      default: undefined,
    },
    type: { type: String, default: undefined },
  },
  setup(props, { attrs, slots, expose }) {
    let rootElement: HTMLSpanElement | null = null;

    const element = computed(() => rootElement);
    expose({ element });

    return () => {
      const prefix = props.prefixCls;
      const classes = [
        `${prefix}-icon`,
        props.size === 'inherit' ? null : `${prefix}-icon-${props.size}`,
        props.spin ? `${prefix}-icon-spinning` : null,
        props.type ? `${prefix}-icon-${props.type}` : null,
      ];
      const rotationStyle: CSSProperties = isSafeRotation(props.rotate)
        ? { transform: `rotate(${props.rotate}deg)` }
        : {};
      const content = slots.default?.() ?? props.svg;
      const rootProps = mergeProps(
        {
          role: 'img',
          'aria-label': props.type,
          class: classes,
          style: rotationStyle,
        },
        attrs,
      );

      const renderedContent = Array.isArray(content)
        ? content.map((node) => withFill(node, props.fill))
        : withFill(content, props.fill);

      return h(
        'span',
        {
          ...rootProps,
          ref: (value: Element | ComponentPublicInstance | null) => {
            rootElement = value instanceof HTMLSpanElement ? value : null;
          },
        },
        renderedContent == null ? undefined : renderedContent,
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
      fill: { type: [String, Array] as PropType<IconFill>, default: undefined },
      prefixCls: { type: String, default: undefined },
      rotate: { type: Number, default: undefined },
      size: { type: String as PropType<IconSize>, default: undefined },
      spin: { type: Boolean, default: false },
    },
    setup(props, { attrs, expose }) {
      let iconInstance: IconExposed | null = null;
      const element = computed(() => iconInstance?.element.value ?? null);
      expose({ element });

      return () =>
        h(
          Icon as Component,
          {
            ...props,
            ...attrs,
            ref: (value: unknown) => {
              iconInstance = value as IconExposed | null;
            },
            type: iconType,
          },
          { default: () => renderSvg({ fill: props.fill }) },
        );
    },
  }) as unknown as SemiIconComponent;

  component.elementType = 'Icon';
  return component;
}

export default Icon;
